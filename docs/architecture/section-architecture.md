# Section Architecture — v1

This document defines the portfolio’s six primary sections and their architecture. It is UX/architecture only: no components, no implementation details.

## Final Section Model (Primary)

1. Whoami
2. Toolchain
3. Experience
4. Tutorials
5. Knowledge Center
6. Contact

## Route Stability Strategy

Route paths remain stable. Labels and section language change to match the model:
- “Tutorials” reuses the existing `/blog` routes and `blog` collection.
- “Knowledge Center” reuses `/knowledge` routes and `knowledgeResources` collection.
- “Briefing Pack” reuses the existing `/cv` route and `cvFormats` collection.
- “Proofs / Deployments” may continue to reuse the existing `/portfolio` routes as a secondary route set.

## Section Specifications

### 1) Whoami (Route: `/` and `/{lang}/`)

Purpose:
- Identity layer and recruiter-first first screen.

Content modules:
- Operator portrait/avatar zone (left)
- Stats panel (right) with short, scannable summaries
- Badges (explicitly factual, source-backed)
- Skill-dimension radar charts with text fallback
- Navigation key cluster under avatar (primary section links)

Data sources:
- `profile`, `skills`, `tools`, `certifications`, `experience` (summaries), and content-graph aggregates where available.

Progressive enhancement:
- Any 3D/animated avatar is non-essential; the operator portrait and core copy are HTML-first.
- Radar charts require an accessible table/list fallback.

### 2) Toolchain (Route: `/{lang}/toolchain`)

Purpose:
- Explain the technology surface area and connect tools to proof.

Baseline (non-3D):
- The current filterable HTML list is the canonical fallback.

Enhanced mode (future):
- 3D navigable node map as progressive enhancement (see [toolchain-3d-tree.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/architecture/toolchain-3d-tree.md)).

Data sources:
- `tools`, `skills`, `categories`, `tags`, `experience`, `projects`, `caseStudies`, `blog`, `knowledgeResources`, plus `public/data/content-graph.json` for link integrity and backlinks.

### 3) Experience (Route: `/{lang}/experience`)

Purpose:
- Primary proof narrative: timeline with cross-links to tools/projects/case studies and a CV selector.

Concept:
- “LinkedIn-like timeline, visually upgraded” without losing scannability.

Data sources:
- `experience` as the spine, with `cvFormats`, `projects`, `caseStudies`, `tools`, `skills`, and knowledge/tutorial links where present.

Constraints:
- Achievements must be factual or explicitly flagged as needing confirmation.
- CV downloads are governed strictly by `cvFormats` availability and file existence.

### 4) Tutorials (Route: `/{lang}/blog`)

Purpose:
- Guillermo-authored technical posts (tutorials) that link to proof and resources.

Rules:
- Reuse the existing `blog` collection.
- Draft posts must not publish public detail routes.

Data sources:
- `blog` primary; optional cross-links to `tools`, `projects`, `caseStudies`, `experience`, `knowledgeResources`.

### 5) Knowledge Center (Route: `/{lang}/knowledge`)

Purpose:
- Curated library of external references supporting the portfolio’s architecture and technical claims.

Rules:
- No graph explorer or canvas visualization here.
- Filter/search is allowed as progressive enhancement; HTML-first list remains primary.
- No iframing external content.

Data sources:
- `knowledgeResources` primary; relationships link into `tools`, `skills`, `categories`, `tags`, and proof content.

### 6) Contact (Route: `/{lang}/contact`)

Purpose:
- Professional channels and availability.

Data sources:
- `contactChannels`, `socialLinks`, plus `profile` metadata if present.

Constraints:
- Respect per-channel visibility; avoid exposing private channels.

## Secondary Routes (Not Primary Nav)

- `/{lang}/cv` — Briefing Pack (download flows; may also be embedded/linked from Experience)
- `/{lang}/portfolio` — Proofs / Deployments (secondary browsing)
- `/{lang}/case-studies/{slug}` — Mission Dossier details
- `/{lang}/content-index` — Graph diagnostics

