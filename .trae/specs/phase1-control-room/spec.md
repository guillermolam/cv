# Phase 1 — Hybrid Cloud Control Room Homepage Spec

Project: guillermolam/cv

Status note:
- This phase spec was authored before the motion-first experience direction in [docs/spec.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/spec.md).
- When guidance conflicts, follow docs/spec.md and update this phase spec before implementing conflicting work.

Sources of truth:
- [docs/architecture/control-room-blueprint.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/architecture/control-room-blueprint.md)
- [docs/architecture/ia.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/architecture/ia.md)
- [docs/architecture/content-model.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/architecture/content-model.md)
- [docs/architecture/threejs-boundaries.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/architecture/threejs-boundaries.md)
- [docs/design/design-system.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/design/design-system.md)
- [docs/design/art-direction.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/design/art-direction.md)
- [docs/design/motion-system.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/design/motion-system.md)
- [docs/design/ui-patterns.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/design/ui-patterns.md)
- [docs/design/implementation-review.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/design/implementation-review.md)
- [master plan](file:///Users/guillermolammartin/Git/guillermolam/cv/.trae/documents/master-implementation-plan-hybrid-cloud-control-room.md)

Goal:
- Implement the first usable version of the Hybrid Cloud Control Room homepage.

Hard constraints:
- Do not redesign architecture (use the documents above as truth).
- Three.js is progressive enhancement only (no essential content in canvas).
- No GLTF-heavy assets; no advanced shaders.
- No blog/case-study build-out; no CI; no deployment work.

Output format constraint:
- This spec contains exactly the 11 sections requested by the user, in order.

---

## 1. Phase 1 scope

In scope (deliverables):
- Homepage composition per Control Room Blueprint:
  - headline + subheadline + primary CTAs (Download CV, Portfolio, Flagship Case Study placeholder link if needed)
  - Recruiter Briefing Rail
  - Station chips (anchor navigation)
  - Topology Table (proof index)
- Station anchors:
  - `#station-supply-chain`
  - `#station-gitops-delivery`
  - `#station-kubernetes-platform`
  - `#station-runtime-security`
  - `#station-security-operations`
  - `#station-hybrid-edge`
- HTML overlays above the hero (only if canvas is present):
  - station label
  - “Skip 3D”
  - “Toggle motion” (optional, see reduced-motion rules)
- Non-WebGL fallback hero (first-class, not blank):
  - static topology motif (SVG/CSS)
  - content layout unchanged whether 3D loads or not
- Reduced-motion support (`prefers-reduced-motion: reduce`):
  - no continuous animation loop
  - minimal transitions only
- Mobile-safe layout:
  - rail becomes stacked summary panel (or bottom sheet if already present; otherwise stacked panel)
  - station chips touch-friendly
  - topology table becomes responsive list/cards

Out of scope (non-goals):
- Final art polish
- Advanced 3D effects (bloom, heavy post-processing, advanced shaders)
- Large model assets (GLTF)
- Blog implementation
- Case-study implementation
- Fermyon deployment
- CI changes

---

## 2. Design decisions resolved

This section resolves the blockers in implementation-review.md without changing the architecture.

### 2.1 Typography strategy (locked)

V1 strategy: system-first (no new font dependencies).
- Primary stack (UI + body):
  - `ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"`
- Monospace stack (tags/labels only):
  - `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`

Weights:
- Body: 400
- Emphasis/labels: 500
- Headings: 600 (700 allowed for hero H1 on large screens only)

Type scale (from design-system.md, locked for v1):
- H1: 36px (desktop), up to 44px on very large screens
- H2: 30px
- H3/card title: 24px
- Body: 16px
- Small UI: 14px
- Meta: 13px (use sparingly)

Line-height:
- Body: 1.6–1.7
- Headings: 1.1–1.2
- Labels: 1.25–1.35

### 2.2 Layout grid and breakpoints (locked)

Grid:
- Max content width: 1120px
- Page padding (inline):
  - 16px on ≤ 480px
  - 24px on 481–1024px
  - 32px on ≥ 1025px
- Desktop hero grid: 12 columns
  - Main hero content: 7 columns
  - Recruiter Briefing Rail: 5 columns

Breakpoints (locked):
- `sm`: 480px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

Rail behavior:
- `lg` and above (≥ 1024px): right-side rail visible as column
- below `lg` (< 1024px): rail stacks under hero CTAs as a compact panel

Topology Table responsiveness:
- `lg` and above: table layout
- below `lg`: row → stacked “evidence card” (station, signal, evidence links)

### 2.3 Color tokens (locked)

Palette intent: graphite control room with restrained blue-cyan accent. No neon. No magenta.

Primitive tokens (hex values locked for v1):
- Neutrals:
  - `--neutral-0`: `#0B0F14` (page background)
  - `--neutral-1`: `#0F1620` (bg lift)
  - `--neutral-2`: `#141E2A` (surface)
  - `--neutral-3`: `#1B2938` (surface lift)
  - `--neutral-6`: `#8FA3B8` (muted text)
  - `--neutral-8`: `#D6E2EF` (body text)
  - `--neutral-9`: `#F2F7FF` (strong text)
- Accent (single family):
  - `--accent-6`: `#4CC9F0` (primary action)
  - `--accent-7`: `#6AD7F5` (hover)
  - `--accent-8`: `#9AE6FB` (focus/emphasis)
- Utility:
  - `--success-6`: `#3DDC97`
  - `--warning-6`: `#F7C948`
  - `--danger-6`: `#FF5C7A`

Visual constraints:
- No glow halos as a default styling mechanism.
- If the 3D scene uses emissive accents, clamp intensity to “muted” and match the single accent family.

### 2.4 Semantic color mappings (locked)

Semantic mapping (what UI uses; values reference primitives above):
- Background/surfaces:
  - `--color-bg` = `--neutral-0`
  - `--color-surface-1` = `--neutral-1`
  - `--color-surface-2` = `--neutral-2`
  - `--color-surface-3` = `--neutral-3`
- Text:
  - `--color-text` = `--neutral-8`
  - `--color-text-muted` = `--neutral-6`
  - `--color-text-strong` = `--neutral-9`
- Borders:
  - `--color-border` = `rgba(214, 226, 239, 0.12)` (hairline)
  - `--color-border-strong` = `rgba(214, 226, 239, 0.22)`
- Links/CTAs:
  - `--color-link` = `--accent-6`
  - `--color-link-hover` = `--accent-7`
  - `--color-cta` = `--accent-6`
  - `--color-cta-hover` = `--accent-7`
- Focus:
  - `--color-focus` = `--accent-8`
- Status:
  - `--color-success` = `--success-6`
  - `--color-warning` = `--warning-6`
  - `--color-danger` = `--danger-6`

### 2.5 Station interaction behavior (locked)

Station chips (homepage):
- Primary behavior: anchor navigation to station sections on the same page.
  - Clicking a station chip navigates to `#station-<id>` and updates selected state.
- Secondary behavior (optional, not required for v1):
  - A small “View category” link/button near each station section heading that navigates to the relevant portfolio category route.

Station selection must never require:
- clicking 3D nodes
- camera manipulation
- pointer drag/orbit

If 3D is enabled:
- Selecting a station may update the background “zone” to match the station, but content and navigation remain HTML-first.

### 2.6 Route and deep-link behavior (locked)

Phase 1 does not introduce language-scoped routes; it implements the usable homepage at the current root route.

Deep-linking requirements (Phase 1):
- Station anchors work without JavaScript:
  - `/#station-supply-chain`, etc.
- Topology Table row anchors work without JavaScript:
  - `/#topology-supply-chain`, etc.

Optional enhancement (Phase 1, non-essential):
- `?station=<id>` may preselect a station only if JavaScript is enabled; if not, page remains readable and functional.

Precedence rules (locked):
1. If URL contains a hash anchor `#station-*`, it wins (browser-native behavior).
2. Else if `?station=` exists and is valid, preselect matching station (no scrolling required).
3. Else default to Overview state.

### 2.7 Command palette scope (v1 decision)

Decision: command palette is out of scope for Phase 1.
- Rationale: not required to achieve a first usable recruiter journey; reduces interaction complexity and accessibility surface area.
- Allowed: no-op placeholder is permitted only if it does not introduce UI debt (avoid shipping a “Search” that does nothing).

### 2.8 Homepage language strategy (v1 decision)

Decision: Phase 1 is English-first at `/` (no `/{lang}/...` restructuring in this phase).
- Rationale: Phase 1 goal is “first usable homepage”; i18n routing is explicitly part of later foundation work in the master plan.
- Guardrail: design and layout must not hard-code English-only assumptions in a way that blocks later i18n (e.g., avoid text-as-images; keep layout flexible for longer strings).

---

## 3. File ownership matrix

Ownership rules (Phase 1):
- Astro Portfolio Builder owns all Astro layout/page/component/styling changes required for the homepage deliverables, except 3D internals.
- Three.js Cloud Control Room Developer owns the 3D scene module and its runtime behavior, plus minimal integration glue inside the 3D wrapper boundary.
- Shared: only the integration boundary contract (props, DOM hooks, CSS variables) may be negotiated; do not cross-edit outside owned paths.

Do-not-edit simultaneously:
- `src/pages/**`, `src/layouts/**`: Astro Portfolio Builder only
- `src/styles/**`: Astro Portfolio Builder only
- `src/components/hero3d/**` and 3D runtime code: Three.js Developer only
- `src/components/Hero3D.astro` (if it exists / is introduced): integration boundary; edit only with explicit coordination

---

## 4. Files Astro Builder owns

Astro Builder owns (Phase 1):
- `src/pages/index.astro`
- `src/layouts/BaseLayout.astro`
- `src/styles/global.css`
- Any new homepage-only components required for:
  - Recruiter Briefing Rail
  - Topology Table
  - Station chip navigation
  - Fallback hero (non-WebGL)
  - HTML overlays (structure + accessibility)

Astro Builder must not implement:
- Three.js scene internals
- advanced visual polish beyond the locked token system

---

## 5. Files ThreeJS Developer owns

Three.js Developer owns (Phase 1):
- `src/components/hero3d/**` (or equivalent owned directory for 3D runtime)
- Any Three.js runtime entry point used by the homepage hero

Three.js Developer may modify only:
- The 3D wrapper integration surface (if required) to attach the canvas to a provided container and read provided state (selected station, reduced-motion, enable/disable).

Three.js Developer must not:
- alter page structure, CTAs, station content, or navigation
- move essential content into the canvas

---

## 6. Shared integration boundaries

Boundary contract (Phase 1):
- The homepage provides:
  - a fixed DOM container for canvas mounting (optional enhancement)
  - a boolean “3D enabled” decision (capability / user choice)
  - a boolean “reduced motion” decision (from media query)
  - the selected station ID (string) based on HTML navigation state
- The 3D layer provides:
  - a mounted canvas that is decorative/ambient
  - no interception of navigation
  - a “ready/fallback” signal (optional)

Rules:
- Overlays remain HTML and are controlled by Astro/HTML.
- The 3D scene must degrade to “no-op” cleanly without breaking layout.
- Station selection must remain fully functional without 3D.

---

## 7. Acceptance criteria

Homepage usability:
- The homepage first screen clearly communicates:
  - target role (H1)
  - what Guillermo does (subheadline)
  - primary CTA: Download CV
  - secondary CTA: View Portfolio
- Recruiter Briefing Rail is present:
  - desktop: as right rail at ≥ 1024px
  - mobile/tablet: stacked panel below CTAs
  - no hover-only disclosure of essential info
- Topology Table exists and is scannable:
  - desktop: table layout
  - mobile: stacked cards
  - includes evidence links placeholders where needed
- Station chips exist and navigate to station anchors.
- Station anchors exist and are linkable.

Progressive enhancement:
- With WebGL disabled, the hero remains visually coherent and content-first.
- With JavaScript disabled, station anchors and topology anchors work.

Reduced motion:
- Under `prefers-reduced-motion: reduce`:
  - no continuous 3D animation loop
  - UI transitions remain minimal and non-distracting

Mobile safety:
- No scroll trapping.
- Touch targets meet minimum size expectations for primary actions.

Non-negotiable prohibitions (must be true):
- No essential content inside canvas.
- No WebGL-only navigation.
- No dashboard-style first screen.
- No cyberpunk HUD visuals (neon glow frames, scanlines, glitch effects).

---

## 8. Validation requirements

Manual validation (Phase 1):
- Desktop (≥ 1024px):
  - rail sits as right column and remains readable
  - hero CTAs visible above fold on common viewports
- Mobile (≤ 480px):
  - H1 + primary CTA visible above fold
  - rail stacks compactly and does not dominate scroll
  - topology table rows become cards and remain readable
- Reduced motion:
  - simulate `prefers-reduced-motion: reduce` and confirm no continuous motion
- WebGL off:
  - confirm fallback hero is shown and layout is stable
- JavaScript off:
  - confirm anchor navigation functions and no essential content disappears

Tooling validation (Phase 1, do not add new dependencies):
- Existing project checks/build/tests must pass if already configured.

---

## 9. Risks

UX risks:
- Over-emphasis of 3D background reducing readability of hero copy and briefing rail.
- Rail and table becoming “widgety” and drifting into dashboard aesthetics.

Accessibility risks:
- Weak focus states in dark mode.
- Canvas accidentally capturing pointer events or focus.
- Reduced-motion accidentally leaving a running render loop.

Mobile risks:
- Hero content pushed below fold by overly tall background container.
- Station chips too small or too dense for touch.
- 3D enabled by default causing battery/scroll jank on lower-end devices.

Scope risks:
- Accidental expansion into command palette, full i18n routing, or case studies.

---

## 10. Exact implementation prompt for astro-portfolio-builder

Implement Phase 1 of Hybrid Cloud Control Room homepage for guillermolam/cv using existing architecture/design docs as truth. Do not implement blog/case studies/i18n routing/CI/deploy. Do not move essential content into a canvas.

Deliverables to implement (HTML/CSS/Astro only):
- Homepage composition on `/`:
  - H1 + subheadline
  - CTAs: Download CV (primary), View Portfolio (secondary), Flagship Case Study (optional placeholder link)
  - Station chips that anchor-jump to station sections
  - Recruiter Briefing Rail:
    - ≥1024px: right column
    - <1024px: stacked compact panel
  - Topology Table:
    - ≥1024px: table layout
    - <1024px: stacked cards
  - Station sections with anchors:
    - `station-supply-chain`, `station-gitops-delivery`, `station-kubernetes-platform`, `station-runtime-security`, `station-security-operations`, `station-hybrid-edge`
  - Topology row anchors:
    - `topology-supply-chain`, etc.
- Non-WebGL fallback hero:
  - static topology motif (SVG/CSS) behind/around hero content
  - content layout unchanged whether 3D loads or not
- HTML overlays above the hero area (only if a 3D canvas is mounted):
  - station label
  - “Skip 3D” control
  - optional “Toggle motion” control (must default off in reduced motion)
- Reduced-motion support:
  - ensure UI animations are minimal
  - provide state signals to 3D wrapper: reduced-motion boolean, selected station id

Locked design decisions (must follow):
- Typography: system-first stacks; weights 400/500/600; scale per spec section 2.1.
- Grid: max width 1120px; breakpoints sm 480 / md 768 / lg 1024 / xl 1280; rail stacks below lg.
- Colors: use the exact tokens and semantic mappings from spec section 2.3–2.4.
- Station behavior: anchor-first station chips; do not require 3D for selection.
- Route behavior: implement on `/` only; anchor deep links must work without JS.
- Command palette: do not implement.

Boundaries:
- You may create minimal components for Rail/Table/StationChips/FallbackHero/Overlays as needed.
- Do not implement Three.js internals; just provide a container and state for the 3D layer to mount optionally.

Validation:
- Ensure layout is usable on mobile, reduced motion, WebGL off, and JS off.

---

## 11. Exact implementation prompt for threejs-cloud-control-room-developer

Implement Phase 1 Three.js progressive enhancement for the Hybrid Cloud Control Room homepage. Do not change Astro page structure, navigation, CTAs, or content. The canvas is decorative and optional.

Requirements:
- Mount a Three.js canvas into the provided DOM container (from the homepage hero).
- Render a lightweight, procedural topology background:
  - nodes + edges/flows
  - muted, graphite-compatible styling with single accent family
  - no GLTF models, no heavy textures, no advanced post-processing
- Respect reduced-motion:
  - if reduced motion is true, do not run a continuous animation loop
  - allow only minimal, user-initiated transitions if required (otherwise static)
- Respect station selection:
  - accept a selected station id (string) from HTML state
  - optionally adjust background emphasis (“camera zone” concept) per station
  - do not require clicking 3D nodes to select stations
- Provide “Skip 3D” support:
  - if the host disables 3D, teardown cleanly (dispose resources, stop loops)

Hard prohibitions (must be true):
- Do not render essential text or navigation inside canvas.
- Do not intercept scroll or pointer events in a way that blocks page usage.
- Do not create cyberpunk HUD visuals (no neon frames, scanlines, glitch).
- Do not create a dashboard-like look (no “panels” inside 3D).

Performance constraints:
- Keep geometry and materials simple (procedural primitives).
- Ensure proper cleanup/disposal on teardown.
- Prefer idle rendering only when necessary; pause when not visible.

Integration boundary:
- Read only:
  - reduced-motion boolean
  - selected station id
  - enable/disable flag
- Expose no required UI; overlays remain HTML-owned.
