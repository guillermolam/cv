import fs from "node:fs";
import path from "node:path";
import process from "node:process";

function parseArgs(argv) {
  const args = { _: [], verbose: false, help: false, projectRoot: process.cwd(), distDir: null };
  for (let i = 0; i < argv.length; i += 1) {
    const current = argv[i];
    if (current === "--help" || current === "-h") {
      args.help = true;
      continue;
    }
    if (current === "--verbose" || current === "-v") {
      args.verbose = true;
      continue;
    }
    if (current === "--project-root") {
      const value = argv[i + 1];
      if (!value) throw new Error("--project-root requires a value");
      args.projectRoot = value;
      i += 1;
      continue;
    }
    if (current === "--dist-dir") {
      const value = argv[i + 1];
      if (!value) throw new Error("--dist-dir requires a value");
      args.distDir = value;
      i += 1;
      continue;
    }
    args._.push(current);
  }
  return args;
}

function toAbsolute(base, value) {
  return path.isAbsolute(value) ? value : path.resolve(base, value);
}

function statSafe(targetPath) {
  try {
    return fs.statSync(targetPath);
  } catch {
    return null;
  }
}

function safeReadText(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return null;
  }
}

function listFilesRecursive(rootDir) {
  const files = [];
  const stack = [rootDir];
  while (stack.length) {
    const dir = stack.pop();
    if (!dir) break;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
      } else if (entry.isFile()) {
        files.push(fullPath);
      }
    }
  }
  return files;
}

function extractAssetRefsFromHtml(html) {
  const refs = new Set();
  const attrRegex = /\b(?:src|href)=["']([^"']+)["']/g;
  let match = attrRegex.exec(html);
  while (match) {
    const value = match[1];
    if (value) refs.add(value.trim());
    match = attrRegex.exec(html);
  }
  return Array.from(refs);
}

function looksLikeAssetPath(urlPath) {
  const cleaned = urlPath.split("?")[0].split("#")[0];
  const base = path.posix.basename(cleaned);
  if (!base.includes(".")) return false;
  const ext = base.split(".").pop()?.toLowerCase() ?? "";
  const assetExtensions = new Set([
    "css",
    "js",
    "mjs",
    "json",
    "png",
    "jpg",
    "jpeg",
    "gif",
    "svg",
    "webp",
    "ico",
    "txt",
    "xml",
    "map",
    "woff",
    "woff2",
    "ttf",
    "otf",
    "eot",
    "mp4",
    "webm",
    "pdf",
  ]);
  return assetExtensions.has(ext);
}

function formatUsage() {
  return [
    "validate-static-build.mjs",
    "",
    "Read-only validation for a static build output directory (default: dist/).",
    "Emits JSON to stdout; diagnostics to stderr.",
    "",
    "Usage:",
    "  node scripts/validate-static-build.mjs [--project-root <path>] [--dist-dir <path>] [--verbose] [--help]",
    "",
    "Options:",
    "  --project-root <path>  Project root (default: cwd)",
    "  --dist-dir <path>      Dist directory (default: <projectRoot>/dist or Astro outDir if detectable)",
    "  --verbose, -v          Emit diagnostics to stderr",
    "  --help, -h             Print this help (JSON still emitted to stdout)",
  ].join("\n");
}

function detectDistDirFromAstroConfig(projectRoot) {
  const configCandidates = ["astro.config.mjs", "astro.config.js", "astro.config.ts"];
  for (const fileName of configCandidates) {
    const configPath = path.join(projectRoot, fileName);
    const raw = safeReadText(configPath);
    if (!raw) continue;
    const outDirMatch = raw.match(/outDir\s*:\s*["'`]{1}([^"'`]+)["'`]{1}/);
    if (outDirMatch?.[1]) {
      return toAbsolute(projectRoot, outDirMatch[1]);
    }
    return path.join(projectRoot, "dist");
  }
  return path.join(projectRoot, "dist");
}

function readVercelRewrites(projectRoot) {
  const configPath = path.join(projectRoot, "vercel.json");
  const raw = safeReadText(configPath);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed?.rewrites) ? parsed.rewrites : null;
  } catch {
    return null;
  }
}

function main() {
  const start = Date.now();
  const args = parseArgs(process.argv.slice(2));
  const usage = formatUsage();

  const verboseLog = (message) => {
    if (!args.verbose) return;
    process.stderr.write(`${message}\n`);
  };

  if (args.help) {
    process.stderr.write(`${usage}\n`);
  }

  const projectRoot = toAbsolute(process.cwd(), args.projectRoot);
  const distDir = args.distDir ? toAbsolute(projectRoot, args.distDir) : detectDistDirFromAstroConfig(projectRoot);

  const errors = [];
  const warnings = [];

  const distStat = statSafe(distDir);
  if (!distStat?.isDirectory()) {
    errors.push({ code: "DIST_MISSING", message: "dist directory not found", distDir: path.relative(projectRoot, distDir) });
  }

  const indexPath = path.join(distDir, "index.html");
  const indexStat = statSafe(indexPath);
  if (!indexStat?.isFile()) {
    errors.push({ code: "INDEX_MISSING", message: "index.html not found in dist directory", indexPath: path.relative(projectRoot, indexPath) });
  } else if (indexStat.size === 0) {
    errors.push({ code: "INDEX_EMPTY", message: "index.html is empty", indexPath: path.relative(projectRoot, indexPath) });
  }

  const indexHtml = safeReadText(indexPath) ?? "";
  const hasLocalhost = /(?:localhost|127\.0\.0\.1)/i.test(indexHtml);
  if (hasLocalhost) {
    warnings.push({ code: "LOCALHOST_REFERENCE", message: "index.html contains localhost references; verify build-time base URL configuration" });
  }

  const fileList = distStat?.isDirectory() ? listFilesRecursive(distDir) : [];
  const relativeFiles = fileList.map((f) => path.relative(distDir, f));
  const htmlFiles = relativeFiles.filter((f) => f.endsWith(".html"));
  const hasAstroAssets = Boolean(statSafe(path.join(distDir, "_astro"))?.isDirectory());
  const hasViteAssets = Boolean(statSafe(path.join(distDir, "assets"))?.isDirectory());

  let buildProfile = "unknown";
  if (hasAstroAssets) buildProfile = "astro-static";
  else if (hasViteAssets) buildProfile = "vite-static";
  else if (htmlFiles.length <= 1) buildProfile = "spa-like";
  else buildProfile = "multi-page-static";

  const vercelRewrites = readVercelRewrites(projectRoot);
  const vercelHasRewriteToIndex = Array.isArray(vercelRewrites)
    ? vercelRewrites.some((r) => typeof r?.destination === "string" && r.destination.trim() === "/index.html")
    : false;

  if (vercelHasRewriteToIndex && htmlFiles.length <= 1) {
    warnings.push({
      code: "SPA_REWRITE_HINT",
      message: "vercel.json indicates rewrite-to-index behavior and dist appears SPA-like; deep-link refresh behavior must be validated on the target host (do not assume rewrite support)",
    });
  } else if (vercelHasRewriteToIndex && htmlFiles.length > 1) {
    warnings.push({
      code: "VERCEL_SPA_REWRITE_PRESENT",
      message: "vercel.json contains a rewrite-to-index rule, but dist appears multi-page; ensure any hosting rewrite configuration does not override static page routing",
    });
  }

  const assetRefs = indexStat?.isFile() ? extractAssetRefsFromHtml(indexHtml) : [];
  const unresolvedAssets = [];
  const suspiciousRouteLinks = [];

  for (const ref of assetRefs) {
    if (!ref) continue;
    if (ref.startsWith("http://") || ref.startsWith("https://") || ref.startsWith("data:")) continue;
    if (ref.startsWith("#")) continue;

    const cleaned = ref.split("?")[0].split("#")[0];
    if (!cleaned) continue;
    if (cleaned.startsWith("//")) continue;

    const isAsset = looksLikeAssetPath(cleaned) || cleaned.startsWith("/_astro/");
    const isRouteLink = cleaned.startsWith("/") && !isAsset;

    if (isAsset) {
      const candidate = cleaned.startsWith("/") ? path.join(distDir, cleaned.slice(1)) : path.join(distDir, cleaned);
      if (!statSafe(candidate)?.isFile()) {
        unresolvedAssets.push({ ref, expectedFile: path.relative(projectRoot, candidate) });
      }
      continue;
    }

    if (isRouteLink && cleaned !== "/" && htmlFiles.length > 1) {
      const routePath = cleaned.endsWith("/") ? cleaned.slice(1, -1) : cleaned.slice(1);
      const candidates = [
        path.join(distDir, routePath, "index.html"),
        path.join(distDir, `${routePath}.html`),
      ];
      const emitted = candidates.some((c) => statSafe(c)?.isFile());
      if (!emitted) {
        suspiciousRouteLinks.push({ ref, expected: candidates.map((c) => path.relative(projectRoot, c)) });
      }
      continue;
    }
  }

  if (unresolvedAssets.length) {
    warnings.push({
      code: "UNRESOLVED_ASSET_REFS",
      message: "index.html references assets that were not found in dist; this often causes broken styling or blank pages after deploy",
      unresolved: unresolvedAssets.slice(0, 50),
      truncated: unresolvedAssets.length > 50,
    });
  }

  if (suspiciousRouteLinks.length) {
    warnings.push({
      code: "ROUTE_LINKS_WITHOUT_OUTPUT",
      message: "index.html contains internal route links that do not map to emitted HTML files in dist; this may indicate a mis-built output or a static hosting routing risk",
      unresolved: suspiciousRouteLinks.slice(0, 50),
      truncated: suspiciousRouteLinks.length > 50,
    });
  }

  const likelySinglePageOnly = htmlFiles.length <= 1;
  if (likelySinglePageOnly) {
    warnings.push({
      code: "SINGLE_HTML_OUTPUT",
      message: "dist contains only one HTML file; if relying on client-side routing, deep links may 404 on static hosting unless a fallback strategy is configured and supported",
      htmlFiles: htmlFiles.slice(0, 10),
    });
  }

  const largeFiles = relativeFiles
    .map((rel) => {
      const st = statSafe(path.join(distDir, rel));
      return st?.isFile() ? { path: rel, sizeBytes: st.size } : null;
    })
    .filter((v) => v && v.sizeBytes >= 5 * 1024 * 1024)
    .sort((a, b) => b.sizeBytes - a.sizeBytes)
    .slice(0, 20);

  if (largeFiles.length) {
    warnings.push({
      code: "LARGE_ASSETS",
      message: "dist contains very large files (>= 5MB); confirm these are intentional for static hosting performance",
      files: largeFiles,
    });
  }

  verboseLog(`Project root: ${projectRoot}`);
  verboseLog(`Dist dir: ${distDir}`);
  verboseLog(`Files in dist: ${relativeFiles.length}`);

  const result = {
    ok: errors.length === 0,
    help: args.help,
    usage: args.help ? usage : undefined,
    projectRoot: projectRoot,
    distDir: path.relative(projectRoot, distDir),
    checks: {
      distExists: Boolean(distStat?.isDirectory()),
      indexHtmlExists: Boolean(indexStat?.isFile()),
      htmlFileCount: htmlFiles.length,
      fileCount: relativeFiles.length,
      unresolvedAssetRefsCount: unresolvedAssets.length,
      buildProfile,
      hasAstroAssets,
      hasViteAssets,
    },
    warnings,
    errors,
    timings: {
      validatedAt: new Date().toISOString(),
      durationMs: Date.now() - start,
    },
  };

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  process.exit(result.ok ? 0 : 1);
}

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.stdout.write(`${JSON.stringify({ ok: false, errors: [{ code: "UNHANDLED", message }] }, null, 2)}\n`);
  process.exit(1);
}
