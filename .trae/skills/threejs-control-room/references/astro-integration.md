# Astro Integration

## Astro Island Integration
- Treat Three.js as a client-only enhancement mounted into a dedicated container.
- Keep all essential information in HTML outside the canvas.
- Prefer lazy-loading the 3D entrypoint to protect LCP.

## Client Hydration Rules
- Hydrate only the smallest surface necessary to mount the scene.
- Do not hydrate large layout sections.
- Do not move recruiter-critical content into the island subtree.

## Lifecycle Coordination
- Initialize on mount.
- Recompute sizes on resize.
- Pause rendering when tab is hidden.

## Cleanup Requirements
- Cancel RAF on unmount.
- Remove listeners (resize, pointer, visibility).
- Dispose WebGL resources (renderer, geometries, materials, textures).

## Progressive Enhancement
- Provide a non-WebGL fallback hero.
- If capability checks fail, render fallback without layout shift.
