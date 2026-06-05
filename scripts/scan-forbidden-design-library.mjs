import fs from 'node:fs/promises';
import path from 'node:path';

const forbiddenPackages = [
  'react',
  'react-dom',
  '@astrojs/react',
  'preact',
  '@astrojs/preact',
  'vue',
  '@astrojs/vue',
  'svelte',
  '@astrojs/svelte',
  'tailwindcss',
  'daisyui',
  '@react-three/fiber',
  'framer-motion',
  'react-chartjs-2',
  'vue-chartjs',
  'svelte-chartjs',
];

const forbiddenImportRegex =
  /from\s+['"](react|react-dom|preact|vue|svelte|@react-three\/fiber|react-chartjs-2|vue-chartjs|svelte-chartjs)['"]/g;

const readJson = async (filePath) => JSON.parse(await fs.readFile(filePath, 'utf8'));

const walk = async (dir, predicate) => {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'dist') continue;
      out.push(...(await walk(full, predicate)));
      continue;
    }
    if (predicate(full)) out.push(full);
  }
  return out;
};

const main = async () => {
  const root = process.cwd();
  const pkg = await readJson(path.join(root, 'package.json'));
  const deps = {
    ...(pkg.dependencies ?? {}),
    ...(pkg.devDependencies ?? {}),
    ...(pkg.optionalDependencies ?? {}),
  };

  const forbiddenInPackageJson = forbiddenPackages.filter((name) => Object.hasOwn(deps, name));

  const lockPath = path.join(root, 'pnpm-lock.yaml');
  const lockText = await fs.readFile(lockPath, 'utf8');
  const forbiddenInLock = forbiddenPackages.filter((name) => lockText.includes(`${name}@`));

  const srcRoot = path.join(root, 'src');
  const sourceFiles = await walk(srcRoot, (p) => /\.(ts|tsx|js|jsx|astro)$/.test(p));
  const forbiddenImports = [];
  for (const filePath of sourceFiles) {
    const text = await fs.readFile(filePath, 'utf8');
    forbiddenImportRegex.lastIndex = 0;
    if (forbiddenImportRegex.test(text)) forbiddenImports.push(path.relative(root, filePath));
  }

  const astroConfigCandidates = ['astro.config.mjs', 'astro.config.ts', 'astro.config.js']
    .map((p) => path.join(root, p));
  const astroConfigHits = [];
  for (const configPath of astroConfigCandidates) {
    try {
      const text = await fs.readFile(configPath, 'utf8');
      if (
        text.includes('@astrojs/react') ||
        text.includes('@astrojs/preact') ||
        text.includes('@astrojs/vue') ||
        text.includes('@astrojs/svelte')
      ) {
        astroConfigHits.push(path.relative(root, configPath));
      }
    } catch {
    }
  }

  const ok =
    forbiddenInPackageJson.length === 0 &&
    forbiddenInLock.length === 0 &&
    forbiddenImports.length === 0 &&
    astroConfigHits.length === 0;

  const report = {
    ok,
    forbiddenInPackageJson,
    forbiddenInLock,
    forbiddenImports,
    astroConfigHits,
  };

  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (!ok) process.exitCode = 1;
};

await main();
