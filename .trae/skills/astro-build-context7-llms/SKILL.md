---
name: "astro-build-context7-llms"
description: "Astro.build docs snippets filtered for this repo. Invoke when you need install/dev/build/preview/testing commands, CLI integration adds, or Astro v6 upgrade notes without introducing SSR."
---

# Astro.build Docs (Filtered for This Repo)

Reference source:
- https://context7.com/llmstxt/astro_build_llms-full_txt/llms.txt?tokens=10000

Project fit:
- This repo is static-hosting first; do not introduce SSR unless explicitly required.
- Prefer pnpm in this repo; dev port is 4324 (`pnpm dev:4324`).

## When to Invoke

Use this skill when the user asks about:
- Installing dependencies in an Astro project.
- Creating a new Astro project via CLI and templates.
- Running preview locally (`astro preview`) or the programmatic preview API.
- Adding official integrations through `astro add`.
- Setting up testing tooling (Playwright is relevant to this repo).
- Reading upgrade notes that matter to Astro v6 (without adopting SSR patterns).

## Install and Setup

### Install project dependencies

Source: https://docs.astro.build/en/install-and-setup

```bash
npm install
```

```bash
pnpm install
```

```bash
yarn install
```

### Initialize a new Astro project via CLI (templates)

Source: https://docs.astro.build/en/guides/migrate-to-astro/from-nuxtjs

```bash
# npm
npm create astro@latest
npm create astro@latest -- --template <example-name>
```

```bash
# pnpm
pnpm create astro@latest
pnpm create astro@latest --template <example-name>
```

```bash
# yarn
yarn create astro@latest
yarn create astro@latest --template <example-name>
```

## Preview (Local)

### preview() (programmatic)

Source: https://docs.astro.build/en/reference/programmatic-reference

```js
import { preview } from 'astro';

const previewServer = await preview({ root: './my-project' });
await previewServer.stop();
```

## Integrations (CLI)

### Add an integration

Source: https://docs.astro.build/en/guides/styling

```bash
npx astro add <integration>
```

### Add Alpine.js integration (example)

Source: https://docs.astro.build/en/guides/integrations-guide/alpinejs

```bash
npx astro add alpinejs
```

```bash
pnpm astro add alpinejs
```

```bash
yarn astro add alpinejs
```

## Testing

### Install Playwright

Source: https://docs.astro.build/en/guides/testing

```bash
npm init playwright@latest
```

```bash
pnpm create playwright
```

```bash
yarn create playwright
```

## Build Behavior Notes (Astro v6)

### Update server entrypoint: replace start()

Source: https://docs.astro.build/en/guides/upgrade-to/v6

This is relevant only if you are authoring/maintaining an SSR adapter or server entrypoint.

```js
// Before (Astro 5.x)
import { App } from 'astro/app';

export function start(manifest) {
  const app = new App(manifest);
  addEventListener('fetch', (event) => {
    // ...
  });
}

// After (Astro 6.0+)
import { createApp } from 'astro/app/entrypoint';

const app = createApp();
addEventListener('fetch', (event) => {
  // ...
});
```

## Static-First Guardrails (This Repo)

- Avoid adding a `start` script pointing at `dist/server/entry.mjs` unless the project explicitly moves to SSR.
- Prefer static build + hosting (CDN). Only hydrate islands where interaction is needed.
