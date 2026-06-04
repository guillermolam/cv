# Spin workflow (static site on Fermyon)

This document describes a safe, repeatable workflow for building, validating, deploying, and releasing an Astro static site (`dist/`) on Fermyon Cloud using Spin.

If any command, flag, or manifest field is unfamiliar or disputed, follow [docs-freshness.md](docs-freshness.md) before proceeding.

## Repository-aware preflight (mandatory for this portfolio)

Before selecting commands or proposing `spin.toml` changes, consult:
- [project-deployment-inventory.md](project-deployment-inventory.md)
- [project-pattern-mapping.md](project-pattern-mapping.md)

Decide which build artifact is being deployed:
- Root Astro: `dist/` (multi-page HTML + `_astro/`)
- Subproject Vite: `guillermo-lam-cv/dist` (built in CI; SPA routing expectations exist via `vercel.json`)

## Build workflow

1. Confirm the project root and package manager (pnpm/npm/yarn).
2. Confirm the Astro output is static and produces `dist/`.
3. Run the local build command (project-defined).
4. Validate the output using:
   - `node scripts/validate-static-build.mjs --verbose`

Build outputs to capture:
- Build command executed
- Build tool version (Node, package manager)
- `dist/` existence and key files (at least `index.html`)

## Validation workflow

Run validations in this order:

1. Project inspection:
   - `node scripts/inspect-spin-project.mjs --verbose`
2. Static build validation:
   - `node scripts/validate-static-build.mjs --verbose`
3. Spin manifest validation:
   - `node scripts/validate-spin-manifest.mjs --verbose`
4. Security checks:
   - [security-checks.md](security-checks.md)

Stop conditions:
- If build artifacts fail: route to Astro implementation (or rerun the build if it simply wasn’t run).
- If manifest is missing: confirm whether Spin is in scope or create it with docs-backed fields only.

## Deployment workflow

This skill does not assume a specific Spin subcommand name for Fermyon deployment because Spin/Fermyon evolve quickly.

Required steps:

1. Confirm Spin CLI availability:
   - Use `spin --help` to confirm installed and discover the correct deploy subcommands.
2. Confirm Fermyon authentication flow:
   - Use official Fermyon docs to determine the correct login/token usage.
3. Build the Spin application (if required by the chosen flow).
4. Deploy using the verified command(s) from official docs.

### Fermyon Cloud deploy (cloud plugin evidence)

Fermyon’s official Cloud docs describe deployment and operations via the `cloud` plugin:
- https://developer.fermyon.com/cloud/cloud-command-reference

Use these discovery-first checks:

```bash
spin cloud --help
spin cloud deploy --help
spin cloud login --help
```

If CI is involved, consult the official actions guidance:
- https://developer.fermyon.com/cloud/github-actions

Deployment artifacts to capture:
- The exact commands executed (redact tokens/secrets)
- The produced application URL(s)
- Any runtime logs/diagnostics relevant to static file serving

### Manifest baseline to copy from (docs-backed example)

For static file serving, use Spin’s own template as the baseline structure:
- https://github.com/spinframework/spin/tree/main/templates/static-fileserver (see `content/spin.toml`)

The key construct to preserve is:
- remote `spin_static_fs.wasm` referenced by `source.url` plus `digest`
- `files = [{ source = "<artifact>", destination = "/" }]`

## Smoke test workflow

Use [deployment-validation.md](deployment-validation.md). Minimum smoke tests:

- Homepage loads over HTTPS and returns 200
- `index.html` references resolve (JS/CSS assets return 200)
- At least one deep link resolves as expected (static-hosting constraints apply)
- Refresh on a non-root route behaves as expected for the chosen routing strategy
- 404 behavior is predictable and documented

## Update workflow

An “update” is a redeploy of the same app with new static artifacts.

Required steps:
1. Rebuild the artifact directory (root `dist/` or `guillermo-lam-cv/dist`).
2. Re-run:
   - `node scripts/validate-static-build.mjs --verbose`
   - `node scripts/validate-spin-manifest.mjs --verbose`
3. Deploy using docs-verified Spin/Fermyon commands.
4. Run the smoke tests again and confirm HTML content changed as expected (cache/staleness check).

## Release workflow

1. Ensure build + manifest validation gates pass.
2. Deploy to the target environment.
3. Run smoke tests against the deployed URL.
4. Perform a short production validation sweep:
   - availability
   - routing
   - assets
   - error handling
5. Produce a release report (see the Output Contract in [../SKILL.md](../SKILL.md)).
6. Confirm rollback readiness (see [rollback-procedures.md](rollback-procedures.md)).

## Incident workflow

Use this when:
- production routes/asset requests are failing
- the deployment is serving stale or incorrect content
- security exposure is suspected

Steps:
1. Freeze changes: stop further deploy attempts until evidence is captured.
2. Capture evidence:
   - deployed URL(s)
   - failing paths + status codes
   - whether the failure is routing vs assets vs availability
3. Validate locally (artifact + manifest) to rule out packaging errors.
4. Decide: fix-forward vs rollback (see [rollback-procedures.md](rollback-procedures.md)).
5. After recovery, update:
   - [deployment-validation.md](deployment-validation.md)
   - [troubleshooting.md](troubleshooting.md)
   - [anti-patterns.md](anti-patterns.md)
