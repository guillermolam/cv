# Information Architecture (IA) — Hybrid Cloud Control Room

Source of truth: [.trae/documents/master-implementation-plan-hybrid-cloud-control-room.md](file:///Users/guillermolammartin/Git/guillermolam/cv/.trae/documents/master-implementation-plan-hybrid-cloud-control-room.md)

This document defines the route hierarchy, navigation hierarchy, recruiter journey, CTA placement, and canonical routes for v1.

---

## Route Hierarchy

Language-scoped primary routes:
- `/{lang}/` — Control Room landing
- `/{lang}/about` — Professional summary, values, timeline highlights
- `/{lang}/cv` — Canonical CV page + downloads
- `/{lang}/portfolio` — Overview
  - `/{lang}/portfolio/development`
  - `/{lang}/portfolio/infra`
  - `/{lang}/portfolio/security`
- `/{lang}/case-studies/{slug}` — Case study detail (long-form proof)
- `/{lang}/blog` — Blog index (initially can be EN-first for posts; index still exists in all langs)
  - `/{lang}/blog/{slug}` — Blog post
- `/{lang}/contact` — Contact + social links

Non-language root:
- `/` — English default landing (or a light language chooser that routes to `/en/`, `/es/`, `/fr/`, `/de/`)

Supported languages (v1 requirement):
- `en`, `es`, `fr`, `de`

---

## Navigation Hierarchy

Primary navigation (header, persistent):
- Home
- About
- CV
- Portfolio
- Blog
- Contact
- Language switcher

Secondary navigation (within Portfolio):
- Overview
- Development
- Infrastructure
- Security

Tertiary navigation (contextual, within case studies and blog):
- Breadcrumbs (Home → Portfolio → Category → Item)
- “Related” modules (case studies/projects/blog) to connect proof pathways

Control Room (landing) in-page navigation (supplemental, non-essential):
- Station chips (link to anchors or portfolio categories)
- Topology Table links (deep-link rows)

Rules:
- Navigation must remain usable without WebGL and without JavaScript.
- Control Room navigation must duplicate (not replace) standard site navigation.

---

## Recruiter Journey

### Primary recruiter questions (mapped to routes)
1. Who is Guillermo and what role is he targeting?
   - Answered on `/{lang}/` (first screen) and `/{lang}/about`
2. What domains is he strong in?
   - Answered on `/{lang}/` (briefing rail + topology table) and `/{lang}/portfolio`
3. Where is the proof?
   - Answered via portfolio category routes + case studies + scannable topology index
4. Can I download a CV that fits my process (ATS, one-page, recruiter)?
   - Answered on `/{lang}/cv`
5. How do I contact him quickly?
   - Answered via persistent header CTA and `/{lang}/contact`

### Ideal flow (fast path)
`/{lang}/` → (Download CV) → (Portfolio) → (Flagship Case Study) → (Contact)

### Alternate flow (deep technical)
`/{lang}/` → Portfolio category → Case study → Blog post → CV → Contact

---

## CTA Placement

Landing page (first screen, above fold):
- Primary: **Download CV**
- Secondary: **View Portfolio**
- Proof CTA: **Flagship Case Study** (e.g., glam-hybrid-cloud)
- External proof links: GitHub, LinkedIn (present, not visually dominant over CV/Portfolio)

CV page:
- CV format selector with clear “use case” labels
- Direct download links (or “Coming soon” if a PDF is not present)
- Secondary CTA: Contact

Portfolio overview:
- Category entry cards (Development / Infrastructure / Security)
- Case study highlights

Case study detail:
- “Back to Portfolio”
- “Download CV”
- “Contact”

Contact:
- Email / form (if present) + social links (GitHub, LinkedIn)

Rules:
- CV download CTA must be available from every page via header or consistent page-level placement.
- CTAs must be text-first and accessible; avoid icon-only actions.

---

## Canonical Routes and SEO Canonicals

Canonical principles:
- Each language route is canonical for that language.
- `hreflang` links connect the same page across `en/es/fr/de`.

Canonical mapping rules:
- `/`:
  - If used as English default landing, canonical should be `/en/`
  - If used as language chooser, canonical should be `/` and it should not compete with `/en/` for indexing (implementation detail handled later)
- `/{lang}/...`:
  - Canonical: itself
  - Alternates: other languages via `hreflang`

Stable content identifiers:
- Case studies: `/{lang}/case-studies/{slug}` where `{slug}` is stable across languages (translations vary by content, not by path)
- Blog posts: `/{lang}/blog/{slug}` where `{slug}` is stable; translations optional

---

## IA Guardrails (Scope Control)

Avoid:
- A “dashboard-style homepage” where the first screen is widgets, charts, and panels.
- A “cloud console clone” interaction model.
- Navigation patterns that require canvas or pointer manipulation.

Enforce:
- Recruiter-first scannability.
- Content-first semantics.
- Progressive enhancement for any 3D.

