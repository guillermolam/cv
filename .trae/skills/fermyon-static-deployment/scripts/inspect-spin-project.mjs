import fs from "node:fs";
import path from "node:path";
import process from "node:process";

function parseArgs(argv) {
  const args = { _: [], verbose: false, help: false, projectRoot: process.cwd() };
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
      if (!value) {
        throw new Error("--project-root requires a value");
      }
      args.projectRoot = value;
      i += 1;
      continue;
    }
    args._.push(current);
  }
  return args;
}

function toAbsoluteProjectRoot(projectRoot) {
  return path.isAbsolute(projectRoot) ? projectRoot : path.resolve(process.cwd(), projectRoot);
}

function safeReadText(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return null;
  }
}

function fileExists(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

function statSafe(targetPath) {
  try {
    return fs.statSync(targetPath);
  } catch {
    return null;
  }
}

function detectPackageManager(projectRoot) {
  const candidates = [
    { name: "pnpm", lockFile: "pnpm-lock.yaml" },
    { name: "yarn", lockFile: "yarn.lock" },
    { name: "npm", lockFile: "package-lock.json" },
  ];

  for (const candidate of candidates) {
    const lockPath = path.join(projectRoot, candidate.lockFile);
    if (fileExists(lockPath)) {
      return { name: candidate.name, evidence: candidate.lockFile };
    }
  }

  const pkgJsonPath = path.join(projectRoot, "package.json");
  if (fileExists(pkgJsonPath)) {
    return { name: "unknown", evidence: "package.json present but no lockfile detected" };
  }

  return { name: "unknown", evidence: "no package.json and no lockfile detected" };
}

function detectAstroOutDir(projectRoot) {
  const configCandidates = ["astro.config.mjs", "astro.config.js", "astro.config.ts"];
  for (const fileName of configCandidates) {
    const configPath = path.join(projectRoot, fileName);
    const raw = safeReadText(configPath);
    if (!raw) continue;
    const outDirMatch = raw.match(/outDir\s*:\s*["'`]{1}([^"'`]+)["'`]{1}/);
    if (outDirMatch?.[1]) {
      const outDirValue = outDirMatch[1];
      const resolved = path.isAbsolute(outDirValue) ? outDirValue : path.resolve(projectRoot, outDirValue);
      return { configPath, outDir: resolved, evidence: `outDir parsed from ${fileName}` };
    }
    return { configPath, outDir: path.join(projectRoot, "dist"), evidence: `${fileName} present; outDir not detected, defaulting to dist/` };
  }
  return { configPath: null, outDir: path.join(projectRoot, "dist"), evidence: "no astro config found; defaulting to dist/" };
}

function inspectWorkflows(projectRoot) {
  const workflowsDir = path.join(projectRoot, ".github", "workflows");
  const dirStat = statSafe(workflowsDir);
  if (!dirStat?.isDirectory()) {
    return [];
  }

  const entries = fs.readdirSync(workflowsDir, { withFileTypes: true });
  const workflows = [];
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    if (!entry.name.endsWith(".yml") && !entry.name.endsWith(".yaml")) continue;
    const filePath = path.join(workflowsDir, entry.name);
    const content = safeReadText(filePath) ?? "";
    const mentionsSpin = /(^|\W)spin(\W|$)/i.test(content);
    const mentionsFermyon = /fermyon/i.test(content);
    const mentionsPages = /deploy-pages|upload-pages-artifact|github-pages/i.test(content);
    const mentionsBun = /setup-bun|(^|\W)bun(\W|$)/i.test(content);
    const mentionsPnpm = /(^|\W)pnpm(\W|$)/i.test(content);
    workflows.push({
      path: path.relative(projectRoot, filePath),
      mentions: { spin: mentionsSpin, fermyon: mentionsFermyon, pages: mentionsPages, bun: mentionsBun, pnpm: mentionsPnpm },
    });
  }
  return workflows;
}

function extractGithubPagesBuildConfig(projectRoot) {
  const workflowPath = path.join(projectRoot, ".github", "workflows", "deploy-cv.yaml");
  const raw = safeReadText(workflowPath);
  if (!raw) {
    return { exists: false, path: path.relative(projectRoot, workflowPath), config: null };
  }

  const workingDirMatch = raw.match(/working-directory:\s*([^\n#]+)\s*/);
  const artifactPathMatch = raw.match(/uses:\s*actions\/upload-pages-artifact@[\w.]+\s*[\s\S]*?\n\s*with:\s*[\s\S]*?\n\s*path:\s*([^\n#]+)\s*/m);

  const workingDirectory = workingDirMatch?.[1]?.trim() ?? null;
  const artifactPath = artifactPathMatch?.[1]?.trim() ?? null;

  return {
    exists: true,
    path: path.relative(projectRoot, workflowPath),
    config: {
      workingDirectory,
      artifactPath,
      usesBun: /setup-bun|(^|\W)bun(\W|$)/i.test(raw),
    },
  };
}

function extractVercelSpaRewrite(projectRoot) {
  const configPath = path.join(projectRoot, "vercel.json");
  const raw = safeReadText(configPath);
  if (!raw) {
    return { exists: false, path: path.relative(projectRoot, configPath), rewrites: null };
  }
  try {
    const parsed = JSON.parse(raw);
    const rewrites = Array.isArray(parsed?.rewrites) ? parsed.rewrites : null;
    return { exists: true, path: path.relative(projectRoot, configPath), rewrites };
  } catch {
    return { exists: true, path: path.relative(projectRoot, configPath), rewrites: null };
  }
}

function inspectSubproject(projectRoot, subprojectDir) {
  const subRoot = path.join(projectRoot, subprojectDir);
  const pkgPath = path.join(subRoot, "package.json");
  const raw = safeReadText(pkgPath);
  if (!raw) {
    return { exists: false, dir: subprojectDir, packageJsonPath: path.relative(projectRoot, pkgPath), buildScript: null };
  }
  try {
    const parsed = JSON.parse(raw);
    const buildScript = typeof parsed?.scripts?.build === "string" ? parsed.scripts.build : null;
    return {
      exists: true,
      dir: subprojectDir,
      packageJsonPath: path.relative(projectRoot, pkgPath),
      buildScript,
      distDir: path.join(subprojectDir, "dist"),
    };
  } catch {
    return { exists: true, dir: subprojectDir, packageJsonPath: path.relative(projectRoot, pkgPath), buildScript: null, distDir: path.join(subprojectDir, "dist") };
  }
}

function formatUsage() {
  return [
    "inspect-spin-project.mjs",
    "",
    "Read-only inspection of an Astro + Spin repo for Fermyon static deployment readiness.",
    "",
    "Usage:",
    "  node scripts/inspect-spin-project.mjs [--project-root <path>] [--verbose] [--help]",
    "",
    "Options:",
    "  --project-root <path>  Path to the project root (default: cwd)",
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

  const projectRoot = toAbsoluteProjectRoot(args.projectRoot);
  const errors = [];
  const warnings = [];

  const rootStat = statSafe(projectRoot);
  if (!rootStat?.isDirectory()) {
    errors.push({ code: "PROJECT_ROOT_INVALID", message: "project root is not a directory", projectRoot });
  }

  const spinManifestPath = path.join(projectRoot, "spin.toml");
  const spinManifestExists = fileExists(spinManifestPath);
  if (!spinManifestExists) {
    warnings.push({ code: "SPIN_MANIFEST_MISSING", message: "spin.toml not found at project root", expectedPath: spinManifestPath });
  }

  const pkgManager = detectPackageManager(projectRoot);
  const astro = detectAstroOutDir(projectRoot);

  const distPath = astro.outDir;
  const distStat = statSafe(distPath);
  if (!distStat?.isDirectory()) {
    warnings.push({ code: "DIST_MISSING", message: "build output directory does not exist (build may not have been run yet)", distPath });
  }

  const packageJsonPath = path.join(projectRoot, "package.json");
  const packageJsonRaw = safeReadText(packageJsonPath);
  let packageJson = null;
  if (packageJsonRaw) {
    try {
      packageJson = JSON.parse(packageJsonRaw);
    } catch {
      warnings.push({ code: "PACKAGE_JSON_INVALID", message: "package.json is not valid JSON", path: packageJsonPath });
    }
  } else {
    warnings.push({ code: "PACKAGE_JSON_MISSING", message: "package.json not found; cannot infer build scripts", path: packageJsonPath });
  }

  const scripts = packageJson?.scripts && typeof packageJson.scripts === "object" ? packageJson.scripts : null;
  const buildScript = typeof scripts?.build === "string" ? scripts.build : null;
  if (!buildScript) {
    warnings.push({ code: "BUILD_SCRIPT_MISSING", message: "package.json scripts.build missing; build command must be provided explicitly" });
  }

  const workflows = inspectWorkflows(projectRoot);
  const pagesWorkflow = extractGithubPagesBuildConfig(projectRoot);
  const vercelRouting = extractVercelSpaRewrite(projectRoot);
  const subproject = inspectSubproject(projectRoot, "guillermo-lam-cv");

  const rootDistRel = path.relative(projectRoot, distPath);
  const subDistAbs = path.join(projectRoot, "guillermo-lam-cv", "dist");
  const subDistStat = statSafe(subDistAbs);

  verboseLog(`Project root: ${projectRoot}`);
  verboseLog(`spin.toml: ${spinManifestExists ? "found" : "missing"}`);
  verboseLog(`Package manager: ${pkgManager.name} (${pkgManager.evidence})`);
  verboseLog(`Astro outDir: ${distPath} (${astro.evidence})`);
  if (pagesWorkflow.exists) {
    verboseLog(`GitHub Pages workflow: ${pagesWorkflow.path}`);
  }
  if (vercelRouting.exists) {
    verboseLog(`Vercel config: ${vercelRouting.path}`);
  }

  const result = {
    ok: errors.length === 0,
    help: args.help,
    usage: args.help ? usage : undefined,
    projectRoot,
    spin: {
      manifestPath: path.relative(projectRoot, spinManifestPath),
      exists: spinManifestExists,
    },
    packageManager: pkgManager,
    astro: {
      configPath: astro.configPath ? path.relative(projectRoot, astro.configPath) : null,
      outDir: path.relative(projectRoot, distPath),
      evidence: astro.evidence,
    },
    build: {
      script: buildScript,
      distPath: path.relative(projectRoot, distPath),
      distExists: Boolean(distStat?.isDirectory()),
      indexHtmlExists: fileExists(path.join(distPath, "index.html")),
    },
    artifacts: {
      rootAstro: {
        kind: "astro",
        distDir: rootDistRel,
        exists: Boolean(distStat?.isDirectory()),
        indexHtmlExists: fileExists(path.join(distPath, "index.html")),
      },
      pagesSubproject: {
        kind: "vite",
        distDir: path.relative(projectRoot, subDistAbs),
        exists: Boolean(subDistStat?.isDirectory()),
        indexHtmlExists: fileExists(path.join(subDistAbs, "index.html")),
      }
    },
    deployment: {
      workflows,
      githubPages: pagesWorkflow,
      vercelRouting,
      subproject,
    },
    warnings,
    errors,
    timings: {
      inspectedAt: new Date().toISOString(),
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
