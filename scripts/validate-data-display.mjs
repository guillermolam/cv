import fs from 'node:fs/promises';
import path from 'node:path';

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
  'chart.js',
  'three',
  '@react-three/fiber',
  'react-chartjs-2',
];

const exists = async (p) => {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
};

const main = async () => {
  const root = process.cwd();

  const requiredComponents = [
    'src/components/ui/UiCard.astro',
    'src/components/ui/UiStatCard.astro',
    'src/components/ui/UiSkillBadge.astro',
    'src/components/ui/UiTimelineItem.astro',
    'src/components/ui/UiProjectCard.astro',
    'src/components/ui/UiKnowledgeCard.astro',
    'src/components/ui/UiProofChain.astro',
    'src/components/ui/UiMetaList.astro',
  ];

  const requiredCss = ['src/design-system/tokens/data-display.css'];

  const missingFiles = [];
  for (const rel of [...requiredComponents, ...requiredCss]) {
    if (!(await exists(path.join(root, rel)))) missingFiles.push(rel);
  }

  const tokensIndexText = await fs.readFile(path.join(root, 'src/design-system/tokens/index.css'), 'utf8');
  const cssImported = tokensIndexText.includes("@import './data-display.css';");

  const forbiddenHits = [];
  for (const rel of requiredComponents) {
    const text = await fs.readFile(path.join(root, rel), 'utf8');
    for (const snippet of forbiddenSnippets) {
      if (text.includes(snippet)) forbiddenHits.push({ file: rel, snippet });
    }
  }

  const proofChainText = await fs.readFile(path.join(root, 'src/components/ui/UiProofChain.astro'), 'utf8');
  const proofChainUsesOl = proofChainText.includes('<ol>');

  const metaListText = await fs.readFile(path.join(root, 'src/components/ui/UiMetaList.astro'), 'utf8');
  const metaListUsesDl = metaListText.includes('<dl>');

  const retroSupport = {
    UiCard: (await fs.readFile(path.join(root, 'src/components/ui/UiCard.astro'), 'utf8')).includes('retro?: boolean'),
    UiStatCard: (await fs.readFile(path.join(root, 'src/components/ui/UiStatCard.astro'), 'utf8')).includes('retro?: boolean'),
    UiSkillBadge: (await fs.readFile(path.join(root, 'src/components/ui/UiSkillBadge.astro'), 'utf8')).includes('retro?: boolean'),
    UiTimelineItem: (await fs.readFile(path.join(root, 'src/components/ui/UiTimelineItem.astro'), 'utf8')).includes('retro?: boolean'),
    UiProjectCard: (await fs.readFile(path.join(root, 'src/components/ui/UiProjectCard.astro'), 'utf8')).includes('retro?: boolean'),
    UiKnowledgeCard: (await fs.readFile(path.join(root, 'src/components/ui/UiKnowledgeCard.astro'), 'utf8')).includes('retro?: boolean'),
    UiProofChain: (await fs.readFile(path.join(root, 'src/components/ui/UiProofChain.astro'), 'utf8')).includes('retro?: boolean'),
    UiMetaList: metaListText.includes('retro?: boolean'),
  };

  const catalogText = await fs.readFile(path.join(root, 'src/pages/design-system/index.astro'), 'utf8');
  const catalogUsesRetroExamples = catalogText.includes('<UiCard') && catalogText.includes('retro');

  const ok =
    missingFiles.length === 0 &&
    cssImported &&
    forbiddenHits.length === 0 &&
    proofChainUsesOl &&
    metaListUsesDl &&
    Object.values(retroSupport).every(Boolean) &&
    catalogUsesRetroExamples;

  const report = {
    ok,
    missingFiles,
    cssImported,
    forbiddenHits,
    checks: {
      proofChainUsesOrderedList: proofChainUsesOl,
      metaListUsesDefinitionList: metaListUsesDl,
      retroSupport,
      catalogUsesRetroExamples,
    },
  };

  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (!ok) process.exitCode = 1;
};

await main();
