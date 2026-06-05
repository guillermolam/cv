# WebGL Hero (Architecture)

The hero backdrop is the **only** real WebGL surface in the project (per the
locked decision). Everything else uses CSS/SVG faux-3D.

## Files
- `src/design-system/three/capability.ts` — `hasWebGL()`, `deviceQuality()`,
  `prefersReducedMotion()`, `heroWebglAllowed()` (the final gate, honours
  `?no3d=1`).
- `src/design-system/three/renderer.ts` — `createRenderCore(canvas)`: renderer
  (alpha, low-power, pixel-ratio capped by device quality) + scene + camera +
  `resize()`.
- `src/design-system/three/particle-field.ts` — `createHeroField(canvas)`:
  a grid of points displaced by layered sine ripples/waves in a vertex shader,
  additive accent-tinted, calm drift. Returns `{ start, pause, resize, dispose }`.
- `src/design-system/three/dispose.ts` — recursive geometry/material/texture +
  renderer disposal (`disposeScene`).
- `src/components/three/HeroParticleField.astro` — the island.

## Lifecycle (HeroParticleField)
1. Static SVG topology fallback is always in the DOM.
2. If `heroWebglAllowed()`: an IntersectionObserver waits for first viewport
   entry, then **dynamically imports** `particle-field` (deferred chunk) and
   `start()`s the scene; `data-hero-ready="true"` fades the canvas in.
3. Offscreen → `pause()`; onscreen → `start()`.
4. `resize` listener calls `controller.resize()`.
5. `pagehide` / `astro:before-swap` → `dispose()` (GPU cleanup), observer
   disconnected, listeners removed.

## Budget
- Particle count scales with `deviceQuality()` (36²/56²/80²).
- No LCP block (lazy chunk, gated). Pauses when offscreen.
