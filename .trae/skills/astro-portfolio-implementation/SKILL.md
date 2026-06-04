---
name: astro-portfolio-implementation
description: "Use this skill when implementing Astro pages, routes, components, islands, content collections, navigation, SEO metadata, accessibility fixes, performance refactors, or static site validation. Do not use for copywriting/recruiter messaging, governance/planning, deployment, architecture redesign, or Three.js scene implementation."
compatibility: "Trae SOLO / Claude Code / Claude.ai. Node.js 22+. Assumes local Astro project; may consult official Astro docs via MCP/web when APIs are uncertain."
metadata:
  version: "1.0.0"
  owner: "astro-implementation"
  scope: "astro-only"
  evals: "evals/trigger-evals.json, evals/output-evals.json"
  scripts: "scripts/validate-astro-project.mjs, scripts/check-static-output.mjs"
---

# Astro Portfolio Implementation

## Activation Scope
Use this skill when the user intent is to implement or modify Astro-specific portfolio functionality:
- Build Astro page or route (`src/pages/**`)
- Implement Astro component or layout (`src/components/**`, `src/layouts/**`)
- Add or adjust Astro islands/hydration strategy (only when necessary)
- Add or evolve Astro content collections (when used/introduced)
- Improve navigation structure implementation (not IA redesign)
- Add/fix SEO metadata and accessibility behavior
- Refactor for performance, reduce client JS, improve static output reliability
- Validate build output and static hosting assumptions

Do not activate for:
- Copywriting, recruiter messaging, portfolio narrative strategy
- Governance decisions, plan/spec authoring, agent routing
- Spin/Fermyon deployment workflows
- Architecture redesign or changes to IA/content model
- Three.js scene implementation or creative direction

## Required Inputs
Minimum:
- Requested change and target area (route/component/layout)
- Expected behavior and acceptance criteria (or confirm missing)
- Constraints (content-first, reduced motion, a11y, SEO, performance, recruiter fast path)

If debugging:
- Exact failing command output
- Steps to reproduce

## Workflow (Implementation Loop)
1) Classify request (page/route, component/layout, island, collections, SEO/a11y, performance, validation).
2) Inspect local project state first (package.json, astro config, src structure, existing patterns).
3) Load only the reference(s) needed for this request (see Reference Loading).
4) If any Astro API/config is unfamiliar or version-sensitive, verify before coding (see Docs Freshness).
5) Plan the implementation in small steps with clear acceptance criteria.
6) Implement using existing project conventions and minimal new dependencies.
7) Run validation scripts:
   - `node scripts/validate-astro-project.mjs --verbose`
   - `node scripts/check-static-output.mjs --path dist --verbose` (after build)
8) Fix failures; if blocked by non-Astro ownership, stop and route away.
9) Report results using the Output Contract.

## Decision Tree
If the request implies:
- Architecture conflict (SSR introduction, essential content gated behind JS/islands, IA/content-model changes) → STOP and route to portfolio-delivery-governance.
- Content strategy or recruiter messaging request → route to portfolio-content-storytelling.
- Three.js scene/visual WebGL work → route to threejs-control-room.
- Deployment/Spin/Fermyon workflow → route to fermyon-static-deployment.
- Pure design critique/polish request → route to visual-design-critic.

If Astro API/config uncertainty exists:
- Inspect local project usage and version.
- Consult `references/astro-docs-freshness.md`.
- Fetch official Astro docs (MCP Astro docs first; web only if needed).
- Then implement.

If validation commands are unclear:
- Infer from `package.json` scripts (`pnpm run check/build/test`).
- Report any uncertainty explicitly; do not invent commands.

## Stop Conditions
Stop implementation and escalate when:
- The change requires altering IA/content model (not just implementing existing IA).
- The change requires architecture redesign or violates project constraints in docs/spec.md.
- The change requires Three.js scene changes beyond Astro integration boundaries.
- Acceptance criteria are missing and the scope is non-trivial.
- Validation strategy is missing for risky changes (routing, SEO, hydration, collections).

## Reference Loading
Load only what you need:
- Project conventions → `references/astro-project-conventions.md`
- Routing/pages concerns → `references/astro-routing-and-pages.md`
- Components/layouts/islands → `references/astro-components-and-islands.md`
- Content collections → `references/astro-content-collections.md`
- SEO + accessibility → `references/astro-seo-accessibility.md`
- Performance/hydration → `references/astro-performance.md`
- Testing/validation workflow → `references/astro-testing-validation.md`
- Docs freshness / verification rules → `references/astro-docs-freshness.md`

## Available Scripts
- `scripts/validate-astro-project.mjs` — Validates repository structure and Astro presence (read-only).
- `scripts/check-static-output.mjs` — Validates `dist/` static output (read-only).

Run from the skill root.

## Validation Gates
Pass all applicable gates for the change:
- Architecture alignment (content-first + progressive enhancement; no essential content hidden behind JS/WebGL)
- Design alignment (do not invent a new visual system; follow project tokens/patterns)
- Routing correctness (links resolve; no broken routes)
- Accessibility (semantic headings/landmarks, keyboard/focus, reduced motion respected)
- SEO (titles/descriptions/OG basics; canonical URLs if used; no indexability regressions)
- Motion quality (transitions/microinteractions considered when they improve understanding; no motion that blocks access)
- Performance (keep client JS intentional; avoid unnecessary islands; avoid large deps)
- Mobile responsiveness (layout and nav work; no hover-only critical UI)
- Static output (build produces `dist/` with `index.html` and assets)
- Hydration strategy (only hydrate when necessary; isolate and justify islands)
- Content collection safety (schema consistency; no breaking content shape without escalation)
- Docs freshness (when version-sensitive APIs were involved, record what was verified)

## Definition of Done
Implementation is done only when:
- Validation gates pass for the affected area.
- Scripts pass, or failures are explicitly documented with risk and follow-up.
- Any uncertain Astro APIs/config were verified against official docs.
- Affected files are listed.
- References loaded and docs fetched (if any) are reported.
- No ownership boundary is violated.

## Output Contract
Every run must produce:
- Affected files (relative paths)
- Implementation summary (what changed and why)
- References loaded (which `references/*.md` were used)
- Docs fetched (URLs or MCP queries) if any, and what was verified
- Commands run (build/check/test/script invocations)
- Validation results (pass/fail per gate)
- Accessibility impact (what changed, what was checked)
- SEO impact (what changed, what was checked)
- Performance impact (hydration changes, dependency changes)
- Risks and trade-offs
- Follow-up actions (if any)

## Evals
Use:
- `evals/trigger-evals.json` to test description triggering precision.
- `evals/output-evals.json` to test output quality expectations (page/component/island/SEO/a11y/perf).
