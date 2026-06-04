# Spin pattern catalog (repository-derived)

Source: `spinframework/spin` templates, tests, and docs (local clone under `.tmp/spinframework-spin/`).

This file records reusable patterns with **concrete manifest structures** and “when to use / when not to use” guidance.

## Pattern: Manifest v2 schema header + `spin_manifest_version = 2`

**When To Use:** writing or reviewing new Spin manifests using manifest v2 conventions  
**When NOT To Use:** when the repo is explicitly pinned to manifest v1 style (rare; must be docs-backed)  
**Manifest Structure:**

```toml
#:schema https://schemas.spinframework.dev/spin/manifest-v2/latest.json
spin_manifest_version = 2
```

**Validation Steps:**
- ensure `spin_manifest_version = 2` exists
- ensure `[application]` exists with `name` and `version`
**Failure Modes:**
- tooling rejects manifest as invalid or assumes legacy behavior
**Portfolio Relevance:** required if/when this repo adds `spin.toml`

## Pattern: Static fileserver component (remote WASM + digest)

**When To Use:** serving static build output (e.g., Astro `dist/`) via Spin  
**When NOT To Use:** when you need SSR or server-side rewrites not supported by static file serving  
**Manifest Structure (from template):**

```toml
[[trigger.http]]
route = "/..."
component = "app"

[component.app]
source = { url = "https://github.com/spinframework/spin-fileserver/releases/download/v0.3.0/spin_static_fs.wasm", digest = "sha256:ef88708817e107bf49985c7cefe4dd1f199bf26f6727819183d5c996baa3d148" }
files = [{ source = "dist", destination = "/" }]
```

**Validation Steps:**
- confirm `files[0].source` exists and contains `index.html`
- confirm `_astro/` (Astro) or `assets/` (Vite) is included
**Failure Modes:**
- deploy succeeds but `/` is 404 (files not mounted / wrong source path)
- assets 404 (assets not included)
**Portfolio Relevance:** primary path for deploying the root Astro site

## Pattern: File mount with destination path + exclusions (legacy style evidence)

**When To Use:** when you must mount only a subset of files or exclude sensitive patterns  
**When NOT To Use:** as a reason to “guess” the correct fields; confirm current manifest version and docs first  
**Manifest Structure (assets test excerpt):**

```toml
files = [
  { source = "static/thisshouldbemounted", destination = "/thisshouldbemounted" },
]
exclude_files = ["static/thisshouldbemounted/thisshouldbeexcluded/*"]
```

**Validation Steps:**
- confirm excluded globs actually match intended files
- confirm public surface contains no secrets/private exports
**Failure Modes:**
- unintended files are published
**Portfolio Relevance:** aligns with the repo’s “secure-by-default” constraints

## Pattern: Wildcard route matching (`/...`) + parameter routes (`:id`)

**When To Use:** HTTP triggers that need route wildcards or parameter capture  
**When NOT To Use:** static file serving where routing should map to real files (unless explicitly using HTTP trigger routing)  
**Manifest Structure (http-routing test):**

```toml
[[trigger.http]]
route = "/users/:userid/..."
component = "http-routing"
```

**Validation Steps:**
- include smoke tests for:
  - exact path
  - wildcard path
  - unknown path returns expected status
**Failure Modes:**
- route mismatch leading to 404s
**Portfolio Relevance:** informs route validation when using Spin triggers beyond static file serving

## Pattern: `static_response` for explicit 404/redirect semantics

**When To Use:** defining explicit error/redirect behavior per route  
**When NOT To Use:** as a substitute for static file mounting of actual assets  
**Manifest Structure (static-response test):**

```toml
[[trigger.http]]
route = "/..."
static_response = { status_code = 404, body = "not found" }
```

**Validation Steps:**
- validate status codes and headers for known routes
**Failure Modes:**
- “fallback” behavior breaks asset loading if applied too broadly
**Portfolio Relevance:** useful to document expected 404 behavior after deploy

## Pattern: Multiple HTTP triggers with ids (route inventory)

**When To Use:** complex apps where routes map to multiple components  
**When NOT To Use:** simple static site serving where a single wildcard route suffices  
**Manifest Structure (docs/spin.toml excerpt):**

```toml
[[trigger.http]]
id = "trigger-redirect-site-index"
component = "redirect-site-index"
route = "/"
```

**Validation Steps:**
- enumerate expected routes in a validation checklist
**Failure Modes:**
- missing trigger coverage for key routes
**Portfolio Relevance:** use as a model for “route inventory” validation reports

## Pattern: Embedded build command in manifest (testcases evidence)

**When To Use:** Spin workflows that build components as part of Spin tooling (must be docs-backed)  
**When NOT To Use:** static file serving when the build pipeline already produces `dist/`  
**Manifest Structure (multi-trigger excerpt):**

```toml
[component.front.build]
command = "cargo build --target wasm32-wasip1 --release"
```

**Validation Steps:**
- ensure build commands are reproducible and non-interactive
**Failure Modes:**
- CI builds diverge from local builds
**Portfolio Relevance:** mostly informational; the portfolio build should remain `pnpm run build` / `bun run build`

