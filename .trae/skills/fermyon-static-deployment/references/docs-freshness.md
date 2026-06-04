# Docs freshness (Spin + Fermyon)

Spin and Fermyon evolve quickly. This skill must treat unfamiliar details as unknown until verified.

## When docs must be consulted

Consult official Spin and/or Fermyon documentation before proceeding if any of these are true:
- A Spin manifest field is not already present in the repo and you plan to add it
- A CLI subcommand/flag is not already used in the repo and you plan to run it
- Hosting behavior is being assumed (SPA fallbacks, caching headers, MIME types, custom routes)
- A deployment error message is unclear or suggests changed behavior
- The user requests “best practice” behavior that might differ by current platform release

## Firecrawl guidance

If web access is available, prefer fetching official docs and examples over memory:
- Fetch Spin documentation pages relevant to:
  - the Spin v3 docs set (this repo uses Spin v3)
  - `spin.toml` schema
  - static file serving components
  - build/deploy workflows
  - CLI reference (`spin --help` equivalents)
- Fetch Fermyon Cloud documentation pages relevant to:
  - authentication and tokens
  - deploy/update workflows
  - the `spin cloud` plugin command reference (`spin cloud deploy`, `spin cloud login`, variables, logs)
  - GitHub Actions deployment guidance
  - custom domains and subdomain behavior (including limitations)
  - environment/limits/quotas
  - troubleshooting and known incidents
- When troubleshooting, also check release notes/changelogs if available.

Preferred official sources (use these before general search):
- Spin: https://spinframework.dev/
- Fermyon Cloud: https://developer.fermyon.com/cloud/
- Fermyon Cloud `spin cloud` command reference: https://developer.fermyon.com/cloud/cloud-command-reference

## MCP guidance

If a documentation MCP server exists for Spin/Fermyon in this environment:
- Prefer MCP retrieval over memory.
- Prefer MCP retrieval over ad-hoc web search, when it provides up-to-date content.

## Anti-hallucination rules

Never:
- invent `spin.toml` fields
- invent CLI flags or subcommands
- invent Fermyon hosting capabilities (SPA fallback, rewrites, headers)
- invent auth mechanisms or token formats
- claim “this is how Fermyon works” without either:
  - evidence from local repo configuration, or
  - evidence from official docs

When uncertain:
- Say what is known from the repo.
- Say what is unknown.
- Fetch docs or ask the user for confirmation.
