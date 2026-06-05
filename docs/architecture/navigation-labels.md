# Navigation Labels — v1

This document defines the visible navigation labels for the portfolio, independent of route paths. Route paths remain stable for build safety and SEO; labels and in-page section language communicate the updated section model.

## Primary Navigation (Header)

Primary nav labels MUST be exactly:
- Whoami
- Toolchain
- Experience
- Tutorials
- Knowledge Center
- Contact

Avoid in visible primary navigation:
- Home
- About
- CV
- Portfolio
- Blog

## Route-to-Label Map (Stable Paths)

Primary section mapping:
- `/` and `/{lang}/` → Whoami
- `/{lang}/toolchain` → Toolchain
- `/{lang}/experience` → Experience
- `/{lang}/blog` → Tutorials
- `/{lang}/knowledge` → Knowledge Center
- `/{lang}/contact` → Contact

Secondary/utility mapping (not in primary nav):
- `/{lang}/cv` → Briefing Pack (CV formats / downloads)
- `/{lang}/portfolio` → Proofs / Deployments (secondary)
- `/{lang}/case-studies/{slug}` → Mission Dossier (case study detail)
- `/{lang}/about` → Operator File (optional deeper bio)
- `/{lang}/content-index` → Content Index / Graph Diagnostics
- `/test/*` and `/design-system/*` → dev/test utilities (never primary)

## CTA Labeling Rules

- Prefer “Briefing Pack” for the main CV entry point when the CTA appears within the control-room narrative.
- Keep “Download CV” as an action label when the action is explicitly a download (format cards, buttons).
- Avoid icon-only labels; links must be meaningful out of context (screen readers, copy/paste, search).

## i18n Notes

- Labels above are the canonical English labels.
- If localized labels are introduced later, the underlying section model remains the same; do not change route paths to translate them.

## Nav Components (Control Room Console v1)

The header navigation is now rendered by two reusable components:

- **`SectionNavRail`** (`src/components/nav/SectionNavRail.astro`) renders the
  six primary sections as **animated-SVG glyphs** (`NavSectionGlyph`). The glyph
  is the primary signal; the text label is tiny and the full label is carried by
  a tooltip. Labels remain exactly as defined above — the glyph never replaces
  the accessible label (`aria-label` + tooltip).
- **`LanguageDial`** (`src/components/i18n/LanguageDial.astro`) replaces the
  per-language button selector with a single Flipper-Zero-style directional
  wheel. Language codes (EN/ES/FR/DE) and flags are shown on its LCD; the
  underlying language model and route paths are unchanged. See
  [language-dial.md](./language-dial.md).

Both emit decoupled `cr:sfx` audio cues (silent when muted). Neither changes the
route-to-label map above.

