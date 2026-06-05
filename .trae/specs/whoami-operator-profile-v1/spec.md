# Whoami — Operator Profile (Player Bio) v1 Spec

## Why
The current hero/operator card reads like a conventional portfolio header. The Whoami section must become the “box art” of the portfolio: a recruiter-comprehension-first operator profile that makes identity, domains, and proof pathways obvious in under 30 seconds.

## What Changes
- Replace the current homepage hero/operator card with a Player Bio / Operator Profile layout (desktop 3-column, mobile stacked).
- Introduce a “retro keyboard cluster” navigation module that switches between Whoami subviews (Skills, Certifications, Education, Languages, Experience Summary).
- Add a Player Stats Panel with eight categories (Cloud, Security, DevSecOps, Kubernetes, Architecture, Leadership, Automation, AI), each showing score + confidence + evidence source.
- Add a radar chart for the eight categories with an accessible table fallback.
- Add a curated badge collection (explicitly factual, content-derived) for quick recruiter scanning.
- Preserve the control-room narrative and motion system; no fantasy/cyberpunk/esports aesthetics.

## Impact
- Affected specs/docs:
  - [whoami-player-bio.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/architecture/whoami-player-bio.md)
  - [navigation-labels.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/architecture/navigation-labels.md)
  - [section-architecture.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/architecture/section-architecture.md)
  - [control-room-blueprint.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/architecture/control-room-blueprint.md)
  - [ui-patterns.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/design/ui-patterns.md)
  - [design-system.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/design/design-system.md)
  - [motion-system.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/design/motion-system.md)
  - [art-direction.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/design/art-direction.md)
- Affected code (expected; implementation later):
  - Home page routes: `src/pages/index.astro`, `src/pages/[lang]/index.astro` (or current equivalent)
  - Control-room hero components (current hero/operator modules)
  - Content aggregation utilities under `src/lib/content/**` (build-time derivation only)
  - Minimal client script for keyboard cluster enhancement (optional)

---

## ADDED Requirements

### Requirement: Player Bio / Operator Profile layout
The system SHALL render a Whoami layout that resembles a videogame character “player bio” screen while remaining recruiter-readable and consistent with the Hybrid Cloud Control Room art direction.

Constraints:
- Must not resemble: fantasy, neon cyberpunk HUD, esports styling, FIFA card styling, collectible card UI.
- Must preserve existing control-room identity: dark navy palette, glass/brushed metal surfaces, CRT phosphor accents, realistic lighting.
- Must remain readable and scannable at 320px width.

#### Scenario: Recruiter arrives (desktop)
- **WHEN** a recruiter loads `/` or `/{lang}/` on desktop
- **THEN** they see a three-column operator profile:
  - Left: avatar/portrait + status + keyboard cluster navigation
  - Center: operator identity + badge strip + “current focus” summary
  - Right: stats panel + radar chart + evidence cues

#### Scenario: Recruiter arrives (mobile)
- **WHEN** a recruiter loads `/` or `/{lang}/` on mobile
- **THEN** the layout stacks without hiding essential identity/CTAs, and all modules remain readable without horizontal scrolling.

---

### Requirement: Retro keyboard cluster navigation (no standard tabs)
The system SHALL provide a keyboard-key cluster that navigates between Whoami subviews:
- Skills View
- Certifications View
- Education View
- Languages View
- Experience Summary View

Baseline (no-JS safe):
- Keys MUST be standard links that jump to in-page anchors (e.g., `#skills`, `#certifications`, etc.).

Enhanced (optional JS):
- The system MAY upgrade anchor navigation into a “panel switcher” (tab-like behavior) while keeping link semantics and preserving back/forward behavior.
- The visual MUST remain “retro keyboard keys” (physical press illusion).

#### Scenario: No JavaScript
- **WHEN** JavaScript is disabled
- **THEN** clicking a key navigates to the relevant content section on the page, and all sections remain accessible by scrolling.

#### Scenario: JavaScript enabled
- **WHEN** JavaScript is enabled and a key is activated
- **THEN** the associated panel becomes visually foregrounded and others de-emphasized without removing them from the accessibility tree unless the interaction model is explicitly a disclosure/panel pattern.

---

### Requirement: Stats panel with derived scoring (no invented numbers)
The system SHALL display a stats panel with these categories:
- Cloud
- Security
- DevSecOps
- Kubernetes
- Architecture
- Leadership
- Automation
- AI

Each category SHALL include:
- score (0–100) OR “N/A (insufficient evidence)”
- confidence label (Low/Medium/High)
- evidence source summary (human-readable)

Scoring rules:
- Scores MUST be derived from existing content collections and graph relationships (not subjective claims).
- Scores MUST be explicitly presented as a “portfolio evidence index”, not an objective competency rating.
- If derivation cannot be explained simply, render “N/A” instead of a number.

Evidence sources (allowed):
- Count of related proof nodes (projects, case studies, published tutorials, experience entries) connected via `*Ids` and `links[]`.
- Skill levels only if explicitly represented in content (no inference).
- “Needs confirmation” reduces confidence, not the score (unless the score would become misleading).

Proposed minimal scoring model (deterministic, seed-safe):
- For each category axis:
  - `evidenceCount = projects + caseStudies + publishedBlog + experience`
  - `score = clamp(round(20 * log2(1 + evidenceCount)), 0, 100)`
  - `confidence =`
    - High if `evidenceCount >= 6` and `needsConfirmationCount == 0`
    - Medium if `evidenceCount >= 3`
    - Low otherwise
- If `evidenceCount == 0` → show `N/A` and confidence “Low”.

#### Scenario: Seed data is sparse
- **WHEN** there is not enough evidence for an axis
- **THEN** the UI shows `N/A` and does not imply competence via placeholders.

---

### Requirement: Radar chart with accessible fallback
The system SHALL render a radar chart for the eight categories.

Constraints:
- The chart MUST have an accessible text/table fallback that enumerates each axis and its current value/confidence.
- The chart MUST not require a third-party charting dependency.

Baseline:
- HTML table (or definition list) is always present and visible to assistive tech.

Enhanced:
- An SVG radar chart MAY be shown as a visual layer, with the table as fallback/alternate representation.

#### Scenario: Screen reader
- **WHEN** a screen reader user navigates the Whoami section
- **THEN** they can access the stats values and evidence summaries without interpreting the chart.

---

### Requirement: Badge collection (factual, content-derived)
The system SHALL display a set of badges (e.g., Cloud Security, DevSecOps, Kubernetes, Platform Engineering, AI Security, Supply Chain Security) derived from curated taxonomy and/or explicit profile fields.

Constraints:
- Badges MUST map to real content/taxonomy present in the repository.
- Badges MUST not imply certification or achievement unless evidence exists.

---

### Requirement: Progressive enhancement and reduced motion (non-negotiable)
The Whoami implementation SHALL be Astro-first and static-first.

Non-negotiable constraints:
- No mandatory JavaScript for accessing content.
- Reduced-motion disables non-essential transitions and prevents motion-gated comprehension.
- No canvas-only content; avatar/3D is optional and must have image fallback.

---

## MODIFIED Requirements

### Requirement: Homepage hero semantics (Whoami replaces “traditional hero”)
The homepage SHALL prioritize the Whoami operator profile as the first-screen identity layer.

**BREAKING (visual)**: the previous hero/operator card layout is replaced.
**Non-breaking (routes)**: route paths remain stable (`/` and `/{lang}/`).

---

## REMOVED Requirements

### Requirement: Conventional portfolio hero structure
**Reason**: The site’s first screen must communicate identity and proof pathways through the operator profile metaphor rather than generic hero patterns.
**Migration**: Existing hero content becomes inputs to the Whoami modules (identity, CTAs, proof rail references) rather than a standalone hero block.

---

## Information Architecture (Whoami internal)

Whoami is a single page with internal subviews/panels:
- `#core` (default anchor state): Operator Identity + badges + top CTAs
- `#skills`
- `#certifications`
- `#education`
- `#languages`
- `#experience`

The keyboard cluster keys map to these anchors for baseline behavior.

---

## Component Hierarchy (proposed)

No implementation is performed in this spec. The following is the intended architecture:

- `WhoamiSection` (page composition)
  - `OperatorPortraitPanel` (left column)
    - `AvatarFrame` (image fallback always present; optional 3D enhancement)
    - `OperatorStatusIndicator` (text + icon)
    - `KeyboardClusterNav` (keys as links; optional enhanced press animation)
  - `OperatorIdentityPanel` (center column)
    - `IdentityHeader` (name, role, focus, availability)
    - `BadgeStrip` (factual badges)
    - `PrimaryCTACluster` (Briefing Pack, Experience, Contact)
  - `OperatorStatsPanel` (right column)
    - `StatsGrid` (8 axes rows with score/confidence/evidence)
    - `RadarChart` (SVG optional) + `RadarTableFallback` (always present for a11y)
    - `EvidenceNotes` (short explanation of scoring)

---

## Data Sources (build-time only)

Primary inputs:
- `profile` (identity strings)
- `skills` (curated skills; optional levels if present)
- `experience` (timeline summaries)
- `certifications` (status + evidence)
- `projects`, `caseStudies`, `blog` (published-only), `knowledgeResources` (supporting evidence)
- `public/data/content-graph.json` (relationship counts and backlinks; never as the only source of essential text)

Data derivation rules:
- All derived stats MUST be computed at build time (Astro server-side) and rendered into HTML.
- Any client-side enhancement MUST read server-rendered data attributes (no remote fetch).

---

## Accessibility Strategy

- Semantic headings: one `h1` for page identity; subsections `h2`/`h3` in correct order.
- Keyboard cluster:
  - Baseline: links to anchors (native keyboard support).
  - Enhanced: optionally add `aria-current` on active key; preserve link semantics.
- Radar chart:
  - Always provide a table/list fallback; ensure values and evidence are readable without the graphic.
- Status/score:
  - No color-only meaning; include text labels (“High confidence”, “N/A”).
- Focus states:
  - Visible and stable (no glow halos that drift into HUD aesthetics).

---

## Motion Specification (Whoami)

Use [motion-system.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/design/motion-system.md) timing categories:

- Key press micro-interaction: 100–140ms (press down/up illusion).
- Panel emphasis transition (enhanced mode): 180–240ms opacity/translate (≤ 8px).
- Badge hover/active: micro duration, border/value shift only (no glow).

Reduced motion:
- No idle loops on the Whoami modules.
- Replace panel transitions with instant state change (or ≤180ms crossfade only when necessary for readability).

---

## Keyboard Interaction Specification

Inputs:
- Pointer click/tap on keys
- Keyboard activation (Enter/Space) on focused key links
- Optional shortcuts (future): none in v1 (avoid scope creep)

Behavior:
- Keys are always navigational links (baseline).
- Active key is indicated via pressed styling + `aria-current="true"` (or equivalent) when a section is active/targeted.
- The active state must track URL hash when present.

---

## Mobile Layout

Required stacking order (top to bottom):
1. Operator identity (name/role/focus/availability)
2. Primary CTAs (Briefing Pack, Experience, Contact)
3. Avatar/portrait (or keep at top if it improves recognition; choose the option that preserves immediate identity)
4. Keyboard cluster (compact, horizontally scroll-free; wrap if needed)
5. Stats panel + radar table fallback
6. Subviews sections (skills/certs/edu/lang/experience)

Constraints:
- No horizontal scroll.
- Maintain tap targets ≥ 44px height for key buttons.

---

## Recruiter 30-Second Scan Flow (success definition)

Within 30 seconds, the Whoami screen SHALL make it obvious:
- Who Guillermo is (name + role)
- What he specializes in (badges + top domains)
- What differentiates him (control-room proof structure cues + evidence index)
- How to proceed (CTAs + nav keys)

---

## Performance Budget

Hard constraints:
- No new runtime dependencies.
- Avoid charting libraries; prefer SVG for radar chart.

Budgets (Whoami incremental):
- Additional client JavaScript for Whoami enhancement ≤ 8KB gzip.
- No additional blocking network requests required for Whoami functionality.
- 3D/avatar enhancements must lazy-load and never delay first contentful paint.

