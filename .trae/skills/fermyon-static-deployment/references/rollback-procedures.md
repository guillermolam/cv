# Rollback procedures

This reference documents how to plan and verify a rollback for a Spin-hosted static site on Fermyon Cloud.

Because rollback mechanics depend on the exact Fermyon/Spin workflow in use, consult official docs when uncertain (see [docs-freshness.md](docs-freshness.md)).

## Rollback strategy

Preferred strategies (choose one and document it):
- Versioned releases (recommended): deploy identifiable versions and roll back by redeploying the last known-good version.
- Immediate redeploy rollback: re-run deployment using the previous artifact/manifest state.

Key requirement:
- You must be able to identify “last known good” (LKG): URL, version, commit SHA, or release tag.

## Rollback triggers

Trigger rollback when:
- Production is serving broken HTML or missing assets
- Critical routes return 404 unexpectedly
- A regression impacts recruiter-critical flows (homepage, CV downloads, portfolio navigation)
- Security exposure is detected (e.g., sensitive file accidentally deployed)
- Root cause is unclear and impact is high

## Rollback verification

After rollback:
- Confirm the LKG URL serves expected content
- Re-run the smoke tests from [deployment-validation.md](deployment-validation.md)
- Confirm the broken behavior no longer reproduces
- Document what changed between the failed release and the LKG release

## Recovery guidance

After stabilizing production:
- Perform a post-incident review:
  - What validation gate failed to catch the issue?
  - What new check should be added to prevent recurrence?
- Update:
  - [deployment-validation.md](deployment-validation.md)
  - [troubleshooting.md](troubleshooting.md)
  - script validations if appropriate

