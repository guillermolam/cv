# Whoami — Operator Profile Architecture

This document defines the Whoami section’s UX architecture (homepage identity layer) using the control-room narrative. It is recruiter-first and content-first: enhancements must never block comprehension.

## Route

- `/` and `/{lang}/`

## Label

- Whoami

## Concept

Gamified operator profile: “player bio / operator desk” aesthetic, but presented as a credible professional identity panel (not a cartoon game UI).

## Layout Requirements (Desktop)

Two-lane split:
- Left lane: operator portrait/avatar, key cluster navigation.
- Right lane: scannable stats panel (recruiter-first).

Required modules:
- Operator portrait/avatar (always present as image fallback).
- Navigation key cluster below portrait:
  - 6 primary keys matching nav labels (Whoami, Toolchain, Experience, Tutorials, Knowledge Center, Contact).
  - Keys resemble retro 3D keyboard keys (realistic, not playful).
- Stats panel:
  - education summary (factual)
  - languages summary (factual)
  - certifications summary (factual; if uncertain, display “In progress” or “Needs confirmation”)
  - skills summary (derived from curated skill list; do not claim objective rankings)
  - achievements/impact summary (only with evidence, otherwise clearly flagged)
  - soft skills summary (if present in content; otherwise omit)
  - badge strip (explicit, not implied)
- Radar charts for skill dimensions:
  - Must include accessible text fallback (table/list) describing axes and approximate values.

## Scoring Rules (If Displayed)

- Scores are presentation aids, not objective truth.
- Score values must be derived from:
  - explicit content graph relationships (evidence links)
  - curated skill levels (if present)
  - explicit experience highlights (if present)
- If the derivation cannot be stated simply and honestly, do not show a numeric score.

## Data Sources

Primary:
- `profile` (headline, summary, location/timezone if present)
- `skills` (names, optional levels)
- `experience` (role summaries/highlights)
- `certifications` (status + evidence fields)
- `socialLinks` / `contactChannels` (shortcuts only)

Supporting:
- `public/data/content-graph.json` for relationship counts, not for private details.

## Progressive Enhancement Constraints

- Any 3D avatar or animated enhancement is optional and must degrade to an image without layout shifts.
- Charts must degrade to readable HTML summaries.
- Motion must respect reduced-motion and cannot gate the CTA/primary nav.

## Accessibility Requirements

- All nav keys are keyboard-focusable links with visible focus states.
- No essential information conveyed by color alone.
- Charts include text fallback and meaningful headings.
- Content remains readable at 320px width.

