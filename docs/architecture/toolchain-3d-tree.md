# Toolchain — 3D Tree Map (Progressive Enhancement)

This document defines the enhanced Toolchain experience as a 3D navigable map, while keeping the existing HTML-first Toolchain page as the canonical baseline fallback.

## Route

- `/{lang}/toolchain`

## Label

- Toolchain

## Baseline (Required, No-JS Safe)

The Toolchain page must always render:
- an HTML list/grid of tools
- a readable grouping structure (type/category/tag)
- evidence links (projects, case studies, experience, tutorials, knowledge resources) where relationships exist

The current filterable Toolchain page remains the baseline fallback.

## Enhanced Mode (Future, Optional)

### Visual Concept

3D tree map / technology graph:
- tools are represented as nodes
- relationships are represented as edges or proximity clustering
- categories form spatial “constellations”:
  - Development
  - Operations
  - Security
  - AI
  - Architecture & Integration

### Interaction Requirements

- Clicking a node:
  - moves the camera to the node (user-initiated; reduced-motion must disable animated travel)
  - opens a detail panel/modal (HTML overlay)
- Detail panel MUST explain:
  - what the tool is (short definition)
  - where Guillermo used it (experience links)
  - linked projects
  - linked mission dossiers (case studies)
  - related skills
  - related tutorials (published only)
  - related knowledge resources

### Data Model Requirements

The 3D layer must be driven by the same content graph:
- `tools` as the node set
- relationships derived from `*Ids` and `links[]`
- use `public/data/content-graph.json` for build-time integrity, not for runtime fetching

If the 3D layer needs runtime data, it MUST receive it from server-rendered JSON in the page (no remote fetch).

## Progressive Enhancement Constraints

- No essential content may exist only inside the canvas.
- Keyboard navigation must work:
  - nodes reachable via a parallel HTML list
  - the panel is keyboard accessible and closable
- Canvas must not trap focus.
- Reduced-motion must:
  - disable continuous motion
  - disable animated camera travel by default

## Accessibility Requirements

- The HTML fallback is canonical and must remain complete.
- Detail panel content is semantic and readable via screen readers.
- Visible focus states for all interactive controls.

