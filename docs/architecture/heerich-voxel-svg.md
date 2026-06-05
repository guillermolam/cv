# Heerich Voxel→SVG (Architecture)

[`heerich`](https://github.com/meodai/heerich) (v0.14, zero-dependency vanilla
ESM) renders 3D voxel scenes — with CSG boolean ops, multiple cameras, and
per-face styling — to **SVG strings from pure JS**. Because the output is plain
SVG markup produced synchronously, it slots cleanly into the project's
static-first, SVG-over-icons, no-framework constraints.

It is integrated on three surfaces, exactly as the brief asked (Astro
Integration API and/or Alpine):

## 1. Build-time component (default, zero client JS)
`src/components/heerich/HeerichScene.astro` calls `renderPreset()` in
**frontmatter** and emits the SVG with `set:html`. No JavaScript ships; the art
is static, accessible (figure + `aria-label`, or `aria-hidden` when purely
decorative), printable, and indexable.

```astro
<HeerichScene preset="monolith" label="Control room monolith" />
```

## 2. Scene presets — `src/lib/heerich/presets.ts`
Shared by both the build-time and interactive paths:
- `buildScene(preset, { camera, tile })` → a configured `Heerich` instance.
- `renderPreset(preset, opts)` → an SVG string (build-time convenience).
- Presets: `monolith`, `stationStack`, `badgeCube`.
- Fills use **CSS custom properties** (`var(--color-cta)` …) so voxel art themes
  with the design system; per-face fills (`top`/`left`/`right`) give 3D shading.
- Geometry is added with `addGeometry` (union) and carved with `removeGeometry`
  (CSG subtract).

## 3. Interactive island — Alpine `heerichScene`
`src/alpine/heerich.ts` (registered in `src/alpine/index.ts`). When a
`<HeerichScene interactive />` is present, the **build-time SVG is the no-JS
baseline**; on first interaction Alpine lazily `import()`s heerich + the presets,
rebuilds the scene, and re-renders `toSVG()` as the user **drags to rotate** the
oblique camera (`setCamera({ angle })`). Static and silent under
`prefers-reduced-motion` (the build-time SVG simply stays put).

## 4. Astro Integration — `integrations/heerich/index.ts`
A real `AstroIntegration` wired in `astro.config.mjs`. On `astro:config:setup` it
`updateConfig`s Vite with `ssr.noExternal: ['heerich']` + `optimizeDeps.include`
so the ESM resolves during the SSR build pass (which is where build-time
frontmatter rendering runs) and is pre-bundled for dev. Emits a one-line
diagnostic.

## Why this fits the rules
- **Static-first / recruiter-first**: default path ships zero JS; content is real
  SVG.
- **No forbidden deps**: heerich is vanilla zero-dep ESM (not flagged by
  `scripts/scan-forbidden-design-library.mjs`).
- **Progressive enhancement + reduced motion**: interactivity is additive and
  disabled under reduced motion.
- **Strict cleanup**: the interactive path holds a single instance per element
  and only swaps innerHTML; no GPU resources.

## API reference used (heerich 0.14)
`new Heerich({ tile, camera })` · `addGeometry/removeGeometry/applyGeometry` ·
`applyStyle` · `setCamera({ type:'oblique'|'perspective'|'orthographic'|'isometric', angle, distance })` ·
`rotate({ axis, turns })` · `toSVG({ padding, … }) → string`. Named exports:
`Heerich`, `SVGRenderer`.
