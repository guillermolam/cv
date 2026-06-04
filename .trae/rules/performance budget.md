---
alwaysApply: false
description: Apply when introducing dependencies, client-side code, animations, media assets, rendering logic, hydration, or performance-sensitive features.
---
# Performance Budget

Prioritize:

1. Accessibility
2. Performance
3. SEO
4. Motion and visual effects (as product features)

Prefer build-time solutions.

Avoid unnecessary dependencies.

Keep hydration intentional:
- Hydrate interactive systems and motion controllers when they improve comprehension.
- Avoid hydrating static content that can remain server-rendered.

For animation- or WebGL-heavy work:
- Prefer adaptive quality (device capability, viewport size, reduced-motion).
- Prefer smooth interaction over visual complexity.
