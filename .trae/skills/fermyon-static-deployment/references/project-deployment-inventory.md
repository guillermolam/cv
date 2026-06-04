# Project deployment inventory (guillermolam/cv)

This inventory captures repository-derived evidence about how this portfolio builds and deploys today, and what a Spin/Fermyon deployment would need to match.

Primary goal: make Spin/Fermyon deployment recommendations using repository facts, not generic assumptions.

## Discovered deployment architecture

This repository currently contains **two buildable static sites**:

1. **Astro portfolio (repo root)**
   - Root scripts: [package.json](file:///Users/guillermolammartin/Git/guillermolam/cv/package.json)
   - Static output is explicitly configured: [astro.config.mjs](file:///Users/guillermolammartin/Git/guillermolam/cv/astro.config.mjs) (`output: 'static'`)
   - Output directory observed locally: `dist/` (multi-page HTML + `_astro/` assets)

2. **Legacy CV site (subproject)**
   - Location: `guillermo-lam-cv/`
   - Build toolchain: Bun + Vite + Solid
   - Subproject scripts: [guillermo-lam-cv/package.json](file:///Users/guillermolammartin/Git/guillermolam/cv/guillermo-lam-cv/package.json)
   - CI artifact path (GitHub Pages): `./guillermo-lam-cv/dist`

Spin/Fermyon packaging must decide which artifact is being deployed:
- `dist/` (root Astro)
- `guillermo-lam-cv/dist` (subproject Vite)

## Build workflow (repository-derived)

### Root Astro build

Evidence:
- Root build command: `astro build` ([package.json](file:///Users/guillermolammartin/Git/guillermolam/cv/package.json))
- Static output: [astro.config.mjs](file:///Users/guillermolammartin/Git/guillermolam/cv/astro.config.mjs)
- Node constraint: `>=22.12.0` ([package.json](file:///Users/guillermolammartin/Git/guillermolam/cv/package.json))
- Package manager evidence: `pnpm-lock.yaml` exists

Observed output (local `dist/` sample):
- `dist/index.html`
- `dist/about/index.html`
- `dist/cv/index.html`
- `dist/portfolio/index.html`
- `dist/blog/index.html`
- `dist/contact/index.html`
- `dist/_astro/*` assets

### Subproject (GitHub Pages) build

Evidence:
- GitHub Actions build runs in `./guillermo-lam-cv` ([deploy-cv.yaml](file:///Users/guillermolammartin/Git/guillermolam/cv/.github/workflows/deploy-cv.yaml#L17-L43))
- Toolchain: installs Bun (`oven-sh/setup-bun@v1`)
- Commands:
  - `bun install`
  - `bun run build` (comment says `tsc -b && vite build`)
- Artifact uploaded: `./guillermo-lam-cv/dist`

## Deployment workflow (current)

### GitHub Pages (active)

Evidence:
- Workflow: [deploy-cv.yaml](file:///Users/guillermolammartin/Git/guillermolam/cv/.github/workflows/deploy-cv.yaml)
- Deploys the **subproject** artifact `./guillermo-lam-cv/dist`, not root `dist/`.
- Uses `actions/deploy-pages@v4`.

### Fermyon / Spin (not yet wired)

Evidence:
- No `spin.toml` exists in the repo (required to package a Spin app).
- No Fermyon deploy workflow exists in `.github/workflows/`.

## Release workflow (current)

GitHub Pages release:
- Trigger: push to `main` (and workflow_dispatch)
- “Release” == Pages deployment success

For Fermyon/Spin, the release workflow is not implemented in this repo yet. Any plan must explicitly define:
- how to version releases
- how to validate the deployed URL
- how to roll back

## Hosting assumptions

Repo constraints:
- Deployment targets include Fermyon + GitHub Pages; static hosting only (see deployment constraints rule under `.trae/rules/`).
- No SSR should be introduced without approval.

## Routing assumptions

### Root Astro (`dist/`)

Observed to be multi-page output (directory-per-route with `index.html`), which is compatible with “pure static file server” hosting.

### Subproject Vite (`guillermo-lam-cv/dist`)

Evidence of SPA-style routing expectation:
- [vercel.json](file:///Users/guillermolammartin/Git/guillermolam/cv/vercel.json) rewrites all routes to `/index.html`.

If the Vite subproject is deployed via Spin static files:
- deep-link refresh behavior must be validated explicitly
- do not assume Spin/Fermyon provides SPA fallbacks without docs evidence

## Risk areas (repository-derived)

1. **Ambiguous “source of truth” build artifact**
   - Risk: deploying the wrong `dist/` (Astro vs Vite) to Fermyon.
2. **SPA fallback mismatch**
   - Risk: Vite build expects rewrite-to-index; Spin static hosting may not match by default.
3. **Toolchain divergence**
   - Root expects pnpm + Node >= 22.12
   - Subproject CI uses Bun
4. **CI guardrails**
   - Trunk checks may flag new workflows/manifests; changes must be compatible.

