# Docs Freshness

Three.js evolves rapidly. Treat version-sensitive details as untrusted until verified.

## When to Consult Docs
Consult official docs/examples when you are:
- Using unfamiliar Three.js APIs (renderer options, materials, textures, loaders)
- Writing or modifying shaders
- Changing animation loop patterns or WebXR/WebGPU related behaviors
- Integrating third-party ecosystems (pmndrs packages) if they are present in the project

## Verification Order (Anti-Hallucination)
1) Inspect existing project code first (imports, patterns, dependency versions).
2) Consult project references (Control Room blueprint and threejs boundaries).
3) If still uncertain, consult Three.js documentation:
   - Prefer MCP documentation retrieval if available.
   - Otherwise use web fetching/crawling for official docs and examples.
4) Validate behavior in code; do not assume examples match current versions.

## Firecrawl Guidance
If available, use Firecrawl to:
- Crawl official Three.js docs and examples
- Inspect official example source files for patterns
- Inspect pmndrs docs/examples if pmndrs packages are used

## Never
- Invent APIs
- Invent shader syntax
- Invent library features
- Rely on outdated examples when documentation differs

## What to Record
When docs are consulted, record:
- dependency versions
- doc/example URL
- the specific option or behavior verified
