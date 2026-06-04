---
version: "2.0"
title: "Work Plan — Skill System Refactor (Motion-First)"
status: "active"
lastUpdated: "2026-06-04"
---

# Work Plan — Skill System Refactor (Motion-First)

## Goals
- Refactor the project’s skill system and rules to support an immersive, motion-first portfolio experience.
- Keep accessibility, recruiter outcomes, and performance as non-negotiable constraints.
- Make skills motion-aware by default, with progressive disclosure and clear stop conditions.

## Task List
### A) Governance + Source of Truth Alignment
- Create/maintain `docs/spec.md`, `docs/tasks.md`, `docs/checklist.md` as the canonical entry points.
- Update `AGENTS.md` to align with motion-first principles and ensure it references the canonical docs.

### B) Global Rules Refactor
- Add a new global rule: motion-first baseline with narrative justification and reduced-motion requirements.
- Update existing rules that over-index on “static-first” without recognizing motion-first requirements:
  - `.trae/rules/astro architecture.md`
  - `.trae/rules/performance budget.md`
  - `.trae/rules/recruiter first.md`
  - `.trae/rules/design system.md` (ensure motion-system usage is mandatory where relevant)

### C) Architecture + Design Guidance Updates
- Update `docs/design/motion-system.md` to define a cohesive motion system optimized for immersive storytelling.
- Update `docs/architecture/control-room-blueprint.md` and related architecture docs to:
  - clarify “fast path” recruiter flow vs “exploration path”
  - define motion/transitions as first-class UX
  - reaffirm progressive enhancement + fallback constraints

### D) Skill System Refactor (Agent Skills)
- Update existing skills:
  - `astro-portfolio-implementation`: treat motion/transitions as baseline; add motion validation gates.
  - `threejs-control-room`: elevate cinematic transitions and spatial storytelling with performance governance.
  - `portfolio-control-room-implementation`: incorporate motion-first and experience quality gates.
  - `portfolio-content-storytelling`: clarify narrative responsibilities and interaction/reveal strategy collaboration.
  - `fermyon-static-deployment`: no changes unless deployment UX explicitly depends on motion (likely none).
- Create new skills:
  - `immersive-storytelling`
  - `motion-design-system`
  - `immersive-performance-governance`
  - `recruiter-portfolio-ux`

### E) Evals + QA Upgrades
- Add trigger evals for new skills.
- Add output evals that validate:
  - reduced-motion handling
  - non-WebGL fallback presence
  - recruiter fast path preserved
  - motion justification (“why is this moving?”)
  - performance safeguards (adaptive quality, cleanup)

