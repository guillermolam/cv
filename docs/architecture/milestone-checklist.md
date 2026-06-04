# Milestone Checklist — Hybrid Cloud Control Room

Source of truth: [.trae/documents/master-implementation-plan-hybrid-cloud-control-room.md](file:///Users/guillermolammartin/Git/guillermolam/cv/.trae/documents/master-implementation-plan-hybrid-cloud-control-room.md)

This document defines Phase-level acceptance criteria only. It is not an implementation task list.

---

## Architecture Complete (Phase 0)

Acceptance criteria:
- IA is defined and stable:
  - language-scoped routes `/{lang}/...` and non-language `/` behavior
  - canonical routes and deep-link expectations
- Content model schemas are defined (collections + fields) for:
  - Profile, Experience, Projects, Case Studies, Certifications, Blog, CV Formats
- Control Room blueprint is defined:
  - first-screen composition
  - recruiter briefing rail
  - topology table
  - station system
  - camera zones (conceptual)
  - overlay and navigation rules
  - mobile, reduced-motion, and non-WebGL fallback behaviors
- Three.js boundaries are defined with explicit prohibitions:
  - no essential content inside canvas
  - no WebGL-only navigation
  - no dashboard-style homepage
  - no cyberpunk HUD aesthetics
- Scope guardrails are explicit:
  - Three.js is progressive enhancement only
  - essential content is semantic HTML and indexable

Evidence:
- Architecture documents exist under `docs/architecture/` and are consistent with the master plan.

---

## Design Complete (Phase 1)

Acceptance criteria:
- A design system direction exists that supports:
  - premium dark technical aesthetic
  - readable typography hierarchy
  - visible focus states
  - sufficient contrast targets (without claiming compliance)
  - reduced-motion rules
- The “control room” look is defined without becoming:
  - a dashboard clone
  - a cloud console clone
  - a cyberpunk HUD
- Motion rules are specified:
  - what animates, when, and how it disables under reduced motion

Evidence:
- A design specification exists (outside the scope of this Phase 0 doc set) and matches the boundaries defined here.

---

## Specification Complete (Phase 1.5)

Acceptance criteria:
- Interaction spec for Control Room is unambiguous:
  - stations list and their semantics
  - deep-link behavior and fallbacks
  - overlay controls and required accessibility behavior
- Performance budgets are defined at the architecture level:
  - Three.js lazy-load requirement
  - avoidance of heavy assets in v1
  - mobile-first degradation rules
- Content strategy constraints are explicit:
  - EN/ES/FR/DE coverage for core pages
  - blog may be EN-first for long-form posts
  - no invented claims, employers, dates, metrics, or certifications

Evidence:
- There is a single, consistent interpretation path from the spec to implementation without requiring decisions about scope or intent.

---

## Astro Foundation Complete (Phase 2)

Acceptance criteria:
- Core pages exist and are navigable without JavaScript:
  - `/{lang}/`, `/{lang}/about`, `/{lang}/cv`, `/{lang}/portfolio`, `/{lang}/contact`, `/{lang}/blog`
- Static output is preserved (no SSR unless explicitly approved).
- SEO requirements are met:
  - canonical URLs set
  - `hreflang` alternates present for core pages
  - consistent metadata patterns
- Content collections are wired to render:
  - profile, experience, projects, case studies, certifications, blog, cvFormats
- Non-WebGL fallback hero exists and is “first-class” (not blank space).

Evidence:
- Core routes load in all supported languages.
- No essential content depends on canvas.

---

## ThreeJS Complete (Phase 3)

Acceptance criteria:
- Three.js hero is implemented as progressive enhancement:
  - loads after initial content and does not block readability
  - graceful failure path to fallback hero
- Reduced-motion behavior is correct:
  - no continuous animation loop under `prefers-reduced-motion: reduce`
  - user experience remains complete and not degraded in information hierarchy
- Mobile behavior is safe:
  - no scroll trapping
  - no significant battery/perf drain by default
  - degradation behavior is applied when necessary
- Cleanup/disposal behavior exists:
  - resources are released on teardown
  - no runaway render loops
- Boundary rules are respected:
  - no essential content inside canvas
  - no WebGL-only navigation
  - no HUD/panel overlays that mimic cyberpunk or dashboards

Evidence:
- WebGL disabled: landing page remains fully usable and visually coherent.
- Reduced motion: the landing page remains calm and readable.
