# Astro Performance

## Content-First Defaults
- Prefer build-time rendering and indexable HTML for critical content.
- Keep client-side JS intentional; use it for interaction and motion systems that improve understanding.
- Keep islands small and scoped; avoid hydrating large page sections that can remain server-rendered.

## Common Performance Levers
- Reduce hydration surface area.
- Avoid continuous loops for purely visual effects.
- Prefer CSS for simple interactions and transitions.
- Keep dependencies minimal; justify any new dependency with measurable benefit.

## Portfolio-Specific Risks
- Recruiter pages must stay fast on mobile.
- Avoid expensive runtime work on the home page.

## Validation Checklist
- Build output remains static (`dist/` produced; no SSR adapter assumptions).
- No new large dependencies introduced without justification.
- No essential content gated behind hydrated components.
