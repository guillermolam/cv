# Motion System — Hybrid Cloud Control Room

Sources of truth:
- [control-room-blueprint.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/architecture/control-room-blueprint.md)
- [threejs-boundaries.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/architecture/threejs-boundaries.md)

This system defines motion behavior across UI and 3D. Motion is a baseline product feature: use it to communicate hierarchy, navigation, relationships, and state. Motion must still degrade gracefully and must never be required to access critical content.

---

## Motion Principles

- Narrative justification: every animation must answer “why is this moving?”
- Clarity over spectacle: motion supports understanding, not distraction.
- System over one-offs: timing, easing, and patterns must feel cohesive across the site.
- Responsive feel: motion must be quick enough to feel interactive, slow enough to feel intentional.
- Respect user preferences: reduced motion provides alternate behavior and preserves usability.
- No motion-gated content: critical content and navigation remain obvious when everything is static.

---

## Timing Guidance

### Durations

| Category | Duration | Use |
|---------:|---------:|-----|
| Micro | 100–140ms | hover feedback, button press |
| UI Standard | 180–240ms | panel open/close, chip selection |
| UI Emphasis | 260–360ms | rail reveal, command palette open |
| Scene Transition | 600–900ms | station focus camera transition (only when allowed) |

### Easing (conceptual)
- Standard: `cubic-bezier(0.2, 0.8, 0.2, 1)` (calm ease-out/in)
- Emphasis: `cubic-bezier(0.16, 1, 0.3, 1)` (slightly more “premium”)
- Avoid overshoot/bounce easings (reads playful, not control-room).

---

## Idle Motion (Ambient)

Allowed only when:
- WebGL is enabled AND
- device performance is acceptable AND
- `prefers-reduced-motion` is not set to reduce

3D idle motion (preferred):
- Slow, readable motion that reinforces “systems alive” without destabilizing reading.
- Occasional low-contrast pulses that communicate state, selection, or availability.

UI idle motion (avoid by default):
- Do not animate CTAs or headers continuously.
- Allow only a gentle background shimmer in the hero (optional), but disable under reduced motion.

Hard rule:
- No continuous animation that makes reading feel unstable.

---

## Hover Motion

UI hover:
- Links: underline reveal or opacity shift (micro duration).
- Buttons: background value shift + border contrast increase (micro duration).
- Cards: 1–2px lift OR border accent shift (micro duration).

Constraints:
- Hover must not be the only way to discover actions.
- Motion must never move layout significantly or cause reflow.

---

## Focus Motion (Keyboard)

Focus behavior:
- Prefer static focus rings (no animations required).
- If animating, limit to a quick fade-in of the ring (≤ 120ms).

Constraints:
- Focus must remain visible and stable during scrolling.
- Never rely on glowing halos that resemble cyberpunk HUD.

---

## Station Selection Motion

Station selection is a narrative event. It must be optional and must not gate content.

UI response (HTML overlays):
- Chip state updates immediately (selected state).
- Optional: quick crossfade of the station summary (UI standard duration).

3D response (if enabled):
- Transition to the station’s conceptual camera zone (Scene Transition duration).
- Use one consistent transition style across stations:
  - no aggressive zooms
  - no spins
  - no high-frequency camera shake

Constraints:
- Station selection must still work when 3D is disabled (anchor jump or route link).
- Avoid “node clicking” as the primary station selection model (keep it in HTML).

---

## Overlay Transitions

Overlays (labels/controls above canvas):
- Appear/disappear via opacity + slight translate (≤ 240ms).
- Avoid blur transitions (often harms legibility and triggers performance issues).

Page/section transitions:
- Prefer short, premium transitions for navigation and state changes.
- Avoid “cinematic delays” that block recruiter workflows.

Rules:
- Overlays must never obscure H1/CTAs/briefing rail.
- Overlays must remain readable against any 3D background state; if not, reduce 3D contrast, not overlay contrast.

---

## Camera Transitions (3D)

Camera transitions must be:
- Low-acceleration (no whiplash)
- Short enough to feel responsive, long enough to feel deliberate

Recommended approach:
- Ease-in-out for the first half, ease-out for landing.

Constraints:
- Never animate the camera on scroll in a way that hijacks page navigation.
- Never require camera movement to reach content.
- Pause or stop the render loop when not needed (especially in static states).

---

## Reduced-Motion Behavior (Required)

Trigger: `prefers-reduced-motion: reduce`

Required system behavior:
- Disable continuous idle motion (no looping ambient animation).
- Replace camera transitions with:
  - immediate state change OR
  - minimal crossfade (≤ 180ms) if needed to prevent harsh cuts
- Keep overlays and UI transitions minimal and instant-feeling.

User controls:
- If a “Toggle motion” is present, it must default to “off” when reduced motion is enabled.
- Provide “Skip 3D” control when canvas is present; it must take effect immediately.

Non-negotiable:
- Reduced motion changes motion only; it must not reduce content visibility or navigation access.
