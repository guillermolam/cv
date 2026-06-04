---
alwaysApply: false
globs: src/**,astro.config.*
description: Apply when modifying Astro components, routing, islands, content collections, hydration strategies, rendering modes, or application architecture.
---
# Astro Architecture

Astro first.

Prefer:

- Content-first, indexable HTML by default
- Build-time generation where possible
- Islands architecture for interaction and motion systems
- Progressive enhancement for rich experiences

Hydrate only when interaction requires it.

Avoid unnecessary client-side state, but do not avoid motion by default:
- Use motion/interaction when it improves understanding.
- Ensure reduced-motion and no-JS fallbacks remain usable.
