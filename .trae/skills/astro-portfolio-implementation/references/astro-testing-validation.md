# Astro Testing and Validation

## Preferred Local Commands (Inspect `package.json`)
Common scripts (if present):
- `pnpm run check` (type + Astro checks)
- `pnpm run build`
- `pnpm run test`
- `pnpm run test:e2e`

## Skill Validation Scripts (Read-Only)
Run from the skill root:
- `node scripts/validate-astro-project.mjs --verbose`
- `node scripts/check-static-output.mjs --path dist --verbose`

## Validation Loop
1) Run project checks (`check`, then `build`).
2) Validate static output (`dist/`) with the script.
3) For routing/SEO/a11y changes: smoke-check primary routes and keyboard navigation.
4) For performance/hydration changes: verify islands are scoped and justified.
