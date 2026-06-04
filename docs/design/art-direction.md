# Art Direction — Hybrid Cloud Control Room

Sources of truth:
- [control-room-blueprint.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/architecture/control-room-blueprint.md)
- [threejs-boundaries.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/architecture/threejs-boundaries.md)
- [.trae master plan](file:///Users/guillermolammartin/Git/guillermolam/cv/.trae/documents/master-implementation-plan-hybrid-cloud-control-room.md)

This document defines the “Hybrid Cloud Control Room” visual language: premium, technical, restrained, and recruiter-friendly. It must feel original and calm, not like a template or a cloud-console imitation.

---

## Visual Language: “Hybrid Cloud Control Room”

Core metaphor:
- A quiet operations room where systems are understood through topology, signals, and disciplined tooling.

What it should communicate in seconds:
- Cloud Security + DevSecOps + Platform Engineering competence
- Calm operational confidence (not bravado)
- Proof-first structure (Topology Table + case studies) with an ambient spatial layer

Signature motifs (use sparingly):
- **Topology**: nodes and edges that suggest systems, pipelines, and boundaries.
- **Boundaries/Guardrails**: subtle divider lines and containment shapes (policy perimeter, blast radius).
- **Signals**: minimal “pulse” or emphasis cues (only when motion is allowed).
- **Materials**: graphite, brushed metal, smoked glass; no neon plastic.

---

## Materials

Guiding principle: the scene and UI should share the same “material honesty” so 3D does not look bolted-on.

UI materials (CSS surfaces):
- Graphite base with slight chroma (blue/graphite), not pure black.
- Panels: smoked glass illusion via subtle transparency only when it does not harm readability.
- Borders: hairline precision, low contrast.

Three.js materials (conceptual):
- Nodes: matte ceramic or anodized metal spheres/discs (low specular).
- Edges: thin fiber lines, slightly emissive but muted (no glow halos).
- Accents: a single controlled accent hue used for focus/active station, not for decoration.

Avoid:
- Chromatic aberration
- Neon gradients
- Heavy bloom
- Glitch shaders

---

## Lighting

Lighting goal: depth and legibility without drama.

Approach:
- One soft key light to define form.
- Low, cool ambient light to avoid crushing blacks.
- Optional rim light at very low intensity for silhouette separation.

Constraints:
- Lighting must not flicker.
- No strobing or scanning beams.
- No “spotlight reveals hidden UI” behavior.

---

## Atmosphere

Atmosphere is suggestion, not fog.

Allowed:
- Very subtle haze or depth falloff to imply space.
- Gentle vignette at extremely low strength to frame the hero.

Avoid:
- Dense fog that reduces contrast of the overlay text.
- High-grain noise overlays.

---

## Density

Density must remain low to preserve recruiter clarity.

Rules:
- Hero: one main field of topology, with 1–2 emphasis clusters max.
- Overlays: minimal labels only; the rail and CTAs are content, not decoration.
- Below-the-fold: stations are editorial sections, not panels.

If it starts to look like a UI kit demo, reduce density immediately.

---

## Visual Hierarchy

Primary:
- H1 (role identity) + primary CTA (Download CV)

Secondary:
- Subheadline (what Guillermo builds)
- Recruiter Briefing Rail (proof + shortcuts)

Tertiary:
- Station chips (narrative segmentation)
- Topology Table (proof index)

Three.js role:
- Support the hierarchy, never compete with it.

---

## Composition Rules

Desktop composition:
- Two-column hero: content left, briefing rail right.
- Topology Table immediately below as a credible “proof index”.

Mobile composition:
- Stack: headline → CTAs → briefing → station chips → topology list.
- 3D (if present) must never push headline below the fold.

Alignment:
- Use a consistent grid so the rail, hero copy, and table share edges.
- Keep repeated vertical rhythms between sections (no inconsistent spacing).

---

## What Makes the Experience Memorable

Memorability should come from:
- The topology narrative aligned with stations (Supply Chain, GitOps, Kubernetes, Runtime Security, SecOps, Edge).
- Proof indexing: an unusually recruiter-friendly topology table that maps “systems” to evidence.
- Calm premium execution: high contrast, tight typographic rhythm, precise borders, no gimmicks.
- A single standout “station focus” moment that feels like moving attention across a system map (only if motion is allowed), while content remains static and readable.

---

## Explicit Avoid List (Non-Negotiable)

AVOID:
- SaaS dashboard
  - Widget grids, KPI tiles, charts, “panel stacks” as the primary page identity
- Cloud console clone
  - Imitating AWS/GCP/Azure layouts, icons, navigation patterns, or language
- Cyberpunk HUD
  - Neon glow, glitch, scanlines, dense frames/reticles
- Crypto landing page
  - Hyper-saturated gradients, huge glow buttons, excessive motion, “hero hype”
- Generic developer portfolio
  - Template hero + random tech logos + feature cards with no proof structure

Enforcement heuristic:
- If a screenshot could be mistaken for a cloud provider console, a cyberpunk UI, or a template portfolio, the art direction has drifted.

