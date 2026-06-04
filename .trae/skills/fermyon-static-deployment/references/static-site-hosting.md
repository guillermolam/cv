# Static site hosting guidance

This reference focuses on static hosting constraints that commonly affect Astro sites when deployed behind a static file server (including Spin-based hosting).

## Static site assumptions

Assume:
- The host serves files from a directory (e.g., `dist/`) without server-side routing logic.
- A route refresh (`GET /some/page`) will only work if the corresponding file exists at that path.

Verify:
- `dist/index.html` exists
- Asset files referenced by `index.html` exist and are reachable

## SPA routing guidance

Static hosting + “SPA-like” navigation can fail on refresh if:
- Your app uses client-side routing for paths that do not map to real files on disk.

Guidance:
- Prefer file-based routes that emit actual HTML files for each route (Astro default for static pages).
- If you intentionally rely on client-side routing, you must configure an appropriate fallback strategy for unknown paths. Do not assume the hosting platform supports SPA fallback without confirming in docs.
- Validate behavior by directly requesting a non-root path in the deployed environment and then refreshing.

## Asset handling

Common static hosting asset pitfalls:
- Absolute asset paths that assume the site is deployed at `/` (breaks under subpaths).
- Missing or incorrect `<base href>` assumptions.
- References to files not emitted to `dist/` (e.g., from `public/` not copied as expected).

Validation:
- Ensure `index.html` references resolve to actual files in `dist/`.
- Check for `src="/..."` and `href="/..."` patterns that may need base-path awareness.

## Caching guidance

Static hosts frequently cache aggressively.

Guidance:
- Treat hashed assets (content-addressed filenames) as safe to cache long-lived.
- Treat HTML as “more volatile” and validate that HTML updates are visible after deploy.
- If users report “old site content”, validate whether caching is involved before changing code.

## Domains and redirects (Fermyon Cloud limitation)

Fermyon Cloud’s custom domain tutorial documents that redirects are not supported for custom domains at this time, so you must choose the complete domain name you intend to serve (e.g. `www.example.com` vs apex).

See:
- [fermyon-cloud-domains.md](fermyon-cloud-domains.md)
