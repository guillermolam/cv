# Control Room Console v1 Spec

## Why
The Whoami homepage reads like a conventional 3-column card layout. The reference
art direction (`public/images/example_aesthetics.png`) calls for a single,
immersive **Hybrid Cloud Control Room console**: a rusty/vintage metallic bezel
housing a player-bio panel, radar, operator stats, badges, a capabilities grid,
a mechanical-keyboard section switcher, and a Flipper-Zero-style directional
wheel for language selection. This spec covers **Phase A**: the foundation, the
console shell, the WebGL hero, the two navigation pieces, one lazy chart, the
audio foundation, and the CV-derived data needed to feed them.

## Decisions (locked)
1. **3D** — real WebGL behind the **hero only** (particles + ripple/wave + grain),
   lazy + gated (WebGL + not-reduced-motion + `?no3d=1` opt-out); every other
   panel uses CSS/SVG faux-3D. Static SVG topology fallback always present.
2. **Sound** — Web Audio SFX + ambient hum, **muted by default**, persisted
   toggle, silent under reduced motion.
3. **Stats** — **real, CV-derived**; `N/A` where unmodeled (no invented numbers).
4. **Scope** — Phase A only (this spec). Phases B/C deferred (see Out of Scope).

## What Changes
- New single-component homepage orchestrator `ControlRoomConsole` replacing the
  bare `WhoamiOperatorProfile` usage on `/` and `/{lang}/`.
- New reusable FX components (grain, scanlines, glitch, bezel) and a `--fx-*`
  texture token layer.
- First real `nanostores` usage: a `control-room` store (activeSection, lang,
  audioMuted, webglEnabled, reducedMotion) + a persistent-atom helper.
- WebGL hero runtime under `src/design-system/three/` (was empty).
- `LanguageDial` (Flipper-style wheel) replacing `AnalogLanguageSelector`.
- `SectionNavRail` (animated-SVG glyph nav) replacing the inline nav loop.
- `LazyRadarChart` island demonstrating lazy + JIT Chart.js hydration.
- Audio engine + `AudioToggle`.
- New content collections `education`, `languages`, `companies` seeded from CV;
  expanded `experience` + `tools`; `operator-stats.ts` derivation.
- Retro digital fonts: Orbitron (techno) + Share Tech Mono (digital).

## Impact
- Affected docs:
  - docs/architecture/control-room-console.md
  - docs/architecture/language-dial.md
  - docs/architecture/texture-grain-system.md
  - docs/architecture/audio-sfx.md
  - docs/architecture/webgl-hero.md
  - docs/architecture/navigation-labels.md
  - docs/design/retro-fonts-texture-fx.md
- Affected code: `src/pages/index.astro`, `src/pages/[lang]/index.astro`,
  `src/layouts/PageLayout.astro`, `src/content.config.ts`,
  `scripts/validate-content-graph.mjs`, `uno.config.ts`,
  `src/styles/tokens.css`, `src/design-system/tokens/*`.

---

## ADDED Requirements

### Requirement: Single-component console shell
The homepage SHALL render through one top-level `ControlRoomConsole` component
that orchestrates the bezel housing, hero, FX overlays, topbar (title + status +
audio toggle), and the operator panels. Interactive parts are self-initialising
islands driven by the `control-room` nanostores; no cross-island prop drilling.

Constraints:
- Must preserve the recruiter fast path: identity, CV/contact links, and proof
  remain in semantic HTML, never gated behind WebGL/audio/motion.
- Must remain readable at 320px width.

### Requirement: WebGL hero (progressive enhancement)
The hero SHALL render a static SVG topology fallback always, and initialise the
Three.js particle field only when `heroWebglAllowed()` is true. The scene MUST
lazy-load on first viewport entry, pause offscreen, and dispose all GPU
resources on teardown (`astro:before-swap`, `pagehide`).

### Requirement: Flipper-style language dial
Language selection SHALL be a single reusable `LanguageDial` with a directional
wheel + LCD + SVG flags. Up/Down (or Left/Right) preview-cycle the language; the
center SELECT commits and navigates. Without JS, every direction/Select is a
real `<a>` reaching its neighbour/target language. Full keyboard support
(arrows + Enter). Backed by the `$lang` store.

### Requirement: Animated-SVG section nav
Primary navigation SHALL be a `SectionNavRail` of animated-SVG glyphs; the glyph
is primary, the label is tiny + tooltip. Hover/activate emit SFX. Active state
reflects the current route.

### Requirement: Lazy + JIT chart
At least one chart (`LazyRadarChart`) SHALL import Chart.js only when scrolled
into view, own its instance, and destroy it on teardown. An accessible `<table>`
fallback MUST always be present.

### Requirement: Audio (muted by default)
Audio SHALL default to muted, persist the user's choice, create the AudioContext
lazily on first gesture, and stay silent under reduced motion. Components emit
SFX via the decoupled `cr:sfx` event; only the engine imports Web Audio.

### Requirement: CV-derived stats
Operator stats SHALL derive strictly from the content graph; a stat with no
backing evidence renders `N/A`. New `education`/`languages`/`companies`
collections are seeded from the CV.

---

## Out of Scope (Phase B / C)
- In-console mechanical-keyboard section switcher row (BIO/EDU/LANG/…/TERMINAL).
- Full Operator-Stats card grid, hex Badges rack, Capabilities-overview grid.
- Company-logo timeline, terminal easter-egg view.
- Full i18n content translation; multiple additional chart types.
