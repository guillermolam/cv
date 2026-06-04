# Tasks
- [ ] Task 1 (Astro): Update design tokens and global styles to match Phase 2 art direction.
  - [ ] Add new tokens to src/styles/tokens.css (fonts, focus width/offset, scrim/glass alpha, accent-glow, motion-stagger).
  - [ ] Update src/styles/global.css to apply the new aesthetic (operator ID block, stronger focus/hover affordances, topology row focus-within styling).
  - [ ] Validate no regressions in readability and contrast (manual spot-check + existing checks).

- [ ] Task 2 (Astro): Integrate Guillermo personalization into hero, recruiter rail, and footer.
  - [ ] Add “Operator ID” block to the homepage hero (compose ProfilePortrait + name + short label + GitHub/LinkedIn links).
  - [ ] Update RecruiterBriefingRail to include GitHub/LinkedIn links in a stable module (and optional portrait if approved by layout constraints).
  - [ ] Update footer to include GitHub/LinkedIn links with descriptive labels.
  - [ ] Ensure links remain accessible and do not rely on icons only.

- [ ] Task 3 (Astro): Add GSAP motion system implementation (homepage only).
  - [ ] Add GSAP dependency and load it only on routes that use animations.
  - [ ] Implement a single homepage motion orchestrator island that targets semantic HTML via stable selectors or `data-*` hooks.
  - [ ] Implement timelines: hero entry stagger, button/nav micro-interactions, topology hover/focus feedback, station card scroll reveals.
  - [ ] Implement reduced-motion gating: no ScrollTrigger, no parallax, no idle loops; minimal transitions only.

- [ ] Task 4 (ThreeJS): Implement Hero3D particle topology scene and lifecycle (per contract).
  - [ ] Implement WebGL capability checks and quality gating (default-off on low-end mobile if needed).
  - [ ] Mount into `[data-hero3d-mount]` and read `data-hero3d-*` attributes for state/selection.
  - [ ] Render particle topology field (nodes + sparse edges) with restrained accent usage and no heavy post-processing.
  - [ ] Implement lifecycle: lazy-init on viewport entry, stop loop when offscreen, full disposal on teardown.
  - [ ] Ensure `?no3d=1` disables initialization and “Skip 3D” disables immediately.

- [ ] Task 5 (QA): Validate accessibility, SEO, and performance constraints remain satisfied.
  - [ ] Run pnpm run check and pnpm run build.
  - [ ] Validate keyboard navigation: focus-visible rings on nav/buttons/chips/table links and Skip 3D.
  - [ ] Validate reduced motion: all essential content visible and animations disabled as specified.
  - [ ] Validate WebGL off: hero still renders correctly and content remains readable.

# Task Dependencies
- Task 2 depends on Task 1 (tokens/styles first).
- Task 3 depends on Task 1 (motion uses token timings/eases).
- Task 4 depends on Task 1 (hero visual blending relies on tokenized surfaces/borders).
- Task 5 depends on Tasks 1–4.
