# Implementation Review (Design + Interaction) — Hybrid Cloud Control Room

Sources reviewed:
- [control-room-blueprint.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/architecture/control-room-blueprint.md)
- [ia.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/architecture/ia.md)
- [content-model.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/architecture/content-model.md)
- [threejs-boundaries.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/architecture/threejs-boundaries.md)
- [.trae master plan](file:///Users/guillermolammartin/Git/guillermolam/cv/.trae/documents/master-implementation-plan-hybrid-cloud-control-room.md)

This review identifies missing design decisions, ambiguous interactions, and risks (UX, accessibility, mobile) that should be resolved before implementation begins.

---

## Missing Design Decisions

Typography:
- Final font choice (system-first vs dedicated webfont) and weights (400/500/600/700) to standardize hierarchy.
- Exact typographic treatment of:
  - station chips (mono vs sans)
  - topology table labels (caps/spacing rules)
  - long-form article typography (case studies/blog)

Grid and layout:
- Canonical layout grid (max width, gutters, and column behavior) for:
  - hero + briefing rail
  - topology table
  - content pages (about/cv/portfolio/blog/case studies)
- Breakpoints that define when the rail becomes stacked (mobile) vs side rail (desktop).

Color system details:
- Final neutral base (graphite vs blue-black) and accent hue selection (single family).
- Semantic color mapping for status states (success/warn/danger) to ensure consistency and accessibility.

Component styling:
- Card and table styling rules that avoid “dashboard widget” appearance while still being scannable.
- Category differentiation for Development / Infra / Security (label + subtle accent rules).

Three.js visual integration:
- How strongly the 3D background should contrast relative to the content (target: low-contrast ambient).
- A consistent “station focus” visual language (what changes per station: density, cluster emphasis, hue, or geometry).

---

## Ambiguous Interactions

Deep-link behavior:
- The blueprint allows `?station=<id>` as optional enhancement, but does not define:
  - precedence between `?station=` and `#station-*`
  - whether selecting a station should scroll to content sections, or remain “hero-only” focus by default

Station navigation targets:
- The blueprint permits station chips to link to anchors or routes. A single rule is needed:
  - stations on home should either always anchor-jump (recommended) or always route to portfolio categories, with the other as a secondary action.

Recruiter Briefing Rail stickiness:
- It says “sticky” but does not define the sticky boundaries:
  - sticky only during hero (recommended) vs sticky through the entire page (risks dashboard feel).

Command Palette scope:
- Defined as a pattern, but not defined whether it’s v1-required or a v1.5 enhancement.
- Needs a rule for mobile (likely not needed; bottom sheet covers core needs).

CV Dock behavior:
- Architecture defines CV formats schema; interaction needs:
  - default selected format
  - ordering of formats by recruiter value
  - what happens when a format is “coming soon” (must remain credible)

---

## UX Risks

Recruiter readability risk:
- If the hero becomes visually dominant (3D contrast too high), it will compete with the briefing rail and CTAs.
- If the Topology Table is not prominent early, the “proof index” value is lost.

Template vibe risk:
- If cards/tables adopt common UI kit styling, the site risks looking like a generic portfolio.

Over-technical risk:
- Station naming and topology language must remain understandable to recruiters; keep short explanations (signal/proof) close to technical terms.

CTA clarity risk:
- If multiple CTAs compete, recruiters may miss “Download CV”.

---

## Accessibility Risks (WCAG-oriented)

Focus visibility:
- Dark UIs often ship weak focus rings; focus must be deliberately designed and consistent.

Canvas interference:
- Even as progressive enhancement, the canvas can:
  - capture pointer events
  - create scroll-jank
  - reduce overlay contrast
  - trap keyboard focus if misconfigured

Reduced motion:
- Must be treated as a first-class mode:
  - no continuous ambient motion
  - minimal transitions
  - no “motion toggle” that defaults on under reduced motion

Color-only differentiation:
- Portfolio categories and statuses must not rely on color alone; labels are required.

---

## Mobile Risks

Above-the-fold clarity:
- Mobile must show H1 + primary CTA immediately; a 3D hero must not push key copy below the fold.

Rail translation:
- The briefing rail becomes a stacked panel or bottom sheet; if it becomes too tall, it will feel like a dashboard panel.

Touch ergonomics:
- Station chips must be finger-friendly and not require precision tapping on small targets.

Performance:
- Mobile defaults must prioritize battery and scroll smoothness; 3D may need to be off by default for some devices.

---

## Required Changes Before Implementation (Design-Level)

These are design decisions that should be locked before building components.

1. Decide `/` behavior for SEO:
   - English default landing (canonical `/en/`) vs language chooser (canonical `/`)
2. Define the canonical grid:
   - max width, gutters, breakpoints, and rail behavior
3. Lock the typographic system:
   - font(s), sizes/weights, line-heights, heading treatments, label style
4. Lock the color system:
   - neutrals + single accent family + semantic mappings
5. Define station interaction rule:
   - anchor-first station navigation (recommended) with optional “View category” secondary action
6. Define 3D contrast budget:
   - background must remain subdued so text is always dominant
7. Define reduced-motion defaults:
   - what becomes static and what remains minimally transitional
8. Decide v1 scope of the command palette:
   - required vs optional enhancement

---

## Design Approval Verdict

Verdict: **Approved with blockers**

Rationale:
- The architecture correctly enforces content-first, recruiter-first, and progressive enhancement constraints.
- The “control room” metaphor is well-scoped (not a dashboard, not a HUD).
- Before implementation, key design tokens and a few interaction rules must be locked to prevent drift and rework.

