import fs from "node:fs";
import path from "node:path";

function parseArgs(argv) {
  const args = { help: false, verbose: false, projectRoot: null };
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--help" || token === "-h") args.help = true;
    else if (token === "--verbose" || token === "-v") args.verbose = true;
    else if (token === "--project-root") {
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

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function detectPackageManager(repoRoot) {
  const lockfiles = [
    { name: "pnpm", file: "pnpm-lock.yaml" },
    { name: "npm", file: "package-lock.json" },
    { name: "yarn", file: "yarn.lock" },
    { name: "bun", file: "bun.lockb" },
  ];
  const detected = lockfiles.find((entry) => fileExists(path.join(repoRoot, entry.file)));
  return detected ? detected.name : "unknown";
}

function stringSearchInFile(filePath, needle) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    return content.includes(needle);
  } catch {
    return false;
  }
}

function run() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    const help = {
      ok: true,
      usage:
        "node scripts/validate-astro-project.mjs [--project-root <path>] [--verbose] [--help]",
      notes: [
        "Read-only, idempotent. Outputs JSON to stdout, diagnostics to stderr.",
        "If --project-root is not provided, searches upward for package.json.",
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
      id: "package_json",
      ok: false,
      level: "error",
      message: "package.json not found (searched upward).",
    });
    const result = { ok: false, repo_root: null, checks };
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    return 1;
  }

  const repoRoot = path.dirname(packageJsonPath);
  const packageJson = readJson(packageJsonPath);
  const dependencies = { ...(packageJson.dependencies ?? {}), ...(packageJson.devDependencies ?? {}) };
  const astroVersion = dependencies.astro ?? null;

  checks.push({
    id: "repo_root",
    ok: true,
    level: "info",
    message: "Repository root resolved from package.json.",
    details: { repo_root: repoRoot },
  });

  checks.push({
    id: "package_manager",
    ok: true,
    level: "info",
    message: "Detected package manager from lockfiles.",
    details: { package_manager: detectPackageManager(repoRoot) },
  });

  checks.push({
    id: "astro_dependency",
    ok: Boolean(astroVersion),
    level: astroVersion ? "info" : "error",
    message: astroVersion ? "Astro dependency found." : "Astro dependency missing in package.json.",
    details: astroVersion ? { astro: astroVersion } : undefined,
  });

  const astroConfigCandidates = [
    "astro.config.mjs",
    "astro.config.ts",
    "astro.config.js",
    "astro.config.cjs",
    "astro.config.mts",
  ];
  const astroConfigPath = astroConfigCandidates
    .map((name) => path.join(repoRoot, name))
    .find((candidate) => fileExists(candidate));

  checks.push({
    id: "astro_config",
    ok: Boolean(astroConfigPath),
    level: astroConfigPath ? "info" : "warning",
    message: astroConfigPath
      ? "Astro config file found."
      : "Astro config file not found (may be acceptable for defaults).",
    details: astroConfigPath ? { astro_config: path.relative(repoRoot, astroConfigPath) } : undefined,
  });

  const requiredDirs = [
    "src/pages",
    "src/layouts",
    "src/components",
  ];
  for (const dir of requiredDirs) {
    const abs = path.join(repoRoot, dir);
    checks.push({
      id: `dir_${dir.replaceAll("/", "_")}`,
      ok: isDirectory(abs),
      level: isDirectory(abs) ? "info" : "error",
      message: isDirectory(abs) ? `Directory exists: ${dir}` : `Missing directory: ${dir}`,
    });
  }

  const ssrAdapterPackages = [
    "@astrojs/node",
    "@astrojs/vercel",
    "@astrojs/netlify",
    "@astrojs/cloudflare",
    "@astrojs/deno",
  ];
  const presentAdapters = ssrAdapterPackages.filter((pkg) => Boolean(dependencies[pkg]));
  checks.push({
    id: "ssr_adapter_signal",
    ok: presentAdapters.length === 0,
    level: presentAdapters.length === 0 ? "info" : "warning",
    message:
      presentAdapters.length === 0
        ? "No SSR adapter dependency detected (static-output signal)."
        : "SSR adapter dependency detected (verify desired output mode and hosting target).",
    details: presentAdapters.length ? { adapters: presentAdapters } : undefined,
  });

  if (astroConfigPath) {
    const outputServer = stringSearchInFile(astroConfigPath, 'output: "server"');
    const hasAdapterKey = stringSearchInFile(astroConfigPath, "adapter:");
    checks.push({
      id: "astro_config_static_signal",
      ok: !(outputServer || hasAdapterKey),
      level: outputServer || hasAdapterKey ? "warning" : "info",
      message:
        outputServer || hasAdapterKey
          ? "Astro config contains SSR-related signals; verify desired output mode."
          : "No obvious SSR signals detected in Astro config (best-effort).",
      details: outputServer || hasAdapterKey ? { output_server: outputServer, adapter_key: hasAdapterKey } : undefined,
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
    astro_version: astroVersion,
    checks,
  };
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  return ok ? 0 : 1;
}

process.exitCode = run();
