---
name: "pixijs-astro-ssr"
description: "PixiJS + Astro integration playbook. Invoke when adding PixiJS canvas/WebGL to Astro and you need SSR-safe client-only setup, app.init options, plugins, assets, and performance/a11y patterns."
---

# PixiJS + Astro (SSR-Safe) Playbook

## When to Invoke

Use this skill when the user:
- Wants to add PixiJS (canvas/WebGL/WebGPU) to an Astro site.
- Hits SSR issues (`window is not defined`, hydration mismatch, canvas conflicts).
- Needs PixiJS v8 initialization, ApplicationOptions tuning, or plugin patterns.
- Needs asset loading/manifest workflows or performance stabilization.

## Non-Negotiables (Astro + SSR)

- Never run PixiJS or any DOM/canvas code in Astro frontmatter (server).
- Run PixiJS only in client code (`<script>` in `.astro`, or a dedicated client entry loaded on demand).
- Prefer lazy-init (IntersectionObserver / user interaction / `client:idle` equivalent behavior) for offscreen canvases.
- Respect `prefers-reduced-motion`; motion must not block reading or navigation.
- Always dispose on unmount/navigation: `app.destroy(true, { children: true })` and remove canvas element if you appended it.

## Minimal Working Example (CDN, Browser-Only)

Source: https://github.com/pixijs/pixijs/wiki/Getting-Started

Note: `pixijs.download` CDN is not recommended for production use.

```html
<html>
  <head>
    <script src="https://pixijs.download/release/pixi.min.js"></script>
  </head>
  <body>
    <script>
      var app = new PIXI.Application(640, 360);
      document.body.appendChild(app.view);
      var circle = new PIXI.Graphics();
      circle.beginFill(0x5cafe2);
      circle.drawCircle(0, 0, 80);
      circle.x = 320;
      circle.y = 180;
      app.stage.addChild(circle);
    </script>
  </body>
</html>
```

## PixiJS v8 Application Initialization (Async init)

Source: https://github.com/pixijs/pixijs/blob/dev/src/__docs__/migrations/v8.md

```ts
import { Application } from 'pixi.js';

const app = new Application();

(async () => {
  await app.init({
    width: 800,
    height: 600,
    backgroundColor: 0x1099bb,
  });

  document.body.appendChild(app.canvas);
})();
```

## Astro Pattern (Vanilla, SSR-Safe, Lazy + Cleanup)

Use this structure inside an `.astro` component: server renders the container, client script dynamically imports PixiJS and attaches the canvas.

```astro
---
const { label = 'Decorative animation' } = Astro.props;
---

<div class="pixi-shell" data-pixi-root aria-label={label}></div>

<script>
  const root = document.currentScript?.previousElementSibling;
  if (!(root instanceof HTMLElement)) throw new Error('Pixi root not found');

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let app;
  let destroyed = false;

  const init = async () => {
    if (destroyed || reducedMotion) return;
    const { Application, Graphics } = await import('pixi.js');

    app = new Application();
    await app.init({
      resizeTo: root,
      backgroundAlpha: 0,
      antialias: true,
      autoDensity: true,
      resolution: window.devicePixelRatio || 1,
      powerPreference: 'low-power',
    });

    root.appendChild(app.canvas);

    const circle = new Graphics().circle(0, 0, 80).fill(0x5cafe2);
    circle.x = app.renderer.width / 2;
    circle.y = app.renderer.height / 2;
    app.stage.addChild(circle);
  };

  const cleanup = () => {
    destroyed = true;
    try {
      app?.destroy(true);
    } finally {
      app = undefined;
      root.querySelector('canvas')?.remove();
    }
  };

  const observer = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      observer.disconnect();
      void init();
    }
  }, { rootMargin: '200px' });

  observer.observe(root);
  window.addEventListener('pagehide', cleanup, { once: true });
</script>

<style>
  .pixi-shell {
    min-height: 220px;
  }
  @media (prefers-reduced-motion: reduce) {
    .pixi-shell {
      display: none;
    }
  }
</style>
```

## Creating Custom Application Plugins

Source: https://github.com/pixijs/pixijs/blob/dev/src/app/__docs__/app.md

```ts
import { ExtensionType, extensions } from 'pixi.js';
import type { ApplicationOptions } from 'pixi.js';

class MyPlugin {
  public static extension = ExtensionType.Application;

  public static init(options: Partial<ApplicationOptions>) {
    console.log('Custom plugin init:', this, options);
  }

  public static destroy() {
    console.log('Custom plugin destroy');
  }
}

extensions.add(MyPlugin);
```

TypeScript options extension:

```ts
declare global {
  namespace PixiMixins {
    interface ApplicationOptions {
      myPlugin?: import('./myPlugin').PluginOptions | null;
    }
  }
}
```

## ApplicationOptions (Practical Defaults)

Source: https://github.com/pixijs/pixijs/blob/dev/src/app/__docs__/app.md

- For UI/ambient scenes: `powerPreference: 'low-power'`, `backgroundAlpha: 0`, `autoDensity: true`, `resolution: devicePixelRatio`.
- For crisp pixels: prefer integer scaling; avoid extreme DPR on mobile.
- Avoid `preserveDrawingBuffer` unless required for `toDataURL` (costly).

## Asset Management + Performance Stabilizers

### Pre-upload textures to GPU

Source: https://github.com/pixijs/pixijs/blob/dev/src/rendering/__docs__/textures.md

```ts
await renderer.prepare.upload(sprite);
```

### Cache complex containers

Source: https://github.com/pixijs/pixijs/blob/dev/src/scene/__docs__/container/cache-as-texture.md

Use `cacheAsTexture()` to reduce draw calls when contents are static.

### ParticleContainer boundsArea (v8)

Source: https://github.com/pixijs/pixijs/blob/dev/src/__docs__/migrations/v8.md

```ts
import { ParticleContainer, Rectangle } from 'pixi.js';

const container = new ParticleContainer({
  boundsArea: new Rectangle(0, 0, 500, 500),
});
```

## v8 Migration Notes to Remember

Source: https://github.com/pixijs/pixijs/blob/dev/src/__docs__/migrations/v8.md

- `Application` initialization is async (`await app.init(...)`) to support WebGPU.
- `container.getBounds()` returns a `Bounds` object; use its rectangle when you need `Rectangle`:
  - `const rect = container.getBounds().rectangle;`

## Deprecation Notes (Options Renames)

Source: https://github.com/pixijs/pixijs/blob/dev/src/app/__docs__/app.md

- `textureGCActive` is deprecated → use `gcActive`
- `textureGCCheckCountMax` is deprecated → use `gcFrequency`
- `textureGCMaxIdle` is deprecated → use `gcMaxUnusedTime`

## Quick Commands

Install PixiJS:

```bash
npm install pixi.js
```

Upgrade PixiJS (recommended clean reinstall approach):

```bash
npm uninstall pixi.js
npm install pixi.js
```

AssetPack (manifest generation helper):

```bash
npm install --save-dev @assetpack/core
```

Create a new PixiJS project (scaffold):

```bash
npm create pixi.js@latest
```

Quick-start flow after scaffolding:

```bash
cd <your-project>
npm install
npm run dev
```

## Basic PixiJS App Setup (Bunny Grid + Container Rotation)

Source: https://pixijs.com/8.x/guides/getting-started/quick-start

```ts
import { Application, Assets, Container, Sprite } from 'pixi.js';

(async () => {
  const app = new Application();

  await app.init({ background: '#1099bb', resizeTo: window });
  document.body.appendChild(app.canvas);

  const container = new Container();
  app.stage.addChild(container);

  const texture = await Assets.load('https://pixijs.com/assets/bunny.png');

  for (let i = 0; i < 25; i++) {
    const bunny = new Sprite(texture);
    bunny.x = (i % 5) * 40;
    bunny.y = Math.floor(i / 5) * 40;
    container.addChild(bunny);
  }

  container.x = app.screen.width / 2;
  container.y = app.screen.height / 2;
  container.pivot.x = container.width / 2;
  container.pivot.y = container.height / 2;

  app.ticker.add((time) => {
    container.rotation -= 0.01 * time.deltaTime;
  });
})();
```

## Ticker Notes

Source: https://pixijs.com/8.x/guides/components/ticker

- Auto-start when first listener is added:

```ts
ticker.autoStart = true;
```

- Manual lifecycle:

```ts
ticker.start();
ticker.stop();
```

## Assets: Background Loading Bundles

Source: https://pixijs.com/8.x/guides/components/assets/background-loader

```ts
const manifest = {
  bundles: [
    {
      name: 'home-screen',
      assets: [{ alias: 'flowerTop', src: 'https://pixijs.com/assets/flowerTop.png' }],
    },
    {
      name: 'game-screen',
      assets: [{ alias: 'eggHead', src: 'https://pixijs.com/assets/eggHead.png' }],
    },
  ],
};

await Assets.init({ manifest });
Assets.backgroundLoadBundle(['game-screen']);
const resources = await Assets.loadBundle('home-screen');
```

## Extensions: Self-Install Reminder

Source: https://pixijs.com/8.x/guides/migrations/v7

Many extensions now self-install via import side-effects. Example:

```ts
import 'pixi.js/accessibility';
```

## Custom Adapter (Non-Standard Environments)

Source: https://pixijs.com/8.x/guides/concepts/environments

This is relevant when running PixiJS in headless/Node-like environments. In a typical Astro website you usually do not need this; keep PixiJS browser-only instead of adapting SSR.

```ts
import { DOMAdapter } from 'pixi.js';

const CustomAdapter = {
  createCanvas: (width: number, height: number) => {
    throw new Error('Not implemented');
  },
  getCanvasRenderingContext2D: () => {
    throw new Error('Not implemented');
  },
  getWebGLRenderingContext: () => {
    throw new Error('Not implemented');
  },
  getNavigator: () => ({ userAgent: 'Custom', gpu: null }),
  getBaseUrl: () => 'custom://',
  fetch: async (_url: string, _options?: unknown) => {
    throw new Error('Not implemented');
  },
  parseXML: (_xml: string) => {
    throw new Error('Not implemented');
  },
};

DOMAdapter.set(CustomAdapter);
```

## RenderLayers (UI Above Scene)

Source: https://pixijs.com/8.x/guides/concepts/render-layers

Use RenderLayers to keep UI rendering above a scene (especially when using filters). Prefer this over zIndex hacks when the scene is complex.

## Mixing PixiJS + Three.js (Shared Context)

Source: https://pixijs.com/8.x/guides/third-party/mixing-three-and-pixi

Use only when you explicitly need a shared WebGL context. For typical portfolio UX, prefer keeping PixiJS and Three.js isolated (separate canvases) to avoid state conflicts and hard-to-debug performance regressions.

If sharing context, always reset render state between renders (as the example does).

## Graphics: Pixel-Perfect Lines (v8)

Source: https://pixijs.com/8.x/guides/components/scene-objects/graphics/graphics-pixel-line

```ts
import { Application, Container, Graphics, Text } from 'pixi.js';

function buildGrid(graphics: Graphics) {
  for (let i = 0; i < 11; i++) {
    graphics.moveTo(i * 10, 0).lineTo(i * 10, 100);
  }
  for (let i = 0; i < 11; i++) {
    graphics.moveTo(0, i * 10).lineTo(100, i * 10);
  }
  return graphics;
}

(async () => {
  const app = new Application();
  await app.init({ antialias: true, resizeTo: window });
  document.body.appendChild(app.canvas);

  const gridPixel = buildGrid(new Graphics()).stroke({
    color: 0xffffff,
    pixelLine: true,
    width: 1,
  });

  const grid = buildGrid(new Graphics()).stroke({
    color: 0xffffff,
    pixelLine: false,
  });

  grid.x = -100;
  grid.y = -50;
  gridPixel.y = -50;

  const container = new Container();
  container.addChild(grid, gridPixel);
  container.x = app.screen.width / 2;
  container.y = app.screen.height / 2;
  app.stage.addChild(container);

  let count = 0;
  app.ticker.add(() => {
    count += 0.01;
    container.scale = 1 + (Math.sin(count) + 1) * 2;
  });

  const label = new Text({
    text: 'Grid Comparison: Standard Lines (Left) vs Pixel-Perfect Lines (Right)',
    style: { fill: 0xffffff },
  });

  label.position.set(20, 20);
  label.style.wordWrap = true;
  label.style.wordWrapWidth = app.screen.width - 40;
  app.stage.addChild(label);
})();
```
