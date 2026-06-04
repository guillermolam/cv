# Project pattern mapping (repo vs Spin patterns)

This document compares the current state of `guillermolam/cv` against patterns extracted from `spinframework/spin`.

Inputs (required):
- [project-deployment-inventory.md](project-deployment-inventory.md)
- [spin-pattern-catalog.md](spin-pattern-catalog.md)
- [example-catalog.md](example-catalog.md)

## Mapping table

| Pattern | Current state (repo evidence) | Recommended state (Spin evidence) | Gap | Risk | Migration effort | Priority |
|---|---|---|---|---|---|---|
| Spin manifest present (`spin.toml`) | No `spin.toml` in repo | Manifest v2 with `spin_manifest_version = 2` and explicit triggers/components | Missing manifest | Cannot deploy to Fermyon via Spin until created | Medium | P0 |
| Static fileserver component | Not configured | Use `spin-fileserver` template (`source.url` + `digest`, `files` mapping) | Missing static serving component | Deploy succeeds but serves nothing if misconfigured | Medium | P0 |
| Artifact selection (which `dist/`) | Two buildable artifacts: root `dist/` and CI-built `guillermo-lam-cv/dist` | `files.source` must point to the intended artifact directory | Ambiguous “source of truth” | Wrong site deployed or broken deploy | Low (decision) | P0 |
| Multi-page static output | Root Astro emits `dist/<route>/index.html` | Static file server works naturally with multi-page output | None (for Astro) | Low | Low | P1 |
| SPA rewrite expectations | `vercel.json` rewrites all routes to `/index.html` (SPA expectation) | Spin patterns do not imply SPA rewrites by default; must be docs-backed | Hosting behavior unknown | Deep links 404 or assets served as HTML | Medium | P0 (if deploying SPA) |
| Route validation approach | Not encoded in repo deploy workflow | Spin tests validate `/hello`, wildcard, and expected 404s | Missing validation discipline | “green deploy” but broken routes/assets | Low | P1 |
| Asset validation approach | Not encoded in CI deploy workflow | Validate that referenced assets exist and return 200 | Missing validation discipline | Blank page/un-styled site post deploy | Low | P1 |
| Exclude sensitive files | No Spin packaging config exists yet | Use explicit file mounts; apply exclusion strategy where supported | Missing controls | Accidental exposure of private files | Medium | P0 |
| Release metadata + rollback | GitHub Pages deploy does not record rollback plan | Spin deploy flow should include rollback plan + verification | Missing release discipline | Slow recovery on failure | Low | P1 |
| CI deploy to Fermyon | No Fermyon workflow | Add separate workflow using secrets + manual gates (docs-backed) | Missing workflow | Manual deploy drift / inconsistent releases | Medium | P2 |

## Notes (portfolio relevance)

- If deploying the **root Astro site**, prefer the Spin static fileserver template pattern and validate multi-page routing.
- If deploying the **Vite subproject**, treat SPA behavior as a first-class risk: do not assume rewrite support; validate deep-link refresh behavior and asset handling explicitly.

