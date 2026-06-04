# Tasks

- [ ] Task 1: Lock and apply Phase 1 design tokens to the homepage UI.
  - [ ] Ensure typography uses system-first stacks and weights per spec section 2.1.
  - [ ] Ensure layout grid and breakpoints match spec section 2.2.
  - [ ] Ensure color tokens and semantic mappings match spec sections 2.3–2.4.

- [ ] Task 2: Implement homepage composition (HTML-first) on `/`.
  - [ ] Add hero headline/subheadline and CTAs (Download CV primary, Portfolio secondary).
  - [ ] Implement Recruiter Briefing Rail with desktop rail + mobile stacked behavior.
  - [ ] Implement station chips (anchor-first) and station sections with anchors.
  - [ ] Implement Topology Table with desktop table + mobile cards and row anchors.

- [ ] Task 3: Implement non-WebGL fallback hero and HTML overlays.
  - [ ] Ensure fallback hero remains visually coherent with 3D disabled/unavailable.
  - [ ] Provide overlay shell: station label, Skip 3D, optional Toggle motion.
  - [ ] Ensure overlays are accessible and do not obscure critical content.

- [ ] Task 4: Implement Three.js progressive enhancement layer (lightweight topology).
  - [ ] Mount canvas into provided container without breaking layout.
  - [ ] Implement station emphasis (optional) driven by selected station id.
  - [ ] Implement reduced-motion behavior (no continuous loop under reduce).
  - [ ] Implement teardown/disposal and Skip 3D behavior.

- [ ] Task 5: Validate Phase 1 acceptance criteria and regression health.
  - [ ] Desktop layout (rail, CTAs, table) matches spec.
  - [ ] Mobile layout is above-the-fold clear and touch-safe.
  - [ ] Reduced motion disables continuous motion.
  - [ ] WebGL off shows fallback hero with stable layout.
  - [ ] JavaScript off preserves anchors and essential content.

# Task Dependencies
- Task 2 depends on Task 1
- Task 3 depends on Task 2
- Task 4 depends on Task 2 and Task 3
- Task 5 depends on Tasks 2–4

