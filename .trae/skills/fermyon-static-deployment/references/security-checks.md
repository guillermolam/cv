# Security checks

This reference defines secure-by-default checks for deploying a static site to Fermyon Cloud using Spin.

## Deployment security checks

Before deployment:
- Ensure deployment tokens/credentials are stored only in secret managers (e.g., CI secrets), not in repo files.
- Confirm no secrets are being copied into `public/` or emitted into `dist/`.
- Confirm build logs do not print secrets or tokens.
- Confirm the deployment workflow uses least-privilege permissions.

After deployment:
- Confirm the deployed URL does not expose unintended files (source maps, internal docs, private exports).
- Confirm error pages do not leak internal paths, stack traces, or environment details.

## Secrets guidance

- Never hardcode tokens in:
  - `spin.toml`
  - `.github/workflows/*`
  - `.env` committed files
- Prefer:
  - local `.env` ignored by git for local-only values
  - CI secrets (e.g., `FERMYON_CLOUD_TOKEN`) for deploy pipelines
- Redaction rule:
  - never paste raw tokens into terminal output, issue trackers, or PRs

## GitHub Actions secret handling (Fermyon Cloud)

Fermyon’s GitHub Actions guide documents using a repository secret named `FERMYON_CLOUD_TOKEN` and passing it to the deploy action.

Source:
- https://developer.fermyon.com/cloud/github-actions

Rules:
- Never echo the token, even on failures.
- Avoid workflows that deploy from untrusted PR contexts.

## Public asset review

Review what becomes publicly accessible:
- `public/` contents (copied into build output)
- `dist/` contents (deployed artifact)

High-risk items to avoid publishing:
- private exports (LinkedIn exports, resumes with private address/phone if not intended)
- internal diagrams with sensitive environment identifiers
- credential files, kubeconfigs, cloud config dumps
- `.env` files

## Exposure review

Validate:
- `robots.txt` is intentional (allow or disallow indexing as desired)
- `sitemap` exposure is intentional
- source maps are either disabled or explicitly intended for production
- the site does not leak internal endpoints via static configuration
