# Astro Design Library (Astro-Native Component Library + Design System) Spec

## Why
The portfolio needs a reusable, recruiter-readable component library that preserves the “Hybrid Cloud Control Room” visual language while remaining static-first, accessible, and React/Tailwind-free.

## What Changes
- Introduce a token-driven design system (CSS variables + UnoCSS shortcuts) that standardizes surfaces, depth, typography, color, icons, and motion.
- Introduce an Astro-native component library (UI primitives, layout, navigation, feedback, charts, and Three.js shells) with a shared prop contract and reduced-motion behavior.
- Introduce an icon pipeline (Streamline Ultimate Duotone Free / Interface Essential) with local registry, SVG optimization, accessibility handling, and 3.5D/3D treatments.
- Introduce GSAP motion utilities with scoped timelines, lifecycle cleanup, and consistent interaction-state choreography.
- Introduce a Chart.js foundation (direct TS usage only) with progressive enhancement and accessible HTML fallbacks (summaries + tables/semantic data).
- Introduce a Three.js shell layer for spatial enhancement only, with strict boundaries and lifecycle cleanup.
- Introduce a component catalog driven by Astro Content Collections, rendered as HTML-first pages under `/design-system`.
- Add diagnostics and guardrails (forbidden dependency scanning, reduced-motion checks, chart/three cleanup discipline) via a local Astro integration and optional dev toolbar app.

## Impact
- Affected capabilities: design tokens, UI components, motion system, icon system, charts, 3D shells, catalog documentation, validation gates.
- Affected code areas (planned):
  - New: `src/design-system/**`, `src/components/ui/**`, `src/components/layout/**`, `src/components/charts/**`, `src/components/three/**`
  - New: `src/content/component-catalog/**`, `src/pages/design-system/**`, `integrations/design-library/**`
  - New/expanded tests: `tests/components/**`, `e2e/design-system/**`, `e2e/charts/**`
  - Existing (must remain passing): build/check pipelines, current content collections, current pages and layouts.

## Source of Truth
This spec MUST be executed without re-architecting. Implementers SHALL follow:
- Design library style guide: [astro-design-library-style-guide.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/design/astro-design-library-style-guide.md)
- Control room blueprint: [control-room-blueprint.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/architecture/control-room-blueprint.md)
- Design system and motion guidance:
  - [design-system.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/design/design-system.md)
  - [ui-patterns.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/design/ui-patterns.md)
  - [motion-system.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/design/motion-system.md)
- Three.js boundaries: [threejs-boundaries.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/architecture/threejs-boundaries.md)
- Content graph + IA constraints:
  - [content-model.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/architecture/content-model.md)
  - [ia.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/architecture/ia.md)

Design-library architecture document status:
- `docs/architecture/astro-design-library-architecture.md` is referenced as authoritative, but is not currently present in the repo.
- Until it is materialized, implementers SHALL treat the latest architecture draft embedded in:
  - `.trae/documents/plan-astro-component-library-design-system.md`
  as the authoritative architecture source for this spec.

## Constraints (Hard Requirements)
- React-free and Tailwind-free:
  - No React/Preact/Vue/Svelte renderers, no React chart wrappers, no Tailwind.
- Native Astro components only (Astro templates + TS modules).
- UnoCSS for utilities + token consumption, plus component-scoped CSS and CSS variables.
- GSAP for motion/choreography, gated by reduced motion and scoped with cleanup.
- Three.js for spatial enhancement only; no essential content inside canvas; strict lifecycle cleanup.
- Chart.js for data visualization only, used directly from TypeScript modules.
- Nanostores only when shared state is required; do not replace local component state unnecessarily.
- No essential content may be canvas-only:
  - no recruiter-critical text, metrics, chart data, or navigation only inside canvas.
- Accessibility is mandatory:
  - semantic HTML-first
  - keyboard support + visible focus
  - no hover-only access
  - reduced-motion behavior is meaningful and global
- Preserve existing passing state:
  - `pnpm astro check` passes
  - `pnpm build` passes
- Content graph safety:
  - use stable IDs and safe references
  - do not invent metrics
  - do not mark in-progress certifications as completed unless the content says so
  - CV formats remain “metadata-only / coming soon” unless assets exist

---

## ADDED Requirements

### Requirement: Implementation objectives (program-level)
The system SHALL deliver a reusable Astro-native component library and design system that is recruiter-readable, motion-aware, 3.5D/3D treated, and compatible with static-first deployment.

#### Scenario: Preserve baseline health
- **WHEN** implementers complete any phase
- **THEN** `pnpm astro check` SHALL pass
- **AND** `pnpm build` SHALL pass
- **AND** no forbidden dependencies SHALL be introduced.

### Requirement: Dependency policy enforcement
The system SHALL enforce required/forbidden dependency policy via repository inspection of `package.json`, `pnpm-lock.yaml`, `astro.config.*`, and `src/**` imports.

Required dependencies (target: latest stable when implementation begins):
- `astro`, `gsap`, `three`, `unocss`, `nanostores`, `chart.js`

Before any dependency modifications, implementers SHALL run:
- `pnpm view astro version`
- `pnpm view gsap version`
- `pnpm view three version`
- `pnpm view unocss version`
- `pnpm view nanostores version`
- `pnpm view chart.js version`

Optional dependencies (allowed only with written justification):
- `fabricjs`, `penciljs`, `vfx-js`, `barba.js`, `roughjs`

Forbidden dependencies:
- `react`, `react-dom`, `@astrojs/react`
- `preact`, `@astrojs/preact`
- `vue`, `@astrojs/vue`
- `svelte`, `@astrojs/svelte`
- `tailwindcss`, `daisyui`
- `@react-three/fiber`
- `framer-motion`
- `react-chartjs-2`, `vue-chartjs`, `svelte-chartjs`
- any framework-specific Chart.js wrapper

#### Scenario: Forbidden wrapper detected
- **WHEN** a forbidden dependency or import is present
- **THEN** the dependency validation gate SHALL fail
- **AND** the implementation SHALL not proceed until removed.

### Requirement: Required folder structure
The system SHALL create and use the following folder structure:

```
src/design-system/tokens/
src/design-system/icons/
src/design-system/motion/
src/design-system/three/
src/design-system/charts/
src/design-system/state/
src/components/ui/
src/components/layout/
src/components/three/
src/components/charts/
src/content/component-catalog/
src/pages/design-system/
integrations/design-library/
tests/components/
e2e/design-system/
e2e/charts/
```

Each folder’s definition (purpose/allowed file types/ownership/forbidden responsibilities) is binding:

#### `src/design-system/tokens/`
- Purpose: token sources and token mapping contracts (CSS variables + theme/depth/motion/chart layers).
- Allowed file types: `.css`, `.ts` (mapping utilities only).
- Ownership: design system maintainers.
- Forbidden: UI markup, page routes, content fetching logic.

#### `src/design-system/icons/`
- Purpose: local icon registry, icon metadata, accessibility helpers, icon motion helpers.
- Allowed file types: `.ts`, `.svg` (local assets), `.md` (optional internal notes if later approved).
- Ownership: design system maintainers.
- Forbidden: runtime network fetching of icons; framework icon wrappers.

#### `src/design-system/motion/`
- Purpose: motion tokens mapping, GSAP actions, reduced-motion strategies, interaction-state contracts.
- Allowed file types: `.ts`.
- Ownership: design system maintainers.
- Forbidden: unscoped global timelines; animations that gate content.

#### `src/design-system/three/`
- Purpose: Three.js lifecycle cleanup utilities, scene registry, depth material presets, reduced-motion rules.
- Allowed file types: `.ts`.
- Ownership: Three.js owner.
- Forbidden: essential content rendering; navigation logic; SSR assumptions.

#### `src/design-system/charts/`
- Purpose: Chart.js tokens/registry/theme, accessibility helpers, lifecycle module.
- Allowed file types: `.ts`.
- Ownership: design system maintainers.
- Forbidden: framework wrappers; canvas-only meaning.

#### `src/design-system/state/`
- Purpose: nanostores for shared UI state only.
- Allowed file types: `.ts`.
- Ownership: design system maintainers.
- Forbidden: storing content collection data by default; using stores where props suffice.

#### `src/components/ui/`
- Purpose: Astro UI primitives + feedback + transitions + navigation components.
- Allowed file types: `.astro` + associated TS enhancement modules (located under `src/scripts/**` or colocated only if project conventions allow).
- Ownership: Astro implementation owner.
- Forbidden: framework renderer usage; heavy global CSS; unscoped scripts without cleanup.

#### `src/components/layout/`
- Purpose: Astro layout primitives for sections, grids, stacks, frames.
- Allowed file types: `.astro`.
- Ownership: Astro implementation owner.
- Forbidden: page routing; embedding content that belongs to pages/routes.

#### `src/components/three/`
- Purpose: Astro shells and composition points for Three.js scenes and overlays (HTML-first).
- Allowed file types: `.astro` + minimal safe scripts.
- Ownership: split ownership (Astro: markup/fallback; Three.js: runtime).
- Forbidden: moving essential content into canvas; focus traps.

#### `src/components/charts/`
- Purpose: Astro chart components that render semantic HTML fallback + enhance with Chart.js on client.
- Allowed file types: `.astro` + TS chart init modules.
- Ownership: Astro implementation owner (with design-system chart module constraints).
- Forbidden: wrapper packages; hiding data only in canvas.

#### `src/content/component-catalog/`
- Purpose: Content collection entries for catalog metadata and demos.
- Allowed file types: `.md` / `.mdx` (per project conventions) and referenced assets (if allowed by collections).
- Ownership: design system maintainers.
- Forbidden: injecting runtime-only dependencies; claiming features not implemented.

#### `src/pages/design-system/`
- Purpose: catalog pages rendered HTML-first.
- Allowed file types: `.astro`.
- Ownership: Astro implementation owner.
- Forbidden: Storybook-like framework dependence; canvas-only catalogs.

#### `integrations/design-library/`
- Purpose: local Astro integration for diagnostics, optional dev toolbar app, config validation.
- Allowed file types: `.ts`.
- Ownership: Astro implementation owner.
- Forbidden: adding SSR requirements or adapters; logging secrets.

#### `tests/components/`
- Purpose: unit tests for token mapping, registry integrity, and deterministic helpers.
- Allowed file types: `.test.ts`.
- Ownership: QA owner.
- Forbidden: brittle visual snapshot coupling to animations.

#### `e2e/design-system/` and `e2e/charts/`
- Purpose: Playwright tests for catalog rendering, interaction, reduced motion, chart lifecycle.
- Allowed file types: `.spec.ts`.
- Ownership: QA owner.
- Forbidden: tests that depend on precise animation timings; prefer DOM state signals.

### Requirement: Required foundation files
The system SHALL implement these foundation files with the listed responsibilities:

Token files (CSS variables as canonical source):
- `src/design-system/tokens/tokens.css`: base tokens (color, spacing, typography, borders, radii, elevation, z-depth).
- `src/design-system/tokens/theme.css`: theme mapping (semantic tokens, category/tag/tool/skill palettes).
- `src/design-system/tokens/depth.css`: depth and 3.5D cues (perspective, transforms, shadows, glows).
- `src/design-system/tokens/motion.css`: motion durations and easing tokens; reduced-motion variants.
- `src/design-system/tokens/chart.css`: chart palette + grid/ticks/tooltip/legend styling tokens.

Motion files (behavior contracts and utilities):
- `src/design-system/motion/motion.tokens.ts`: read/normalize motion tokens for JS (durations/eases).
- `src/design-system/motion/gsap-actions.ts`: reusable GSAP action utilities for hover/press/focus/selected/disabled.
- `src/design-system/motion/reduced-motion.ts`: canonical reduced-motion detection + strategies (global + per-component).
- `src/design-system/motion/interaction-states.ts`: state naming contract and DOM attribute conventions.
- `src/design-system/motion/route-transitions.ts`: Astro view-transition hooks (if enabled) with cleanup.

Icon files (registry + accessibility + motion):
- `src/design-system/icons/icon-types.ts`: shared icon typing (ID, label, role).
- `src/design-system/icons/icon-registry.ts`: local icon registry (no runtime fetch).
- `src/design-system/icons/icon-accessibility.ts`: semantic vs decorative rules, label handling.
- `src/design-system/icons/icon-motion.ts`: icon layer motion patterns (hover/press/focus/selected/disabled).

Three.js files (cleanup-first):
- `src/design-system/three/three-cleanup.ts`: disposal utilities for renderer/material/geometry/texture/event listeners.
- `src/design-system/three/three-scene-registry.ts`: typed registry for scenes and capabilities (no content ownership).
- `src/design-system/three/three-depth-materials.ts`: material/light presets mapped to tokens.
- `src/design-system/three/three-reduced-motion.ts`: reduced-motion policy for scenes.

Chart files (direct Chart.js + progressive enhancement):
- `src/design-system/charts/chart.tokens.ts`: chart token mapping (colors/fonts/grid).
- `src/design-system/charts/chart.registry.ts`: typed registry for chart types, variants, defaults.
- `src/design-system/charts/chart-lifecycle.ts`: mount/update/destroy controller; resize observer lifecycle.
- `src/design-system/charts/chart-accessibility.ts`: title/summary/fallback table helpers.
- `src/design-system/charts/chart-theme.ts`: apply token-mapped options to Chart.js configs.

State files (nanostores only when necessary):
- `src/design-system/state/ui-state.ts`: shared UI state (e.g., command menu open).
- `src/design-system/state/motion-state.ts`: explicit motion toggle preference (in addition to `prefers-reduced-motion`).
- `src/design-system/state/chart-state.ts`: shared chart filter state (only when multiple charts share filters).

Integration files (diagnostics and dev tooling):
- `integrations/design-library/index.ts`: Astro integration entry.
- `integrations/design-library/dev-toolbar.ts`: optional dev toolbar app registration (dev-only).
- `integrations/design-library/diagnostics.ts`: dependency warnings, config validation.

### Requirement: Required component list
The system SHALL implement the following Astro components (no framework renderers):

UI primitives:
- `src/components/ui/UiIcon.astro`
- `src/components/ui/UiButton.astro`
- `src/components/ui/UiIconButton.astro`
- `src/components/ui/UiBadge.astro`
- `src/components/ui/UiSurface.astro`
- `src/components/ui/UiPanel.astro`

Layout:
- `src/components/layout/UiSection.astro`
- `src/components/layout/UiGrid.astro`
- `src/components/layout/UiStack.astro`
- `src/components/layout/UiCluster.astro`
- `src/components/layout/UiControlRoomFrame.astro`

Navigation:
- `src/components/ui/UiNavItem.astro`
- `src/components/ui/UiCommandMenu.astro`
- `src/components/ui/UiBreadcrumb.astro`
- `src/components/ui/UiTabs.astro`

Data display:
- `src/components/ui/UiCard.astro`
- `src/components/ui/UiStatCard.astro`
- `src/components/ui/UiSkillBadge.astro`
- `src/components/ui/UiTimelineItem.astro`
- `src/components/ui/UiProjectCard.astro`
- `src/components/ui/UiKnowledgeCard.astro`

Feedback:
- `src/components/ui/UiTooltip.astro`
- `src/components/ui/UiToast.astro`
- `src/components/ui/UiModal.astro`
- `src/components/ui/UiDrawer.astro`
- `src/components/ui/UiProgress.astro`

Charts:
- `src/components/charts/UiChartShell.astro`
- `src/components/charts/UiBarChart.astro`
- `src/components/charts/UiLineChart.astro`
- `src/components/charts/UiRadarChart.astro`
- `src/components/charts/UiDoughnutChart.astro`
- `src/components/charts/UiSkillMatrixChart.astro`
- `src/components/charts/UiExperienceTimelineChart.astro`
- `src/components/charts/UiSecurityDomainRadar.astro`
- `src/components/charts/UiToolchainDistributionChart.astro`

Three.js / spatial:
- `src/components/three/ThreeCanvasShell.astro`
- `src/components/three/ThreeSceneLayer.astro`
- `src/components/three/ThreeIconPlane.astro`
- `src/components/three/ThreeDepthSurface.astro`

Transitions:
- `src/components/ui/UiTransitionShell.astro`
- `src/components/ui/UiRouteTransition.astro`
- `src/components/ui/UiReveal.astro`
- `src/components/ui/UiMagneticHover.astro`

### Requirement: Shared component contract
All reusable components SHALL support (where applicable):
- `id`, `class`, `variant`, `size`, `depth`, `motion`
- `icon`, `iconPosition`, `iconLabel`
- `interactive`, `disabled`, `selected`
- `reducedMotionStrategy`

Interactive components SHALL support state transitions:
- `idle`, `hoverIn`, `hoverOut`, `press`, `release`, `focus`, `blur`, `disabled`, `selected`

Each component SHALL document:
- props and slots
- emitted custom events (if any)
- client enhancement behavior (if any)
- accessibility behavior
- reduced-motion fallback behavior
- cleanup requirements for any client-side JS

### Requirement: Chart component contract
Chart components SHALL support:
- `id`, `class`, `title`, `description`, `data`, `labels`, `datasetLabel`, `chartType`
- `variant`, `depth`, `motion`, `icon`, `iconPosition`, `iconLabel`
- `showLegend`, `showTooltip`, `showFallbackTable`
- `reducedMotionStrategy`, `interactive`

Chart interaction states:
- `chartEnter`, `chartLeave`, `pointHoverIn`, `pointHoverOut`
- `legendHoverIn`, `legendHoverOut`, `tooltipOpen`, `tooltipClose`
- `dataUpdate`, `resize`

Chart requirements:
- Use Chart.js directly from TypeScript (no wrappers).
- Expose data outside canvas (fallback table or semantic representation).
- Provide accessible title and short summary in HTML.
- Disable Chart.js animations under `prefers-reduced-motion`.
- Destroy chart instances on unmount/navigation and clean resize observers.
- Preserve static Astro fallback content.
- Coordinate shell animation with GSAP only where useful.

### Requirement: Icon specification
The system SHALL implement an icon registry contract:
- Local registry only (no runtime fetch).
- Streamline Interface Essential icons only unless later approved.
- SVG optimization required.
- Stable kebab-case IDs.
- Decorative icons hidden from assistive tech; semantic icons have accessible names.
- Icons support 3.5D/3D treatment:
  - layered duotone, pseudo-extrusion, parallax, depth shadow, hover lift, press compression, selected glow, disabled desaturation.

### Requirement: GSAP motion specification
The system SHALL implement:
- Shared timeline utilities and action helpers.
- Scoped animation setup and cleanup conventions.
- Event binding conventions and reduced-motion guard.
- Optional route transition hooks (Astro view transitions) without trapping focus.
- SVG animation helpers and chart shell animation helpers.

Rules:
- No global uncontrolled timelines.
- No blocking initial render.
- No motion required to understand content.
- All listeners removable; all modules have cleanup strategy.

### Requirement: Three.js specification
The system SHALL define:
- Scene shell contract and progressive enhancement behavior.
- Renderer/camera defaults, lighting/material presets mapped to tokens.
- Resize handling and cleanup/disposal rules.
- Reduced-motion behavior for scenes.

Rules (strict):
- No recruiter-critical content or navigation inside canvas.
- No always-on heavy scenes without reduced-motion and performance guard.
- Dispose geometries, materials, textures, renderers, and listeners.
- Use Three.js only where 3D adds meaning or premium spatial polish.

### Requirement: UnoCSS specification
The system SHALL:
- Configure UnoCSS to consume tokens and provide token-driven shortcuts.
- Avoid Tailwind dependency and avoid Tailwind preset unless explicitly approved.
- Provide shortcuts for: surfaces, panels, buttons, badges, focus rings, chart shells, icon depth, control-room grids, telemetry strips.
- Avoid unreadable utility soup (shortcuts or scoped CSS when complexity rises).

### Requirement: Nanostores specification
Nanostores are allowed only for shared state that spans components, such as:
- motion preference, theme preference, active menu state, active chart filter, design-system debug panel, route transition state (if needed).

Nanostores are not allowed for:
- replacing local component state unnecessarily
- storing static content collection data without need
- using stores where Astro props are enough

### Requirement: Astro API specification (use/non-use)
The system SHALL:
- Use Integration API for local design-library integration, diagnostics, optional token CSS injection, and optional dev toolbar registration.
- Remain static-deployment compatible; avoid SSR-only assumptions unless explicitly approved.
- Explicitly avoid Renderer API usage for React/Preact/Vue/Svelte.
- Use Content Loader API for component catalog metadata, demo data, icon metadata, example registries.
- Use Image Service API for optimized previews (never as a canvas-only replacement).
- Optionally use Dev Toolbar App API for inspection and forbidden dependency warnings (dev-only).
- Treat Session Driver API as future-only; do not force SSR for preference persistence.
- Use Font Provider API only when performance-safe; keep readable fallbacks.
- Use Runtime API for runtime helpers, transition utilities, and environment-aware behavior.

### Requirement: Astro experimental features policy
Experimental flags SHALL be enabled only with explicit justification, risk, validation requirement, and rollback note:
- route caching, client prerendering, IntelliSense for collections, Chrome DevTools workspace, SVG optimization, queued rendering, Rust compiler, advanced routing, logger.

### Requirement: Component catalog specification
The system SHALL implement a catalog using Astro content collections under `src/content/component-catalog/` and render:
- `src/pages/design-system/index.astro` (required)

Catalog metadata MUST include:
- component name, category, status, props, variants
- icon examples, motion examples, chart examples where relevant
- accessibility notes, reduced-motion notes
- usage examples, anti-patterns

### Requirement: Content graph integration specification
UI components SHALL consume existing collections safely:
- `profile`, `experience`, `projects`, `caseStudies`, `blog`, `certifications`, `cvFormats`
- `categories`, `tags`, `tools`, `skills`, `contactChannels`, `socialLinks`

Rules:
- Use stable IDs; avoid drift in references.
- Do not invent metrics.
- Do not present in-progress certifications as completed.
- Do not show coming-soon CV formats as downloadable.
- Surface relationships via readable proof chains; avoid hairball graph visualization.
- Provide semantic links and scannable evidence pathways.

### Requirement: Testing and validation specification
After each phase, implementers SHALL run:
- `pnpm install`
- `pnpm astro check`
- `pnpm build`

If configured:
- `pnpm run lint`
- `pnpm run test`
- `pnpm exec playwright test`

Tests SHALL cover:
- forbidden dependency absence
- component rendering + optional icon rendering
- hover/focus/press/release states (DOM state signals, not timing brittle)
- reduced-motion behavior
- chart fallback data + destroy lifecycle
- Three.js cleanup
- component catalog rendering
- keyboard navigation
- accessible chart summaries
- no canvas-only critical content

---

## MODIFIED Requirements
### Requirement: Multi-language robustness (design requirement)
Even if current collections constrain `lang` more narrowly than IA (`en/es` vs `en/es/fr/de`), the design library SHALL support layout expansion and string growth for future `fr/de` content without requiring component redesign.

---

## REMOVED Requirements
None.
