# Control Room Console v1 — Validation Checklist

## Build gates
- [ ] `pnpm run check` — 0 errors. *(blocked by root-owned test/waves.astro)*
- [ ] `pnpm run build` — all static pages build.
- [x] `node scripts/validate-content-graph.mjs` — 0 issues (warnings = orphan
  nodes for new standalone collections, acceptable).
- [x] `npx tsc --noEmit` — 0 errors across stores/scripts/lib/three runtime.

## Progressive enhancement
- [ ] Hero renders static SVG topology with JS disabled and with `?no3d=1`.
- [ ] WebGL scene appears only when supported and not reduced-motion.
- [ ] Reduced motion: no grain flicker, no glitch, no WebGL, no ambient audio.
- [ ] All recruiter content (identity, CV/contact links) present without JS.

## LanguageDial
- [ ] Arrows preview-cycle en→es→fr→de on the LCD without navigating.
- [ ] SELECT/Enter navigates and preserves the current path.
- [ ] No-JS: each directional link reaches its neighbour language.
- [ ] Keyboard-only operable; visible focus; flags render for gb/es/fr/de.

## SectionNavRail
- [ ] Glyphs draw-on and lift on hover; tooltips show full label.
- [ ] Active state matches current route; tiny labels readable ≥760px.

## Lazy chart
- [ ] Chart.js chunk loads only when the radar scrolls into view (Network tab).
- [ ] `<table>` fallback present in DOM.
- [ ] Instance destroyed on navigation (no canvas/GPU leak on repeated nav).

## Audio
- [ ] Muted by default; toggle persists across reload.
- [ ] Enabling plays boot + ambient + SFX on key/hover; silent under reduced motion.

## Cleanup
- [ ] Navigating away disposes the Three.js renderer (no WebGL context warning).
- [ ] No console errors on `/en`, `/es`, `/fr`, `/de`.

## Responsive
- [ ] Console readable at 320px; dial + rail collapse gracefully.
