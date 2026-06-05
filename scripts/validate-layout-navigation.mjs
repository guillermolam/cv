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
  '@react-three/fiber',
  'react-chartjs-2',
  'barba',
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

  const requiredLayoutComponents = [
    'src/components/layout/UiSection.astro',
    'src/components/layout/UiGrid.astro',
    'src/components/layout/UiStack.astro',
    'src/components/layout/UiCluster.astro',
    'src/components/layout/UiControlRoomFrame.astro',
  ];

  const requiredUiComponents = [
    'src/components/ui/UiNavItem.astro',
    'src/components/ui/UiBreadcrumb.astro',
    'src/components/ui/UiTabs.astro',
  ];

  const requiredCss = ['src/design-system/tokens/layout.css'];

  const missingFiles = [];
  for (const rel of [...requiredLayoutComponents, ...requiredUiComponents, ...requiredCss]) {
    if (!(await exists(path.join(root, rel)))) missingFiles.push(rel);
  }

  const tokensIndexPath = path.join(root, 'src/design-system/tokens/index.css');
  const tokensIndexText = await fs.readFile(tokensIndexPath, 'utf8');
  const cssImported = tokensIndexText.includes("@import './layout.css';");

  const scanTargets = [...requiredLayoutComponents, ...requiredUiComponents].map((p) => path.join(root, p));
  const forbiddenHits = [];
  for (const filePath of scanTargets) {
    const rel = path.relative(root, filePath);
    const text = await fs.readFile(filePath, 'utf8');
    for (const snippet of forbiddenSnippets) {
      if (text.includes(snippet)) forbiddenHits.push({ file: rel, snippet });
    }
  }

  const navItemText = await fs.readFile(path.join(root, 'src/components/ui/UiNavItem.astro'), 'utf8');
  const hasAriaCurrent = navItemText.includes('aria-current');

  const breadcrumbText = await fs.readFile(path.join(root, 'src/components/ui/UiBreadcrumb.astro'), 'utf8');
  const hasBreadcrumbNav = breadcrumbText.includes('<nav') && breadcrumbText.includes('<ol');

  const tabsText = await fs.readFile(path.join(root, 'src/components/ui/UiTabs.astro'), 'utf8');
  const tabsUsesLinks = tabsText.includes('href={tab.href}');

  const ok =
    missingFiles.length === 0 &&
    cssImported &&
    forbiddenHits.length === 0 &&
    hasAriaCurrent &&
    hasBreadcrumbNav &&
    tabsUsesLinks;

  const report = {
    ok,
    missingFiles,
    cssImported,
    forbiddenHits,
    checks: {
      navItemHasAriaCurrent: hasAriaCurrent,
      breadcrumbHasNavAndOl: hasBreadcrumbNav,
      tabsUsesLinks,
    },
  };

  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (!ok) process.exitCode = 1;
};

await main();

