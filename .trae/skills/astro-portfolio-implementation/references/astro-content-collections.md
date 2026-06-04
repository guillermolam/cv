# Astro Content Collections

## Current-State Rule
Inspect the repository before assuming content collections exist.

Signals that collections are in use:
- `src/content/config.*` exists
- content entries exist under `src/content/**`
- pages import `getCollection` / `getEntry` (or equivalent) from Astro content APIs

If none of the above exist:
- Do not invent schemas or data shapes.
- Treat “add content collections” as a spec-worthy change if it alters the site content model.

## When to Use Collections
Good candidates:
- Blog posts and case studies with shared frontmatter fields
- Portfolio projects with a stable schema
- Reusable CV/skills data that must render consistently across pages

Avoid collections when:
- The data is one-off page copy
- The change is purely presentational

## Safety Rules
- Schema changes can be breaking: coordinate with the project content model.
- Do not rename fields or migrate content without a clear plan and validation.

## Validation Checklist
- `astro check` passes.
- Collection schema matches actual entry frontmatter.
- All collection-driven routes build successfully.
