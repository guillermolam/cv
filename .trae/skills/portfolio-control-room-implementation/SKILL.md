---
name: "portfolio-control-room-implementation"
description: "Use this skill when implementing or evolving the Control Room Astro/Three.js portfolio (features, refactors, QA/perf fixes, boundary-safe changes). Do not use for copywriting, deployment operations, or governance decisions."
compatibility:
  platforms:
    - "Trae SOLO"
    - "Claude Code"
    - "Claude.ai"
  project_types:
    - "Astro content-first sites"
    - "Three.js progressive enhancement"
  languages:
    - "TypeScript"
metadata:
  version: "1.0.0"
  owner: "portfolio"
  intent: "implementation-workflows"
  tags:
    - "astro"
    - "threejs"
    - "typescript"
    - "devsecops"
    - "cloud-security"
    - "portfolio"
    - "accessibility"
    - "performance"
    - "reduced-motion"
  authoritative_docs:
    - "docs/architecture/control-room-blueprint.md"
    - "docs/architecture/threejs-boundaries.md"
    - "docs/design/design-system.md"
    - "docs/design/art-direction.md"
    - "docs/design/motion-system.md"
    - "docs/design/ui-patterns.md"
  constraints:
    - "Astro-first, content-first"
    - "Accessibility-first"
    - "Recruiter-first UX"
    - "Motion-first when it improves understanding"
    - "Three.js is enhancement, never primary content"
    - "Respect prefers-reduced-motion"
    - "Mobile usable without WebGL"
---
 
# Portfolio Control Room Implementation
 
## Purpose
Guide implementation agents to build and evolve a cloud-security “Control Room” portfolio using repeatable workflows and validation gates, while treating authoritative docs as the source of truth and keeping changes recruiter-friendly, accessible, and performant.
 
This skill optimizes for:
- Consistent implementation decisions
- Minimal context usage (delegate details to authoritative docs)
- Safe evolution without architecture drift
- Strong QA gates (recruiter UX + a11y + perf + Three.js boundaries)
 
## When To Use
Use this skill when the user asks to:
- Implement a new feature, page, component, route, or interaction
- Refactor or reorganize code while preserving behavior
- Integrate or modify the Three.js Control Room experience within defined boundaries
- Fix accessibility, responsive layout, navigation, or SEO regressions
- Reduce bundle size, improve performance, or fix runtime leaks
- Prepare or troubleshoot Fermyon/Spin deployment packaging (implementation side)
 
### Trigger Examples (at least 5)
- “Add a new portfolio case-study page and wire it into navigation.”
- “Refactor the header/footer layout without changing the visual design.”
- “Integrate the 3D hero as progressive enhancement and add a fallback.”
- “Fix prefers-reduced-motion behavior and make mobile performance acceptable.”
- “The build is failing after content/route changes—diagnose and fix.”
- “Tighten accessibility: focus states, headings, keyboard navigation, contrast.”
 
## When NOT To Use
Do NOT use this skill when the user asks for:
- CV writing, About copywriting, project storytelling, or recruiter narrative edits
- Brand redesign, new art direction, or “make it look like site X” design cloning
- LinkedIn automation or social posting workflows
- Pure research tasks unrelated to implementing this specific portfolio
- Large architectural redesign without updating authoritative docs first
 
### Non-Trigger Examples (at least 3)
- “Rewrite my About section to sound more senior.”
- “Draft a LinkedIn post about my recent project.”
- “Find five trendy portfolio designs and summarize them.”
 
## Required Inputs
Request only what’s needed; prefer pointing to existing artifacts.
 
Minimum inputs:
- The exact change request (feature/bug/refactor)
- The target area (route/component/file) if known
- Constraints or must-not-change elements (UX, layout, performance, scope)
- Current failing command output (if it’s a bug/build issue)
 
If missing, ask for one of:
- Screenshot/URL + steps to reproduce (UI bugs)
- Error logs / stack traces (runtime/build)
- Acceptance criteria (what “done” means)
 
## Decision Tree (Progressive Disclosure)
1) Is this content writing or narrative positioning?
- Yes → stop; route to a content-focused workflow.
- No → continue.
 
2) Does this change affect architecture, navigation structure, or 3D boundaries?
- Yes → mandatory: architecture + boundary review (authoritative docs).
- No → still do quick source-of-truth sanity check.
 
3) Does the change introduce client-side JS, animation, or new dependencies?
- Yes → mandatory: performance + reduced motion + mobile checks.
- No → proceed with standard checks.
 
4) Does the change touch key recruiter journeys (home, CV, contact, portfolio)?
- Yes → run recruiter UX acceptance review before finishing.
- No → still verify no regression.
 
## Workflow
Follow these phases in order. Do not skip gates.
 
### Phase 0 — Scope & Acceptance
- Restate the request as implementation acceptance criteria.
- Define “in scope” vs “out of scope”.
- Identify affected routes/components and user journeys.
- Identify risk: a11y, perf, mobile, SEO, Three.js boundaries.
 
### Phase 1 — Architecture Review (Mandatory)
Read and align with:
- docs/architecture/control-room-blueprint.md
- docs/architecture/threejs-boundaries.md
 
Confirm:
- Content-first + progressive enhancement remains intact
- Essential content is not gated behind canvas/JS
- Control Room narrative is reinforced (not decorative)
 
Stop condition:
- If the change conflicts with authoritative docs, stop and propose a doc/spec update before coding.
 
### Phase 2 — Design Review (Mandatory)
Read and align with:
- docs/design/design-system.md
- docs/design/art-direction.md
- docs/design/motion-system.md
- docs/design/ui-patterns.md
 
Confirm:
- Typography, spacing, and components reuse existing patterns
- Motion is intentional, cohesive, and respects reduced-motion
- No new competing visual system is introduced
 
### Phase 3 — Ownership Validation (Mandatory)
Identify which implementation domain(s) are involved:
- Astro routes/layout/components
- Three.js scene / WebGL lifecycle
- CI/QA/testing
- Fermyon/Spin packaging
 
If crossing domains, split tasks and keep boundaries clean.
 
### Phase 4 — Implementation
- Prefer minimal-change, incremental edits.
- Prefer Astro components and build-time rendering.
- Avoid adding dependencies unless required by acceptance criteria.
- If adding interactivity, isolate into small islands; keep core content server-rendered/static.
 
Three.js-specific requirements:
- Treat WebGL as progressive enhancement.
- Provide a fallback hero/state.
- Respect prefers-reduced-motion (disable/limit animation).
- Ensure cleanup/disposal and no runaway RAF loops.
 
### Phase 5 — Testing
Run the project’s standard checks first, then add targeted tests as needed:
- Build/type checks (Astro check/build if available)
- Route smoke checks (home, about, cv, portfolio, contact, blog if present)
- Interaction checks (keyboard nav, focus, skip links if present)
- Three.js lifecycle checks (mount/unmount, resize, reduced-motion)
 
### Phase 6 — Acceptance Review (Mandatory)
Review against Validation Gates. If any gate fails, fix or explicitly document a known limitation and why it’s acceptable (only if user approves).
 
## Validation Gates (Must Pass)
### Recruiter UX
- Primary pages communicate “who/what/how to contact” quickly
- Navigation is obvious; key CTAs visible
- No content requires WebGL/JS to be understood
 
### Accessibility
- Semantic headings and landmarks
- Keyboard navigation works end-to-end
- Focus states visible
- Canvas has non-canvas equivalent content and does not trap focus
 
### Astro-First Architecture
- Core content is static/server-rendered by Astro
- No unnecessary hydration for static content
- No SSR introduced unless explicitly approved
 
### Three.js Boundaries
- WebGL is optional enhancement
- Fallback exists and is usable
- Resource cleanup: dispose geometries/materials/textures; cancel RAF
- Avoid blocking main thread on initial load
 
### Reduced Motion
- Detect prefers-reduced-motion
- Disable or significantly reduce animations and camera motion
- No “essential” information conveyed only via motion
 
### Mobile Responsiveness
- Layout works at common breakpoints
- Tap targets are usable
- 3D canvas behavior doesn’t break scroll or cause overheating
 
### Performance Impact
- No large new dependencies without justification
- Bundle growth is justified and minimal
- Avoid large images/3D assets without lazy-loading strategy
- Avoid continuous render loops when scene is static/offscreen
 
## Output Contract
Every execution must produce:
- A concise implementation summary (what changed, where)
- A list of files changed (paths)
- The validation gates checklist result (pass/fail per gate)
- Any follow-ups (explicit, actionable)
- If blocked: exact reason + required decision
 
## Implementation Examples (at least 5)
1) Add a new route
- “Create `/portfolio/security` route and wire it into the header nav without changing design tokens.”
 
2) Refactor safely
- “Extract repeated layout sections into a shared Astro component while preserving HTML semantics and CSS behavior.”
 
3) Progressive enhancement for 3D
- “Add a Hero3D island that only loads on capable devices, with a static fallback and reduced-motion behavior.”
 
4) Accessibility fix
- “Fix heading order, add landmark regions, and ensure focus ring contrast meets the design system.”
 
5) Performance fix
- “Stop an unnecessary requestAnimationFrame loop when the scene is idle and dispose GPU resources on navigation.”
 
## Troubleshooting
- Build fails after content/route changes:
  - Verify route file naming, exports, and Astro config assumptions.
  - Confirm no mismatched imports across TS paths.
- 3D hero breaks on mobile:
  - Add capability checks, reduce DPR, throttle animations, or disable on low-end.
  - Ensure resize logic and CSS sizing are correct.
- Reduced motion not respected:
  - Verify preference detection and ensure animations are gated.
  - Provide a non-animated fallback state.
- Accessibility regressions:
  - Verify focus order, landmarks, and keyboard access.
  - Ensure canvas does not intercept scrolling/keys unexpectedly.
- Performance regressions:
  - Identify heavy JS islands and eliminate unnecessary hydration.
  - Avoid continuous rendering when not needed.
 
## Common Mistakes
- Implementing essential content inside the canvas with no equivalent HTML
- Introducing new UI patterns that conflict with the design system
- Adding dependencies for convenience without clear value
- Adding animation without reduced-motion support
- Creating route changes that hide key recruiter CTAs
- Leaving WebGL resources undisposed (memory leaks)
- Shipping a desktop-only experience that degrades recruiter UX
 
## Common Failure Scenarios (at least 5) + Required Response
1) Architecture conflict
- Symptom: requested change requires SSR or conflicts with docs/spec.md constraints.
- Response: stop; propose doc/spec update or alternative static approach.
 
2) Three.js becomes primary content
- Symptom: key messaging/CTAs only visible in 3D.
- Response: move essential content to HTML; keep 3D supporting.
 
3) Reduced motion ignored
- Symptom: camera drift/particles animate despite preference.
- Response: gate all motion; provide static scene or disable 3D.
 
4) Mobile usability regression
- Symptom: scroll jank, canvas steals touch, battery drain.
- Response: add mobile-specific limits, disable heavy effects, ensure fallback.
 
5) Performance regression from hydration/dependencies
- Symptom: large JS bundle, slow TTI, long tasks.
- Response: remove unnecessary hydration, lazy-load, cut dependencies, avoid loops.
 
6) Accessibility regression
- Symptom: keyboard can’t reach nav/CTAs; focus invisible.
- Response: fix semantics and focus styles; re-run accessibility gate review.
 
# Quick Start Prompt Template
- Task: <feature/bug/refactor>
- Target: <route/component/files>
- Constraints: <must keep content-first + progressive enhancement / no SSR unless approved / keep design tokens>
- Acceptance: <what must be true to call it done>
- Evidence: <error logs / screenshot / repro steps>
