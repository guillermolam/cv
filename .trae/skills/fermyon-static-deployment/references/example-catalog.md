# Spin example catalog (repository-derived)

Source repository: `https://github.com/spinframework/spin` (local clone used under `.tmp/spinframework-spin/` for extraction).

This catalog is a **mapping layer**: it records concrete examples and the exact files/features they use, so the skill can reuse patterns without guessing.

## Static fileserver template (manifest v2)

**Example Name:** `templates/static-fileserver`  
**Repository Path:** `templates/static-fileserver/content/`  
**Purpose:** Serve a directory of static files via `spin-fileserver` WASM  
**Key Files:** `templates/static-fileserver/content/spin.toml`  
**Manifest Features:**

```toml
#:schema https://schemas.spinframework.dev/spin/manifest-v2/latest.json
spin_manifest_version = 2

[[trigger.http]]
route = "{{ http-path | http_wildcard }}"
component = "{{project-name | kebab_case}}"

[component.{{project-name | kebab_case}}]
source = { url = "https://github.com/spinframework/spin-fileserver/releases/download/v0.3.0/spin_static_fs.wasm", digest = "sha256:ef88708817e107bf49985c7cefe4dd1f199bf26f6727819183d5c996baa3d148" }
files = [{ source = "{{ files-path }}", destination = "/" }]
```

**Deployment Features:** remote WASM component via `source.url` + `digest`  
**Validation Lessons:** `files` mappings are explicit and should be validated against the build output directory  
**Portfolio Applicability:** strong fit for packaging `dist/` as static output  
**Migration Notes:** choose `files.source` as the correct portfolio artifact (`dist/` vs `guillermo-lam-cv/dist`)

## Redirect template (manifest v2)

**Example Name:** `templates/redirect`  
**Repository Path:** `templates/redirect/content/`  
**Purpose:** Route-level redirect using a dedicated WASM component  
**Key Files:** `templates/redirect/content/spin.toml`  
**Manifest Features:**

```toml
spin_manifest_version = 2

[[trigger.http]]
route = "{{ redirect-from }}"
component = "{{project-name | kebab_case}}"

[component.{{project-name | kebab_case}}]
source = { url = "https://github.com/fermyon/spin-redirect/releases/download/v0.1.0/redirect.wasm", digest = "sha256:8bee959843f28fef2a02164f5840477db81d350877e1c22cb524f41363468e52" }
environment = { DESTINATION = "{{ redirect-to }}" }
```

**Deployment Features:** remote WASM component via `source.url` + `digest`  
**Validation Lessons:** route-by-route behavior can be expressed as explicit trigger entries  
**Portfolio Applicability:** useful for canonical URL handling or legacy route redirects (only when repo requires them)  
**Migration Notes:** do not add redirects unless the portfolio repo provides an explicit requirement

## HTTP routing test case (manifest v2)

**Example Name:** `tests/testcases/http-routing`  
**Repository Path:** `tests/testcases/http-routing/`  
**Purpose:** Demonstrate route patterns with parameters + wildcards  
**Key Files:** `tests/testcases/http-routing/spin.toml`  
**Manifest Features:**

```toml
spin_manifest_version = 2

[[trigger.http]]
route = "/users/:userid/..."
component = "http-routing"
```

**Validation Lessons:** validate wildcard routes explicitly (`/...`) and parameter routes (`:userid`)  
**Portfolio Applicability:** useful when reasoning about how Spin matches routes vs static files

## Static response test case (manifest v2)

**Example Name:** `tests/testcases/static-response`  
**Repository Path:** `tests/testcases/static-response/`  
**Purpose:** Demonstrate `static_response` behavior for status codes, bodies, and redirects  
**Key Files:** `tests/testcases/static-response/spin.toml`  
**Manifest Features:**

```toml
[[trigger.http]]
route = "/..."
static_response = { status_code = 404, body = "not found" }

[[trigger.http]]
route = "/bob"
static_response = { status_code = 302, headers = { location = "/users/bob" } }
```

**Validation Lessons:** smoke tests should include both “happy path” and expected 404/redirect behavior  
**Portfolio Applicability:** helps define expected 404 semantics (important for static hosting)

## Assets test case (manifest v1 style)

**Example Name:** `tests/testcases/assets-test`  
**Repository Path:** `tests/testcases/assets-test/`  
**Purpose:** Validate file mounting + exclude rules for static assets  
**Key Files:** `tests/testcases/assets-test/spin.toml`  
**Manifest Features:**

```toml
spin_version = "1"
trigger = { type = "http" }

[[component]]
id = "fs"
source = { url = "https://github.com/spinframework/spin-fileserver/releases/download/v0.2.1/spin_static_fs.wasm", digest = "sha256:5f05b15f0f7cd353d390bc5ebffec7fe25c6a6d7a05b9366c86dcb1a346e9f0f" }
files = [
    { source = "static/thisshouldbemounted", destination = "/thisshouldbemounted" },
]
exclude_files = ["static/thisshouldbemounted/thisshouldbeexcluded/*"]
[component.trigger]
executor = { type = "http" }
route = "/static/..."
```

**Validation Lessons:** mounting is explicit, and `exclude_files` is a critical safety control  
**Portfolio Applicability:** reinforces “public surface review” for static artifacts  
**Migration Notes:** this is manifest-v1 style; do not mix styles without a docs-backed decision

## Spin docs app (multi trigger.http with ids)

**Example Name:** `docs/spin.toml`  
**Repository Path:** `docs/`  
**Purpose:** Demonstrate multiple `[[trigger.http]]` entries with `id` and per-route components  
**Key Files:** `docs/spin.toml`  
**Manifest Features (excerpt):**

```toml
[application.trigger.http]
base = "/"

[[trigger.http]]
id = "trigger-redirect-site-index"
component = "redirect-site-index"
route = "/"

[component.redirect-site-index]
source = "modules/redirect.wasm"
environment = { DESTINATION = "https://spinframework.dev/index" }
```

**Validation Lessons:** complex apps use explicit trigger ids and per-route components; smoke tests should enumerate expected routes  
**Portfolio Applicability:** helps define a “route inventory” approach for validation

## Integration smoke test (HTTP)

**Example Name:** `tests/integration.rs http_smoke_test()`  
**Repository Path:** `tests/integration.rs`  
**Purpose:** Demonstrate request/response assertions for HTTP triggers  
**Key Files:** `tests/integration.rs`  
**Validation Lessons (excerpt):**

```rust
assert_spin_request(spin, Request::new(Method::Get, "/hello"), Response::new_with_body(200, "I'm a teapot"))?;
assert_spin_request(spin, Request::new(Method::Get, "/hello/wildcards/should/be/handled"), Response::new_with_body(200, "I'm a teapot"))?;
assert_spin_request(spin, Request::new(Method::Get, "/thishsouldfail"), Response::new(404))?;
```

**Portfolio Applicability:** adopt the same structure for deployed smoke tests (happy path + wildcard + 404)

## Deployment auth and login UX (SIP 007)

**Example Name:** `docs/content/sips/007-deployment-auth.md`  
**Repository Path:** `docs/content/sips/`  
**Purpose:** Records a deploy-auth model including `spin login` and non-interactive modes  
**Key Files:** `docs/content/sips/007-deployment-auth.md`  
**Deployment Features (excerpt):**

```text
We propose to add a `spin login` command...
spin login --url https://example.com
...
`spin logout` destroys the current stored credentials
...
If Spin is logged out, `spin deploy` prints a prompt to run `spin login`, and exits.
```

**Portfolio Applicability:** use as a reminder that deploy auth mechanisms change; consult current CLI docs before recommending commands

