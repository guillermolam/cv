# Three.js Boundaries — Hybrid Cloud Control Room

Source of truth: [.trae/documents/master-implementation-plan-hybrid-cloud-control-room.md](file:///Users/guillermolammartin/Git/guillermolam/cv/.trae/documents/master-implementation-plan-hybrid-cloud-control-room.md)

This document defines strict boundaries for what belongs in Astro vs overlays vs content collections vs Three.js. It also defines explicit prohibitions to preserve accessibility, recruiter UX, and performance.

---

## What Belongs Where

### Astro (Routes, Layout, SEO, Rendering)

Astro owns:
- Route structure and canonical navigation (`/{lang}/...`)
- Semantic HTML content and headings (indexable, accessible)
- SEO metadata:
  - titles/descriptions
  - canonicals
  - `hreflang` alternates
  - OG/Twitter metadata
- Primary CTAs and link destinations
- Language switcher behavior and canonical mapping
- Topology Table markup and deep-link anchors
- Non-WebGL fallback hero (as a first-class design, not a placeholder)

Astro must ensure:
- The site is fully usable with JavaScript disabled.
- The landing page reads correctly and persuasively without any canvas.

### HTML Overlays (UI Above Canvas)

Overlays own:
- Station chips / station labels visible above the hero
- “Skip 3D” / “Reduce motion” controls (if present)
- Small, readable annotations that support the narrative

Overlays must:
- Be keyboard accessible
- Have visible focus states
- Not obscure headlines, CTAs, or recruiter briefing content

Overlays must not:
- Become a complex HUD
- Introduce data panels, charts, or dense UI stacks

### Content Collections (Structured, Queryable Content)

Collections own:
- The single source of truth for content and proof artifacts:
  - Profile, Experience, Projects, Case Studies, Certifications, Blog, CV Formats
- Cross-linking via stable IDs
- Language-specific variants of content

Collections must not:
- Store presentation-specific geometry/material parameters for Three.js beyond minimal, non-essential hints (if needed later)
- Encode navigation logic that only the 3D layer can interpret

### Three.js (Progressive Enhancement Only)

Three.js owns:
- Ambient spatial metaphor for “Hybrid Cloud Control Room”
- Abstract topology visualization:
  - nodes
  - edges/flows
  - subtle depth cues
- Optional station focus transitions aligned with the currently selected station
- Capability detection and degradation behavior:
  - WebGL checks
  - performance heuristics
  - reduced-motion compliance
- Lifecycle and cleanup:
  - resource disposal
  - animation loop control
  - pause on hidden tab / route changes

Three.js must not own:
- Primary navigation
- Primary content
- Any route decisions
- SEO-relevant content

---

## Explicit Prohibitions (Non-Negotiable)

Forbidden patterns:
- Essential content inside canvas
  - No “read the headline in the 3D scene”
  - No “CV downloads only accessible via 3D”
  - No “case study summaries only appear as 3D labels”
- WebGL-only navigation
  - No “drag to find menu items”
  - No “click nodes to reveal the only copy”
  - No “camera movement required to reach sections”
- Dashboard-style homepage
  - No widget grids, charts, metrics tiles, or “console panels” as the primary first screen
  - The control room metaphor is ambient and editorial, not a data dashboard
- Cyberpunk HUD aesthetics
  - No neon overload, no glitch effects, no “hacker HUD” frames
  - No dense reticles, scanning lines, or aggressive animated overlays
  - No crypto-landing-page look

---

## Required Constraints (Hard Requirements)

Accessibility:
- All essential content is semantic HTML.
- Canvas is non-essential; do not trap focus.
- Overlays and controls are keyboard accessible and properly labeled.
- Reduced-motion is respected by default.

Performance:
- Three.js is lazy-loaded and must not block LCP.
- Avoid large models and textures in v1; prefer procedural primitives.
- Memory cleanup is mandatory (dispose geometries, materials, textures, renderer).
- Mobile defaults prioritize readability and smooth scroll; 3D may be disabled by default on low-end devices.

Recruiter UX:
- Headline + subheadline + primary CTAs appear without depending on WebGL.
- Proof index (Topology Table) is visible and linkable via anchors.
- The experience remains “premium technical minimalism”, not novelty.

---

## Allow List (What Three.js May Do)

Allowed (if implemented tastefully and within constraints):
- Intentional node/edge motion that communicates state/relationships (disabled under reduced motion)
- Station highlighting as background emphasis (not required for comprehension)
- Light parallax tied to scroll or pointer movement (opt-out under reduced motion)
- Focus transitions when selecting station chips (disabled under reduced motion)
- Cinematic environmental transitions that reinforce narrative progression, provided they do not delay reading or block navigation

---

## Failure Modes and Required Behavior

If WebGL is unavailable/disabled:
- Render the fallback hero with no layout breakage.
- All navigation and proof links remain available.

If performance is poor:
- Disable 3D and fall back automatically.
- Do not loop in a degraded animation state.

If reduced motion is enabled:
- No continuous motion.
- Prefer static background with optional user-initiated transitions.
