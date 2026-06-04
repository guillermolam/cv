# Astro Routing and Pages

## File-Based Routing
- Routes are defined by files in `src/pages/`.
- `index.astro` controls the root of a directory route (`/blog/`, `/portfolio/`).
- Dynamic routes use bracket notation (example: `src/pages/blog/[slug].astro`).

## Portfolio-Specific Routing Rules
- Do not rename or reorganize routes that reflect the site IA without escalation.
- Prefer additive routes over destructive changes (add new pages first, then deprecate with redirects only if specified).

## Common Route Implementation Tasks
- Add a new page: create a new `.astro` file under `src/pages/`.
- Add a section page under an existing route group: add to the existing folder and keep consistent naming.
- Ensure navigation links align with the existing header/footer patterns.

## Gotchas
- Breaking links is a recruiter UX regression: treat route changes as high-risk.
- Do not rely on hover-only interactions for navigation.
- If adding client JS for navigation behavior, justify why server-rendered HTML is insufficient.

## Validation Checklist
- Build succeeds.
- Primary routes render (home, about, cv, portfolio, contact, blog if present).
- No broken internal links for navigation changes.
