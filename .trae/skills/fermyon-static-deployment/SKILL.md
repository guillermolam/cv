---
name: fermyon-static-deployment
description: Use this skill when you need to deploy an Astro static site to Fermyon Cloud using Spin, validate release readiness (build/artifacts/manifest/routing/assets), troubleshoot deployment failures, or plan/execute rollbacks. This skill owns deployment workflow, release workflow, deployment validation, smoke testing, and deployment troubleshooting for Spin-based static hosting. It does not own Astro/Three.js implementation, portfolio content, or architecture planning.
compatibility: Runs in a local repo with Node.js for bundled scripts; Spin and Fermyon Cloud CLI access required for actual deployments; network access required to consult official Spin/Fermyon docs when uncertain.
---

# Fermyon Static Deployment

## Scope and ownership

This skill owns:
- Deploying Astro `dist/` output to Fermyon Cloud using Spin
- Reviewing and validating `spin.toml` for static hosting assumptions
- Release readiness checks and production validation (smoke tests, routing, assets)
- Deployment troubleshooting and rollback planning/execution guidance

This skill does not own:
- Astro implementation or routing changes (route to `astro-portfolio-implementation`)
- Three.js implementation/performance (route to `threejs-control-room`)
- Recruiter storytelling, portfolio narrative, or content strategy (route to `portfolio-content-storytelling`)
- Architecture governance/spec changes (route to `portfolio-delivery-governance`)

## Triggers (activate this skill when)
- Deploy to Fermyon / Fermyon Cloud / Spin deployment
- Static hosting on Spin (static file server)
- `spin.toml` review, manifest validation, static assets packaging
- Release readiness, production validation, smoke testing, rollback planning
- Deployment failures, 404/asset issues after deploy, routing failures, caching issues

## Non-triggers (do not activate this skill when)
- Implementing or refactoring Astro pages/components/layouts/content collections
- Implementing or optimizing Three.js scenes
- Writing recruiter copy or content strategy
- Deciding project architecture, IA, or spec scope

## Progressive disclosure map

Start here (always):
- Follow the workflow in this file
- Run the scripts in **Scripts** to get machine-readable diagnostics

Load references only when needed:
- Project deployment truth: [references/project-deployment-inventory.md](references/project-deployment-inventory.md)
- Project vs Spin mapping: [references/project-pattern-mapping.md](references/project-pattern-mapping.md)
- Spin patterns and examples: [references/spin-pattern-catalog.md](references/spin-pattern-catalog.md), [references/example-catalog.md](references/example-catalog.md)
- Spin pitfalls: [references/anti-patterns.md](references/anti-patterns.md)
- Fermyon Cloud CLI: [references/fermyon-cloud-cli.md](references/fermyon-cloud-cli.md)
- Fermyon Cloud domains: [references/fermyon-cloud-domains.md](references/fermyon-cloud-domains.md)
- Build/release flow: [references/spin-workflow.md](references/spin-workflow.md)
- Fermyon specifics: [references/fermyon-deployment.md](references/fermyon-deployment.md)
- Static hosting pitfalls: [references/static-site-hosting.md](references/static-site-hosting.md)
- Release and verification: [references/release-process.md](references/release-process.md)
- Rollback planning: [references/rollback-procedures.md](references/rollback-procedures.md)
- Validation checklist: [references/deployment-validation.md](references/deployment-validation.md)
- Failure modes: [references/troubleshooting.md](references/troubleshooting.md)
- Security gates: [references/security-checks.md](references/security-checks.md)
- Docs freshness and anti-hallucination rules: [references/docs-freshness.md](references/docs-freshness.md)

## Decision tree (routing)

If the primary blocker is:
- Missing/incorrect requirements/spec/ownership boundary → route to `portfolio-delivery-governance`
- Astro build output, routes, base path, assets emitted incorrectly → route to `astro-portfolio-implementation`
- WebGL/Three.js runtime failures impacting build or homepage behavior → route to `threejs-control-room`
- Content copy/portfolio structure → route to `portfolio-content-storytelling`
- Spin/Fermyon uncertainty about manifest fields/flags/hosting behavior → consult docs per [references/docs-freshness.md](references/docs-freshness.md) before proceeding

## Repository evidence rules (mandatory)

Before proposing any of the following changes:
- `spin.toml` changes
- routing changes (rewrites, fallback behavior, base paths)
- deployment changes (new workflow, new auth method, new deploy commands)
- hosting changes (SPA assumptions, caching assumptions)
- release changes (versioning, rollback strategy, validation gates)

The agent must consult, in this order:
1. [references/project-deployment-inventory.md](references/project-deployment-inventory.md)
2. [references/project-pattern-mapping.md](references/project-pattern-mapping.md)
3. [references/spin-pattern-catalog.md](references/spin-pattern-catalog.md)
4. [references/example-catalog.md](references/example-catalog.md)
5. Official docs (Spin, then Fermyon) per [references/docs-freshness.md](references/docs-freshness.md)

If any required behavior remains uncertain after these sources:
- STOP
- document what is unknown
- fetch docs or request user confirmation

## Knowledge source priority

Use this priority order when reasoning:
1. Project repository files (actual configs, workflows, build outputs)
2. Project deployment inventory (this skill’s repo-derived inventory)
3. Project pattern mapping (gap assessment vs Spin patterns)
4. Official Spin examples (spinframework/spin templates/tests)
5. Official Spin docs
6. Official Fermyon docs
7. Model memory (last resort)

## Workflow (deploy + validate + operate)

Follow this sequence. Do not skip validation gates.

1. Classify the request
   - Target: Fermyon Cloud (Spin)
   - Artifact: determine which repo artifact is being deployed (see inventory)
   - Operation type: deploy / validate / troubleshoot / rollback

2. Inspect project state (read-only)
   - Run:
     - `node scripts/inspect-spin-project.mjs --verbose`
   - Read:
     - [references/project-deployment-inventory.md](references/project-deployment-inventory.md)
     - [references/project-pattern-mapping.md](references/project-pattern-mapping.md)
   - If `spin.toml` is missing, stop and confirm whether Spin deployment is in scope (do not invent a manifest).

3. Load required references (minimum)
   - Always load: [references/spin-workflow.md](references/spin-workflow.md)
   - If troubleshooting/rollback/security is requested, load the matching reference file(s).

4. Docs freshness gate (anti-hallucination)
   - If any Spin CLI flag, manifest field, or Fermyon deploy behavior is uncertain, consult:
     - [references/docs-freshness.md](references/docs-freshness.md)
   - Do not invent manifest fields or CLI flags.

5. Validate build artifacts (static hosting gate)
   - Run:
     - `node scripts/validate-static-build.mjs --verbose`
   - If it fails, stop and route to Astro implementation (unless it is purely missing build execution).

6. Validate Spin manifest (hosting gate)
   - Run:
     - `node scripts/validate-spin-manifest.mjs --verbose`
   - If it flags structural issues, fix `spin.toml` (or consult docs if uncertain).

7. Create deployment plan
   - Include: build command, artifact path, Spin build/deploy commands, expected URL, smoke tests, rollback plan, and security checks.
   - Use [references/release-process.md](references/release-process.md) and [references/security-checks.md](references/security-checks.md).

8. Execute deployment workflow
   - Run the agreed Spin/Fermyon commands.
   - For Fermyon Cloud, prefer `spin cloud` commands that are confirmed via:
     - local `spin cloud --help`
     - [references/fermyon-cloud-cli.md](references/fermyon-cloud-cli.md)
   - Capture exact commands executed and outputs (do not log secrets).

9. Run smoke tests + production validation
   - Use [references/deployment-validation.md](references/deployment-validation.md).
   - Validate availability, routing, assets, and error pages.

10. Produce a deployment report (output contract)
   - Use the template in **Output contract** below.

## Scripts

All scripts are read-only, idempotent, non-interactive, and emit JSON to stdout.

- `scripts/inspect-spin-project.mjs`
  - Purpose: summarize Spin + Astro static deployment readiness
  - Run: `node scripts/inspect-spin-project.mjs --help`
- `scripts/validate-static-build.mjs`
  - Purpose: validate `dist/` for static hosting and common SPA pitfalls
  - Run: `node scripts/validate-static-build.mjs --help`
- `scripts/validate-spin-manifest.mjs`
  - Purpose: validate `spin.toml` structure and static hosting assumptions
  - Run: `node scripts/validate-spin-manifest.mjs --help`

## Validation gates (must pass before calling a release “done”)

- Build validation (static artifacts exist and are coherent)
- Manifest validation (Spin config structurally sane for static hosting)
- Deployment validation (reachable, correct status codes, correct routes)
- Routing validation (deep links behave as expected for static hosting)
- Asset validation (hashed assets load, correct content-type)
- Availability validation (stable under refresh)
- Release validation (post-deploy checks pass)
- Rollback readiness (documented and actionable)
- Security review (no secrets exposure, safe permissions, public surface reviewed)

## Definition of done

Deployment work is complete only when:
- Build validation passes
- Manifest validation passes
- Smoke tests pass
- Deployment validation passes
- Routing validation passes
- Rollback plan exists (even if not executed)
- Risks are documented
- A release report is produced

## Output contract (required report)

Produce a report in this shape (markdown is fine; keep it scannable):

```markdown
# Fermyon Deployment Report

## Deployment summary
- Target: Fermyon Cloud
- App: <spin app name>
- Version/tag: <version>
- URL(s): <prod url>, <preview url if any>
- Outcome: success | failed | rolled back

## Affected files
- <relative paths changed>

## References loaded
- references/<file>.md

## Docs fetched
- <Spin docs URL(s)>
- <Fermyon docs URL(s)>
- <release notes URL(s) if relevant>

## Commands executed
- <command>

## Validation results
- Build: pass|fail (evidence)
- Manifest: pass|fail (evidence)
- Deploy: pass|fail (evidence)
- Routing: pass|fail (evidence)
- Assets: pass|fail (evidence)
- Availability: pass|fail (evidence)

## Smoke test results
- <test> pass|fail (evidence)

## Rollback readiness
- Strategy: <strategy>
- Trigger conditions: <conditions>
- Verified rollback steps: yes|no

## Risks
- <risk + mitigation>

## Follow-up actions
- <action item>
```
