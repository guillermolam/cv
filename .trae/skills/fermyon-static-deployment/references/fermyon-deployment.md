# Fermyon deployment (static sites via Spin)

This reference describes the deployment architecture and lifecycle expectations for serving an Astro static site on Fermyon Cloud using Spin.

When uncertain about platform behavior, consult [docs-freshness.md](docs-freshness.md) and confirm against official docs and examples.

## Deployment architecture

Core components:
- Astro build output (`dist/`): static HTML, JS, CSS, and assets
- Spin application manifest (`spin.toml`): describes the app and how files are served
- Fermyon Cloud: runs the Spin application and exposes a public URL

Fermyon Cloud is operated via the Spin CLI using the `cloud` plugin:
- See: [fermyon-cloud-cli.md](fermyon-cloud-cli.md)

Key assumption:
- The deployed artifact is static output; no server-side rendering runtime is required.

## Deployment lifecycle

1. Preflight
   - Confirm the requested deployment target (preview vs production).
   - Confirm the repo builds to `dist/` successfully.
   - Validate `spin.toml` with `node scripts/validate-spin-manifest.mjs --verbose`.
2. Build
   - Run the project’s build command to produce `dist/`.
   - Validate `dist/` with `node scripts/validate-static-build.mjs --verbose`.
3. Package
   - Ensure Spin is configured to serve the intended static files and paths.
4. Deploy
   - Use docs-verified `spin cloud deploy` commands (do not guess flags).
5. Verify
   - Run smoke tests and routing checks.
   - Capture the URL(s), status codes, and asset load results.
6. Release report
   - Produce a report per [../SKILL.md](../SKILL.md).
7. Operate
   - Monitor for regressions (404s, asset failures, cache issues).
   - Be ready to roll back (see [rollback-procedures.md](rollback-procedures.md)).

## Production expectations

Minimum expectations for a “production-ready” deploy:
- Stable and repeatable build output
- Deterministic asset references and correct base paths
- Predictable routing behavior under refresh
- A documented rollback strategy and trigger conditions
- A security review of public assets and credentials handling

## Environment considerations

Things that commonly differ between local and Fermyon-hosted behavior:
- Base URL and path assumptions (`/` vs subpaths)
- MIME types and caching headers
- SPA deep-link behavior on refresh
- Asset paths that are absolute vs relative
- Differences between “deploy succeeded” vs “site is serving correct content”

## Domains (release-affecting)

Fermyon Cloud supports:
- renaming the default `.fermyon.app` subdomain
- attaching custom domains via DNS delegation

Important limitation documented in the custom domain tutorial:
- redirects are not supported for custom domains at this time

See: [fermyon-cloud-domains.md](fermyon-cloud-domains.md)
