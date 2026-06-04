# Release process

This reference provides a release checklist and a safe deployment/verification sequence for static sites deployed to Fermyon Cloud via Spin.

## Release checklist

Preflight:
- Request is clearly classified (preview vs production, new deploy vs redeploy vs rollback)
- Project inspection completed:
  - `node scripts/inspect-spin-project.mjs --verbose`
- Static build validated:
  - `node scripts/validate-static-build.mjs --verbose`
- Spin manifest validated:
  - `node scripts/validate-spin-manifest.mjs --verbose`
- Security checks completed:
  - [security-checks.md](security-checks.md)
- Rollback plan drafted:
  - [rollback-procedures.md](rollback-procedures.md)

## Deployment sequence

1. Build the site (project-defined command) to produce `dist/`.
2. Re-run static build validation.
3. Confirm Spin manifest still matches the intended `dist/` content and paths.
4. Deploy using docs-verified Spin/Fermyon commands (do not guess flags).
5. Capture deployment output and the resulting URL(s).

## Verification sequence

1. Basic availability check:
   - `GET /` returns 200
2. Asset checks:
   - Main CSS/JS assets referenced in HTML return 200
3. Routing checks:
   - At least one non-root route behaves as expected on direct request and refresh
4. Error handling:
   - Unknown path behavior is documented (404 vs fallback) and acceptable for the site
5. Regression sweep:
   - Verify at least one representative page per top-level route group

## Failure handling

If verification fails:
- Do not “patch forward” blindly.
- Decide whether the fastest safe recovery is:
  - Fix and redeploy (if root cause is identified and low risk), or
  - Roll back (if impact is high or root cause is unclear)
- Document:
  - symptom
  - suspected root cause
  - corrective action
  - decision (redeploy vs rollback)

