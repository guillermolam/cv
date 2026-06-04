import fs from "node:fs";
import path from "node:path";

function parseArgs(argv) {
  const args = { help: false, verbose: false, distPath: null, projectRoot: null };
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--help" || token === "-h") args.help = true;
    else if (token === "--verbose" || token === "-v") args.verbose = true;
    else if (token === "--path") {
      const value = argv[index + 1];
      if (value) {
        args.distPath = value;
        index += 1;
      }
    } else if (token === "--project-root") {
      const value = argv[index + 1];
      if (value) {
        args.projectRoot = value;
        index += 1;
      }
    }
  }
  return args;
}

function fileExists(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

function isDirectory(dirPath) {
  try {
    return fs.statSync(dirPath).isDirectory();
  } catch {
    return false;
  }
}

function findUp(startDir, fileName, maxDepth = 12) {
  let current = path.resolve(startDir);
  for (let depth = 0; depth < maxDepth; depth += 1) {
    const candidate = path.join(current, fileName);
    if (fileExists(candidate)) return candidate;
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }
  return null;
}

function safeReadText(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return null;
  }
}

function run() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    const help = {
      ok: true,
      usage:
        "node scripts/check-static-output.mjs [--path <dist>] [--project-root <path>] [--verbose] [--help]",
      defaults: { path: "dist (relative to repo root)" },
      notes: [
        "Read-only, idempotent. Outputs JSON to stdout, diagnostics to stderr.",
        "Resolves repo root by searching upward for package.json unless --project-root is provided.",
      ],
    };
    process.stdout.write(`${JSON.stringify(help, null, 2)}\n`);
    return 0;
  }

  const startDir = args.projectRoot ? path.resolve(args.projectRoot) : process.cwd();
  const packageJsonPath = findUp(startDir, "package.json");
  const checks = [];

  if (!packageJsonPath) {
    checks.push({
      id: "repo_root",
      ok: false,
      level: "error",
      message: "package.json not found (searched upward). Cannot resolve repo root.",
    });
    const result = { ok: false, dist_path: null, checks };
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    return 1;
  }

  const repoRoot = path.dirname(packageJsonPath);
  const distPath = path.resolve(repoRoot, args.distPath ?? "dist");

  checks.push({
    id: "dist_dir",
    ok: isDirectory(distPath),
    level: isDirectory(distPath) ? "info" : "error",
    message: isDirectory(distPath) ? "dist directory exists." : "dist directory missing.",
    details: { dist_path: distPath },
  });

  const indexHtmlPath = path.join(distPath, "index.html");
  checks.push({
    id: "index_html",
    ok: fileExists(indexHtmlPath),
    level: fileExists(indexHtmlPath) ? "info" : "error",
    message: fileExists(indexHtmlPath) ? "index.html exists." : "index.html missing.",
    details: { index_html: indexHtmlPath },
  });

  const astroAssetsDir = path.join(distPath, "_astro");
  const assetsDir = path.join(distPath, "assets");
  const hasAstroAssets = isDirectory(astroAssetsDir);
  const hasAssets = isDirectory(assetsDir);

  checks.push({
    id: "assets_dir",
    ok: hasAstroAssets || hasAssets,
    level: hasAstroAssets || hasAssets ? "info" : "warning",
    message:
      hasAstroAssets || hasAssets
        ? "Static assets directory detected."
        : "No _astro/ or assets/ directory detected (verify build output).",
    details: { has__astro: hasAstroAssets, has_assets: hasAssets },
  });

  const html = fileExists(indexHtmlPath) ? safeReadText(indexHtmlPath) : null;
  if (html) {
    const hasHtmlTag = html.includes("<html");
    const hasTitle = html.includes("<title");
    checks.push({
      id: "index_html_sanity",
      ok: hasHtmlTag,
      level: hasHtmlTag ? "info" : "warning",
      message: hasHtmlTag ? "index.html contains <html> tag." : "index.html missing <html> tag (unexpected).",
    });
    checks.push({
      id: "index_title_signal",
      ok: hasTitle,
      level: hasTitle ? "info" : "warning",
      message: hasTitle ? "index.html includes a <title> tag." : "index.html missing <title> tag (SEO risk).",
    });
  }

  const errors = checks.filter((check) => check.level === "error");
  const ok = errors.length === 0;

  if (args.verbose) {
    for (const check of checks) {
      process.stderr.write(
        `${check.level.toUpperCase()} ${check.id}: ${check.message}${check.details ? ` ${JSON.stringify(check.details)}` : ""}\n`,
      );
    }
  }

  const result = {
    ok,
    repo_root: repoRoot,
    dist_path: distPath,
    checks,
  };
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  return ok ? 0 : 1;
}

process.exitCode = run();
