# Scene Architecture

## Scene Ownership Rules
- Three.js is progressive enhancement only.
- Essential content must remain semantic HTML outside the canvas.
- Three.js must not own navigation, SEO, or route decisions.

## Composition Patterns
Prefer a small number of scene layers:
- Background field: subtle grid/ambient topology cues.
- Node layer: instanced nodes or lightweight sprites.
- Edge/flow layer: line segments or simple ribbons (avoid heavy geometry).
- Accent layer: occasional highlights tied to user-selected station (optional).

## Camera Architecture
- Default to stable framing; avoid “tour” motion.
- If using motion:
  - low amplitude
  - slow easing
  - user-initiated transitions preferred
  - disabled under reduced motion
- Keep camera math centralized (one controller), not scattered across components.

## Rendering Lifecycle
Preferred:
- Initialize once per mount.
- Render only while visible and needed.
- Pause on `document.hidden`.
- Update on resize via a single resize observer.

## Cleanup Expectations
On unmount or route change:
- Cancel RAF / stop renderer loop.
- Remove event listeners.
- Dispose geometries, materials, textures.
- Dispose renderer and release references.
