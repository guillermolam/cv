# Astro Design Library Style Guide — Hybrid Cloud Control Room

Sources (context and constraints):
- Intended design-library architecture: `docs/architecture/astro-design-library-architecture.md` (if not yet materialized, use the latest architecture draft in `.trae/documents/plan-astro-component-library-design-system.md`)
- [control-room-blueprint.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/architecture/control-room-blueprint.md)
- [design-system.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/design/design-system.md)
- [art-direction.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/design/art-direction.md)
- [ui-patterns.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/design/ui-patterns.md)
- [motion-system.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/design/motion-system.md)
- [threejs-boundaries.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/architecture/threejs-boundaries.md)
- [content-model.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/architecture/content-model.md)
- [ia.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/architecture/ia.md)
- Latest content graph audit notes (summary): build + `astro check` pass; content graph seed is safe; medium risks include schema drift and IA language mismatch.

This is a style guide only:
- No implementation.
- No package installation.
- No component code.
- No dependency changes.

Mandatory constraints (non-negotiable):
- React-free. Tailwind-free. Native Astro components only.
- UnoCSS for utilities and token usage.
- GSAP for choreography, transitions, microanimations.
- Three.js for spatial enhancement only.
- Chart.js for data visualization only; canvas is never the only source of truth.
- Nanostores only for shared state when truly needed.
- Every reusable component supports an optional Streamline Ultimate Duotone Free Interface Essential SVG icon:
  - https://www.streamlinehq.com/icons/ultimate-duotone-free/interface-essential
- Every icon must support 3.5D/3D treatment (layered SVG, CSS transforms, GSAP timelines, or Three.js planes).
- No purely flat 2D component styling.
- No recruiter-critical information may live only inside a Three.js or Chart.js canvas.
- Accessibility and reduced-motion support are mandatory.

Design library must support the content graph foundation:
- `profile`, `experience`, `projects`, `caseStudies`, `blog`, `certifications`, `cvFormats`
- `categories`, `tags`, `tools`, `skills`
- `contactChannels`, `socialLinks`

---

## 1) Visual design thesis

The design library expresses a **Hybrid Cloud Control Room**:
- Cloud control room + security operations cockpit.
- Recruiter-readable portfolio UI (editorial clarity, high signal).
- Premium technical interface (precision, restraint).
- 3.5D/3D spatial layer (depth cues, parallax, subtle “systems alive” behavior).
- Cinematic but usable: motion supports understanding and navigation, never spectacle.
- Technical but not chaotic: security-native tone without “hacker HUD cosplay”.

Desired emotional effect:
- Credible: feels like a senior engineer’s workspace, not a marketing page.
- Sharp: deliberate edges, clear structure, consistent tokens.
- Calm: stable reading experience, minimal jitter, no ambient distractions under reduced motion.
- High-signal: scannable summaries, evidence-first UI, obvious CTAs.
- Infrastructure-aware: topology cues, system framing, proof chains.
- Security-native: status semantics, threat-model thinking, careful information hierarchy.
- Senior-engineer level: the UI respects performance, accessibility, and correctness.

Avoid:
- Gaming UI excess (busy HUDs, reticles, glitch noise).
- Unreadable neon overload (glow as typography, over-saturation).
- Generic SaaS cards (flat “component library vibe” without narrative intent).
- Startup gradient sludge (large fuzzy gradients that weaken hierarchy).
- Animation for animation’s sake (motion without purpose).
- Cyberpunk parody mode (aesthetic that reduces trust).

---

## 2) Design principles

Practical principles for implementation agents:
- Semantic Astro content first: HTML owns meaning; effects are layered on top.
- 3D enhances, never replaces: Three.js is optional and must degrade gracefully.
- Motion communicates state: hover/focus/press/selected/disabled states are real product states, not decoration.
- Charts explain evidence, not decoration: charts exist to clarify signals and reduce reading load, not to look “data-y”.
- Icons reinforce meaning: icons support scanability and semantics; never become clutter.
- Recruiter path readable in 30 seconds: key info visible above the fold; no hidden/hover-only proof.
- Every flourish degrades safely: no JS/no WebGL/reduced motion remains usable and persuasive.
- Content graph relationships are visible via:
  - tags and chips
  - timelines and rails
  - linked cards and evidence panels
  - charts with semantic fallbacks

---

## 3) Visual language

This library uses a set of interface “materials” and UI motifs that feel like a control room without becoming a dashboard.

### Base surfaces
Feel: graphite, stable, quiet.
- Behavior: no motion by default; acts as the reading plane.
- Use: page backgrounds, long-form content, primary reading surfaces.

### Elevated surfaces
Feel: gently lifted, precise edges, bordered.
- Behavior: subtle hover lift (≤ 2px) only when interactive; never causes layout shift.
- Use: cards, panels, “proof” blocks, tables.

### Glass layers
Feel: optical lift, controlled blur, used sparingly.
- Behavior: used for overlays and transient UI; avoid overuse to prevent “crypto landing page” gloss.
- Use: sticky headers, tooltips, overlays above a hero background.

### Grid overlays
Feel: subtle topology/engineering grid, barely-there.
- Behavior: static by default; optional slow parallax under non-reduced motion.
- Use: hero frames, chart shells, control-room frames.

### Control-room panels
Feel: instrumentation panel, not “widget”.
- Behavior: clear header, clear content, tight spacing rhythm.
- Use: recruiter briefing rail, evidence panels, chart panels.

### Telemetry strips
Feel: a small “signal rail” that summarizes status.
- Behavior: short, scannable, no long copy; can animate in on enter.
- Use: status labels, “at a glance” modules, key KPIs.

### Command bars
Feel: purposeful operator control, minimal.
- Behavior: keyboard-first; focus states must be obvious; no hover-only discovery.
- Use: command menu, filters, chart toggles, catalog control UI.

### Status lights
Feel: restrained status semantics.
- Behavior: static color + text label; optional micro pulse only when meaningful (and disabled under reduced motion).
- Use: availability, status chips, “public/private” labels in catalog.

### Timeline rails
Feel: calm chronological structure.
- Behavior: animated reveal allowed; must work as static list.
- Use: experience timeline, certifications timeline, project histories.

### Data cards
Feel: evidence containers; “what it proves” first.
- Behavior: interactive if clickable; otherwise static.
- Use: projects, case studies, skills, tools.

### Chart panels
Feel: instrument panel with a plot inside.
- Behavior: chart canvas is just the plot; shell owns semantics, legend, tooltip.
- Use: experience over time, skill matrix, distributions, radar.

### Project evidence panels
Feel: proof index, linkable evidence.
- Behavior: strong link styling, stable anchors, table-like structure.
- Use: topology table analogs, “evidence” blocks, proof chains.

### Skill/tool/category badges
Feel: metadata chips with meaning, not tag soup.
- Behavior: hover/focus lift if interactive; otherwise static.
- Use: graph relationships, filtering, navigation.

---

## 4) 3.5D and 3D depth system

Depth is a narrative tool: it communicates hierarchy, interactivity, and state. It must not become a pile of floating plastic rectangles.

Depth levels (semantic → spatial):
1. Flat semantic base
2. Raised surface
3. Elevated card
4. Floating panel
5. Modal layer
6. Spatial scene layer
7. Cinematic hero layer

### Depth level specifications

| Level | Intended use | Shadow | Glow | Blur | Border | Transform | Perspective | Hover elevation | Press compression | Focus outline | Reduced-motion fallback |
|---:|---|---|---|---|---|---|---|---|---|---|---|
| 1 | reading plane, sections | none | none | none | hairline | none | none | none | none | visible ring | identical |
| 2 | non-interactive surface | very soft | none | none | hairline | none | none | none | none | ring if focusable | identical |
| 3 | interactive cards | soft | tiny edge glow only | none | hairline + stronger on hover | translateY(-1px) | subtle | -1px | +1px settle | strong ring, no jitter | disable transforms; keep border/contrast |
| 4 | overlays, tooltips | stronger + tighter | restrained accent | optional mild | stronger border | opacity + translateY | subtle | small | small | ring + stable | no motion; appear instantly |
| 5 | modals/drawers | strong | minimal | optional (background scrim) | strong | translateY/scale only | subtle | none | none | focus trap + ring | no motion; immediate open |
| 6 | Three.js enhancement | N/A | scene lighting | N/A | N/A | camera/scene transforms | true 3D | optional | optional | canvas not focus | disabled under reduced motion |
| 7 | hero cinematic layer | minimal (avoid distraction) | ambient, low-contrast | optional | frame border | minimal parallax | controlled | optional | optional | never obscures H1 | static hero frame |

Rules:
- Depth must be achieved primarily via surface value shifts + border contrast, not heavy shadows.
- If a component is interactive, it must “respond” to hover/focus/press. If it is not interactive, it must not pretend to be.
- Under reduced motion:
  - remove parallax and continuous movement
  - keep depth via static lighting, border/value, and texture

---

## 5) Color system

Color is token-driven, dark-mode-first, contrast-safe, and restrained. Prefer one primary accent family and reserve strong chroma for meaning.

### Core semantic palette (tokens)
Base guidance is aligned with [tokens.css](file:///Users/guillermolammartin/Git/guillermolam/cv/src/styles/tokens.css) and [design-system.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/design/design-system.md).

Primary tokens to maintain:
- Background: near-black graphite (not pure black).
- Surfaces: 2–3 value steps above background.
- Borders: low-contrast neutrals; stronger for focus/active.
- Text: strong for headings, muted for metadata, never “dim enough to be unreadable”.
- Accent: restrained cyan/blue family for actions and highlights.
- Status: success/warning/danger must be used for status meaning only.

### Extended semantic colors (content graph + security domains)

Define token families (each with 2–3 steps: base/hover/strong) for:
- `info` (neutral informational)
- `security` (security-specific highlights)
- `cloud` (cloud architecture cues)
- `infrastructure` (platform/system cues)
- `automation` (pipelines/CI/CD)
- `compliance` (audit/policy)
- `offensiveSecurity` (red-team, only for factual classification)
- `defensiveSecurity` (blue-team, detection/response)

Rules:
- These families must not introduce a rainbow UI; they are used sparingly and always paired with text labels.
- Use family colors primarily for small accents: chips, borders, keylines, chart series, small icons.

### Content graph concept mapping

Use consistent color intent so relationships are scannable:
- Categories: a small set of stable colors (no per-category randomization).
- Tags: mostly neutral; colored only when tag is a “primary” graph axis.
- Tools: neutral with small accent; “tool” is evidence, not identity.
- Skills: slightly stronger emphasis; skill nodes are capability signals.
- Projects: accent on borders/keylines; project cards remain readable.
- Case studies: stronger emphasis than projects; they are flagship proof narratives.
- Certifications: calm “validation signal” color (compliance-adjacent).
- CV formats: action-forward CTA treatment; never buried.
- Blog posts: neutral editorial; allow small accent in metadata.

### Contrast and state rules
- Contrast targets:
  - Body text: aim for ≥ 4.5:1 against background.
  - Large text: aim for ≥ 3:1.
  - Non-text UI indicators (borders, icons, focus rings): must remain perceivable on dark surfaces.
- Hover/active/focus:
  - Hover: border contrast increases + subtle surface lift.
  - Active/press: compress depth; do not flash colors.
  - Focus: rely on a consistent focus ring token; avoid neon halos.
- Disabled:
  - reduce contrast and saturation; keep label readable
  - include non-color indicator (text or icon change) where meaning matters

### Chart palettes
- Chart palettes must be derived from tokens:
  - series colors: small set; consistent across charts
  - grid/ticks: subtle neutral; never stronger than data
  - tooltip: high contrast, readable, stable
- Avoid “vibrant dashboard palettes” that look like analytics SaaS.

### Duotone SVG mapping
- Duotone icons use:
  - Layer A (primary): text-strong or accent depending on context
  - Layer B (secondary): muted text or low-contrast accent tint
- Under hover/selected: shift depth and subtle color, not full recolor.

---

## 6) Typography

Typography is calm, technical, and recruiter-readable.

Use the scale guidance in [design-system.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/design/design-system.md) and the base tokens in [tokens.css](file:///Users/guillermolammartin/Git/guillermolam/cv/src/styles/tokens.css).

### Typography roles (what each role must do)
- Hero title: identity + target role; must be readable immediately.
- Section heading: page structure; supports scanning.
- Card heading: what this item is; short and information-dense.
- Metadata label: small caps/label style; never too light to read.
- Technical code label: monospace for short terms (tools, IDs, commands) only.
- Chart label: ticks + legend; must be readable at small sizes.
- Status label: short, explicit; never color-only.
- Recruiter summary: 1–2 sentence “what to do next” clarity.
- Long-form body: high readability; 60–80ch line length guidance.
- Navigation label: short; supports multilingual expansion.
- CTA label: action verbs, text-first (icons optional).

### Rules
- Keep technical labels readable:
  - avoid ultra-tight tracking on small text
  - avoid low-opacity text for essential labels
- Avoid oversized decorative text that damages scannability.
- Multilingual expansion:
  - assume future `fr/de` strings are longer; components must not clip labels
  - prefer flexible layouts (wrap-friendly chips, min-width constraints for controls)
  - do not bake English-only line breaks into components
- Do not rely on text embedded inside images, SVGs, or canvas.

---

## 7) Icon system

Streamline “Ultimate Duotone Free / Interface Essential” icons are supported by every reusable component as an optional enhancement.

### Selection rules
- Pick icons that encode meaning and improve scanability:
  - actions (download, external link, mail)
  - states (warning, success, locked)
  - categories (cloud/security/platform) only when consistently applied
- Do not add icons to everything; avoid icon noise.

### Naming rules
- Use stable, kebab-case IDs.
- Decide one namespace rule and enforce it:
  - `ie-<name>` (recommended for brevity) or `interface-essential/<name>`

### Semantic vs decorative
- Semantic:
  - icon conveys meaning and must have an accessible name
  - pairs with visible text when possible
- Decorative:
  - icon is purely decorative; must be `aria-hidden="true"` and not focusable

### Duotone color mapping
- Primary layer uses:
  - `--color-text-strong` for neutral contexts
  - `--color-cta` or domain accent when it conveys category/state
- Secondary layer uses:
  - `--color-text-muted` or an accent tint with high transparency

### 3.5D layered SVG treatment
Required traits:
- icon layers are separable (duotone parts become layers)
- icon has depth cues:
  - subtle perspective transform
  - layer parallax (small) on hover/focus
  - press compresses layers (depth decreases)
- the 3.5D illusion must not reduce readability or interactability

### Motion states for icons
Icons support:
- `idle`
- `hoverIn`
- `hoverOut`
- `press`
- `release`
- `focus`
- `selected`
- `disabled`

### Loading policy
- Icons are optional and must not block component rendering.
- No external runtime fetches for icons unless explicitly approved.
- SVG optimization expected (SVGO-based); avoid path bloat.

---

## 8) Motion system

Motion is a product feature; it communicates state, hierarchy, and navigation. It must not block comprehension.

Principles:
- GSAP controls choreography and complex microinteractions.
- CSS handles cheap state transitions where sufficient.
- Three.js handles spatial enhancement only and respects boundaries.
- Chart.js animation is allowed only when reduced motion allows it and it does not conflict with GSAP.
- Reduced motion must work globally and defaults to safety.

### Timing tokens (semantic, not numeric)
- `instant`: effectively immediate (no visible motion)
- `fast`: microinteractions
- `normal`: standard UI state changes
- `deliberate`: panels, rail reveals
- `cinematic`: scene transitions (rare)
- `route`: page transitions (must not delay fast path)

### Easing tokens (semantic)
- `softOut`: calm ease-out for UI
- `pressIn`: quick ease-in for press
- `springOut`: optional, restrained (avoid playful bounce)
- `magnetic`: subtle “pull” for hover targets (sparingly)
- `controlRoom`: stable, premium, no overshoot
- `cinematicReveal`: longer ease-in-out for scene/hero reveals

### Required microanimations (must be supported as states)
- hover in / hover out
- click / press / release
- focus / blur
- selected / disabled
- route transition
- scroll reveal
- chart enter / update
- chart tooltip open / close
- modal enter / exit
- drawer enter / exit

Rules:
- Motion must never gate content; it can only enhance.
- Under reduced motion:
  - disable continuous loops
  - remove parallax and camera travel
  - convert transitions to instant or minimal crossfade

---

## 9) Component style matrix

This matrix tells implementers how each component family should look and behave within the control-room style.

### Primitives
| Component | Visual role | Depth | Icon usage | Motion behavior | Accessibility | Reduced-motion fallback | Content graph usage | Anti-patterns |
|---|---|---:|---|---|---|---|---|---|
| UiIcon | meaning cue | 2 | optional | parallax layers on hover/focus | semantic labels when needed | static 3.5D | tags/categories/status | icon-only without labels |
| UiButton | primary action | 3 | optional leading | hover lift, press compress | visible focus, 44px targets | no transforms, keep contrast | CTAs, downloads | glow-only affordance |
| UiIconButton | compact action | 3 | required | same as button | must be labeled | static depth, no motion | share/filter actions | unlabeled icon-only |
| UiBadge | metadata signal | 2 | optional | optional hover if clickable | not color-only | static | tags, skills, tools | unreadable micro text |
| UiSurface | structure plane | 2 | n/a | none | semantic container | identical | panels, frames | excessive shadow |
| UiPanel | grouped info | 3–4 | optional header | enter reveal allowed | headings + landmarks | instant appear | briefing rail, evidence | long paragraphs |

### Layout
| Component | Visual role | Depth | Icon usage | Motion behavior | Accessibility | Reduced-motion fallback | Content graph usage | Anti-patterns |
|---|---|---:|---|---|---|---|---|---|
| UiSection | page rhythm | 1–2 | optional | optional reveal | correct heading levels | none | all collections | fake “dashboard sections” |
| UiGrid | responsive layout | 1 | n/a | none | no reading order breaks | none | cards, catalog | reordering that breaks SR |
| UiStack | vertical rhythm | 1 | n/a | none | predictable spacing | none | lists/timelines | random spacing |
| UiCluster | chip rows | 1 | optional | hover only if interactive | wrap-friendly | static | tags/tools/skills | overflow clipping |
| UiControlRoomFrame | hero/panel frame | 2–4 | optional | minimal parallax | never obscures content | static frame | landing sections | HUD clutter |

### Navigation
| Component | Visual role | Depth | Icon usage | Motion behavior | Accessibility | Reduced-motion fallback | Content graph usage | Anti-patterns |
|---|---|---:|---|---|---|---|---|---|
| UiNavItem | primary nav | 2–3 | optional | hover lift | focus visible | static | routes | hover-only discoverability |
| UiCommandMenu | power nav | 5 | optional | modal enter/exit | focus trap | instant open/close | graph search | required for nav |
| UiBreadcrumb | context trail | 1–2 | optional separators | none | clear labels | none | graph-aware trails | tiny unreadable text |
| UiTabs | local nav | 2–3 | optional | underline/indicator | keyboard support | static indicator | filters | tab content in canvas only |

### Data display
| Component | Visual role | Depth | Icon usage | Motion behavior | Accessibility | Reduced-motion fallback | Content graph usage | Anti-patterns |
|---|---|---:|---|---|---|---|---|---|
| UiCard | content unit | 3 | optional header | hover lift if link | descriptive link text | static | projects/posts | generic SaaS card |
| UiStatCard | metric summary | 3–4 | optional | enter reveal | text summary | static | impact metrics | number-only tile |
| UiSkillBadge | capability node | 2–3 | optional | hover if clickable | label first | static | skills graph | color-only skill levels |
| UiTimelineItem | chronology | 2 | optional | reveal in | semantic dates | static | experience/certs | timeline as canvas only |
| UiProjectCard | proof anchor | 3–4 | optional | hover lift | meaningful links | static | projects | fake “case study” claims |
| UiKnowledgeCard | concept node | 3 | optional | subtle | readable summary | static | blog/tools | dense jargon blocks |

### Feedback
| Component | Visual role | Depth | Icon usage | Motion behavior | Accessibility | Reduced-motion fallback | Content graph usage | Anti-patterns |
|---|---|---:|---|---|---|---|---|---|
| UiTooltip | micro help | 4 | optional | quick fade/slide | not hover-only | instant | labels | tooltip as only data |
| UiToast | ephemeral feedback | 4 | optional | slide in/out | SR announce policy | instant | actions | infinite toasts |
| UiModal | focused task | 5 | optional | enter/exit | focus trap | instant | command/help | scroll lock bugs |
| UiDrawer | side context | 5 | optional | slide | focus mgmt | instant | filters | hidden close control |
| UiProgress | state indicator | 2–3 | optional | minimal | text fallback | static | loading states | animated forever |

### Charts
| Component | Visual role | Depth | Icon usage | Motion behavior | Accessibility | Reduced-motion fallback | Content graph usage | Anti-patterns |
|---|---|---:|---|---|---|---|---|---|
| UiChartShell | instrument panel | 3–4 | optional | shell reveal | title+summary+table | static | evidence | chart-only meaning |
| UiBarChart | distribution | 2D plot in 3D shell | optional | enter/update | table fallback | static | tools/skills | tooltip-only values |
| UiLineChart | time series | same | optional | enter/update | summary + table | static | experience | huge animations |
| UiRadarChart | domains | same | optional | enter/update | summary + table | static | security domains | unreadable labels |
| UiDoughnutChart | composition | same | optional | enter/update | summary + table | static | toolchain | color-only meaning |
| UiSkillMatrixChart | evidence map | same | optional | highlight | table fallback | static | skills↔projects | matrix in canvas only |
| UiExperienceTimelineChart | timeline | same | optional | reveal | semantic list | static | experience | scroll-jacking |
| UiSecurityDomainRadar | security mapping | same | optional | enter/update | summary | static | security domains | “fake scoring” |
| UiToolchainDistributionChart | stack evidence | same | optional | enter/update | table fallback | static | tools↔projects | rainbow palette |

### Three.js / spatial
| Component | Visual role | Depth | Icon usage | Motion behavior | Accessibility | Reduced-motion fallback | Content graph usage | Anti-patterns |
|---|---|---:|---|---|---|---|---|---|
| ThreeCanvasShell | 3D mount + overlays | 6–7 | optional | optional | canvas not focus | disabled or static | ambient topology | content inside canvas |
| ThreeSceneLayer | scene contract | 6 | optional | controlled | no nav dependency | disabled | station cues | always-on render loop |
| ThreeIconPlane | spatial icon | 6 | required | subtle | decorative by default | static | scene labels | icon as only label |
| ThreeDepthSurface | spatial surface | 6 | n/a | subtle | never blocks reading | static | hero frame | heavy post FX |

### Transitions
| Component | Visual role | Depth | Icon usage | Motion behavior | Accessibility | Reduced-motion fallback | Content graph usage | Anti-patterns |
|---|---|---:|---|---|---|---|---|---|
| UiTransitionShell | page transitions | 1–2 | optional | route transitions | focus stable | instant | navigation | trapping focus |
| UiRouteTransition | nav feedback | 1–2 | optional | quick | no delays | instant | routes | cinematic delays |
| UiReveal | content entry | 1–2 | optional | reveal only | not required | none | long pages | everything animates |
| UiMagneticHover | premium affordance | 3 | optional | subtle | keyboard parity | static | CTAs | gimmicky motion |

---

## 10) Chart design system

Chart.js is allowed only for data visualization. Charts must always be understandable without canvas.

### Mandatory chart requirements
- Accessible titles (in HTML).
- Short summaries (in HTML).
- Expose data outside canvas:
  - fallback tables or semantic data representation.
- Support reduced motion:
  - disable Chart.js animated transitions under reduced motion.
- Destroy chart instances cleanly on navigation/unmount.
- Use 3.5D/3D shells:
  - chart panel, legend, tooltip, icons use depth system.
- Use GSAP only for shell/interaction choreography when useful.
- Avoid fake metrics.

### Chart visual rules
- Containers match control-room panels:
  - clear header with title + summary
  - plot area feels like a “window” inside a panel
- Legends:
  - semantic and keyboard-readable where interactive
  - do not hide meaning behind hover-only
- Tooltips:
  - not the only way to access values
  - if tooltips are used, mirror values in accessible text or table
- Colors map to design tokens:
  - stable series colors per chart type
  - subtle grid/ticks
- Recruiter readability:
  - a one-sentence interpretation is required (what this means)

### Required chart examples (design intent)
- Experience over time: a calm, readable signal of progression.
- Cloud/security skill matrix: shows relationships (skills ↔ projects/case studies) without a hairball.
- Security domain radar: small set of domains; avoid gamified scoring.
- Toolchain distribution: evidence of tools across projects.
- Project impact metrics: only if backed by real evidence and phrased carefully.
- Certification timeline: validation signals over time.
- Content graph relationships: show a small slice (e.g., “skills connected to this case study”), not the entire graph.

---

## 11) Content graph visualization style

The content graph is a navigation and credibility system, not a literal node graph to render.

### Concept mapping
- Profile: root node (identity and role target).
- Projects: proof anchors (what was built/delivered).
- Case studies: evidence narratives (deep proof).
- Skills: capability nodes (what you can do).
- Tools: implementation evidence (how you do it).
- Categories: semantic grouping (primary browse paths).
- Tags: discovery metadata (secondary browse paths).
- Certifications: validation signals (external trust markers).
- CV formats: downloadable artifacts (recruiter workflow).
- Blog posts: thought-leadership nodes (context and depth).

### Recommended UI patterns
- Linked evidence cards: projects/case studies show related skills/tools/categories.
- Relationship chips: small clusters that link graph edges.
- Proof chains:
  - claim → evidence → related systems → links
- Graph-aware breadcrumbs:
  - route context plus “related” graph edges.
- Skill-to-project matrices (chart-backed with table fallback).
- Tool-to-case-study crosslinks:
  - “where this tool was used” lists.
- Category-filtered panels:
  - keep the top-level categories stable and obvious.
- Tags as lightweight filters:
  - never hide essential content behind filters.
- Chart-backed summaries:
  - charts explain relationships, while cards provide the narrative.

### Warnings
- Do not render the whole graph as a hairball.
- Do not hide relationships inside hover-only states.
- Do not make graph navigation dependent on canvas.
- Do not expose “orphan node warnings” in public UI; keep it for internal diagnostics.

---

## 12) Page-level visual guidance

Each page must preserve the recruiter fast path from [ia.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/architecture/ia.md).

### Homepage
- Objective: who/what/proof/CTA clarity in <10 seconds.
- Primary recruiter action: Download CV.
- Components: UiControlRoomFrame, UiPanel (briefing rail), UiButton, UiProjectCard preview, relationship chips.
- Motion: hero reveal + microinteractions only; no motion-gated content.
- Charts: optional small “proof signal” only if it doesn’t compete with CTAs.
- 3D: optional ambient topology; never required.
- Accessibility: ensure CTAs are visible and text-first.

### Projects page
- Objective: scanable proof anchors.
- Primary action: open project/case study evidence.
- Components: UiProjectCard, UiBadge clusters (skills/tools), filters as optional.
- Motion: hover lift + quick reveal.
- Charts: optional distribution summaries with table fallback.
- 3D: generally avoid; focus on readability.
- Accessibility: filters must not hide content in a way that breaks keyboard usage.

### Case studies page
- Objective: credible long-form proof.
- Primary action: read outcome + download CV / contact.
- Components: UiPanel for “at a glance”, timeline, evidence links.
- Motion: minimal; editorial.
- Charts: allowed for “before/after” clarity with text summaries.
- 3D: avoid; case study is narrative.
- Accessibility: headings and link labels must be strong.

### Skills page
- Objective: capability map with evidence links.
- Primary action: click a skill → see linked projects/case studies.
- Components: UiSkillBadge, UiKnowledgeCard, matrix chart with fallback table.
- Motion: small; selection states.
- Charts: skill matrix (chart + table fallback).
- 3D: optional for icon depth only; not required.
- Accessibility: avoid color-only skill “levels”.

### Tools page
- Objective: implementation evidence index.
- Primary action: tool → where used.
- Components: UiCard, badges, linked evidence lists.
- Charts: distribution chart with table fallback.
- Accessibility: tool names must be readable; avoid tiny mono text.

### Certifications page
- Objective: validation signals over time.
- Primary action: download CV / see cert details.
- Components: timeline rail, stat cards.
- Charts: certification timeline (chart + table fallback) optional.
- Accessibility: dates must be semantic text, not visual-only.

### CV / download page
- Objective: make formats discoverable and actionable immediately.
- Primary action: download appropriate CV.
- Components: CV dock pattern from [ui-patterns.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/design/ui-patterns.md).
- Motion: minimal; clarity-first.
- Charts: avoid; not needed.
- Accessibility: disabled formats must be explicitly labeled.

### Blog listing
- Objective: editorial scan; show relevance.
- Primary action: open a post.
- Components: UiCard, badges (tags), brief summaries.
- Motion: minimal; hover lift.
- Accessibility: maintain readable line lengths.

### Blog detail
- Objective: long-form reading.
- Primary action: find related proof (projects/case studies).
- Components: related modules, breadcrumb, evidence links.
- Motion: minimal; no scroll hijack.
- Accessibility: headings and code labels must be readable.

### Design-system catalog page
- Objective: implementation-ready reference.
- Primary action: find a component, understand props/states/a11y.
- Components: catalog index, component demo panels.
- Motion: demonstrates states; must also show reduced-motion variants.
- Charts: include chart examples with fallback tables visible in “no JS” mode.
- Accessibility: catalog must work without JS.

---

## 13) Reduced-motion design

Reduced motion is a first-class mode. It must preserve usability and meaning.

### Global behavior
- Disable large camera movement.
- Disable looping decorative animation.
- Disable Chart.js animated transitions.
- Replace 3D movement with static depth cues.
- Preserve affordances with:
  - color, border, opacity
  - minimal transform only where acceptable (prefer none)
- Ensure all content remains visible and actionable.

### Motion mapping matrix (normal → reduced)
| Feature | Normal motion | Reduced-motion alternative |
|---|---|---|
| Hover lift | translateY(-1px) + glow | border/value change only |
| Press | compress depth + slight translate | border/value change only |
| Tooltips | fade/slide | immediate show/hide |
| Modals/drawers | slide/fade | immediate open/close |
| Route transitions | short fade | none |
| Scroll reveals | mild reveal | none |
| Icon parallax | layer parallax | static layered icon |
| Chart enter/update | subtle shell choreography | no animation; keep table visible option |
| Three.js scene | ambient topology motion | static scene or disabled |

---

## 14) Accessibility rules

Mandatory rules:
- Semantic HTML first.
- Keyboard-visible focus states.
- No hover-only access to essential content.
- No canvas-only information.
- No color-only meaning.
- Accessible chart summaries and fallback tables.
- Accessible SVG labels for semantic icons.
- Decorative icons hidden from assistive tech.
- Contrast-safe chart palettes.
- Route transitions must not trap focus.
- Modals/drawers must manage focus properly.
- Animations must respect `prefers-reduced-motion`.

---

## 15) UnoCSS usage guidance

UnoCSS is the utility layer and must consume tokens; it must not become a new design system that fights the token model.

Guidance:
- Use utilities for:
  - spacing, layout, typography roles
  - composing repeating patterns
- Use CSS variables as the source of truth for color, elevation, motion timing.
- Prefer shortcuts for recurring component patterns to avoid utility soup.
- Avoid Tailwind naming assumptions where possible:
  - use semantic shortcut names rather than reproducing Tailwind class taxonomy
- Keep component styling readable:
  - if a component needs many utilities, define a shortcut or scoped CSS.

Suggested shortcut categories (examples of intent, not code):
- surface: base surface, raised surface, glass surface
- panel: control-room panel, evidence panel, telemetry strip
- button: primary, secondary, icon button, disabled
- badge: tag badge, tool badge, skill badge, category badge
- focus ring: consistent focus ring pattern
- chart shell: chart frame + header + plot window
- icon depth: duotone layers + depth transforms
- control-room grid: subtle grid overlay
- telemetry strip: compact signal line

---

## 16) GSAP usage guidance

Use GSAP for:
- multi-step choreography (enter sequences, coordinated hover states)
- icon layer parallax and press compression
- chart shell animations (not the data itself)
- modal/drawer transitions when CSS is insufficient
- route transitions only when they don’t degrade navigation

CSS is enough for:
- simple hover color/border changes
- static focus rings
- basic opacity transitions when reduced motion is not required to change behavior

Rules:
- All GSAP behavior must:
  - be scoped to a component root (`data-*` hooks)
  - be cleaned up (listeners, timelines, observers)
  - check reduced motion before starting non-essential motion
- No uncontrolled global timelines.
- Do not animate layout (avoid reflow); animate transforms/opacity.
- Chart coordination:
  - GSAP may animate container and tooltip layers
  - Chart.js internal animation must be disabled under reduced motion

---

## 17) Three.js usage guidance

Three.js is for spatial enhancement, not content delivery.

Use Three.js when:
- it reinforces the control-room narrative (ambient topology, station focus cues)
- it improves understanding without blocking reading
- it can be disabled safely without changing meaning

Do not use Three.js when:
- it would carry recruiter-critical text/metrics/navigation
- it would replace an HTML table/list/card
- it would run continuously without a clear reason

Rules:
- Canvas must not be the only source of any critical information.
- Canvas must not trap focus.
- Scenes must have explicit cleanup (renderer + resources).
- Reduced-motion fallbacks:
  - disable continuous motion
  - prefer static scene or disable Three.js entirely
- Integration with Astro:
  - progressive enhancement only (mount after load, opt-out available)
  - never block first contentful paint for 3D
- Relationship to SVG icons:
  - icons remain HTML/SVG-first
  - Three.js planes are optional for spatial scenes only

---

## 18) Anti-patterns

Do not ship components that introduce:
- React creeping back in.
- Tailwind creeping back in.
- Framework chart wrappers.
- Chart.js canvas-only data.
- Three.js canvas-only content.
- 3D everywhere with no purpose.
- Infinite animations and looping UI movement.
- Unreadable glow and neon text.
- Fake metrics.
- Overdesigned recruiter path.
- Inaccessible hover-only controls.
- Icon clutter and decorative noise.
- Dependency creep without written justification.
- Page transitions that break navigation or trap focus.
- Visual mismatch between charts and cards.
- Graph visualization hairballs.

---

## 19) Acceptance checklist

A component is acceptable only if:
- It renders with native Astro.
- It does not require React.
- It does not require Tailwind.
- It supports an optional Streamline SVG icon.
- It has a 3.5D/3D visual treatment (appropriate to its role).
- It defines interaction states (idle/hover/press/focus/selected/disabled).
- It respects reduced motion.
- It has correct keyboard and focus behavior.
- It keeps essential content semantic (HTML-first).
- It cleans up client-side animation resources (GSAP/observers/listeners).
- If it uses Chart.js: data is available outside canvas and a fallback summary/table exists.
- If it uses Three.js: content is not canvas-only and a non-WebGL fallback exists.
- It fits the control-room portfolio visual language and keeps the recruiter fast path readable.
