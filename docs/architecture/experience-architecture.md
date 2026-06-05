# Experience — Timeline + Briefing Pack Architecture

This document defines the Experience section as the primary proof narrative: a recruiter-readable timeline connected to tools, projects, case studies, tutorials, and knowledge resources.

## Route

- `/{lang}/experience`

## Label

- Experience

## Concept

“LinkedIn-like timeline, visually upgraded” with retro selectors and a control-room feel. The default presentation remains editorial and scannable; any 3D is decorative or assistive, never required.

## Required UX Modules

### Timeline (Spine)

Each timeline entry (role) includes:
- company name
- role title
- dates (start/end or current)
- short summary
- highlights/achievements list (factual; if uncertain, use `needsConfirmation`)
- skills gained (links)
- tools used (links)
- security/architecture domains (category/security facets when available)
- linked proof:
  - projects
  - mission dossiers (case studies)
  - tutorials (published only)
  - knowledge resources

### Briefing Pack Selector (CV Formats)

Embed or link a “Briefing Pack” module that:
- lists CV formats from `cvFormats`
- shows availability states
- only shows download action when:
  - `availability === "available"` AND
  - the file exists under `public/`

Interaction style:
- “retro selector” aesthetic is allowed (dial/selector/keys) but the underlying control must be standard HTML controls.

## Data Sources

Primary:
- `experience` (timeline entries)
- `cvFormats` (download formats and availability)

Supporting:
- `projects`, `caseStudies`, `tools`, `skills`, `categories`, `tags`, `knowledgeResources`, `blog` (published-only)
- `public/data/content-graph.json` for backlinks/related content and to avoid broken cross-links.

## Constraints

- No invented employers, dates, titles, achievements, or certifications.
- Achievements should be phrased as outcomes/behaviors; avoid numeric metrics unless sourced.
- Draft tutorials must never be linked as public detail pages.

## Progressive Enhancement Constraints

- Timeline must remain fully usable without JavaScript.
- Any 3D/animated selector must have an HTML baseline.
- Reduced-motion must disable non-essential animation and keep the timeline readable.

## Accessibility Requirements

- Use semantic headings and lists.
- Provide meaningful link labels (“Open case study: …”, not “Read more”).
- Ensure keyboard navigation across timeline and selector.

