# Anti-patterns (Spin static hosting + portfolio deployment)

This file lists deployment anti-patterns that have caused real-world failures in static hosting workflows, plus Spin-specific pitfalls inferred from Spin’s own templates/tests.

## Manifest anti-patterns

- Mixing manifest styles (e.g., `spin_version = "1"` style fields) with `spin_manifest_version = 2` conventions in the same project without a docs-backed migration plan.
- Using absolute filesystem paths in `spin.toml` that won’t exist in CI or other machines.
- Omitting a `digest` when using `source.url` for remote WASM components (reduces integrity guarantees).
- Packaging more files than intended (no `exclude` strategy), especially when repo contains private exports or archives.
- Adding new manifest fields “because they seem plausible” instead of copying from verified Spin examples/docs.

## Routing anti-patterns

- Assuming SPA rewrites exist on the hosting platform because `vercel.json` has a rewrite rule.
- Applying “rewrite everything to index.html” behavior that also rewrites asset URLs, causing CSS/JS to be served as HTML.
- Treating “deploy succeeded” as evidence that routing works; deep-link refresh behavior must be validated explicitly.

## Asset anti-patterns

- Deploying without validating that `index.html` references resolve to files in the packaged artifact.
- Deploying with missing directories (`_astro/` for Astro, `assets/` for Vite) due to incomplete packaging rules.
- Publishing source maps unintentionally when they contain internal paths or sensitive hints (verify repo policy).

## Build anti-patterns

- Confusing the repo’s two build artifacts:
  - root Astro `dist/`
  - subproject `guillermo-lam-cv/dist`
- Assuming `dist/` exists locally because CI builds it; validate artifact existence per environment.
- Ignoring the repo’s toolchain split (pnpm vs Bun) and recommending commands that don’t match the project path being deployed.

## Deployment anti-patterns

- Proposing Spin/Fermyon CLI commands without first checking:
  - what Spin version is installed
  - what subcommands exist (`spin --help`)
  - official docs for the current platform
- Printing or pasting tokens into logs, CI output, or release reports.

## Release anti-patterns

- Shipping without a rollback plan (even if not executed).
- Not capturing the deployed URL(s), build version, commit SHA, and validation results in a release report.
- Treating “Pages deploy green” as equivalent to “production is correct” without smoke tests.

