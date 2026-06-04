---
name: immersive-storytelling
description: "Use this skill when designing immersive portfolio journeys: landing/hero experiences, interactive narratives, reveal strategies, transition systems, spatial storytelling, and exploration flows. Owns narrative pacing and interaction design. Do not use for Astro/Three.js implementation, deployment, or governance."
compatibility: "Trae SOLO / Claude Code / Claude.ai. Produces design/interaction specs and acceptance criteria; may reference docs/* and existing UI patterns."
metadata:
  version: "1.0.0"
  owner: "experience-design"
  scope: "experience-specs"
  references: "references/*.md"
  evals: "evals/trigger-evals.json, evals/output-evals.json"
---

# Immersive Storytelling

## Activation Scope
Use this skill to define how the portfolio is experienced, discovered, and understood:
- Landing page/hero experience design (fast path + exploration path)
- Portfolio journeys (guided discovery, station progression, narrative arcs)
- Reveal strategy (what appears when, and why)
- Transition systems (between sections, states, routes, and “modes”)
- Spatial storytelling concepts (relationships, proximity, “system map” metaphors)
- Interaction design for exploration without confusing navigation

Do not use for:
- Implementing Astro routes/components/layout/CSS
- Implementing Three.js scenes or shaders
- Deployment, CI, or infrastructure workflows
- Architecture governance (/plan, /spec, ownership disputes)

## Required Inputs
- Target area (homepage, portfolio index, a project showcase, case study)
- Primary audience for the artifact (recruiter vs hiring manager vs technical peer)
- “Fast path” requirement (what must be understood within 30 seconds)
- Optional: inspiration references and constraints (mobile, reduced motion, no-WebGL)

## Workflow
1) Define the user journeys:
   - Recruiter fast path (CV/contact/summary)
   - Exploration path (interactive discovery)
2) Define the narrative arc:
   - entry state → progression → climax/proof → conversion (contact/CV)
3) Define interaction and reveal strategy:
   - triggers (scroll, hover, focus, click, route transition)
   - what changes (content emphasis, environment feedback, state)
4) Define transition system requirements:
   - timing/easing tiers
   - when transitions must be instant (no delays)
5) Define accessibility and degradation:
   - reduced-motion alternate behavior
   - non-WebGL fallback behavior
   - keyboard and touch interaction model
6) Produce acceptance criteria and handoff:
   - route implementation to astro-portfolio-implementation
   - scene implementation to threejs-control-room
   - motion tokens/patterns to motion-design-system
   - perf gates to immersive-performance-governance

## Validation Gates
- Narrative clarity: every motion supports a story or comprehension goal
- Recruiter fast path: critical content remains obvious and reachable immediately
- Discoverability: exploration rewards users without hiding basics
- Accessibility: reduced motion + keyboard + non-WebGL fallback remain usable

## Output Contract
Every execution must produce:
- Journey map (fast path + exploration path)
- State model (modes/stations/sections and transitions)
- Reveal strategy (triggers and rules)
- Motion intent list (why each key motion exists)
- Degradation rules (reduced motion + non-WebGL + mobile simplifications)
- Handoff plan (which owner skill implements what)

