# Phase 2 — Final Design & 3D Integration Spec (Hybrid Cloud Control Room)

## Why
Phase 1 delivered a working, accessible Astro scaffold, but the site still lacks the distinctive art direction, motion language, personalization, and a real Hero3D experience required to feel premium and recruiter-converting.

## What Changes
- Update visual system tokens and global styles to support a dark, retro-futuristic “phosphor control room” aesthetic without violating the project’s non-negotiable avoid list.
- Integrate Guillermo’s portrait and GitHub/LinkedIn links into the hero, recruiter briefing rail, and footer as first-class recruiter pathways.
- Add a motion layer (GSAP-based) for micro-interactions and scroll reveals with strict reduced-motion behavior.
- Define the Three.js Hero3D integration contract (particle topology field, gating, lifecycle, and data-attribute integration points) without implementing Three.js.

## Impact
- Affected specs:
  - Motion system: [docs/design/motion-system.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/design/motion-system.md)
  - Art direction: [docs/design/art-direction.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/design/art-direction.md)
  - Design system: [docs/design/design-system.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/design/design-system.md)
  - UI patterns: [docs/design/ui-patterns.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/design/ui-patterns.md)
  - Three.js boundaries: [docs/architecture/threejs-boundaries.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/architecture/threejs-boundaries.md)
- Affected code (expected):
  - Tokens/styles: [tokens.css](file:///Users/guillermolammartin/Git/guillermolam/cv/src/styles/tokens.css), [global.css](file:///Users/guillermolammartin/Git/guillermolam/cv/src/styles/global.css)
  - Layouts: [BaseLayout.astro](file:///Users/guillermolammartin/Git/guillermolam/cv/src/layouts/BaseLayout.astro), [ControlRoomLayout.astro](file:///Users/guillermolammartin/Git/guillermolam/cv/src/layouts/ControlRoomLayout.astro), [PageLayout.astro](file:///Users/guillermolammartin/Git/guillermolam/cv/src/layouts/PageLayout.astro)
  - Control Room components: [RecruiterBriefingRail.astro](file:///Users/guillermolammartin/Git/guillermolam/cv/src/components/control-room/RecruiterBriefingRail.astro), [FallbackHero.astro](file:///Users/guillermolammartin/Git/guillermolam/cv/src/components/control-room/FallbackHero.astro), [TopologyTable.astro](file:///Users/guillermolammartin/Git/guillermolam/cv/src/components/control-room/TopologyTable.astro), [StationChips.astro](file:///Users/guillermolammartin/Git/guillermolam/cv/src/components/control-room/StationChips.astro), [StationOverlay.astro](file:///Users/guillermolammartin/Git/guillermolam/cv/src/components/control-room/StationOverlay.astro)
  - Hero container: [Hero3D.astro](file:///Users/guillermolammartin/Git/guillermolam/cv/src/components/Hero3D.astro)
  - Personal assets: [ProfilePortrait.astro](file:///Users/guillermolammartin/Git/guillermolam/cv/src/components/ProfilePortrait.astro), [site.ts](file:///Users/guillermolammartin/Git/guillermolam/cv/src/lib/site.ts)

## ADDED Requirements

### Requirement: Retro-futuristic control room look (restrained)
The system SHALL present a distinctive “phosphor control room” aesthetic using restrained neon accents and editorial typography, without drifting into the explicit avoid list in art-direction.

Constraints:
- No cyberpunk HUD styling (no scanlines, glitch, heavy bloom, chromatic aberration).
- No cloud-console imitation layouts.
- No motion-gated content.

#### Scenario: Visual identity and restraint
- **WHEN** a user lands on the homepage
- **THEN** the site reads as a calm control room (graphite surfaces, hairline borders, subtle phosphor accents) and remains immediately readable and recruiter-friendly.

### Requirement: Personalization in recruiter fast path
The system SHALL integrate Guillermo’s portrait and key identity links into the homepage hero layer and recruiter briefing rail.

Links (canonical):
- LinkedIn: `https://www.linkedin.com/in/guillermo-lam-28901047`
- GitHub: `https://github.com/guillermolam`

#### Scenario: Recruiter arrives and wants proof quickly
- **WHEN** a recruiter scans the hero and the recruiter briefing rail
- **THEN** they can find and click GitHub/LinkedIn without scrolling and without relying on hover.

### Requirement: Motion layer with reduced-motion compliance
The system SHALL provide GSAP-driven micro-animations and scroll-triggered reveals for key UI components, while honoring `prefers-reduced-motion: reduce`.

Reduced-motion rules:
- No continuous idle animation loops.
- Replace motion with instant state changes or minimal crossfades (≤ 180ms) where necessary for readability.

#### Scenario: Reduced motion
- **WHEN** the user has `prefers-reduced-motion: reduce`
- **THEN** scroll reveals, parallax, and ambient loops do not run, and the page remains fully usable and readable.

### Requirement: Hero3D Three.js integration contract (no code)
The system SHALL define a stable integration contract between the Astro Hero3D wrapper and the Three.js implementation so that:
- the canvas is progressive enhancement,
- the UI overlay is always HTML-first,
- and the 3D system can read state via data attributes and URL params.

#### Scenario: WebGL disabled or opted out
- **WHEN** WebGL is unavailable, motion is reduced, or the user opts out via `?no3d=1`
- **THEN** the hero renders the fallback experience and no Three.js scene is initialized.

## MODIFIED Requirements

### Requirement: Tokens and global styles support the new aesthetic
The system SHALL extend the existing token system and global styles to support:
- “phosphor” accent usage for interactive focus/active states only,
- consistent glass/scrim surfaces for overlays/rails,
- consistent typography tokens for body/mono/labels.

Token additions (additive, not breaking):
- Typography tokens:
  - `--font-sans`
  - `--font-mono`
  - `--font-weight-regular`
  - `--font-weight-semibold`
  - `--font-weight-bold`
- Focus tokens:
  - `--focus-ring-width`
  - `--focus-ring-offset`
- Surface/overlay tokens:
  - `--color-scrim` (used for modal/bottom-sheet/scrim overlays)
  - `--glass-alpha` (single source of truth for “smoked glass” transparency)
  - `--accent-glow` (very low-alpha, used only for focus/active emphasis; not for default styling)
- Motion helper tokens:
  - `--motion-stagger` (for staggered sequences, e.g., 60–90ms)

Style modifications (global.css expectations):
- Introduce “Operator ID” styling in the hero: portrait + name + short label (“Operator”) without disrupting H1/CTAs.
- Strengthen hover/focus affordances with restrained accent lines and surface lifts (≤ 2px translate; no layout shift).
- Add topology row hover/focus-within highlighting via border/left-accent rule (no glow halos).

### Requirement: Recruiter Briefing Rail includes identity links
The system SHALL modify the Recruiter Briefing Rail to include GitHub/LinkedIn in a consistent location and visual hierarchy.

Required structure update:
- Add a new row/module:
  - `Operator` (portrait + name + short descriptor) OR
  - `Identity` (GitHub/LinkedIn) if portrait is reserved for hero only

Constraints:
- The rail must remain readable at 320px width.
- Links must be descriptive (not icon-only) unless paired with text labels.

### Requirement: Footer includes identity links
The system SHALL include GitHub/LinkedIn links in the footer as a secondary path, consistent with header/rail styling.

## REMOVED Requirements

### Requirement: Motion-free minimal UI (implicit Phase 1 state)
**Reason**: Phase 2 requires a motion system to deliver premium interaction and “control room” readability cues.
**Migration**: Replace static-only interactions with GSAP-driven micro-animations while honoring reduced-motion.

---

## Implementation Notes (for Astro builder and ThreeJS developer)

### 1) Asset locations (non-breaking convention)
- Portraits:
  - `public/images/profile/` (existing convention; canonical portrait already referenced via `site.profile.photoPath`)
- UI imagery (if added later):
  - `public/images/ui/` (SVGs, subtle motifs)
- Optional hero video captures (if ever used; not required for v2):
  - `public/video/`

### 2) New components / modules (expected)
- Motion:
  - A single small motion “orchestrator” island (client-side) that attaches animations to existing semantic HTML via stable `data-*` hooks.
  - Prefer one orchestrator for homepage rather than per-component hydration.
- Personalization:
  - `OperatorId` component (hero usage) that composes `ProfilePortrait` + identity links + short label.
- Footer:
  - `SocialLinks` component or footer partial updated to render GitHub/LinkedIn consistently.

### 3) Motion specifications (GSAP timelines)
This section defines required animation behaviors; exact code is implementation-owned by Astro builder.

GSAP library scope:
- Use GSAP core for timelines.
- Use ScrollTrigger for scroll reveals only.

Global gates:
- Do not run timelines when `prefers-reduced-motion: reduce`.
- Prefer `IntersectionObserver` + GSAP for reveal triggers; avoid scroll “scrub” that hijacks reading.

Selectors / hooks (stable targets):
- Header/nav: `.site-header`, `.nav a`
- Hero copy: `.hero-eyebrow`, `.hero-title`, `.hero-subtitle`, `.hero-ctas`
- Operator ID (new): `[data-operator-id]`
- Briefing rail: `.briefing-block`, `.briefing-row`
- Station chips: `.station-chip`
- Topology table rows: `.topology-table tbody tr` and `.topology-card` (mobile)
- Station cards: `.station`

Timelines:
- Page entry (hero):
  - Sequence: eyebrow → title → subtitle → CTAs → operator ID → rail
  - Properties: opacity (0→1), y (10→0)
  - Stagger: use `--motion-stagger` (60–90ms)
  - Ease: `--ease-emphasis`
  - Duration per item: 180–240ms (standard)
- Buttons/chips hover/press:
  - Hover: border accent strength + background lift
  - Press: scale 0.98 and y +1 (≤ 120ms)
  - Ease: `--ease-standard`
- Nav hover/focus:
  - Micro underline reveal or background tint shift (≤ 140ms)
- Topology rows:
  - Hover/focus-within highlight:
    - left accent rule appears
    - subtle surface lift
    - evidence links increase contrast
  - Must work with keyboard focus (no hover-only effects).
- Scroll reveals:
  - Briefing rail (mobile stacked) and station cards reveal with small translate and fade.
  - No blur transitions.

Reduced motion behaviors:
- Replace page-entry stagger with immediate visibility or a single ≤ 180ms fade-in for the hero block only.
- Disable ScrollTrigger entirely.
- Disable parallax.

### 4) Hero3D (Three.js) requirements (contract only)
The Three.js hero SHALL render a particle topology field consistent with the “control room” motif.

Visual description:
- A sparse particle field (nodes) with occasional thin links (edges) forming a calm topology map.
- Subtle ambient drift only when allowed.
- Single accent family (cyan) used sparingly for focus/active station emphasis.
- No heavy bloom; no neon glow halos; no glitch effects.

Gating conditions (must all pass to enable 3D):
- WebGL capability detection passes.
- URL does not include opt-out (`?no3d=1`).
- `prefers-reduced-motion` is not `reduce`.
- Device quality gate (implementation detail) indicates acceptable performance (e.g., low-end mobile defaults to disabled).

Astro integration points (already present, must be used):
- Hero wrapper: `[data-hero3d]`
- Mount element: `[data-hero3d-mount]`
- State attributes:
  - `data-hero3d-state`: `enabled|disabled`
  - `data-hero3d-selected-station`: station id string
  - `data-hero3d-reduced-motion`: `1|0`

Lifecycle requirements:
- Lazy-init Three.js when the hero enters viewport.
- Dispose all WebGL resources on teardown (route change/unmount).
- Pause/stop render loop when offscreen.

UI overlay requirements:
- Overlay remains HTML-first and keyboard accessible.
- “Skip 3D” remains available when 3D is enabled; it MUST disable 3D immediately and persist for the session (implementation detail).

Station emphasis contract:
- Station selection is driven by HTML station chips (not 3D clicking).
- Three.js may visually emphasize a station cluster based on `data-hero3d-selected-station`.

### 5) SEO and accessibility requirements
- Semantic headings must remain correct (H1 is page identity).
- No essential content in canvas; links remain in HTML.
- All interactive elements must have visible focus states (`:focus-visible`).
- Links to GitHub/LinkedIn must have descriptive text labels.

### 6) Performance requirements
- Minimize client JS:
  - One motion orchestrator island for the homepage only.
  - GSAP loaded only on routes that use it.
- Three.js:
  - Lazy-load and stop rendering when offscreen.
  - Prefer lightweight geometry/materials; avoid heavy post-processing.
