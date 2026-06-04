# Deployment validation

This reference defines production validation checks for a Spin-hosted static site on Fermyon Cloud.

Use the repo’s deployment inventory to decide which artifact you are validating:
- [project-deployment-inventory.md](project-deployment-inventory.md)

## Smoke tests

Minimum smoke tests (must pass):
- `GET /` returns 200
- `GET /<primary-css-or-js>` returns 200 and is not HTML
- `GET /favicon.*` returns 200 (if used)
- `GET /robots.txt` returns expected result (200 or intentionally absent)
- `GET /sitemap.*` returns expected result (if generated)

### Repository-aware smoke tests (guillermolam/cv)

If deploying the **root Astro** build (`dist/` is multi-page):
- Validate that these routes exist as real static pages (direct request + refresh):
  - `/about/`
  - `/cv/`
  - `/portfolio/`
  - `/blog/`
  - `/contact/`
- Validate `_astro` assets are reachable (example path taken from built output):
  - `/_astro/<file>.css` returns 200 and `content-type` is not HTML

If deploying the **Vite subproject** build (`guillermo-lam-cv/dist`):
- Treat deep-link refresh behavior as a first-class risk. The repo contains:
  - [vercel.json](file:///Users/guillermolammartin/Git/guillermolam/cv/vercel.json) (`destination: /index.html`)
- Do not assume Spin/Fermyon provides SPA fallback without docs evidence. Validate by direct request + refresh of at least one non-root path.

## Availability checks

- Confirm the site is reachable over HTTPS.
- Confirm repeated refreshes do not intermittently fail.
- Confirm time-to-first-byte is within expected bounds for a static site (identify outliers).

## Routing checks

Static hosting routing must be validated explicitly.

- Pick at least one non-root route and verify:
  - direct request behaves as expected
  - refresh behaves as expected
- Document what “expected” means for this site:
  - static HTML per route (preferred), or
  - SPA fallback behavior (only if confirmed supported), or
  - deliberate 404 for unknown routes

### Spin-derived route validation structure (tests evidence)

Spin’s integration tests validate:
- a “happy path” route
- a wildcard route
- an expected 404

Reference excerpt:
- https://github.com/spinframework/spin/blob/main/tests/integration.rs (search for `fn http_smoke_test`)

Adapt this structure to static hosting by validating:
- one expected page path returns 200
- one expected asset path returns 200
- one obviously-invalid path returns 404 (or the repo’s explicitly documented fallback behavior)

## Asset checks

- Confirm `index.html` references exist and load:
  - CSS
  - JS
  - fonts (if any)
  - images/icons
- Confirm no mixed-content warnings (HTTPS page loading HTTP assets).
- Confirm large assets are intentional (identify unusually large files).

## Validation checklist

- [ ] Build validation passed (`validate-static-build`)
- [ ] Manifest validation passed (`validate-spin-manifest`)
- [ ] Deployed URL reachable
- [ ] Homepage loads and renders expected content
- [ ] Assets load without 404s
- [ ] Representative deep link tested (direct request + refresh)
- [ ] Unknown path behavior documented and acceptable
- [ ] Rollback plan exists and is actionable
- [ ] Risks documented in release report
