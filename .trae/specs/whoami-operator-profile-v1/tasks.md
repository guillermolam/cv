# Tasks

- [ ] Task 1: Confirm current Whoami entry points and replacement scope
  - [ ] Identify the current homepage hero/operator modules and the exact component/page that will be replaced
  - [ ] Confirm that route paths remain unchanged (`/` and `/{lang}/`)
  - [ ] Confirm primary nav labels remain per [navigation-labels.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/architecture/navigation-labels.md)

- [ ] Task 2: Build build-time Whoami data model (no invented metrics)
  - [ ] Define a build-time “evidence index” derivation for the 8 stats axes using content collections + content graph relationships
  - [ ] Implement deterministic score + confidence outputs and a clear evidence summary string per axis
  - [ ] Ensure draft blog posts are excluded from evidence counts and links
  - [ ] Ensure missing evidence renders “N/A” and Low confidence (no placeholders)

- [ ] Task 3: Implement Operator Profile layout (desktop + mobile)
  - [ ] Create the three-column desktop layout (left avatar + keys, center identity + badges, right stats + radar)
  - [ ] Implement mobile stacking order and tap target sizing for keyboard keys
  - [ ] Preserve existing CTAs and recruiter fast path (Briefing Pack, Experience, Contact)

- [ ] Task 4: Implement Keyboard Cluster navigation (progressive enhancement)
  - [ ] Baseline: key cluster uses anchor links to `#skills`, `#certifications`, `#education`, `#languages`, `#experience`
  - [ ] Enhanced: add pressed/active state and optional panel emphasis without hiding content from the accessibility tree
  - [ ] Add reduced-motion safe behavior for key press and panel emphasis

- [ ] Task 5: Implement badges (factual, content-derived)
  - [ ] Define badge sources and mapping to existing taxonomy/collections
  - [ ] Render badges with explicit, non-claiming language (no implied certifications)

- [ ] Task 6: Implement radar chart with accessible table fallback (no chart dependency)
  - [ ] Render an SVG radar chart (optional visual layer) backed by the computed 8-axis values
  - [ ] Always render a table/list fallback with axis name, value, confidence, and evidence summary
  - [ ] Ensure screen reader navigation is straightforward and not duplicated/noisy

- [ ] Task 7: Accessibility + motion conformance
  - [ ] Verify heading structure and link labels
  - [ ] Verify keyboard navigation + visible focus states
  - [ ] Verify reduced-motion disables non-essential motion and keeps the UI stable
  - [ ] Verify no essential information is only color-coded or only in the chart graphic

- [ ] Task 8: Performance guardrails
  - [ ] Ensure no new runtime deps are introduced
  - [ ] Ensure Whoami incremental client JS stays within budget (≤ 8KB gzip for new enhancements)
  - [ ] Ensure avatar/3D remains optional and never blocks core content rendering

- [ ] Task 9: Validation and smoke testing
  - [ ] `pnpm content:validate`
  - [ ] `pnpm content:graph`
  - [ ] `pnpm check`
  - [ ] `pnpm astro check`
  - [ ] `pnpm build`
  - [ ] `pnpm exec playwright test --project=chromium --reporter=line`

# Task Dependencies
- Task 3 depends on Task 1 and Task 2
- Task 4 depends on Task 3
- Task 6 depends on Task 2 and Task 3
- Task 7 depends on Tasks 3–6
- Task 9 depends on Tasks 2–8
