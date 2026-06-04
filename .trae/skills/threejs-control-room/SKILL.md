---
name: threejs-control-room
description: "Use this skill when implementing or optimizing Three.js/WebGL Control Room scenes (scene architecture, camera behavior, animation systems, shaders/materials, particles, performance, cleanup) and integrating them into Astro. Do not use for content writing, governance/planning, deployment, Astro routing, SEO strategy, or architecture redesign."
compatibility: "Trae SOLO / Claude Code / Claude.ai. Node.js 22+. Runs read-only Node scripts from scripts/. May consult Three.js/pmndrs docs via MCP/web when APIs are uncertain."
metadata:
  version: "1.0.0"
  owner: "threejs"
  scope: "threejs-only"
  references: "references/*.md"
  scripts: "scripts/inspect-threejs-usage.mjs, scripts/validate-scene-budget.mjs"
  evals: "evals/trigger-evals.json, evals/output-evals.json"
---

# ThreeJS Control Room

## Activation Scope
Use this skill for:
- Three.js scene creation or refactors for the Control Room landing experience
- WebGL performance optimization (FPS stability, draw calls, memory, shader cost)
- Particle systems, line/flow visualizations, topology graphs, telemetry-style visuals
- Shaders/material tuning and maintainable shader organization
- Camera behavior, interaction patterns, and animation system design
- Astro + Three.js integration: progressive enhancement, lifecycle, cleanup, hydration boundaries
- Reduced-motion implementation for 3D
- Accessibility: non-canvas fallback, keyboard-safe overlays, no focus traps

Do not use this skill for:
- Copywriting, recruiter messaging, or content strategy
- Governance decisions (/plan, /spec, readiness, ownership conflicts)
- Deployment (Spin/Fermyon), CI pipelines
- Astro routing, content collections, site-wide SEO strategy
- Architecture redesign (violations of docs/spec.md or threejs boundaries)

## Required Inputs
Minimum:
- The request (create/optimize/debug) and target scene or component
- Expected behavior (what should be visible/interactive) and constraints (reduced motion, mobile)
- Any current errors, logs, screenshots, or reproduction steps

If performance work:
- Target device class (desktop, mobile, low-end)
- Current observed symptoms (jank, battery drain, crashes, blank canvas)

## Workflow
1) Classify request: scene build, optimization, bugfix, shader/material, camera/interaction, integration, accessibility, reduced motion.
2) Identify ownership: confirm the change is Three.js-layer work, not content/governance/deploy.
3) Load only required references (see Reference Loading).
4) If Three.js API uncertainty exists, apply docs freshness rules before coding.
5) Create an implementation plan with budgets and validation gates.
6) Implement incrementally; keep essential content outside canvas.
7) Validate performance:
   - run `node scripts/inspect-threejs-usage.mjs --verbose`
   - run `node scripts/validate-scene-budget.mjs --verbose`
8) Validate accessibility and reduced motion (non-canvas fallback, animation gating).
9) Validate Astro integration and cleanup correctness.
10) Produce an implementation report using the Output Contract.

## Decision Tree
- If the request is content strategy, recruiter copy, or narrative writing → route to portfolio-content-storytelling.
- If the request is governance/readiness/spec/ownership → STOP and route to portfolio-delivery-governance.
- If the request is Astro routing/pages/layouts/components not related to the 3D layer → route to astro-portfolio-implementation.
- If the request is deployment/Spin/Fermyon → route to fermyon-static-deployment.
- If the request implies architecture redesign or violates threejs boundaries → STOP and escalate to governance.
- If Three.js or shader API uncertainty exists → verify docs before coding.

## Stop Conditions (Non-Negotiable)
Stop and escalate if:
- Essential information is requested to be rendered only in canvas.
- Navigation/SEO-relevant content is requested inside the 3D layer.
- The change requires altering IA/content model or portfolio-wide architecture.
- Reduced motion or mobile requirements cannot be met with the proposed approach.
- You cannot verify a version-sensitive API and risk inventing behavior.

## Reference Loading
Load only what is needed:
- Scene design and lifecycle → `references/scene-architecture.md`
- Astro integration boundaries → `references/astro-integration.md`
- Budgets and constraints → `references/performance-budgets.md`
- Animation systems and hierarchy → `references/animation-patterns.md`
- Accessibility rules and fallbacks → `references/accessibility.md`
- Reduced motion patterns → `references/reduced-motion.md`
- Control Room narrative constraints → `references/control-room-narrative.md`
- Shaders/material guidance → `references/shaders-materials.md`
- Docs verification rules → `references/docs-freshness.md`

## Available Scripts
- `scripts/inspect-threejs-usage.mjs` — Locates Three.js-related code and summarizes usage.
- `scripts/validate-scene-budget.mjs` — Heuristic checks for budget risks (shaders/assets/loops).

Run from the skill root.

## Gotchas (Project-Specific)
- Recruiter comprehension matters more than visual complexity.
- No critical information inside canvas only; HTML must remain the primary layer.
- Motion is expected where it improves understanding; reduced motion is mandatory and must provide alternate behavior.
- Mobile experience is mandatory; degrade gracefully and disable 3D when needed.
- Avoid unnecessary shaders and excessive particle counts.
- Avoid uncontrolled render loops; pause when hidden; render-on-demand when feasible.
- Cleanup resources correctly (dispose geometries/materials/textures; cancel RAF; dispose renderer).
- Avoid hydrating scenes that add no narrative value.
- Do not introduce dashboard/HUD aesthetics; keep ambient editorial control-room metaphor.

## Validation Gates
Pass all applicable gates:
- Control Room narrative alignment (ambient, editorial; no dashboard widgets; content-first)
- Performance (FPS stability, low-end behavior, draw calls, memory)
- Accessibility (fallback content, keyboard-safe UI, no focus traps)
- Reduced motion (prefers-reduced-motion compliance; motion reduction strategies)
- Mobile responsiveness (touch/scroll stability; overheating avoidance; fallback)
- Memory usage (no leaks; proper disposal)
- Rendering efficiency (no unnecessary continuous loops; DPR sanity; asset discipline)
- Astro integration (progressive enhancement; hydration boundaries; lifecycle coordination)
- Cleanup correctness (unmount/route changes; tab hidden; resize handling)

## Definition of Done
Work is complete only when:
- Performance validation passes (or exceptions are documented with mitigation).
- Accessibility validation passes (fallback remains usable without WebGL/JS).
- Reduced motion validation passes (no continuous motion under reduced motion).
- Scene ownership remains respected (no content/SEO/navigation moved into canvas).
- Resources are cleaned up correctly.
- No documentation uncertainty remains unresolved for version-sensitive APIs.
- Risks and follow-up actions are documented.

## Failure Mode Analysis (at least 20)
Each failure: symptom → root cause → corrective action.

| # | Symptom | Root Cause | Corrective Action |
|---:|---|---|---|
| 1 | Blank canvas on load | WebGL unsupported or init error | Add capability check + fallback; surface error safely |
| 2 | Janky scroll on mobile | Canvas steals touch/scroll or high DPR | Disable pointer capture; lower DPR; consider disabling 3D |
| 3 | Battery drain | Continuous render loop with heavy scene | Render-on-demand; throttle; pause when hidden |
| 4 | Memory grows over navigation | Missing disposal on unmount | Dispose geometries/materials/textures; cancel RAF; dispose renderer |
| 5 | Reduced motion ignored | Animations not gated | Gate all motion; provide static scene state |
| 6 | Core messaging only in 3D | Content placed inside canvas | Move essentials to HTML; keep 3D ambient only |
| 7 | Too many draw calls | Excessive meshes/lines | Merge geometries; instancing; reduce detail |
| 8 | Shader compile stutter | Complex shaders or too many variants | Simplify shaders; cache materials; reduce defines |
| 9 | Overly “HUD” aesthetic | Misaligned art direction | Remove HUD frames; reduce glow; follow control-room narrative |
| 10 | Camera motion feels gimmicky | High amplitude movement | Reduce motion; make subtle; disable under reduced motion |
| 11 | Resize breaks aspect | Missing resize handler | Add resize observer; update camera and renderer sizes |
| 12 | Textures blurry or huge | Wrong resolution strategy | Use mipmaps; cap texture size; compress where possible |
| 13 | Particles overwhelm readability | Excessive count/brightness | Reduce counts; tone down; ensure HTML remains dominant |
| 14 | Input lag | Too much per-frame work | Precompute; avoid allocations; measure hotspots |
| 15 | WebGL context lost | GPU pressure | Reduce memory; handle context lost; auto fallback |
| 16 | Stutter on tab switch | Not pausing when hidden | Listen for visibility change; pause loop |
| 17 | Accessibility regression | Focus traps or missing fallback | Ensure overlays are keyboard accessible; keep fallback content |
| 18 | Animation is inconsistent | No timing hierarchy | Centralize timing; use motion system guidance; keep hierarchy |
| 19 | Scene not lazy-loaded | Heavy imports block LCP | Lazy-load 3D; use progressive enhancement |
| 20 | Integration leaks global listeners | Event listeners not removed | Remove listeners on cleanup; keep ownership localized |

## Output Contract
Every execution must produce:
- Affected files (relative paths)
- Scene ownership summary (what is in 3D vs HTML)
- References loaded (`references/*.md`)
- Docs fetched (URLs/MCP queries) and what was verified
- Performance impact (expected and observed)
- Accessibility impact (fallback/keyboard considerations)
- Reduced motion impact (what is disabled/reduced)
- Validation results (pass/fail per gate)
- Risks and trade-offs
- Follow-up actions

## Evals
- `evals/trigger-evals.json` tests activation precision.
- `evals/output-evals.json` tests output quality (scene creation, optimization, a11y, reduced motion, integration, perf).
