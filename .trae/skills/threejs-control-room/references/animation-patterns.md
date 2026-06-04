# Animation Patterns

## Animation Architecture
- Centralize timing and animation state (one loop/controller).
- Avoid per-component RAF loops.
- Prefer deterministic animations with clear stop conditions.

## Timing Guidance
- Keep ambient motion subtle.
- Use easing; avoid sharp acceleration.
- Avoid multiple simultaneous attention-grabbing motions.

## Interaction Patterns
- Prefer user-initiated transitions (click/tap) over autoplay motion.
- Keep interactions reversible and predictable.
- Avoid camera motion as a required navigation mechanism.

## Motion Hierarchy
Order of attention:
1) HTML content and CTAs (primary)
2) Subtle 3D ambience (secondary)
3) Interaction accents (tertiary, brief)

Reduced motion overrides everything: default to stillness.
