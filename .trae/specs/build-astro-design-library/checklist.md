- [ ] Spec references are resolvable: style guide + blueprint + boundaries + IA + content model paths exist
- [ ] Architecture source-of-truth is resolved: `docs/architecture/astro-design-library-architecture.md` exists OR the plan-embedded architecture draft is explicitly referenced during implementation

- [ ] Dependency policy is enforced (pre-implementation):
  - [ ] `package.json` contains no forbidden deps (React/Tailwind/framework wrappers)
  - [ ] `pnpm-lock.yaml` contains no forbidden deps (including transitive React wrappers if any appear)
  - [ ] `astro.config.*` contains no renderer integrations for React/Preact/Vue/Svelte
  - [ ] `src/**` contains no imports from forbidden frameworks/wrappers

- [ ] Version discovery commands have been executed before changing dependencies:
  - [ ] `pnpm view astro version`
  - [ ] `pnpm view gsap version`
  - [ ] `pnpm view three version`
  - [ ] `pnpm view unocss version`
  - [ ] `pnpm view nanostores version`
  - [ ] `pnpm view chart.js version`

- [ ] Foundation structure exists:
  - [ ] All required folders exist (design-system, components, integrations, tests, e2e)
  - [ ] Token CSS files exist under `src/design-system/tokens/`
  - [ ] UnoCSS is configured to consume tokens (no Tailwind preset unless explicitly justified)

- [ ] Icon pipeline requirements met:
  - [ ] Icon registry is local-only (no runtime fetch)
  - [ ] Streamline Interface Essential icons only (unless later approved)
  - [ ] SVG optimization is applied
  - [ ] Decorative icons are hidden from assistive tech; semantic icons are labeled
  - [ ] Icons support 3.5D treatment; reduced-motion disables icon parallax

- [ ] GSAP requirements met:
  - [ ] Reduced-motion guard is enforced globally
  - [ ] No uncontrolled global timelines
  - [ ] All event listeners and observers have cleanup strategy
  - [ ] Motion does not block comprehension or gate content

- [ ] Component contract requirements met:
  - [ ] All listed components exist and follow the shared prop contract
  - [ ] Interactive states are supported (idle/hover/press/focus/selected/disabled)
  - [ ] Components render meaningfully with JS disabled (progressive enhancement only)

- [ ] Chart.js requirements met:
  - [ ] Chart.js is used directly from TypeScript (no wrappers installed)
  - [ ] Each chart has HTML title + short summary
  - [ ] Each chart exposes data outside canvas (fallback table or semantic data)
  - [ ] Reduced-motion disables Chart.js animation
  - [ ] Chart instances are destroyed on unmount/navigation
  - [ ] Resize observers are cleaned up
  - [ ] E2E covers hover, tooltip, resize, reduced-motion, fallback table

- [ ] Three.js requirements met:
  - [ ] No recruiter-critical content or navigation inside canvas
  - [ ] Progressive enhancement and non-WebGL fallback exist
  - [ ] Renderer/material/geometry/texture disposal is implemented and verified
  - [ ] Reduced-motion disables continuous motion and large camera movement

- [ ] Content graph safety requirements met:
  - [ ] Stable IDs are used for cross-links
  - [ ] No fake metrics introduced
  - [ ] Certifications status matches content (no “completed” claims unless present)
  - [ ] CV formats remain “coming soon” unless assets exist
  - [ ] Graph relationships are shown as readable proof chains (no hairballs)

- [ ] Component catalog requirements met:
  - [ ] `src/content/component-catalog/` entries exist with required metadata
  - [ ] `src/pages/design-system/index.astro` exists and renders HTML-first
  - [ ] Catalog works without JS and documents reduced-motion variants

- [ ] Project health preserved after each phase:
  - [ ] `pnpm install` succeeds
  - [ ] `pnpm astro check` passes
  - [ ] `pnpm build` passes
  - [ ] If configured: tests and Playwright pass
