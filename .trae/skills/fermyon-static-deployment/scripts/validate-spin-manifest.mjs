import fs from "node:fs";
import path from "node:path";
import process from "node:process";

function parseArgs(argv) {
  const args = { _: [], verbose: false, help: false, projectRoot: process.cwd(), manifestPath: null };
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
    if (current === "--manifest") {
      const value = argv[i + 1];
      if (!value) throw new Error("--manifest requires a value");
      args.manifestPath = value;
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

function findSpinTomlCandidates(projectRoot, maxResults = 20) {
  const ignoreNames = new Set(["node_modules", ".git", "dist", ".astro", ".trunk", ".tmp"]);
  const results = [];
  const stack = [{ dir: projectRoot, depth: 0 }];
  const maxDepth = 5;

  while (stack.length && results.length < maxResults) {
    const current = stack.pop();
    if (!current) break;
    const { dir, depth } = current;
    if (depth > maxDepth) continue;
    const dirStat = statSafe(dir);
    if (!dirStat?.isDirectory()) continue;

    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      continue;
    }

    for (const entry of entries) {
      if (results.length >= maxResults) break;
      if (entry.isDirectory()) {
        if (ignoreNames.has(entry.name)) continue;
        stack.push({ dir: path.join(dir, entry.name), depth: depth + 1 });
        continue;
      }
      if (!entry.isFile()) continue;
      if (entry.name === "spin.toml") {
        results.push(path.join(dir, entry.name));
      }
    }
  }

  return results;
}

function formatUsage() {
  return [
    "validate-spin-manifest.mjs",
    "",
    "Read-only validation for a Spin manifest (spin.toml) with static-hosting heuristics.",
    "Emits JSON to stdout; diagnostics to stderr.",
    "",
    "Usage:",
    "  node scripts/validate-spin-manifest.mjs [--project-root <path>] [--manifest <path>] [--verbose] [--help]",
    "",
    "Options:",
    "  --project-root <path>  Project root (default: cwd)",
    "  --manifest <path>      Spin manifest path (default: <projectRoot>/spin.toml)",
    "  --verbose, -v          Emit diagnostics to stderr",
    "  --help, -h             Print this help (JSON still emitted to stdout)",
  ].join("\n");
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
  const manifestPath = args.manifestPath ? toAbsolute(projectRoot, args.manifestPath) : path.join(projectRoot, "spin.toml");

  const errors = [];
  const warnings = [];

  const st = statSafe(manifestPath);
  if (!st?.isFile()) {
    errors.push({ code: "MANIFEST_MISSING", message: "spin.toml not found", manifestPath: path.relative(projectRoot, manifestPath) });
  }

  const raw = safeReadText(manifestPath) ?? "";
  if (st?.isFile() && raw.trim().length === 0) {
    errors.push({ code: "MANIFEST_EMPTY", message: "spin.toml is empty", manifestPath: path.relative(projectRoot, manifestPath) });
  }

  const lines = raw.split(/\r?\n/);

  const hasSpinManifestVersion = st?.isFile() ? lines.some((l) => /^\s*spin_manifest_version\s*=/.test(l)) : false;
  const hasLegacySpinVersion = st?.isFile() ? lines.some((l) => /^\s*spin_version\s*=/.test(l)) : false;
  const hasName = st?.isFile() ? lines.some((l) => /^\s*name\s*=/.test(l)) : false;
  const hasVersion = st?.isFile() ? lines.some((l) => /^\s*version\s*=/.test(l)) : false;
  const hasComponentTable = st?.isFile() ? lines.some((l) => /^\s*\[+.*component.*\]+/.test(l)) : false;
  const hasFilesKey = st?.isFile() ? lines.some((l) => /^\s*files\s*=/.test(l)) : false;

  let manifestStyle = "missing";
  if (st?.isFile() && hasSpinManifestVersion) manifestStyle = "manifest-v2";
  else if (st?.isFile() && hasLegacySpinVersion) manifestStyle = "manifest-v1";
  else if (st?.isFile()) manifestStyle = "unknown";

  if (st?.isFile() && !hasSpinManifestVersion && !hasLegacySpinVersion) {
    warnings.push({ code: "MANIFEST_VERSION_NOT_FOUND", message: "no manifest version field detected; confirm required fields against official Spin docs" });
  }
  if (st?.isFile() && !hasName) {
    warnings.push({ code: "NAME_NOT_FOUND", message: "name not detected in manifest; confirm required fields against official Spin docs" });
  }
  if (st?.isFile() && !hasVersion) {
    warnings.push({ code: "VERSION_NOT_FOUND", message: "version not detected in manifest; confirm required fields against official Spin docs" });
  }
  if (st?.isFile() && !hasComponentTable) {
    warnings.push({ code: "COMPONENT_TABLE_NOT_FOUND", message: "no component table detected; static hosting requires at least one component definition" });
  }
  if (st?.isFile() && !hasFilesKey) {
    warnings.push({ code: "FILES_KEY_NOT_FOUND", message: "no files= entry detected; static file serving typically requires an explicit list/glob of files to include" });
  }

  const hasAbsolutePath = st?.isFile() ? lines.some((l) => /(["'])(\/[^"']+)\1/.test(l)) : false;
  if (hasAbsolutePath) {
    warnings.push({ code: "ABSOLUTE_PATHS_DETECTED", message: "manifest contains absolute filesystem paths; this is usually non-portable across machines/CI" });
  }

  const suspiciousIncludes = st?.isFile()
    ? lines
        .map((l) => l.trim())
        .filter((l) => /^\s*files\s*=/.test(l) && /(\.env|id_rsa|kubeconfig|\.pem|\.key)/i.test(l))
    : [];
  if (suspiciousIncludes.length) {
    warnings.push({ code: "SUSPICIOUS_FILE_INCLUDES", message: "manifest files list appears to include sensitive file patterns; review before deploying", evidence: suspiciousIncludes.slice(0, 10) });
  }

  const otherSpinTomls = findSpinTomlCandidates(projectRoot).map((p) => path.relative(projectRoot, p));
  if (!st?.isFile() && otherSpinTomls.length) {
    warnings.push({ code: "SPIN_TOML_FOUND_ELSEWHERE", message: "spin.toml not found at the expected path, but other candidates exist in the repo", candidates: otherSpinTomls });
  }

  if (!st?.isFile()) {
    warnings.push({
      code: "REPO_NEXT_STEPS",
      message: "repo has no spin.toml; create one using verified Spin examples (static-fileserver template) and choose the correct artifact (dist/ vs guillermo-lam-cv/dist) using the project deployment inventory",
      references: [
        ".trae/skills/fermyon-static-deployment/references/project-deployment-inventory.md",
        ".trae/skills/fermyon-static-deployment/references/project-pattern-mapping.md",
        "https://github.com/spinframework/spin/tree/main/templates/static-fileserver"
      ]
    });
  }

  verboseLog(`Project root: ${projectRoot}`);
  verboseLog(`Manifest path: ${manifestPath}`);

  const result = {
    ok: errors.length === 0,
    help: args.help,
    usage: args.help ? usage : undefined,
    projectRoot,
    manifestPath: path.relative(projectRoot, manifestPath),
    checks: {
      manifestExists: Boolean(st?.isFile()),
      manifestStyle,
      spinManifestVersionDetected: hasSpinManifestVersion,
      legacySpinVersionDetected: hasLegacySpinVersion,
      nameDetected: hasName,
      versionDetected: hasVersion,
      componentTableDetected: hasComponentTable,
      filesKeyDetected: hasFilesKey,
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
