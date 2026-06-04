# Performance Budgets

Budgets are heuristics; validate empirically on representative devices.

## Targets
- Desktop: steady 60 FPS when active.
- Mobile: steady 30–60 FPS; prefer stable 30 over unstable 60.
- Time to interactive: 3D must not block initial content rendering.

## Draw Calls
- Prefer < 150 draw calls desktop; < 80 mobile (heuristic).
- Use instancing and merged geometries where possible.

## Geometry Budgets
- Prefer procedural primitives over large models for v1.
- Avoid high-poly meshes; cap vertex counts aggressively for mobile.

## Texture Budgets
- Prefer small textures; avoid > 2048px unless justified.
- Prefer compressed/optimized assets; keep counts low.
- Use mipmaps; avoid huge uncompressed textures.

## Memory Considerations
- Dispose resources on unmount.
- Avoid creating new materials per frame.
- Avoid per-frame allocations.

## Mobile Constraints
- Cap device pixel ratio (DPR) for mobile.
- Disable expensive postprocessing by default.
- Prefer static scenes or low-motion mode on low-end devices.
