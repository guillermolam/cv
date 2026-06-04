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

function listFilesRecursive(rootDir, maxFiles = 40000) {
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
      usage: "node scripts/validate-scene-budget.mjs [--project-root <path>] [--verbose] [--help]",
      notes: [
        "Read-only, idempotent. Outputs JSON to stdout, diagnostics to stderr.",
        "Heuristic checks only. Use runtime profiling for real performance validation.",
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
  const srcDir = path.join(repoRoot, "src");
  const publicDir = path.join(repoRoot, "public");
  const candidateRoots = [srcDir, publicDir].filter(isDirectory);
  const allFiles = candidateRoots.flatMap((dir) => listFilesRecursive(dir));

  const shaderExtensions = new Set([".glsl", ".vert", ".frag", ".wgsl"]);
  const textureExtensions = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif", ".ktx2"]);
  const modelExtensions = new Set([".glb", ".gltf", ".fbx", ".obj"]);
  const codeExtensions = new Set([".js", ".mjs", ".cjs", ".ts", ".mts", ".cts", ".tsx", ".jsx", ".astro"]);

  let shaderCount = 0;
  let textureCount = 0;
  let modelCount = 0;
  let largeAssetCount = 0;
  let largeAssetBytes = 0;
  let rafSignalCount = 0;
  let loopSignalCount = 0;
  let threeImportCount = 0;

  const largeAssetThresholdBytes = 512 * 1024;

  for (const filePath of allFiles) {
    const ext = path.extname(filePath).toLowerCase();
    let stat;
    try {
      stat = fs.statSync(filePath);
    } catch {
      continue;
    }

    if (shaderExtensions.has(ext)) shaderCount += 1;
    if (textureExtensions.has(ext)) textureCount += 1;
    if (modelExtensions.has(ext)) modelCount += 1;

    const isAsset = shaderExtensions.has(ext) || textureExtensions.has(ext) || modelExtensions.has(ext);
    if (isAsset && stat.size >= largeAssetThresholdBytes) {
      largeAssetCount += 1;
      largeAssetBytes += stat.size;
    }

    if (!codeExtensions.has(ext)) continue;
    const text = safeReadText(filePath);
    if (!text) continue;

    if (
      text.includes('from "three"') ||
      text.includes("from 'three'") ||
      text.includes('import("three")') ||
      text.includes("import('three')") ||
      text.includes("THREE.")
    ) {
      threeImportCount += 1;
    }

    if (text.includes("requestAnimationFrame")) rafSignalCount += 1;
    if (text.includes("setAnimationLoop")) loopSignalCount += 1;
  }

  const warnings = [];
  if (shaderCount > 12) warnings.push("High shader file count; consider consolidation and variant control.");
  if (textureCount > 50) warnings.push("High texture count; verify texture sizes and compression.");
  if (modelCount > 0) warnings.push("3D model assets detected; verify polygon and texture budgets, especially on mobile.");
  if (largeAssetCount > 0) warnings.push("Large assets detected; verify loading strategy and budget impact.");
  if (rafSignalCount + loopSignalCount > 5) warnings.push("Multiple render loop signals detected; ensure a single controlled loop and cleanup.");

  checks.push({
    id: "asset_indicators",
    ok: true,
    level: "info",
    message: "Heuristic asset indicators collected.",
    details: {
      shader_count: shaderCount,
      texture_count: textureCount,
      model_count: modelCount,
      large_asset_count: largeAssetCount,
      large_asset_bytes: largeAssetBytes,
    },
  });

  checks.push({
    id: "loop_indicators",
    ok: true,
    level: "info",
    message: "Heuristic animation loop indicators collected.",
    details: {
      three_import_file_count_estimate: threeImportCount,
      request_animation_frame_signal_count: rafSignalCount,
      set_animation_loop_signal_count: loopSignalCount,
    },
  });

  const ok = warnings.length === 0;
  const result = {
    ok,
    repo_root: repoRoot,
    budgets: {
      shader_soft_limit: 12,
      texture_soft_limit: 50,
      large_asset_threshold_bytes: largeAssetThresholdBytes,
    },
    indicators: {
      shader_count: shaderCount,
      texture_count: textureCount,
      model_count: modelCount,
      large_asset_count: largeAssetCount,
      large_asset_bytes: largeAssetBytes,
      request_animation_frame_signal_count: rafSignalCount,
      set_animation_loop_signal_count: loopSignalCount,
      three_import_file_count_estimate: threeImportCount,
    },
    warnings,
    checks,
  };

  if (args.verbose) {
    process.stderr.write(`INFO repo_root: ${repoRoot}\n`);
    for (const warning of warnings) process.stderr.write(`WARN budget: ${warning}\n`);
  }

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  return ok ? 0 : 1;
}

process.exitCode = run();
