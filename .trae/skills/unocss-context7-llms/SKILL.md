---
name: "unocss-context7-llms"
description: "UnoCSS integration playbook. Invoke when configuring UnoCSS (presets/icons/transformers/content scanning) for frameworks like Astro/Vite, or when troubleshooting missing utilities/icons."
---

# UnoCSS (Context7 LLMs) Integration Playbook

Reference source:
- https://context7.com/unocss/unocss/llms.txt?tokens=10000

## When to Invoke

Use this skill when the user:
- Wants to integrate UnoCSS into a project (especially Vite-based stacks like Astro).
- Needs to pick presets (mini/wind3/wind4/typography/web-fonts/tagify/legacy-compat).
- Needs to add transformers (directives, variant-group, attributify JSX).
- Needs icons via Iconify collections and is seeing warnings like “failed to load icon”.
- Needs CLI/PostCSS/Runtime/LSP/ESLint integration guidance.

## Core Install Patterns

### Base install (core UnoCSS)

Source: https://github.com/unocss/unocss/blob/main/docs/integrations/cli.md

```bash
npm install -D unocss
```

### PostCSS plugin

Source: https://github.com/unocss/unocss/blob/main/docs/integrations/postcss.md

```bash
pnpm add -D unocss @unocss/postcss
```

### Runtime (only if you explicitly want runtime generation)

Source: https://github.com/unocss/unocss/blob/main/docs/integrations/runtime.md

```bash
npm i @unocss/runtime
```

## Presets (Choose What You Need)

### preset-mini (recommended baseline for utility primitives)

Source: https://github.com/unocss/unocss/blob/main/docs/presets/mini.md

```bash
pnpm add -D @unocss/preset-mini
```

### preset-wind3 / preset-wind4

Source:
- https://github.com/unocss/unocss/blob/main/docs/presets/wind3.md
- https://github.com/unocss/unocss/blob/main/docs/presets/wind4.md

```bash
pnpm add -D @unocss/preset-wind3
```

```bash
pnpm add -D @unocss/preset-wind4
```

### preset-typography

Source: https://github.com/unocss/unocss/blob/main/docs/presets/typography.md

```bash
pnpm add -D @unocss/preset-typography
```

### preset-web-fonts

Source: https://github.com/unocss/unocss/blob/main/docs/presets/web-fonts.md

```bash
pnpm add -D @unocss/preset-web-fonts
```

### preset-tagify

Source: https://github.com/unocss/unocss/blob/main/docs/presets/tagify.md

```bash
pnpm add -D @unocss/preset-tagify
```

### preset-legacy-compat

Source: https://github.com/unocss/unocss/blob/main/docs/presets/legacy-compat.md

```bash
pnpm add -D @unocss/preset-legacy-compat
```

### preset-rem-to-px

Source: https://github.com/unocss/unocss/blob/main/docs/presets/rem-to-px.md

```bash
pnpm add -D @unocss/preset-rem-to-px
```

## Transformers (Recommended for DX)

### transformer-attributify-jsx

Source:
- https://github.com/unocss/unocss/blob/main/docs/transformers/attributify-jsx.md
- https://github.com/unocss/unocss/blob/main/packages-presets/transformer-attributify-jsx/README.md

```bash
pnpm add -D @unocss/transformer-attributify-jsx
```

```ts
import { defineConfig, presetAttributify } from 'unocss';
import transformerAttributifyJsx from '@unocss/transformer-attributify-jsx';

export default defineConfig({
  presets: [presetAttributify()],
  transformers: [transformerAttributifyJsx()],
});
```

### transformer-directives

Source: https://github.com/unocss/unocss/blob/main/docs/transformers/directives.md

```bash
pnpm add -D @unocss/transformer-directives
```

### transformer-variant-group

Source: https://github.com/unocss/unocss/blob/main/packages-presets/transformer-variant-group/README.md

```bash
pnpm add -D @unocss/transformer-variant-group
```

### transformer-compile-class

Source: https://github.com/unocss/unocss/blob/main/docs/transformers/compile-class.md

```bash
pnpm add -D @unocss/transformer-compile-class
```

## Icons (Iconify)

### Install full icon sets (large) OR a specific collection (recommended)

Source: https://github.com/unocss/unocss/blob/main/docs/presets/icons.md

Full set:

```bash
pnpm add -D @iconify/json
```

Specific collection:

```bash
pnpm add -D @unocss/preset-icons @iconify-json/[the-collection-you-want]
```

## Style Reset

Source: https://github.com/unocss/unocss/blob/main/docs/guide/style-reset.md

```bash
pnpm add -D @unocss/reset
```

## Tooling Integrations

### LSP (language server)

Source: https://github.com/unocss/unocss/blob/main/docs/integrations/lsp.md

```bash
npm install -g unocss-language-server
```

### ESLint config

Source: https://github.com/unocss/unocss/blob/main/docs/integrations/eslint.md

```bash
pnpm add -D @unocss/eslint-config
```

## Practical Integration Notes (Astro/Vite)

- Prefer explicit content include/exclude patterns so UnoCSS scans only what matters (avoid scanning docs, build output, hidden tooling folders).
- Icon warnings often come from tokens that look like icon classes inside non-class text (comments, markdown, generated strings). Remove/escape those tokens or narrow content scanning.
- For icons, prefer installing and registering the exact collections you use (keeps dependencies smaller and avoids missing icons at runtime).
