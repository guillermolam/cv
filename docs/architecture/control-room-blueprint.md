# Control Room Blueprint — Hybrid Cloud Control Room

Source of truth: [.trae/documents/master-implementation-plan-hybrid-cloud-control-room.md](file:///Users/guillermolammartin/Git/guillermolam/cv/.trae/documents/master-implementation-plan-hybrid-cloud-control-room.md)

This document specifies the Phase 0 interaction and layout blueprint for the landing experience. It is architecture only. It defines the “control room” metaphor without becoming a dashboard, and keeps all essential information accessible, semantic, and indexable (Three.js as progressive enhancement only).

---

## First-Screen Composition (Desktop)

Objectives for the first screen:
- Make Guillermo’s target role and domains obvious in <10 seconds.
- Provide immediate proof paths: CV download, portfolio, flagship case study, GitHub/LinkedIn.
- Preserve a premium “control room” feel via intentional motion and topology cues, without hiding content behind canvas.

Two-lane requirement:
- Recruiter fast path: the essentials are obvious immediately.
- Exploration path: enhanced interactions and spatial cues deepen understanding without blocking the fast path.

Composition layers:
1. **Base Content Layer (HTML, always present)**
   - Headline + subheadline
   - Primary CTAs
   - Recruiter Briefing Rail
   - Topology Table preview (collapsed summary)
2. **Enhancement Layer (Three.js canvas, optional)**
   - Abstract topology background + subtle motion cues
   - Station focus transitions (if enabled)
3. **Overlay Layer (HTML over canvas, always present when canvas is present)**
   - Station labels
   - Focus indicator
   - “Jump to” controls (duplicates of normal navigation)

### Desktop Wireframe (ASCII)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Header: Whoami | Toolchain | Experience | Tutorials | Knowledge Center | Contact | Lang │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌───────────────────────────────────────────────┐  ┌─────────────────────┐ │
│  │ Control Room Hero (HTML + optional 3D canvas)  │  │ Recruiter Briefing  │ │
│  │                                               │  │ Rail (sticky)       │ │
│  │  H1: Cloud Security & DevSecOps Engineer      │  │                     │ │
│  │  H2: Building secure hybrid-cloud platforms   │  │ Role Target         │ │
│  │                                               │  │ Domains             │ │
│  │  CTAs: [Briefing Pack] [Experience]           │  │ Proof Links         │ │
│  │        [Flagship Case Study]                  │  │ Availability/Loc    │ │
│  │                                               │  │ Contact shortcuts   │ │
│  │  Station Chips: Supply Chain | GitOps | ...   │  └─────────────────────┘ │
│  └───────────────────────────────────────────────┘                          │
│                                                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│ Topology Table (scannable proof index, HTML)                                  │
│  Systems/Stations | What it proves | Links                                    │
└──────────────────────────────────────────────────────────────────────────────┘
```

Notes:
- The hero block must read perfectly with the canvas removed.
- The Recruiter Briefing Rail must not contain long paragraphs; it is a briefing, not a biography.
- The Topology Table is the “proof index” that makes the narrative credible and skimmable.

---

## Recruiter Briefing Rail

Purpose: provide recruiter-oriented answers without requiring scrolling or interpretation.

Required modules (short, skimmable):
- **Role Target**
  - Primary: Cloud Security & DevSecOps / Platform Security / DevSecOps Engineer
- **Domains**
  - Kubernetes, GitOps, cloud security, software supply chain security, infrastructure automation, security operations
- **Proof Links**
  - CV downloads (primary), Portfolio, flagship case study, GitHub, LinkedIn
- **Snapshot**
  - Location/timezone (if present in source content)
  - Work authorization/remote preference (only if present in source content)
- **Contact**
  - Email and/or contact route

Constraints:
- Must remain readable at 320px width.
- Must not require hover to reveal essential information.
- Must not be implemented as a “dashboard widget stack” aesthetic; use calm, editorial typography.

---

## Topology Table

Purpose: a canonical, content-first index that maps Guillermo’s work to “systems” (stations) and proof links.

Format: HTML table (or responsive definition list), always accessible, linkable, and indexable.

Minimum columns:
- **Station/System**
- **Signal (What it proves)**
- **Evidence**
  - links to portfolio sections, case studies, blog posts, or CV anchors

Recommended row groups:
- **Infrastructure Control Plane** (Kubernetes, GitOps, IaC)
- **Supply Chain** (SBOM, signing, SAST/DAST, policy)
- **Runtime Security** (Kubernetes policy, network, admission control)
- **Operations** (SIEM/SOAR, detections, incident response)
- **Edge/Wasm Experiments** (Fermyon/Spin narrative)

Deep-link requirement:
- Each row must have a stable anchor target (e.g., `#topology-supply-chain`) to enable direct linking from the rail and from external shares.

---

## Station System

Stations are narrative “modules” that appear as both:
- A semantic HTML section (primary)
- An optional spatial concept (Three.js) providing focus transitions and ambient topology cues (secondary)

Station naming (v1 set, can expand later):
1. **Supply Chain**
2. **GitOps & Delivery**
3. **Kubernetes Platform**
4. **Runtime Security**
5. **Security Operations**
6. **Hybrid/Edge Experiments**

Station responsibilities:
- Provide a clear “what” and “proof” summary.
- Link to:
  - relevant Portfolio category route
  - relevant Case Studies
  - relevant Blog posts (if any)
  - a CV anchor (for recruiters who want the canonical CV)

Station UI affordances (non-canvas):
- Station chips in hero
- Corresponding sections below the fold
- Table row anchors

---

## Camera Zones (Conceptual)

Camera zones are a Three.js-only concept used to frame the background topology to match the active station. They must never be required to access content.

Zones:
- **Zone A: Overview**
  - default: broad topology view behind the hero
- **Zone B: Supply Chain**
  - subtle emphasis on “pipeline” motif (nodes + flow)
- **Zone C: GitOps & Delivery**
  - subtle emphasis on “sync / reconcile” motif
- **Zone D: Kubernetes Platform**
  - subtle emphasis on “cluster nodes” motif
- **Zone E: Runtime Security**
  - subtle emphasis on “policy boundary / guardrails” motif
- **Zone F: SecOps**
  - subtle emphasis on “signals / events” motif (without HUD)
- **Zone G: Edge/Wasm**
  - subtle emphasis on “edge nodes” motif

Constraints:
- Transitions must respect reduced-motion.
- Zones must not imply a literal cloud console or UI replica.

---

## Overlay System

Overlay definition: HTML elements positioned over the canvas area, used for labels and controls.

Overlay elements:
- **Station labels** (short)
- **Focus indicator** (non-animated by default)
- **Controls**
  - Toggle motion (if motion is enabled)
  - “Skip 3D” (if canvas is present; immediately collapses to static mode)

Overlay constraints:
- All overlay controls must be keyboard accessible.
- Overlays must not obscure the headline, CTAs, or rail at common breakpoints.

---

## Navigation Model

Primary navigation (always present):
- Header navigation for canonical routes.
- Footer navigation (secondary, includes social links).

Control Room navigation (optional enhancement):
- Station chips that jump to:
  - either a section on the same page
  - or a portfolio/category route

Rules:
- Never introduce navigation that only works inside the canvas.
- Never require pointer-based interactions (drag/orbit) to reach content.

---

## Deep-Linking Model

Deep-link targets (must be stable and human-readable):
- Route-level: `/{lang}/...` (canonical)
- Section-level: `#station-<id>` anchors on the landing page
- Table-level: `#topology-<id>` anchors for the Topology Table

Optional enhancement parameterization (non-essential):
- `?station=<id>` may select a station (and align the 3D zone if available)

Rules:
- Hash anchors must work with JavaScript disabled.
- External shares must land on meaningful content even without WebGL.

---

## Mobile Experience

Mobile priorities:
- Clarity > immersion
- Fast first paint
- Zero scroll-traps

Behavior:
- Default to **HTML-first hero** with a static or ultra-light enhancement.
- Station chips become a horizontally scrollable list (or stacked buttons).
- Recruiter Briefing Rail becomes a **top summary panel** directly under the headline/CTAs.
- Topology Table becomes a responsive list (each row becomes a card-like block).

Mobile wireframe (ASCII):
```
┌──────────────────────────────┐
│ Header + Menu + Lang         │
├──────────────────────────────┤
│ H1                           │
│ H2                           │
│ [Download CV] [Portfolio]    │
│ [Flagship Case Study]        │
├──────────────────────────────┤
│ Recruiter Briefing (compact) │
├──────────────────────────────┤
│ Station Chips (scroll)       │
├──────────────────────────────┤
│ Topology Rows (stacked)      │
└──────────────────────────────┘
```

---

## Reduced-Motion Experience

Trigger: `prefers-reduced-motion: reduce`

Required behavior:
- No continuous animation loop that causes constant motion.
- Any transitions become:
  - instant or minimal
  - user-initiated only
- Station changes do not animate camera travel; they switch to the matching zone state (or remain in overview).

Non-negotiable:
- Reduced-motion users must not receive a degraded information hierarchy; only motion changes.

---

## Non-WebGL Fallback

Fallback must cover:
- WebGL unavailable/disabled
- Low-performance devices (heuristic gate)
- User choice (“Skip 3D”)

Fallback components:
- HTML/CSS hero with a static “topology” motif:
  - SVG background grid + nodes
  - subtle gradients (no neon)
- Station chips and Topology Table remain fully functional.

Rules:
- The fallback is not “empty space”; it still conveys the control room narrative.
- No critical copy is conditionally rendered only when WebGL succeeds.

---

## Accessibility Constraints (WCAG-oriented expectations)

Hard constraints:
- Essential content must be semantic HTML and available without JavaScript.
- Canvas must be marked decorative where appropriate and must not receive focus by default.
- Keyboard navigation:
  - all controls reachable
  - visible focus states
  - no keyboard traps
- Meaningful labels for CTAs and station controls.
- Respect user preferences:
  - reduced motion
  - prefers-contrast (when feasible through design system)

Content constraints:
- Do not encode meaning using color alone.
- Provide text alternatives for any topology legend if a legend is present.

---

## Performance Constraints (Content-first + Progressive Enhancement)

Budgets are architectural guardrails (exact numbers may be tuned during implementation, but the constraints must be enforced):
- The landing page must remain fast and readable before any 3D loads.
- Three.js must be lazy-loaded and must not block LCP.
- Avoid large model assets (no heavy glTF in v1); prefer procedural/primitive geometry.
- Avoid large textures; prefer small, compressed textures or none.
- Ensure cleanup/disposal to avoid memory leaks on navigation.
- On mobile, default behavior should prioritize battery and smooth scroll over visuals.
