import fs from 'node:fs/promises';
import path from 'node:path';

const requiredStates = [
  'idle',
  'hoverIn',
  'hoverOut',
  'press',
  'release',
  'focus',
  'blur',
  'selected',
  'disabled',
  'chartEnter',
  'chartLeave',
  'pointHoverIn',
  'pointHoverOut',
  'legendHoverIn',
  'legendHoverOut',
  'tooltipOpen',
  'tooltipClose',
  'routeEnter',
  'routeLeave',
  'revealEnter',
  'revealLeave',
];

const forbiddenSnippets = [
  "from 'react'",
  'from "react"',
  "from 'react-dom'",
  'from "react-dom"',
  "from 'preact'",
  'from "preact"',
  "from 'vue'",
  'from "vue"',
  "from 'svelte'",
  'from "svelte"',
  'tailwindcss',
  'daisyui',
  '@astrojs/react',
  '@astrojs/preact',
  '@astrojs/vue',
  '@astrojs/svelte',
  '@react-three/fiber',
  'react-chartjs-2',
  'barba',
];

const main = async () => {
  const root = process.cwd();
  const motionRoot = path.join(root, 'src', 'design-system', 'motion');

  const requiredFiles = [
    'motion.tokens.ts',
    'interaction-states.ts',
    'reduced-motion.ts',
    'gsap-actions.ts',
    'route-transitions.ts',
    'cleanup.ts',
  ].map((p) => path.join(motionRoot, p));

  const missingFiles = [];
  for (const filePath of requiredFiles) {
    try {
      await fs.access(filePath);
    } catch {
      missingFiles.push(path.relative(root, filePath));
    }
  }

  const interactionPath = path.join(motionRoot, 'interaction-states.ts');
  const interactionText = await fs.readFile(interactionPath, 'utf8');
  const missingStates = requiredStates.filter((s) => !interactionText.includes(`'${s}'`));

  const motionFiles = await fs.readdir(motionRoot);
  const tsFiles = motionFiles.filter((f) => f.endsWith('.ts')).map((f) => path.join(motionRoot, f));

  const forbiddenHits = [];
  const gsapImportsOutside = [];
  for (const filePath of tsFiles) {
    const rel = path.relative(root, filePath);
    const text = await fs.readFile(filePath, 'utf8');

    for (const snippet of forbiddenSnippets) {
      if (text.includes(snippet)) forbiddenHits.push({ file: rel, snippet });
    }

    if (rel !== 'src/design-system/motion/gsap-actions.ts' && text.includes('gsap')) {
      gsapImportsOutside.push(rel);
    }
  }

  const ok =
    missingFiles.length === 0 && missingStates.length === 0 && forbiddenHits.length === 0 && gsapImportsOutside.length === 0;

  const report = {
    ok,
    missingFiles,
    missingStates,
    forbiddenHits,
    gsapImportsOutside,
  };

  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (!ok) process.exitCode = 1;
};

await main();

