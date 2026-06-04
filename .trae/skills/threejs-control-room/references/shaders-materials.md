# Shaders and Materials

## Shader Guidelines
- Keep shaders readable and minimal; prefer built-in materials when sufficient.
- Do not introduce shaders for purely decorative noise if it harms performance.
- Organize shader code consistently (one shader per file when possible).

## Material Guidance
- Prefer physically plausible, restrained materials (avoid neon/glow overload).
- Avoid per-frame material recreation.
- Reuse materials and geometries aggressively.

## Optimization Considerations
- Reduce shader variants and conditional compilation where possible.
- Avoid expensive fragment operations on large screen areas.
- Cap DPR to reduce fragment workload on mobile.

## Maintainability Rules
- Use clear naming for uniforms and varyings.
- Keep shader parameters centralized and documented in code (not in prose).
- If using third-party shader snippets, ensure licensing and provenance are clear.
