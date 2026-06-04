---
name: "portfolio-delivery-governance"
description: "Use this skill when governing portfolio delivery readiness and agent routing (start-of-work checks, plan/spec/tasks review, ownership validation, go/no-go decisions). Do not use to implement features."
compatibility:
  platforms:
    - "Trae SOLO"
    - "Claude Code"
    - "Claude.ai"
    - "Agent Skills (future)"
  project_types:
    - "Astro + Three.js portfolios"
    - "Multi-agent delivery workflows"
  languages:
    - "English"
metadata:
  version: "1.0.0"
  owner: "governance"
  intent: "orchestration-decision-validation"
  tags:
    - "governance"
    - "orchestration"
    - "routing"
    - "planning"
    - "specification"
    - "validation"
    - "stop-conditions"
  authoritative_refs:
    - "references/spec.md"
    - "references/tasks.md"
    - "references/checklist.md"
    - "references/master-implementation-plan-hybrid-cloud-control-room.md"
    - "references/implementation-review.md"
    - "references/control-room-blueprint.md"
  hard_rules:
    - "Does not implement features"
    - "Stops work when artifacts/ownership/validation are missing"
    - "Routes work to the correct specialist agent"
    - "Prevents architecture drift"
    - "Prevents work outside ownership boundaries"
---

# Portfolio Delivery Governance

## Purpose
Act as the project’s governance and delivery operating system:
- Decide whether work should proceed or stop.
- Detect missing artifacts (architecture/design/spec/tasks/validation).
- Assign ownership to the correct specialist agent.
- Trigger escalation to /plan or /spec when needed.
- Produce a governance report suitable for Trae SOLO and other agent runtimes.

This skill must not implement features or write code. It only governs delivery.

## Scope
In scope:
- Request classification and readiness review
- Artifact completeness and consistency checks
- Dependency and prerequisite validation
- Ownership validation and routing
- Acceptance and validation strategy confirmation
- Escalation decisions (/plan, /spec, stop)

Out of scope:
- Implementing Astro/Three.js/UI code
- Writing CV/About/portfolio copy
- Running deployment actions (except deciding who should)
- Editing authoritative project docs (unless explicitly asked to update specs)

## When To Use
Use this skill when the user asks:
- “Can we start building?”
- “Implement this feature.”
- “Which agent should do this?”
- “Review this plan.”
- “Create a specification.”
- “Validate this task.”
- “Is architecture/design/spec ready?”
- “Are we ready to merge/deploy?”

Governance-related trigger phrases:
- “go/no-go”, “readiness”, “governance”, “gates”, “blocked”, “stop”, “escalate”

Planning-related trigger phrases:
- “/plan”, “rethink architecture”, “major redesign”, “new direction”

Architecture-related trigger phrases:
- “architecture”, “boundaries”, “control room blueprint”, “threejs boundaries”

## When NOT To Use
Do not use this skill when the user already provided:
- A complete, approved spec + tasks + checklist and explicitly requests implementation by a specific owner agent.
Do not use this skill for:
- Writing or editing content narrative (route to portfolio-content-storytelling)
- Visual critique and CSS polish (route to visual-design-critic)
- Astro implementation (route to astro-portfolio-implementation)
- Three.js scene implementation (route to threejs-control-room)
- CI creation (route to devsecops-ci-builder)
- Fermyon deployment packaging (route to fermyon-static-deployment)

## Required Inputs
Minimum:
- The request (feature/bug/refactor/content/design/deploy/governance)
- Target scope (page/route/component/scene/CI/deploy/doc)
- Intended outcome and acceptance criteria (or confirm it is missing)

If governance is asked to validate readiness:
- Links/paths to spec, tasks, and checklist artifacts (or confirm which phase)
- Any constraints (no SSR unless approved, content-first, performance budget, reduced motion)

## Governance Workflow
Follow phases in order. Do not skip stop conditions.

### Phase 0 — Request Classification
Classify into exactly one primary category:
- Planning (/plan): architecture or major direction decisions
- Specification (/spec): requirements, acceptance criteria, tasks definition
- Implementation: code changes by an owner agent
- Validation/QA: testing, accessibility, performance, reviewer checks
- Deployment: packaging and release steps
- Content: recruiter narrative and copy
- Design: visual review and consistency

If category is ambiguous, ask for clarification before proceeding.

### Phase 1 — Artifact Review
Consult authoritative references (progressive disclosure):
- references/spec.md: requirements and acceptance criteria
- references/tasks.md: actionable work breakdown
- references/checklist.md: validation and quality gates
- references/master-implementation-plan-hybrid-cloud-control-room.md: phase plan and sequencing
- references/implementation-review.md: design/implementation review criteria
- references/control-room-blueprint.md: narrative/architecture alignment constraints

Determine existence and freshness:
- Exists? yes/no
- Is it the correct phase? yes/no
- Is it internally consistent? yes/no

### Phase 2 — Dependency Validation
Verify prerequisites for the requested category:
- For implementation: spec + tasks + validation strategy must exist
- For deployment: build artifacts + deployment docs + secrets handling strategy must exist
- For design changes: design system guidance must exist
- For content changes: IA + content model alignment must exist

Identify dependency gaps:
- Missing docs, missing inputs, missing environment assumptions, missing constraints

### Phase 3 — Ownership Validation
Assign exactly one primary owner agent. Secondary agents are allowed only if explicitly coordinated.

Confirm:
- Owner agent exists and matches domain
- Request stays within owner boundaries
- No ownership conflict with other agents

Stop condition:
- If ownership is unclear or conflicting, stop implementation and return a routing recommendation.

### Phase 4 — Execution Readiness Review
Decide go/no-go based on Decision Tree and Validation Gates.

Output one of:
- GO: proceed with named owner agent and explicit next action
- NO-GO: stop and produce missing artifacts + escalation recommendation
- CONDITIONAL GO: proceed only after specific prerequisites are created/updated

### Phase 5 — Acceptance Review
Confirm:
- Acceptance criteria exist and are measurable
- Validation strategy exists and is appropriate
- Risks are understood (architecture drift, performance regressions, a11y)

If acceptance criteria are missing or vague:
- Escalate to /spec.

### Phase 6 — Governance Report
Always produce the Output Contract fields and include severity classification for blockers.

## Decision Tree (Stop Conditions)
Answer in order:
1) Does architecture exist and is it aligned with the request?
2) Does design guidance exist for the affected area?
3) Does a specification exist for this change?
4) Does ownership exist (single primary owner agent)?
5) Does a validation strategy exist (checklist/tests/QA plan)?
6) Do acceptance criteria exist and are they testable?
7) Are dependencies satisfied (tools, env, docs, assets)?

If any answer is NO:
- STOP.
- Recommend the missing artifact(s).
- Provide the correct escalation (/plan or /spec) or routing.

Escalation triggers:
- Major architecture changes → return to /plan
- Major scope changes or unclear requirements → return to /spec
- Agent ownership conflicts → stop implementation and resolve ownership
- Undefined validation → stop implementation and define validation strategy

## Escalation Rules
- Return to /plan when:
  - The request changes the portfolio architecture principles (content-first, motion-first, Astro-first, boundaries).
  - The request changes the Control Room narrative structure across the site.
  - The request introduces new platform constraints (SSR, backend runtime) without approval.
- Return to /spec when:
  - Acceptance criteria are missing, vague, or non-testable.
  - Tasks are missing or not actionable.
  - Scope changed materially from existing spec/tasks.
- Stop implementation when:
  - Ownership is unclear or multiple agents would edit the same area without coordination.
  - Validation strategy is absent.
  - The request conflicts with authoritative references and no decision has been made.

## Ownership Matrix
Single primary owner per request:
- portfolio-delivery-governance: governance, orchestration decisions, stop/go, routing, report
- immersive-storytelling: experience/journey design, reveal strategy, narrative pacing
- motion-design-system: motion patterns, timing/easing system, interaction states, reduced-motion alternates
- recruiter-portfolio-ux: recruiter fast path evaluation + motion evaluation (discoverability, CTA clarity)
- astro-portfolio-implementation: Astro routes/components/layouts/content wiring (implementation)
- portfolio-control-room-implementation: Control Room feature work across pages/components
- threejs-control-room: Three.js/WebGL scene, lifecycle, performance, fallback behavior
- immersive-performance-governance: performance budgets, adaptive quality, heavy-interaction guardrails
- portfolio-content-storytelling: CV/About content structure and truthfulness enforcement
- fermyon-static-deployment: Spin packaging, Fermyon deploy workflows, token handling guidance

## Validation Gates
Readiness gates (must be explicitly confirmed):
- Architecture alignment: request fits existing architecture and boundaries
- Design alignment: request fits design guidance for affected areas
- Ownership alignment: one owner agent, no conflicts
- Dependency readiness: tools/assets/docs available
- Acceptance criteria existence: measurable, testable
- Validation strategy existence: checklist/tests/QA defined

## Definition Of Done
Work may proceed only when:
- Architecture exists and aligns with the request
- Specification exists and is current
- Ownership exists (single primary owner) and boundaries are respected
- Validation exists (checklist/tests/QA plan)
- Acceptance criteria exist and are testable
- Dependencies are satisfied

## Severity Classification
Critical (stop immediately):
- Architecture missing or architecture conflict without decision
- Specification missing for implementation work
- Ownership conflict or unclear ownership
- Validation missing or undefined

Major (block until resolved, but not necessarily /plan):
- Dependency gaps (assets/tools/env missing)
- Unclear or non-testable acceptance criteria
- Incomplete tasks (non-actionable or missing sequencing)

Minor (can proceed with caution or document as follow-up):
- Documentation improvements
- Workflow optimizations
- Formatting/consistency fixes in tasks/spec

## Failure Mode Analysis (at least 15)
Each failure includes symptom → root cause → corrective action.

| # | Symptom | Root Cause | Corrective Action |
|---:|---|---|---|
| 1 | Implementation starts with no spec | Governance skipped Phase 1 | Stop; create /spec artifact; define acceptance criteria |
| 2 | Two agents edit same area | No ownership validation | Stop; assign single owner; coordinate secondary work explicitly |
| 3 | Architecture drift | Changes made without blueprint/boundaries review | Stop; return to /plan; update architecture docs before code |
| 4 | “Done” is subjective | Missing acceptance criteria | Return to /spec; add measurable acceptance criteria |
| 5 | QA happens too late | Validation strategy missing | Stop; define validation gates and checklist usage first |
| 6 | Scope creep in implementation | Tasks not bounded | Return to /spec; rewrite tasks with in/out-of-scope |
| 7 | Conflicting design decisions | Design guidance not consulted | Pause; consult implementation-review + design system; resolve |
| 8 | Content + implementation conflated | No classification | Reclassify; route content to storytelling skill; code to builder |
| 9 | CI failures discovered at merge | CI ownership not engaged | Stop; define CI checks and validation strategy before continuing |
| 10 | Deployment blocked by missing token strategy | No deploy prerequisites | Route to fermyon-static-deployment; document secrets handling |
| 11 | Three.js breaks accessibility | Boundaries ignored | Stop; enforce boundaries and fallback; route to threejs-control-room |
| 12 | Performance regressions | No perf gate | Add perf checks to validation; require reduced-motion/mobile checks |
| 13 | Tasks exist but aren’t actionable | Task quality poor | Return to /spec; rewrite tasks with clear outputs and gates |
| 14 | “Plan” exists but not authoritative | Wrong doc referenced | Stop; point to references/master plan/spec/tasks/checklist |
| 15 | Review happens without evidence | No governance report contract | Enforce Output Contract; require explicit readiness status |
| 16 | Agent used outside boundaries | Orchestration failure | Stop; re-route to correct owner; document boundary in report |
| 17 | Validation exists but mismatched | Wrong checklist for phase | Stop; align validation to requested scope and phase |

## Output Contract
Always output:
- Governance Assessment (summary of what was evaluated)
- Readiness Status (GO / NO-GO / CONDITIONAL GO)
- Missing Artifacts (explicit list)
- Risks (explicit list with severity)
- Assigned Owner (single primary owner agent)
- Next Action (concrete, one step)
- Escalation Recommendation (if required: /plan, /spec, or stop)

## Examples
Trigger examples:
- “Implement this feature.”
- “Which agent should do this?”
- “Can we start building?”
- “Review this plan.”
- “Create a specification.”
- “Validate this task.”

Governance routing examples:
- “Add a Three.js hero with fallback” → threejs-control-room (after spec+validation confirmed)
- “Add a new Astro route for portfolio/security” → astro-portfolio-implementation (after spec+tasks)
- “Define motion tokens + transition patterns” → motion-design-system
- “Design the home journey and reveal strategy” → immersive-storytelling
- “Evaluate recruiter flow + motion discoverability” → recruiter-portfolio-ux
- “Prepare Fermyon deploy workflow” → fermyon-static-deployment

## Troubleshooting
- Too many blockers reported:
  - Re-check classification; ensure you’re not applying implementation gates to content-only work.
- User insists on immediate implementation without spec:
  - Enforce stop condition; propose minimal /spec with acceptance criteria and validation.
- Ownership dispute:
  - Stop; present Ownership Matrix; select single primary owner; define handoff boundaries.
- Docs referenced don’t match repo structure:
  - Use skill references paths as the stable interface; update those references to point to the correct authoritative docs.
