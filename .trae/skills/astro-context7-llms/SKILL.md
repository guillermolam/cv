---
name: "astro-context7-llms"
description: "Astro core repo/doc snippets playbook. Invoke when you need canonical Astro CLI commands, project scaffolding, dev/build/test workflows, or example project structure."
---

# Astro (Context7 LLMs) Core Snippets Playbook

Reference source:
- https://context7.com/withastro/astro/llms.txt?tokens=10000

## When to Invoke

Use this skill when the user:
- Asks how to install or scaffold an Astro project.
- Needs the canonical dev/build/preview commands.
- Needs repo contributor workflows (pnpm install/build), or to run local examples.
- Needs unit-testing patterns used by Astro itself.
- Needs project structure conventions for routes and dynamic pages.

## Canonical Commands

### Install Astro (Recommended)

Source: https://github.com/withastro/astro/blob/main/README.md

```bash
npm create astro@latest
```

### Install Astro (Manual)

Source: https://github.com/withastro/astro/blob/main/README.md

```bash
npm install astro
```

### Standard Project Commands

Source: https://github.com/withastro/astro/blob/main/examples/blog/README.md

```text
npm install
npm run dev
npm run build
npm run preview
npm run astro ...
npm run astro -- --help
```

### Add an Official Integration

Source: https://github.com/withastro/astro/blob/main/AGENTS.md

```bash
astro add
```

## Scaffolding Templates

### Minimal Template

Source: https://github.com/withastro/astro/blob/main/examples/minimal/README.md

```sh
npm create astro@latest -- --template minimal
```

### Basics Template

Source: https://github.com/withastro/astro/blob/main/examples/basics/README.md

```sh
npm create astro@latest -- --template basics
```

### Blog Template

Source: https://github.com/withastro/astro/blob/main/examples/blog/README.md

```sh
npm create astro@latest -- --template blog
```

### Framework Template (Svelte)

Source: https://github.com/withastro/astro/blob/main/examples/framework-svelte/README.md

```sh
npm create astro@latest -- --template framework-svelte
```

### Template from Nested GitHub Path

Source: https://github.com/withastro/astro/blob/main/examples/README.md

```sh
npm create astro@latest -- --template [GITHUB_USER]/[REPO_NAME]/path/to/example
```

## Repo Development (Astro Itself)

### Setup Local Astro Repository (pnpm)

Source: https://github.com/withastro/astro/blob/main/CONTRIBUTING.md

```shell
git clone && cd ...
pnpm install
pnpm run build
```

### Run Local Examples against Local Astro Source

Source: https://github.com/withastro/astro/blob/main/CONTRIBUTING.md

```shell
pnpm --filter @example/minimal run dev
```

### Prerequisites for Astro Repo Development

Source: https://github.com/withastro/astro/blob/main/CONTRIBUTING.md

```text
node: "^>=22.12.0"
pnpm: "^10.28.0"
```

## Project Structure + Routing Shape

### Typical Layout

Source: https://github.com/withastro/astro/blob/main/examples/hackernews/README.md

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── stories/
│           └── [id].astro
│       └── users/
│           └── [id].astro
│       └── [...stories].astro
└── package.json
```

## TypeScript + Editor Tooling

### Install @astrojs/ts-plugin

Source: https://github.com/withastro/astro/blob/main/packages/language-tools/ts-plugin/README.md

```bash
npm install --save-dev @astrojs/ts-plugin
```

### Path Aliasing (tsconfig/jsconfig)

Source: https://github.com/withastro/astro/blob/main/packages/astro/src/vite-plugin-config-alias/README.md

```json
{
  "compilerOptions": {
    "paths": {
      "components:*": ["src/components/*.astro"]
    }
  }
}
```

## SSR Example Pattern (Server-Rendered Astro Component)

Source: https://github.com/withastro/astro/blob/main/packages/astro/e2e/fixtures/solid-component/src/pages/mdx.mdx

```astro
import Counter from '../components/Counter.astro';
export const someProps = {
  count: 0,
};
<Counter id="server-only" {...someProps}>
  # Hello, server!
</Counter>
```

## Testing Patterns (Node.js test runner)

### Basic Unit Test Structure

Source: https://github.com/withastro/astro/blob/main/reference/unit-testing.md

```ts
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { someFunction } from '../../../dist/core/some-module.js';
import { createBasicSettings } from '../test-utils.ts';

describe('someFunction', () => {
  it('handles edge case from issue #1234', async () => {
    const settings = await createBasicSettings({ root: '/tmp/test' });
    const result = someFunction(settings, edgeCaseInput);
    assert.equal(result, expectedOutput);
  });
});
```

### Unit Test with Mocks (Example)

Source: https://github.com/withastro/astro/blob/main/CONTRIBUTING.md

```ts
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

describe('CLI create-key', () => {
  it('logs the generated key', async () => {
    const logger = new SpyLogger();
    const keyGenerator = new FakeKeyGenerator('FOO');
    await createKey({ logger, keyGenerator });
    assert.equal(logger.logs[0].type, 'info');
  });
});
```

## Operational Note (Detached Dev Server)

Source: https://github.com/withastro/astro/blob/main/AGENTS.md

If you need a detached dev server process:

```bash
pnpm exec bgproc start -n devserver --wait-for-port 10 --force -- pnpm -C examples/minimal dev
```
