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

function listFilesRecursive(rootDir, maxFiles = 20000) {
  const files = [];
  const queue = [rootDir];
  while (queue.length) {
    const current = queue.pop();
    if (!current) break;
    let entries;
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === "node_modules" || entry.name === ".git" || entry.name === "dist") continue;
        queue.push(fullPath);
      } else if (entry.isFile()) {
        files.push(fullPath);
        if (files.length >= maxFiles) return files;
      }
    }
  }
  return files;
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
      usage: "node scripts/inspect-threejs-usage.mjs [--project-root <path>] [--verbose] [--help]",
      notes: [
        "Read-only, idempotent. Outputs JSON to stdout, diagnostics to stderr.",
        "Searches for Three.js, pmndrs, shader, and animation loop signals in the repo.",
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

  const threeDeps = Object.entries(dependencies)
    .filter(([name]) => name === "three" || name.startsWith("@react-three/") || name.includes("pmndrs"))
    .map(([name, version]) => ({ name, version }));

  checks.push({
    id: "three_dependencies",
    ok: true,
    level: "info",
    message: "Three.js and related dependency detection (best-effort).",
    details: { dependencies: threeDeps },
  });

  const srcDir = path.join(repoRoot, "src");
  const publicDir = path.join(repoRoot, "public");
  const candidateRoots = [srcDir, publicDir].filter(isDirectory);
  const allFiles = candidateRoots.flatMap((dir) => listFilesRecursive(dir));

  const sceneFiles = [];
  const shaderFiles = [];
  const animationSignals = [];
  const threeImportSignals = [];

  const shaderExtensions = new Set([".glsl", ".vert", ".frag", ".wgsl"]);
  const codeExtensions = new Set([".js", ".mjs", ".cjs", ".ts", ".mts", ".cts", ".tsx", ".jsx", ".astro"]);

  for (const filePath of allFiles) {
    const ext = path.extname(filePath).toLowerCase();
    const rel = path.relative(repoRoot, filePath);

    if (shaderExtensions.has(ext)) shaderFiles.push(rel);
    if (!codeExtensions.has(ext) && !shaderExtensions.has(ext)) continue;

    const text = safeReadText(filePath);
    if (!text) continue;

    const hasThreeImport =
      text.includes('from "three"') ||
      text.includes("from 'three'") ||
      text.includes('import("three")') ||
      text.includes("import('three')") ||
      text.includes("@react-three") ||
      text.includes("THREE.");

    if (hasThreeImport) {
      threeImportSignals.push(rel);
      sceneFiles.push(rel);
    }

    if (text.includes("requestAnimationFrame") || text.includes("setAnimationLoop")) {
      animationSignals.push(rel);
    }
  }

  const unique = (arr) => Array.from(new Set(arr)).sort();
  const result = {
    ok: true,
    repo_root: repoRoot,
    summary: {
      three_dependency_count: threeDeps.length,
      three_import_file_count: unique(threeImportSignals).length,
      scene_file_count: unique(sceneFiles).length,
      shader_file_count: unique(shaderFiles).length,
      animation_signal_file_count: unique(animationSignals).length,
    },
    findings: {
      dependencies: threeDeps,
      three_import_files: unique(threeImportSignals),
      scene_files: unique(sceneFiles),
      shader_files: unique(shaderFiles),
      animation_signal_files: unique(animationSignals),
    },
    checks,
  };

  if (args.verbose) {
    process.stderr.write(`INFO repo_root: ${repoRoot}\n`);
    process.stderr.write(`INFO three_dependency_count: ${threeDeps.length}\n`);
    process.stderr.write(`INFO three_import_file_count: ${result.summary.three_import_file_count}\n`);
    process.stderr.write(`INFO shader_file_count: ${result.summary.shader_file_count}\n`);
    process.stderr.write(`INFO animation_signal_file_count: ${result.summary.animation_signal_file_count}\n`);
  }

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  return 0;
}

process.exitCode = run();
