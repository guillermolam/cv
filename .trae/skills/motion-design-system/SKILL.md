---
name: motion-design-system
description: "Use this skill when defining or reviewing the portfolio’s motion system: timing/easing, microinteractions, transitions, reveal patterns, animated state changes, and interaction feedback across UI and 3D. Owns motion consistency and reduced-motion alternatives. Do not use for narrative strategy, deployment, or unrelated refactors."
compatibility: "Trae SOLO / Claude Code / Claude.ai. Produces motion tokens/patterns and acceptance criteria; references docs/design/motion-system.md and existing components."
metadata:
  version: "1.0.0"
  owner: "design-system"
  scope: "motion-system"
  references: "references/*.md"
  evals: "evals/trigger-evals.json, evals/output-evals.json"
---

# Motion Design System

## Activation Scope
Use this skill for:
- Timing and easing system definition (tiers and usage rules)
- Microinteractions (hover/focus/press/selection feedback)
- Transitions (route/section/state changes)
- Reveal patterns (how content is progressively disclosed)
- Interaction state animations (loading/success/error/system state)
- Reduced-motion alternate behavior design (not just “slower”)
- Motion audits for cohesion and “premium” feel

Do not use this skill for:
- Writing content copy or portfolio narrative positioning
- Implementing Astro components or Three.js scenes (route to implementation owners)
- Performance profiling deep dives (route to immersive-performance-governance)

## Required Inputs
- Target surface (homepage, nav, rail, station chips, portfolio pages, 3D overlays)
- Interaction states and user goals (what needs to be communicated)
- Constraints (reduced motion, mobile, non-WebGL fallback)

## Workflow
1) Inventory motion surfaces (UI + overlays + scene-adjacent).
2) Define motion tokens:
   - durations by tier
   - easing curves by intent
   - distance/opacity/scale bounds
3) Define patterns:
   - hover/focus/press
   - reveal/enter/exit
   - page/route transitions
   - state changes and feedback
4) Define reduced-motion alternates per pattern.
5) Define implementation guidance:
   - CSS variables and preferred primitives
   - when to use JS-driven motion vs CSS-only
6) Produce acceptance criteria and handoff to implementers.

## Validation Gates
- Cohesion: patterns share timing/easing vocabulary
- Intent: each motion communicates something (not decoration)
- Accessibility: reduced motion is meaningful and preserves usability
- Recruiter UX: motion does not add friction to CV/contact path

## Output Contract
Every execution must produce:
- Motion token table (timing tiers + easing)
- Pattern catalog (what/when/why)
- Reduced-motion map (pattern → alternate)
- Implementation notes (CSS vars, primitives, boundaries)
- Risks and follow-up actions

