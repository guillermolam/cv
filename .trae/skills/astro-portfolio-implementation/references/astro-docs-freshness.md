# Astro Docs Freshness

Astro changes quickly. Treat version-sensitive APIs as untrusted until verified.

## Verification Rules
Before using unfamiliar or version-sensitive Astro APIs, integrations, routing, collections, middleware, SSR/static behavior, image APIs, or config options:
1) Inspect the local project first (Astro version, existing config usage, existing patterns).
2) Prefer official docs verification:
   - First: use an Astro docs MCP tool if available.
   - Second: fetch official Astro docs via web only if needed.
3) Never invent config keys or APIs. If uncertain, stop and verify.
4) Record what was verified:
   - Astro version
   - Doc URL or MCP query
   - The specific behavior/option confirmed

## When to Escalate
Escalate to governance/spec if verification implies:
- an architecture change (SSR/adapters)
- a new integration dependency
- a change to IA/content model rather than implementation
