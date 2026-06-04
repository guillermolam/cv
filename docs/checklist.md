---
version: "2.0"
title: "Release Checklist — Motion-First Immersive Portfolio"
status: "active"
lastUpdated: "2026-06-04"
---

# Release Checklist — Motion-First Immersive Portfolio

## Recruiter Fast Path (30 seconds)
- Homepage provides immediate: who/what/how to contact
- CV is reachable within one interaction (visible CTA, not hidden behind exploration)
- Contact is reachable within one interaction
- Achievements/credibility signals are visible without WebGL/JS

## Motion Quality
- Motion has narrative justification (supports hierarchy, relationships, state, or progression)
- Motion is cohesive (timing/easing/patterns follow the motion system)
- No abusive motion (no excessive delays, no forced scrolling, no “wait for animation” gating)
- Motion supports discoverability (reveals help, not hinder)

## Accessibility
- Keyboard navigation works end-to-end
- Screen reader semantics are correct (landmarks/headings/labels)
- Focus is visible and stable
- `prefers-reduced-motion` provides meaningful alternate behavior (not just “slower”)
- Any WebGL experience has a usable non-WebGL fallback
- Touch interactions are usable (tap targets, scroll stability, no gesture traps)

## Performance
- No runaway render loops; animation is paused when offscreen/hidden where applicable
- Mobile performance is acceptable; effects degrade on low-end devices
- Adaptive quality exists for heavy visuals (DPR caps, particle counts, post-processing toggles)
- GPU/memory cleanup is correct for WebGL content (dispose resources; remove listeners)

## SEO / Indexability
- Critical content is present in HTML and crawlable
- Metadata remains correct (title/description/OG where applicable)
- Deep links remain stable (no motion-only navigation dependency)

## Engineering Hygiene
- Changes respect ownership boundaries
- Validation scripts and relevant tests pass
- New skills/rules include evals and stop conditions

