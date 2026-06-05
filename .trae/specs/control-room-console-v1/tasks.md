# Control Room Console v1 — Tasks

## Phase A (this iteration)

- [x] **A1 Retro digital fonts** — Orbitron (`techno`) + Share Tech Mono
  (`digital`) via `presetWebFonts`; `--font-techno` / `--font-digital` tokens
  + `--ds-font-*` aliases.
- [x] **A2 Texture/FX system** — `src/design-system/tokens/texture.css`
  (`--fx-*`); reusable `FxGrain`, `FxScanlines`, `FxGlitch`, `FxBezel` in
  `src/components/fx/`. Reduced-motion aware, `intensity` props.
- [x] **A3 nanostores brain** — `src/stores/control-room.ts`
  (`$activeSection`, `$lang`, `$audioMuted`, `$reducedMotion`, `$webglSupported`,
  `$webglEnabled`, `initCapabilities`) + `src/stores/persistent.ts`.
- [x] **A10 CV data modeling** — `education`/`languages`/`companies` collections
  in `content.config.ts` (+ validator id map); seeds (3 languages, 3 companies,
  1 education, Ciklum experience, 15 tools); `src/lib/content/operator-stats.ts`.
- [x] **A6 LanguageDial** — `src/components/i18n/LanguageDial.astro` +
  `CountryFlag.astro` + `src/scripts/language-dial.ts`; wired into PageLayout.
- [x] **A7 SectionNavRail** — `src/components/nav/SectionNavRail.astro` +
  `src/scripts/section-nav.ts`; replaced inline nav loop in PageLayout.
- [x] **A5 WebGL hero** — `src/design-system/three/{capability,renderer,dispose,
  particle-field}.ts` + `src/components/three/HeroParticleField.astro`.
- [x] **A9 Audio** — `src/lib/audio/{events,sfx}.ts` +
  `src/components/control-room/AudioToggle.astro`.
- [x] **A4 ControlRoomConsole** — `src/components/control-room/ControlRoomConsole.astro`;
  wired into `index.astro` + `[lang]/index.astro`.
- [x] **A8 Lazy chart** — `src/components/charts/LazyRadarChart.astro` +
  `src/scripts/lazy-radar.ts`; swapped into `OperatorStatsPanel`.
- [x] **A11 Docs** — this spec + architecture/design docs.
- [x] **A12 Heerich voxel→SVG** — `heerich` (zero-dep vanilla ESM) integrated on
  three surfaces: build-time `HeerichScene.astro` (zero client JS) +
  `src/lib/heerich/presets.ts`; interactive Alpine `heerichScene`
  (`src/alpine/heerich.ts`); Astro Integration `integrations/heerich/`
  (`ssr.noExternal`). Used in the console hero (monolith). See
  docs/architecture/heerich-voxel-svg.md.
- [ ] **Verify** — `pnpm run check && build`, `node scripts/validate-content-graph.mjs`,
  dev smoke per checklist. **Blocked**: root-owned `src/pages/test/waves.astro`
  must be removed/chowned by the user before Astro can build.

## Phase B (in progress)
- [x] **Operator-Stats card grid** (CV-derived, N/A-aware) —
  `src/components/control-room/OperatorStatsGrid.astro`, build-time only, slotted
  into the console body. Uses `src/lib/content/operator-stats.ts`.
- [ ] In-console mechanical-keyboard section switcher row → drives `$activeSection`.
- [ ] Hex Badges rack with CSS/WebGL sheen.
- [ ] Per-section subview panels (education, languages, certs) with flags/logos.
- [ ] CV seed-content expansion (more tools/experience/education from CV) —
  **to delegate to `opencode` when LM Studio is reachable** (was down at last check).

## Phase C (deferred)
- [ ] Capabilities-overview grid (6 progress columns, multiple chart types).
- [ ] Company-logo timeline; terminal easter-egg view.
- [ ] Glitch route transitions; ambient layering polish; full i18n content.
