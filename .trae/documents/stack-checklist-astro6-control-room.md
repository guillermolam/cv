---
title: "Stack Checklist — Astro 6.4 + UnoCSS + Alpine + Three/Pixi + GSAP/Anime + Chart.js + MDX"
status: "active"
lastUpdated: "2026-06-06"
scope: "Implementation checklist (repo-specific). Subordinate to docs/spec.md + docs/architecture/* + docs/checklist.md."
---

# Stack Checklist — Astro 6.4 + Control Room Repo

This checklist is a practical, repo-specific guardrail list for day-to-day implementation.

If anything here conflicts with:
- docs/spec.md
- docs/architecture/*
- docs/design/*
- docs/checklist.md

those documents win.

## 1) Astro Output + Deployment Model (Critical)

- Output is static (no SSR runtime).
- No `@astrojs/node` adapter is required for production.
- No server-only routes/endpoints are relied upon for critical functionality.
- Any “dynamic” content is build-time (content collections, loaders, scripts) or client-side enhanced.

## 2) Integrations (Order + Scope)

Baseline integrations in this repo:
- UnoCSS: utility generation + icons (build-time).
- MDX: content rendering (build-time).
- Alpine: light client behavior (client-only).
- Custom integrations:
  - `heerich-voxel-svg`: build-time voxel → SVG rendering; keep it SSR-build safe.
  - `apexcharts`: client-only; must be dynamically imported in Alpine/clients to avoid SSR.

Rules:
- Never import client-only libraries in `.astro` frontmatter.
- Prefer dynamic import for heavy client libraries (Three.js, Chart.js, ApexCharts, GSAP, Anime.js, PixiJS).

## 3) UnoCSS (Repo Patterns)

- Use `UnoCSS()` integration + a standalone `uno.config.ts`.
- Ensure content scanning includes `src/**/*.{astro,html,md,mdx,js,jsx,ts,tsx,css}`.
- Exclude non-source directories from scanning to avoid false positives and performance issues:
  - `dist`, `.astro`, `node_modules`, `docs`, `.trae`.
- Icon usage:
  - Install only the Iconify JSON collections you use (`@iconify-json/ph`, etc).
  - Prefer stable class names (no string concatenation that produces unknown icons).
  - Avoid putting icon-like tokens in comments/markdown if they can be parsed as utilities.

## 4) Alpine (Progressive Enhancement)

- All critical content must render without JS.
- Alpine should enhance behavior, not gate it.
- Use `prefers-reduced-motion` to disable continuous UI motion.
- Keep Alpine state local unless it must be shared.

## 5) Three.js / WebGL (Progressive Enhancement Boundaries)

Must satisfy docs/architecture/threejs-boundaries.md and docs/checklist.md.

- Never put essential content inside canvas.
- Lazy-load Three.js only when needed (visibility, interaction, or route-level split).
- Pause/stop animation loops when offscreen and when tab is hidden.
- Cap DPR (e.g., `Math.min(devicePixelRatio, 2)`) and degrade on mobile.
- Dispose GPU resources on teardown (geometries, materials, textures, render targets).
- Reduced motion: no continuous render loop; provide a calm/static alternative.

## 6) PixiJS (If Used)

- Client-only (never in server/frontmatter).
- Use Pixi v8 async `app.init()` pattern.
- Always cleanup: `app.destroy(true)` and remove canvas on teardown.
- Resize handling must be stable; avoid layout thrash.
- Pause tickers/loops when tab hidden.

## 7) Motion System (CSS / GSAP / Anime.js)

- Motion is allowed only when it improves understanding.
- Reduced motion must preserve usability and hierarchy.
- Prefer CSS for simple states; use GSAP/Anime.js for orchestrated sequences.
- Avoid animating layout properties in loops (width/height/left/top) unless strictly necessary.
- Ensure listeners/timers are removed on teardown.

## 8) Charts (Chart.js + ApexCharts)

- Client-only rendering; SSR outputs must provide an accessible fallback (table/summary).
- Destroy chart instances on teardown to avoid leaks.
- Avoid hydration flicker:
  - Render a stable SSR skeleton and replace on client when visible.
  - Disable heavy animations on first paint; enable after a short idle if needed.

## 9) Content Collections + MDX

- Use `z` from `zod` (not deprecated exports).
- Loaders must include both `.md` and `.mdx` where relevant.
- Validate frontmatter via schema; no invented claims.
- Ensure routes that depend on content have stable slugs and deep links.

## 10) Validation (Repo Commands)

Run on any non-trivial change:

```bash
pnpm check
pnpm build
pnpm test
pnpm test:e2e
```

## 11) CI/CD + Secrets (Security)

- Never commit secrets.
- Prefer least-privilege tokens.
- If GitHub Pages is used: static artifact deploy; do not rely on SSR start scripts.
