# Troubleshooting

This reference is a field guide for diagnosing Spin/Fermyon static hosting failures.

If the issue is likely caused by Astro output (missing files, wrong base paths, wrong routes), route to `astro-portfolio-implementation` after capturing evidence.

## Repository-aware first response (guillermolam/cv)

Before diagnosing Spin/Fermyon behavior, confirm you are looking at the correct artifact and pipeline:

1. Identify deployment artifact choice
   - Consult: [project-deployment-inventory.md](project-deployment-inventory.md)
   - This repo can produce:
     - root `dist/` (Astro, multi-page)
     - `guillermo-lam-cv/dist` (Vite, built in CI; SPA rewrite expectation exists via `vercel.json`)
2. Capture evidence
   - Deployed URL(s)
   - Failing paths + status codes
   - Whether failure is: availability vs routing vs assets
3. Run local read-only validation
   - `node scripts/inspect-spin-project.mjs --verbose`
   - `node scripts/validate-static-build.mjs --verbose --dist-dir dist`
   - `node scripts/validate-spin-manifest.mjs --verbose`

Stop conditions:
- If manifest/routing/deploy behavior is uncertain, consult [docs-freshness.md](docs-freshness.md) and verified Spin examples before proposing fixes.

## Runbooks (symptom → diagnosis → resolution → verification)

### Symptom: Deploy succeeded but `/` returns 404

Root cause candidates:
- `files` mapping points to the wrong directory (wrong artifact: Astro vs Vite)
- artifact directory was not built (e.g., `guillermo-lam-cv/dist` missing locally)
- manifest does not mount the artifact directory

Diagnosis steps:
- Confirm which artifact is intended (inventory).
- Validate artifact exists locally:
  - `node scripts/validate-static-build.mjs --verbose --dist-dir dist`
- Validate manifest exists and is structurally sane:
  - `node scripts/validate-spin-manifest.mjs --verbose`

Resolution:
- Adjust `files.source` to the correct artifact directory, using the Spin static-fileserver template as the baseline (see `templates/static-fileserver/content/spin.toml` in `spinframework/spin`).

Verification:
- Re-deploy and verify:
  - `GET /` returns 200
  - `GET /<known-asset>` returns 200

### Symptom: `/` loads but CSS/JS 404 after deploy (unstyled/blank page)

Root cause candidates:
- asset directory not included in packaged files (`_astro/` for Astro, `assets/` for Vite)
- base-path assumptions differ between local and deployed URL
- rewrite/fallback behavior is incorrectly rewriting asset requests to HTML

Diagnosis steps:
- Validate local build asset references:
  - `node scripts/validate-static-build.mjs --verbose`
- Identify an asset URL in `dist/index.html` and request it directly in production.

Resolution:
- Ensure the mounted directory includes the full build output, not only `index.html`.
- If SPA fallback is configured, ensure it does not apply to asset paths.

Verification:
- Confirm the asset request returns 200 and a non-HTML `content-type`.

### Symptom: Deep link refresh returns 404 but in-app navigation works

Root cause candidates:
- SPA routing expectation without hosting rewrite support
- route does not map to an actual file in `dist/`

Diagnosis steps:
- If deploying Astro multi-page: check whether the route maps to `dist/<route>/index.html`.
- If deploying Vite SPA: check whether the hosting platform supports rewrite-to-index behavior (docs-backed only).

Resolution:
- For Astro: ensure routes are built to real files and deployed.
- For SPA: only implement rewrites/fallbacks if platform support is confirmed; otherwise change routing strategy (route to Astro implementation).

Verification:
- Direct request + refresh on at least one non-root path behaves as documented in the release report.

### Symptom: Site shows old content after redeploy

Root cause candidates:
- caching (browser/CDN)
- redeploy did not actually update the artifact

Diagnosis steps:
- Confirm the newly deployed artifact differs (hash or file timestamp) before redeploy.
- In production, check if HTML changed while hashed assets did not.

Resolution:
- Prefer hashed assets for caching; treat HTML as volatile.
- If platform caching controls exist, apply them only with docs evidence.

Verification:
- Confirm updated HTML is served consistently across refreshes and devices.

## Common deployment failures

Symptoms to start from:
- Deploy command fails (auth, API errors, CLI errors)
- Deploy succeeds but site is broken (404s, missing assets, wrong content)
- Site works on `/` but fails on deep links
- Content is stale after deploy

## Manifest failures

Typical manifest-related symptoms:
- App deploy/build fails with “manifest invalid” or “component misconfigured”
- App deploys but serves nothing (no files found)
- Static files missing because they were not included in the package

Use:
- `node scripts/validate-spin-manifest.mjs --verbose`

## Routing failures

Typical routing symptoms:
- Refreshing a non-root page returns 404
- Directly requesting a deep link returns 404 but in-app navigation works

Use:
- [static-site-hosting.md](static-site-hosting.md)
- [deployment-validation.md](deployment-validation.md)

## Build failures

Typical build symptoms:
- `dist/` missing or incomplete
- `index.html` missing
- `index.html` references assets that do not exist in `dist/`

Use:
- `node scripts/validate-static-build.mjs --verbose`

## Asset failures

Typical asset symptoms:
- CSS/JS 404s after deploy
- Fonts/images 404s after deploy
- The HTML loads but page is unstyled/blank due to missing JS/CSS

## Failure mode analysis (≥ 20 realistic failures)

Each entry includes: symptom → likely root cause → corrective action.

1. Symptom: `dist/` missing locally
   - Root cause: build never ran or output directory differs
   - Corrective action: run the project’s build command; confirm output directory in Astro config
2. Symptom: `dist/index.html` missing
   - Root cause: build failed, wrong output directory, or misconfigured build pipeline
   - Corrective action: fix build errors; re-run build; validate output with `validate-static-build`
3. Symptom: Deployment succeeds but `/` returns 404
   - Root cause: Spin component not serving the intended directory or file list
   - Corrective action: verify manifest file inclusion rules; confirm `dist/` is packaged and served
4. Symptom: `/` returns 200 but CSS/JS return 404
   - Root cause: assets not included in the Spin package or wrong base paths in HTML
   - Corrective action: validate `dist/` asset references; ensure manifest includes asset directories
5. Symptom: Page loads unstyled (CSS loads as HTML)
   - Root cause: incorrect routing fallback serving `index.html` for asset paths
   - Corrective action: fix routing rules so assets are served as files, not rewritten to HTML
6. Symptom: Deep link refresh returns 404
   - Root cause: static host does not provide SPA fallback; route does not map to a file
   - Corrective action: prefer static HTML routes; if SPA fallback is required, confirm host support and configure accordingly
7. Symptom: Only some routes work after deploy
   - Root cause: partial `dist/` packaging (missing nested directories)
   - Corrective action: confirm all required files are included; compare local `dist/` tree with deployed behavior
8. Symptom: Deploy command fails with authentication error
   - Root cause: missing/expired credentials or wrong auth method
   - Corrective action: re-auth using official Fermyon guidance; do not paste tokens into logs
9. Symptom: Deploy command fails with “app already exists” / name conflict
   - Root cause: name collision in Fermyon namespace
   - Corrective action: choose a unique app name or update the existing app per docs-backed workflow
10. Symptom: Deploy command fails with “invalid version” or “version required”
   - Root cause: manifest requires a version value per current Spin rules
   - Corrective action: consult Spin manifest docs and set the required version field (do not guess field names)
11. Symptom: Deploy succeeds but site shows old content
   - Root cause: caching at CDN/browser layer; HTML cached unexpectedly
   - Corrective action: validate cache behavior; confirm HTML changed; consider cache-busting strategy for HTML if supported
12. Symptom: Site works locally but 404s on Fermyon for `/assets/...`
   - Root cause: different base path assumptions between environments
   - Corrective action: validate asset paths in built HTML; avoid hard-coded absolute paths unless hosting at `/` is guaranteed
13. Symptom: `index.html` references `http://localhost` URLs
   - Root cause: incorrect environment variables or base URL set during build
   - Corrective action: remove localhost-specific config from production builds; rebuild and redeploy
14. Symptom: Deployed site returns unexpected MIME types
   - Root cause: static server content-type mapping differs from local dev server
   - Corrective action: confirm Spin static server MIME handling in docs; adjust file extensions/hosting configuration accordingly
15. Symptom: Deployed site loads but fonts fail (CORS/blocked)
   - Root cause: cross-origin font loading restrictions or incorrect font URLs
   - Corrective action: host fonts under the same origin; ensure correct paths and MIME types
16. Symptom: Deploy/build fails due to missing `spin.toml`
   - Root cause: Spin not initialized in the repo or file renamed/misplaced
   - Corrective action: confirm whether Spin is intended; if yes, create `spin.toml` using official examples
17. Symptom: `spin` command not found in CI/local
   - Root cause: Spin CLI not installed or PATH not configured
   - Corrective action: install Spin per official docs; confirm `spin --help` works
18. Symptom: Deploy fails due to rate limits or quotas
   - Root cause: account-level quota/rate limit
   - Corrective action: wait/retry later; reduce deploy frequency; consult Fermyon status/limits docs
19. Symptom: Deployment succeeds but pages intermittently fail
   - Root cause: transient platform issues or unstable DNS/CDN propagation
   - Corrective action: validate with repeated requests; consult Fermyon status; wait and re-test
20. Symptom: Deployed site returns 500 from platform edge
   - Root cause: platform/runtime error serving the component, misconfiguration, or service incident
   - Corrective action: consult Fermyon logs/status; validate manifest again; roll back if impact is high
21. Symptom: Static files are served but wrong directory listing is exposed
   - Root cause: packaging includes unintended files or incorrect public root
   - Corrective action: restrict packaged files; review `public/` and `dist/` contents; run [security-checks.md](security-checks.md)
22. Symptom: Deployment report cannot identify what changed
   - Root cause: missing versioning/tagging discipline
   - Corrective action: include commit SHA/tag/version in the release report; standardize release metadata
