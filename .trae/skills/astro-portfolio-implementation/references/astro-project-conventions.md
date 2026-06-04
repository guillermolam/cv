# Astro Project Conventions

This reference captures local conventions observed in the repository. Treat it as the default unless an authoritative project doc overrides it.

## Local Baseline (Observed)
- Runtime: Node.js (see `package.json` engines).
- Package manager: prefer the lockfile in the repo (`pnpm-lock.yaml` if present).
- Astro is the primary framework (see `package.json` dependencies).

## Directory Conventions
- Routes live in `src/pages/`.
- Layouts live in `src/layouts/`.
- Components live in `src/components/`.
- Shared TS utilities live in `src/lib/`.
- Global styling lives in `src/styles/global.css`.

## Implementation Defaults
- Prefer Astro components over client-side islands.
- Keep interactivity minimal and isolated to the smallest surface area.
- Do not add new frameworks/integrations without an explicit spec and governance approval.

## Portfolio Constraints (Project-Specific)
These are implementation constraints that commonly affect Astro work:
- No SSR unless explicitly approved: keep static hosting compatibility by default.
- Accessibility-first: semantic HTML is always the primary experience.
- Three.js is optional enhancement; do not place essential content inside WebGL or islands.

## Escalation Boundaries
Stop and escalate instead of implementing if the request implies:
- Changes to IA or content model (structure/taxonomy changes).
- Architecture changes (SSR, new runtime assumptions, new integrations).
- Three.js scene implementation (not just Astro integration).
