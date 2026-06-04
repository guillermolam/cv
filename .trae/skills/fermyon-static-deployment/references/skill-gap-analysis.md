# Skill gap analysis (repository-aware enhancement)

This document audits the current `fermyon-static-deployment` skill against the needs of **this repo** (guillermolam/cv) and highlights incremental improvements to make it repository-aware.

## Summary (current state)

Current skill strengths:
- Clear ownership boundaries and routing to other skills
- Strong anti-hallucination posture (docs freshness gate)
- Read-only validator scripts with structured JSON output

Primary weakness:
- The skill assumes a single “Astro `dist/`” artifact and does not incorporate the repo’s **actual** deployment pipeline (GitHub Pages deploying `./guillermo-lam-cv/dist`) or the repo’s SPA routing config (`vercel.json` rewrite).

## Gaps (with severity, impact, proposed improvement)

### G1 — No repository deployment inventory

- Severity: Critical
- Impact: Recommendations may deploy the wrong artifact (root `dist/` vs `guillermo-lam-cv/dist`) or propose irrelevant changes.
- Proposed improvement:
  - Add [project-deployment-inventory.md](project-deployment-inventory.md) and make it the primary source of truth.

### G2 — No project vs Spin patterns mapping

- Severity: Critical
- Impact: The skill cannot explain “what we do today” vs “what Spin patterns recommend”, so it cannot safely propose migrations.
- Proposed improvement:
  - Add [project-pattern-mapping.md](project-pattern-mapping.md) driven by Spin examples and this repo’s state.

### G3 — No Spin repository-derived pattern catalog

- Severity: High
- Impact: `spin.toml` guidance risks being generic, outdated, or incorrect.
- Proposed improvement:
  - Mine `spinframework/spin` and extract:
    - [spin-pattern-catalog.md](spin-pattern-catalog.md)
    - [example-catalog.md](example-catalog.md)
    - [anti-patterns.md](anti-patterns.md)

### G4 — Generic deployment-validation guidance

- Severity: High
- Impact: “Smoke tests” remain high-level; does not encode Spin test patterns or this repo’s routing differences (multi-page vs SPA).
- Proposed improvement:
  - Enhance [deployment-validation.md](deployment-validation.md) using Spin tests/examples and add explicit “Astro multi-page” vs “Vite SPA” validation branches.

### G5 — Generic troubleshooting guide

- Severity: High
- Impact: The troubleshooting guide lists plausible failures but lacks concrete “diagnosis steps” and “verification” procedures derived from Spin tests/examples.
- Proposed improvement:
  - Rewrite/reshape [troubleshooting.md](troubleshooting.md) into:
    - Symptom
    - Root cause
    - Diagnosis steps (commands + what evidence to capture)
    - Resolution
    - Verification

### G6 — Scripts not portfolio-aware

- Severity: Medium
- Impact: Scripts don’t detect:
  - the active GitHub Pages deployment pipeline
  - the Vite subproject and its expected output path
  - SPA rewrite expectations via `vercel.json`
- Proposed improvement:
  - Enhance:
    - `scripts/inspect-spin-project.mjs` to surface both build artifacts and the active CI artifact path
    - `scripts/validate-static-build.mjs` to validate both “multi-page” and “SPA” output profiles
    - `scripts/validate-spin-manifest.mjs` to include repository-aware next steps when `spin.toml` is missing

### G7 — Evals are not repository-derived

- Severity: Medium
- Impact: The skill may pass generic evals but still fail on real repo deployment tasks.
- Proposed improvement:
  - Add `evals/repository-derived-evals.json` containing prompts and assertions that require mentioning repo-specific evidence:
    - `.github/workflows/deploy-cv.yaml`
    - `guillermo-lam-cv/package.json`
    - `astro.config.mjs`
    - `vercel.json`
    - missing `spin.toml`

## Project-specific workflow gaps

- Current skill doesn’t explicitly handle the “two artifacts” reality.
- Current skill doesn’t explicitly branch validation/troubleshooting for:
  - Astro multi-page static output
  - Vite SPA output requiring a rewrite/fallback strategy (must be docs-verified)

