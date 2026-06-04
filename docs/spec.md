---
version: "2.0"
title: "Portfolio Experience Spec — Immersive Motion-First Control Room"
status: "active"
lastUpdated: "2026-06-04"
---

# Portfolio Experience Spec — Immersive Motion-First Control Room

This specification defines the portfolio’s evolved direction: an immersive interactive experience that showcases Cloud Engineering, DevSecOps, Platform Engineering, Security Architecture, Internal Developer Platforms, AI Engineering, and Infrastructure at Scale through spatial storytelling and interactive exploration.

This spec is the source of truth for skill behavior, implementation standards, and evaluation criteria.

## 1) Product Thesis
- Motion is a product feature, not decoration.
- Motion communicates hierarchy, navigation, focus, transitions, relationships, system state, and narrative progression.
- Visitors should discover content through transitions, reveals, environmental feedback, spatial movement, interactive exploration, and progressive disclosure.

## 2) Non-Negotiables (Applies To Everything)
### Accessibility first
- Mandatory: reduced-motion support, keyboard navigation, screen reader compatibility, touch-friendly interactions.
- Mandatory: non-WebGL fallback for any experience that uses WebGL.
- No animation may block access to critical content.

### Recruiter first
- Within 30 seconds: who you are, what you specialize in, what differentiates you, and how to contact you must be obvious.
- No immersive experience may hide critical content (CV/contact/primary achievements).
- Any “exploration mode” must keep a clear “fast path” to recruiter goals.

### Narrative first
- Every motion/interaction must answer: “why is this moving?”
- If the only answer is “because it looks cool”, it is likely out of scope.
- If the answer is “because it improves understanding or reinforces the story”, it is justified.

## 3) Architecture Principles (Updated)
### Content first (indexable by default)
- Critical content is rendered in HTML and remains indexable.
- Progressive enhancement may layer motion, 3D, and interaction on top of an accessible baseline.

### Experience rich (expected)
- Motion, transitions, and microinteractions are baseline expectations when they improve comprehension.
- “Static rendering” is not an excuse for a visually flat or interaction-poor experience.

### Progressive enhancement (still required)
- Core experience works without JavaScript.
- Enhanced experience may add:
  - advanced motion systems
  - WebGL/Three.js scenes
  - immersive navigation patterns
  - cinematic transitions

## 4) Motion System Requirements
- Motion must form a system (timing, easing, patterns), not isolated effects.
- Motion is opt-out via reduced motion and/or explicit user controls when appropriate.
- Desktop may be more advanced than mobile; mobile must remain smooth and usable.
- Motion must never delay primary interactions unnecessarily.

## 5) Three.js / WebGL Expectations
- Scenes can be immersive and cinematic, but must preserve:
  - fallback behavior (no WebGL required)
  - reduced-motion alternate behavior
  - lifecycle cleanup and GPU/resource disposal
  - adaptive quality based on device capability
- Avoid: dashboard clones, generic particle wallpapers, meaningless floating objects, decorative complexity without narrative purpose.

## 6) Global Rules For All Skills
Every skill must:
- Assume meaningful motion is desired when it improves understanding.
- Include explicit reduced-motion and fallback guidance within scope.
- Include a recruiter-path check (fast path to CV/contact/summary).
- Include performance safeguards appropriate to the domain.
- Include stop conditions: if behavior is uncertain, do not guess; consult authoritative docs/examples first.

## 7) Knowledge Source Priority (Anti-Hallucination)
When making recommendations:
1. This repository (current code + existing conventions)
2. docs/spec.md
3. docs/architecture/*
4. docs/design/*
5. Official framework examples (Astro/Three.js/Spin as applicable)
6. Official docs
7. Model memory (last resort)

## 8) Validation Gates (Project-Wide)
Changes ship only if they pass:
- Accessibility: keyboard + screen reader + reduced motion + touch
- Recruiter UX: 30-second comprehension path remains obvious
- Motion quality: coherent system; no abusive motion; no forced delays
- Performance: smooth interaction; no runaway animation; mobile-safe
- SEO/indexability: critical content in HTML, not behind WebGL

