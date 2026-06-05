import fs from 'node:fs/promises';
import path from 'node:path';

const exists = async (p) => {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
};

const forbiddenSnippets = [
  '@astrojs/react',
  '@astrojs/preact',
  '@astrojs/vue',
  '@astrojs/svelte',
  "from 'react'",
  'from "react"',
  "from 'vue'",
  'from "vue"',
  "from 'svelte'",
  'from "svelte"',
  "from 'preact'",
  'from "preact"',
  'react-chartjs-2',
  'vue-chartjs',
  'svelte-chartjs',
  '@react-three/fiber',
  'three',
];

const main = async () => {
  const root = process.cwd();

  const requiredFoundation = [
    'src/design-system/charts/chart.tokens.ts',
    'src/design-system/charts/chart.registry.ts',
    'src/design-system/charts/chart-lifecycle.ts',
    'src/design-system/charts/chart-accessibility.ts',
    'src/design-system/charts/chart-theme.ts',
  ];

  const requiredComponents = [
    'src/components/charts/UiChartShell.astro',
    'src/components/charts/UiBarChart.astro',
    'src/components/charts/UiLineChart.astro',
    'src/components/charts/UiRadarChart.astro',
    'src/components/charts/UiDoughnutChart.astro',
    'src/components/charts/UiSkillMatrixChart.astro',
    'src/components/charts/UiExperienceTimelineChart.astro',
    'src/components/charts/UiSecurityDomainRadar.astro',
    'src/components/charts/UiToolchainDistributionChart.astro',
  ];

  const missingFiles = [];
  for (const rel of [...requiredFoundation, ...requiredComponents]) {
    if (!(await exists(path.join(root, rel)))) missingFiles.push(rel);
  }

  const chartCss = await fs.readFile(path.join(root, 'src/design-system/tokens/chart.css'), 'utf8');
  const cssHasShellSelectors =
    chartCss.includes('[data-ui-chart-shell]') &&
    chartCss.includes('[data-ui-chart-canvas-wrap]') &&
    chartCss.includes('[data-ui-chart-summary]') &&
    chartCss.includes('[data-ui-chart-table]');

  const forbiddenHits = [];
  for (const rel of [...requiredFoundation, ...requiredComponents]) {
    const text = await fs.readFile(path.join(root, rel), 'utf8');
    for (const snippet of forbiddenSnippets) {
      if (text.includes(snippet)) forbiddenHits.push({ file: rel, snippet });
    }
  }

  const lowLevelChartTexts = await Promise.all(
    ['UiBarChart', 'UiLineChart', 'UiRadarChart', 'UiDoughnutChart'].map((name) =>
      fs.readFile(path.join(root, `src/components/charts/${name}.astro`), 'utf8'),
    ),
  );

  const canvasAndFallbackOk = lowLevelChartTexts.every((t) => t.includes('<canvas') && t.includes('data-ui-chart-table'));
  const reducedMotionReferenced = (await fs.readFile(path.join(root, 'src/design-system/charts/chart-lifecycle.ts'), 'utf8')).includes(
    'prefersReducedMotion',
  );

  const catalog = await fs.readFile(path.join(root, 'src/pages/design-system/index.astro'), 'utf8');
  const catalogHasCharts = catalog.includes('Chart Foundation') && catalog.includes('<UiBarChart') && catalog.includes('<UiRadarChart');

  const ok =
    missingFiles.length === 0 &&
    cssHasShellSelectors &&
    forbiddenHits.length === 0 &&
    canvasAndFallbackOk &&
    reducedMotionReferenced &&
    catalogHasCharts;

  const report = {
    ok,
    missingFiles,
    cssHasShellSelectors,
    forbiddenHits,
    checks: {
      canvasAndFallbackOk,
      reducedMotionReferenced,
      catalogHasCharts,
    },
  };

  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (!ok) process.exitCode = 1;
};

await main();

