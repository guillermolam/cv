# Design System — Hybrid Cloud Control Room

Sources of truth:
- [control-room-blueprint.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/architecture/control-room-blueprint.md)
- [ia.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/architecture/ia.md)
- [content-model.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/architecture/content-model.md)
- [threejs-boundaries.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/architecture/threejs-boundaries.md)
- [.trae master plan](file:///Users/guillermolammartin/Git/guillermolam/cv/.trae/documents/master-implementation-plan-hybrid-cloud-control-room.md)

This system defines the visual primitives needed to deliver a premium, recruiter-friendly, dark-mode-first portfolio. Three.js is a background enhancement and must not dictate hierarchy or readability.

---

## Typography Scale

### Base Rules
- Default body: readable, calm, not “futuristic”.
- Prefer line length: ~60–80 characters for long-form (case studies/blog).
- Use optical hierarchy via size/weight/spacing, not glow, stroke, or neon.

### Recommended Scale (rem-based)

Assume `1rem = 16px` base.

| Token | rem | px | Use |
|------:|----:|---:|-----|
| `--font-size-00` | 0.8125 | 13 | meta labels, helper text (use sparingly) |
| `--font-size-0`  | 0.875  | 14 | small UI, nav, table labels |
| `--font-size-1`  | 1.0    | 16 | body default |
| `--font-size-2`  | 1.125  | 18 | lead paragraphs, key summaries |
| `--font-size-3`  | 1.25   | 20 | section intro |
| `--font-size-4`  | 1.5    | 24 | h3 / card titles |
| `--font-size-5`  | 1.875  | 30 | h2 |
| `--font-size-6`  | 2.25   | 36 | h1 (desktop) |
| `--font-size-7`  | 2.75   | 44 | hero h1 (large desktop) |

Line-height guidance:
- UI labels: 1.2–1.35
- Body: 1.55–1.75
- Headlines: 1.05–1.2

Letter-spacing guidance:
- Default: normal
- Small caps / labels only: +0.04em to +0.08em (avoid wide tracking on paragraphs)

---

## Font Recommendations

### Primary (UI + Body)
Recommended approach: a system-first stack for performance, with an optional premium webfont later.

System-first stack:
- `ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"`

If choosing a dedicated webfont later (optional, not required by architecture):
- Inter (neutral, recruiter-friendly)
- IBM Plex Sans (technical but not sci-fi)
- Source Sans 3 (highly readable)

### Secondary (Monospace for technical flavor)
Use for tags, short code-like snippets, and small “signal” labels (not for paragraphs).

Stack:
- `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`

---

## Heading Hierarchy (Semantic + Visual)

Rules:
- Heading levels must match document structure (SEO + accessibility).
- Visual size can vary by context, but semantics do not.

Mapping:
- `h1`: Page identity
  - Home: “Cloud Security & DevSecOps Engineer” (or equivalent from Profile content)
  - Case study/blog: title
- `h2`: Primary sections (Stations, Portfolio categories, CV formats)
- `h3`: Subsections (module titles inside a station; case study sections like Problem/Approach/Outcome)
- `h4`: Component titles (cards, tables, side rails)

Visual emphasis:
- `h1`: weight 600–700, no glow, strong contrast
- `h2`: weight 600, slightly muted than `h1`
- `h3/h4`: weight 600, compact spacing

---

## Spacing System

### Base Unit
Use a 4px base scale for predictable rhythm.

Tokens:
| Token | px | Use |
|------:|---:|-----|
| `--space-1` | 4 | tight gaps, icon-label spacing |
| `--space-2` | 8 | small padding |
| `--space-3` | 12 | dense components |
| `--space-4` | 16 | default component padding |
| `--space-5` | 20 | card padding (compact) |
| `--space-6` | 24 | card padding (comfortable) |
| `--space-8` | 32 | section spacing (compact) |
| `--space-10`| 40 | section spacing (default) |
| `--space-12`| 48 | section spacing (hero separation) |
| `--space-16`| 64 | major section breaks |

Layout rhythm rules:
- Sections use consistent top/bottom spacing; do not “invent” random spacing per page.
- Rails and cards should align to the same vertical rhythm (baseline spacing repeated).

---

## Surface System (Dark-Mode First)

Surfaces are used to create depth without “dashboard widgets”.

Recommended surfaces:
- `--surface-bg` (page background): near-black with slight chroma (blue/graphite), not pure black.
- `--surface-1` (default panels): subtle lift over bg.
- `--surface-2` (elevated panels): slightly brighter than surface-1.
- `--surface-3` (spotlight): reserved for primary CTAs or flagship callouts.

Surface rules:
- Prefer subtle value shifts + borders over heavy shadows.
- Avoid nested surfaces deeper than 2 levels (prevents dashboard feel).

---

## Border System

Borders define structure and calm precision.

Tokens:
- `--border-1`: 1px hairline
- `--border-2`: 2px emphasis (rare)
- `--radius-1`: 8px (chips/buttons)
- `--radius-2`: 12px (cards/panels)
- `--radius-3`: 16px (hero containers, large callouts)

Rules:
- Use borders for separation on dark surfaces; avoid aggressive glows.
- Border color should be a low-contrast neutral, with an accent variant for focus/active.

---

## Elevation System

In dark UI, “elevation” should be mostly achieved with:
- surface value shift
- border contrast
- very soft shadow (optional, minimal)

Levels:
- `elevation-0`: background (no shadow)
- `elevation-1`: cards/rails (soft shadow + border)
- `elevation-2`: popovers/command palette (slightly stronger shadow + tighter border)

Rule:
- Avoid strong drop shadows that read like a SaaS dashboard component library.

---

## Focus States (Keyboard + Accessibility)

Non-negotiables:
- Visible focus indicator on all interactive elements.
- Focus must be obvious on dark surfaces and not reliant on color alone.

Recommended focus style (conceptual tokens):
- `--focus-ring-color`: accent with sufficient contrast
- `--focus-ring-width`: 2px
- `--focus-ring-offset`: 2px (offset from element edge)
- `--focus-ring-shadow`: optional subtle outer glow at low opacity (avoid neon)

Behavior rules:
- Use `:focus-visible` semantics (visual design intent: show focus when keyboarding).
- Focus should not cause layout shift.

---

## CTA Styles

CTA hierarchy must align with IA (Download CV is primary).

Variants:
- **Primary CTA**
  - filled surface
  - high contrast label
  - optional leading icon (not icon-only)
- **Secondary CTA**
  - outline or low-contrast fill
  - never visually equal to Primary on the landing page
- **Tertiary CTA / Link**
  - text link with underline on hover/focus

States:
- Default, hover, active, focus-visible, disabled

Rules:
- Primary CTA must remain recognizable in reduced motion and without hover.
- Minimum hit target: ~44×44px for touch contexts.

---

## Color Tokens (Primitive)

Palette intention:
- “Graphite control room” with restrained blue-cyan accent.
- Avoid neon, magenta, and heavy saturation.

Primitive tokens (conceptual names):
- Neutrals:
  - `--neutral-0` (near-black bg)
  - `--neutral-1` (bg lift)
  - `--neutral-2` (panel)
  - `--neutral-3` (panel lift)
  - `--neutral-7` (body text)
  - `--neutral-9` (headline text)
- Accent (single family, 2–3 steps):
  - `--accent-6` (primary)
  - `--accent-7` (hover)
  - `--accent-8` (focus ring / high emphasis)
- Utility:
  - `--success-6`
  - `--warning-6`
  - `--danger-6`

Rules:
- Use one primary accent family. Too many accents pushes toward “crypto landing page”.
- Utility colors must never be used as decoration; only for status meaning.

---

## Semantic Colors (Mapped Meanings)

Semantic tokens (what the UI uses):
- Background:
  - `--color-bg`
  - `--color-surface-1`
  - `--color-surface-2`
- Text:
  - `--color-text`
  - `--color-text-muted`
  - `--color-text-strong`
- Borders:
  - `--color-border`
  - `--color-border-strong`
- Actions:
  - `--color-link`
  - `--color-link-hover`
  - `--color-cta`
  - `--color-cta-hover`
- Focus:
  - `--color-focus`
- Status:
  - `--color-success`
  - `--color-warning`
  - `--color-danger`

Mapping rules:
- Text contrast is driven by semantic tokens, not by arbitrary per-component colors.
- The Three.js scene must not introduce a competing palette; it should inherit the same accent logic (muted).

---

## Accessibility Requirements (WCAG-oriented)

Do not claim compliance without testing. These are requirements to design toward.

Contrast:
- Body text should target at least 4.5:1 against its background.
- Large text (≥ 24px regular or ≥ 18.66px bold) should target at least 3:1.
- Non-text UI indicators (icons, borders, focus rings) should remain perceivable on dark surfaces.

Interaction:
- Keyboard navigable controls with visible focus states.
- Avoid hover-only discovery for essential actions (Recruiter Briefing Rail must be readable without hover).
- Touch targets: aim for ~44×44px minimum for mobile-critical actions.

Motion:
- Must respect `prefers-reduced-motion: reduce`:
  - no continuous ambient motion
  - transitions must be minimal and user-initiated where possible

Canvas:
- No essential content inside canvas.
- Canvas must not trap focus or block scrolling.

Information design:
- Do not encode meaning by color alone.
- Provide clear labels for categories (Development / Infra / Security) using text + consistent iconography (optional).

