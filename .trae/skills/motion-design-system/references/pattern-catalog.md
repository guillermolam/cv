# Motion Pattern Catalog (Baseline)

Source of truth:
- docs/design/motion-system.md

## Microinteractions
- Hover: quick contrast shift + 1–2px lift (no layout reflow)
- Focus: visible ring; optional fast fade-in; never rely on glow alone
- Press: subtle compress or highlight; instant feedback
- Selection: crossfade + border accent change; keep immediate state clarity

## Transitions
- Section reveals: opacity + small translate; avoid long delays
- State transitions: crossfade + small motion; keep interaction responsive
- Route transitions: short, premium transition; never block navigation

## Reduced Motion
- Remove continuous ambient loops
- Replace long transitions with instant changes or short crossfades
- Preserve all content and navigation affordances

