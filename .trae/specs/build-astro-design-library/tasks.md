# Tasks

- [ ] Task 0: Preflight validation (no code changes)
  - [ ] Confirm source-of-truth docs are present and referenced correctly (style guide, blueprint, boundaries, IA, content model)
  - [ ] Confirm `docs/architecture/astro-design-library-architecture.md` status; if missing, materialize it from `.trae/documents/plan-astro-component-library-design-system.md` before implementation begins
  - [ ] Record “latest stable” versions to use by running:
    - [ ] `pnpm view astro version`
    - [ ] `pnpm view gsap version`
    - [ ] `pnpm view three version`
    - [ ] `pnpm view unocss version`
    - [ ] `pnpm view nanostores version`
    - [ ] `pnpm view chart.js version`

- [ ] Phase 1: Dependency audit + folder scaffolding + UnoCSS foundation + token CSS files
  - [ ] Implement forbidden dependency scan (package.json, pnpm-lock.yaml, imports)
  - [ ] Add the required folder structure
  - [ ] Add token CSS files under `src/design-system/tokens/`:
    - [ ] `tokens.css`, `theme.css`, `depth.css`, `motion.css`, `chart.css`
  - [ ] Integrate UnoCSS (no Tailwind preset unless explicitly approved) and define initial shortcuts that consume CSS variables
  - [ ] Validation: `pnpm install` + `pnpm astro check` + `pnpm build`

- [ ] Phase 2: Icon pipeline + UiIcon
  - [ ] Implement icon registry contract (local-only), icon typing, and accessibility helpers
  - [ ] Define SVG optimization workflow (SVGO and/or Astro experimental SVG optimization only if justified)
  - [ ] Implement 3.5D icon treatment system (layered duotone + depth transforms)
  - [ ] Add `UiIcon.astro` and ensure all UI components can accept an optional icon without layout breakage
  - [ ] Validation: catalog page(s) render icons in semantic and decorative modes; reduced motion disables icon parallax

- [ ] Phase 3: Motion tokens + GSAP utilities + reduced-motion utilities
  - [ ] Implement motion tokens mapping (`motion.tokens.ts`) and interaction state contract (`interaction-states.ts`)
  - [ ] Implement GSAP action helpers (`gsap-actions.ts`) for hover/press/focus/selected/disabled
  - [ ] Implement reduced-motion helpers (`reduced-motion.ts`) with global policy consistency
  - [ ] Implement route transition hooks (`route-transitions.ts`) only if Astro view transitions are enabled and validated
  - [ ] Validation: reduced-motion disables non-essential motion; no uncontrolled global timelines

- [ ] Phase 4: Core UI primitives
  - [ ] Implement: `UiButton`, `UiIconButton`, `UiBadge`, `UiSurface`, `UiPanel`
  - [ ] Ensure shared prop contract and required interaction states are supported
  - [ ] Ensure components remain HTML-first and usable with JS disabled (except enhancements)
  - [ ] Validation: focus, disabled, selected states; no hover-only access

- [ ] Phase 5: Layout + navigation components
  - [ ] Implement: `UiSection`, `UiGrid`, `UiStack`, `UiCluster`, `UiControlRoomFrame`
  - [ ] Implement: `UiNavItem`, `UiCommandMenu`, `UiBreadcrumb`, `UiTabs`
  - [ ] Validate recruiter fast path remains obvious per IA and blueprint

- [ ] Phase 6: Data display components integrated with content graph
  - [ ] Implement: `UiCard`, `UiStatCard`, `UiSkillBadge`, `UiTimelineItem`, `UiProjectCard`, `UiKnowledgeCard`
  - [ ] Integrate with collections safely (stable IDs; no invented metrics; certification status truthfulness)
  - [ ] Validate relationship patterns (chips, linked cards) remain readable (no hairballs)

- [ ] Phase 7: Chart.js foundation + chart components
  - [ ] Add chart foundation modules under `src/design-system/charts/`:
    - [ ] `chart.tokens.ts`, `chart.registry.ts`, `chart-lifecycle.ts`, `chart-accessibility.ts`, `chart-theme.ts`
  - [ ] Implement chart components:
    - [ ] `UiChartShell`, `UiBarChart`, `UiLineChart`, `UiRadarChart`, `UiDoughnutChart`
    - [ ] `UiSkillMatrixChart`, `UiExperienceTimelineChart`, `UiSecurityDomainRadar`, `UiToolchainDistributionChart`
  - [ ] Enforce chart policy: title+summary+data outside canvas, reduced-motion disables Chart.js animations, destroy on navigation/unmount, resize cleanup
  - [ ] Validation: e2e tests for hover/tooltip/resize/reduced motion/fallback table

- [ ] Phase 8: Three.js spatial shells + enhancement components
  - [ ] Implement Three.js utilities under `src/design-system/three/`:
    - [ ] `three-cleanup.ts`, `three-scene-registry.ts`, `three-depth-materials.ts`, `three-reduced-motion.ts`
  - [ ] Implement shells:
    - [ ] `ThreeCanvasShell`, `ThreeSceneLayer`, `ThreeIconPlane`, `ThreeDepthSurface`
  - [ ] Enforce boundaries: no essential content inside canvas; progressive enhancement; cleanup/disposal required
  - [ ] Validation: reduced-motion disables motion; scene cleanup is correct; no performance regressions

- [ ] Phase 9: Component catalog (content collection + routes)
  - [ ] Add `src/content/component-catalog/` schema + entries (component metadata, variants, states)
  - [ ] Add `src/pages/design-system/index.astro` and supporting catalog routes/pages
  - [ ] Ensure catalog is HTML-first and renders without JS
  - [ ] Validation: build renders catalog; a11y baseline checks; reduced motion variants documented

- [ ] Phase 10: Local Astro integration + Dev Toolbar diagnostics
  - [ ] Implement `integrations/design-library/index.ts`, `dev-toolbar.ts`, `diagnostics.ts`
  - [ ] Add diagnostics for forbidden dependencies, missing required deps, and misconfigured experimental flags
  - [ ] Keep dev toolbar features dev-only; do not introduce SSR assumptions
  - [ ] Validation: dev server runs; diagnostics do not leak secrets; production build unaffected

- [ ] Phase 11: QA hardening + audits
  - [ ] Add/expand tests under `tests/components/`, `e2e/design-system/`, `e2e/charts/`
  - [ ] Add validation scripts/checks for:
    - [ ] forbidden dependencies
    - [ ] reduced-motion behavior
    - [ ] chart lifecycle cleanup
    - [ ] Three.js cleanup
  - [ ] Final validation: `pnpm astro check` + `pnpm build` + `pnpm exec playwright test`

# Task Dependencies
- Phase 2 depends on Phase 1.
- Phase 3 depends on Phase 1.
- Phase 4 depends on Phases 1–3.
- Phase 5 depends on Phase 4.
- Phase 6 depends on Phases 4–5 and content collection contracts.
- Phase 7 depends on Phases 1 and 3 (tokens + motion utilities).
- Phase 8 depends on Phases 1 and 3 (tokens + motion utilities).
- Phase 9 depends on Phases 1–6 (component inventory) and content collections.
- Phase 10 depends on Phase 1 (integration wiring) and Phase 9 (catalog for diagnostics targets).
- Phase 11 depends on all prior phases.
