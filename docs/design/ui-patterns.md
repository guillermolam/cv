# UI Patterns — Hybrid Cloud Control Room

Sources of truth:
- [control-room-blueprint.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/architecture/control-room-blueprint.md)
- [ia.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/architecture/ia.md)
- [threejs-boundaries.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/architecture/threejs-boundaries.md)

This document defines core UI patterns required by the “Hybrid Cloud Control Room” narrative. Patterns prioritize recruiter scannability and accessibility. Where “control room” elements exist, they are editorial and minimal, not a dashboard or HUD.

---

## Recruiter Briefing Rail

Purpose:
- Answer recruiter questions fast (role, domains, proof, contact) without scrolling.

Desktop layout:
- Right-side rail aligned with hero block.
- Sticky within the hero/first section only (avoid “always-on” dashboard rail).

Content modules (required):
- Role Target
- Domains
- Proof Links (CV primary; portfolio + flagship case study + GitHub/LinkedIn secondary)
- Snapshot (only if present in source content)
- Contact shortcuts

States:
- Default (expanded)
- Collapsed (optional on smaller desktop widths; must still be readable)

Accessibility:
- Ensure links are descriptive (“Download CV (ATS)”, not “Download”).
- Avoid hover-only reveals.

ASCII wireframe:
```
┌──────────────────────────────┐
│ Recruiter Briefing           │
├──────────────────────────────┤
│ Role Target                  │
│ Cloud Security / DevSecOps   │
├──────────────────────────────┤
│ Domains                      │
│ Kubernetes · GitOps · SSC... │
├──────────────────────────────┤
│ Proof Links                  │
│ [Download CV]                │
│ [Portfolio] [Case Study]     │
│ GitHub · LinkedIn            │
├──────────────────────────────┤
│ Snapshot                     │
│ Timezone · Location          │
├──────────────────────────────┤
│ Contact                      │
│ Email · Contact page         │
└──────────────────────────────┘
```

---

## CV Dock

Purpose:
- Make CV formats discoverable and chooseable by use case (recruiter vs ATS vs one-page).

Placement:
- On `/{lang}/cv` as the first primary module.
- Also accessible from every page via a consistent “Download CV” CTA.

Structure:
- Format cards with:
  - title
  - use case label (“ATS-friendly”, “Recruiter summary”, “One-page”)
  - availability state (available / coming soon)
  - download action (if available)

States:
- Available (download enabled)
- Coming soon (disabled button + explanation)

Accessibility:
- Buttons must be text-labeled.
- Disabled state must not be the only signal; include “Coming soon”.

ASCII wireframe:
```
┌──────────────────────────────────────────────┐
│ CV Dock                                      │
├──────────────────────────────────────────────┤
│ [ATS CV]        [Recruiter CV]   [One-page]  │
│ Use: Screening  Use: Hiring mgr  Use: Quick  │
│ [Download]      [Download]       [Coming...] │
└──────────────────────────────────────────────┘
```

---

## Mission Dossier (Case Study Template)

Purpose:
- Present long-form proof without blog-like sprawl.

Structure (recommended):
- Title + short excerpt
- “At a glance” (role, systems, tools, timeframe) only if factual and sourced
- Sections: Problem → Approach → Outcome
- Responsibilities list
- Links back to portfolio category and CV

Tone:
- Direct, operational, credible.
- Avoid marketing fluff.

Accessibility:
- Use semantic headings (`h2`/`h3`) and lists.
- Provide meaningful link labels.

ASCII wireframe:
```
┌──────────────────────────────────────────────┐
│ Mission Dossier: <Title>                     │
│ <Excerpt>                                    │
├──────────────────────────────────────────────┤
│ At a glance:                                 │
│ Role · Stack · Domain                        │
├──────────────────────────────────────────────┤
│ Problem                                      │
│ ...                                          │
│ Approach                                     │
│ ...                                          │
│ Outcome                                      │
│ ...                                          │
├──────────────────────────────────────────────┤
│ Responsibilities                              │
│ - ...                                        │
└──────────────────────────────────────────────┘
```

---

## Station Overlay

Purpose:
- Provide minimal “control room” cues above the hero without becoming a HUD.

Allowed overlay elements:
- Station label (short)
- Focus indicator (static by default)
- Controls: “Skip 3D”, optional “Toggle motion”

Placement rules:
- Must not obscure H1, CTAs, or the briefing rail.
- Must remain readable regardless of background (increase UI contrast rather than adding glow).

Interaction:
- Station selection is performed via HTML chips/links; overlay label updates accordingly.

Accessibility:
- Overlay controls must be keyboard reachable.
- Canvas must not capture focus by default.

ASCII wireframe:
```
┌──────────────────────────────────────────────┐
│ [Station: Supply Chain]      [Skip 3D] [Motion]│
│                                              │
│ H1 / H2 / CTAs (always readable)             │
└──────────────────────────────────────────────┘
```

---

## Command Palette

Purpose:
- A fast navigation accelerator for power users while keeping standard nav primary.

Scope:
- Jump to routes: Home, About, CV, Portfolio, Blog, Contact
- Jump to stations (anchors) and portfolio categories
- Optional: search projects/case studies by title

Trigger:
- Keyboard: `Ctrl+K` / `Cmd+K` (conceptual)
- Visible entry point: small “Search” action in header (optional)

Constraints:
- Must not be required for navigation.
- Must be fully accessible (focus trap inside modal, escape to close, screen reader labels).

ASCII wireframe:
```
┌──────────────────────────────────────────────┐
│ Command Palette                              │
│ > Search routes, stations, projects...       │
├──────────────────────────────────────────────┤
│ Home                                         │
│ CV (Download formats)                        │
│ Portfolio → Security                         │
│ Station → GitOps & Delivery                  │
│ Case study → <Flagship>                      │
└──────────────────────────────────────────────┘
```

---

## Mobile Bottom Sheet

Purpose:
- Provide a mobile-safe replacement for the desktop rail and “control room” overlays.

Content:
- Recruiter briefing summary
- Primary CTAs (Download CV, Portfolio)
- Station navigation shortcuts

Behavior:
- Collapsed “handle” state by default to preserve above-the-fold headline.
- Expandable by user action only; no auto-expansion.

Accessibility:
- Must be reachable and operable by keyboard (where applicable) and screen readers.
- Must not trap scroll unintentionally.

ASCII wireframe:
```
┌──────────────────────────────┐
│ H1 / H2 / CTAs               │
│                              │
│ (Hero background / optional) │
├──────────────────────────────┤
│  ┌────────────────────────┐  │
│  │ Recruiter Briefing ▴   │  │
│  │ Download CV · Portfolio│  │
│  │ Stations: ...          │  │
│  └────────────────────────┘  │
└──────────────────────────────┘
```

