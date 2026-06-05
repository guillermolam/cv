import fs from 'node:fs/promises';
import path from 'node:path';

const main = async () => {
  const root = process.cwd();

  const read = async (rel) => fs.readFile(path.join(root, rel), 'utf8');

  const packageJson = JSON.parse(await read('package.json'));
  const deps = { ...(packageJson.dependencies ?? {}), ...(packageJson.devDependencies ?? {}) };
  const hasKeyboardCss = Object.prototype.hasOwnProperty.call(deps, 'keyboard-css');

  const theme = await read('src/design-system/tokens/theme.css');
  const depth = await read('src/design-system/tokens/depth.css');
  const primitives = await read('src/design-system/tokens/primitives.css');
  const uiButton = await read('src/components/ui/UiButton.astro');
  const catalog = await read('src/pages/design-system/index.astro');

  const requiredThemeTokens = [
    '--ds-retro-shell-bg',
    '--ds-retro-shell-border',
    '--ds-retro-crt-glass',
    '--ds-retro-crt-scanline',
    '--ds-keycap-top',
    '--ds-keycap-side',
    '--ds-keycap-border',
    '--ds-keycap-focus-glow',
  ];

  const requiredDepthTokens = [
    '--ds-keycap-shadow-1',
    '--ds-keycap-shadow-2',
    '--ds-keycap-shadow-3',
    '--ds-keycap-press-distance',
    '--ds-keycap-hover-lift',
    '--ds-panel-inset-shadow',
    '--ds-panel-bevel-highlight',
  ];

  const missingThemeTokens = requiredThemeTokens.filter((t) => !theme.includes(t));
  const missingDepthTokens = requiredDepthTokens.filter((t) => !depth.includes(t));

  const primitivesHasKeycapSelectors =
    primitives.includes("[data-ui-button][data-variant='keycap']") &&
    primitives.includes("[data-ui-button][data-variant='terminal']") &&
    primitives.includes("[data-ui-button][data-variant='control']");

  const uiButtonHasVariant = uiButton.includes("'keycap'") && uiButton.includes("'terminal'") && uiButton.includes("'control'");
  const catalogHasExamples = catalog.toLowerCase().includes('retro computer aesthetic') && catalog.toLowerCase().includes('keycap buttons');

  const ok =
    !hasKeyboardCss &&
    missingThemeTokens.length === 0 &&
    missingDepthTokens.length === 0 &&
    primitivesHasKeycapSelectors &&
    uiButtonHasVariant &&
    catalogHasExamples;

  const report = {
    ok,
    hasKeyboardCss,
    missingThemeTokens,
    missingDepthTokens,
    primitivesHasKeycapSelectors,
    uiButtonHasVariant,
    catalogHasExamples,
  };

  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (!ok) process.exitCode = 1;
};

await main();

