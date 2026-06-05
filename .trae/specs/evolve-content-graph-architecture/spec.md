# Content Graph Content Architecture Spec (Obsidian-like, Astro Collections)

## Why
The current Astro portfolio is a recruiter-first control-room shell with placeholder content pages. We need a structured, linkable knowledge system where proof (experience/projects/case studies) connects to tools, skills, security dimensions, and learning resources—without adding a backend or breaking static deployment.

## What Changes
- Introduce Astro Content Collections as the single source of truth for all portfolio content under `src/content/**`.
- Model the site as a typed content graph (nodes = entries, edges = typed links + derived backlinks).
- Extend IA with Toolchain and Knowledge Center routes while preserving recruiter fast path and existing control-room blueprint constraints.
- Add build-time derived indexes (related items, backlinks, stats, matrices, sitemap metadata) computed from content at build time.
- Define a multi-dimensional Security taxonomy as controlled facets (not a flat tag soup) using `categories` with explicit `dimension`.
- Define islands only for non-essential interactivity (filters/graph explorer), with HTML-first fallbacks.
- Update architecture documentation, root `spec.md`, `tasks.md`, `checklist.md`, and `README.md` to reflect the new content model and authoring workflow.

## Impact
- Affected specs: IA, content model, SEO/content strategy, islands/state strategy, manual LinkedIn sync.
- Affected code (planned; not implemented in this change): `src/content/**`, `src/lib/content/**`, route pages under `src/pages/**`, and minimal islands under `src/components/**`.
- Out of scope (explicit): visual redesign, React/Vue/Alpine adoption, headless CMS, backend services, SSR, Three.js scene changes (Three.js remains progressive enhancement only per boundaries).

---

## ADDED Requirements

### Requirement: Static-first content graph
The system SHALL represent portfolio content as a static content graph where every entry can link to any other entry via stable IDs, and each entry renders an HTML-first page with derived “Related” and “Backlinks” modules.

#### Scenario: Backlinks
- **WHEN** entry A references entry B (typed link or wiki link)
- **THEN** entry B SHALL list entry A under “Referenced by” (backlinks)
- **AND** unresolved references SHALL fail validation at build/check time.

### Requirement: Orthogonal Security taxonomy (facets)
The system SHALL support multi-dimensional security classification across tools, skills, projects, case studies, experience items, achievements, certifications, blog posts, and knowledge resources.

#### Scenario: Faceted filtering
- **WHEN** a user filters for “Kubernetes runtime security”
- **THEN** results SHALL include content where `security.layers` includes `kubernetes` AND `security.subdomains` includes `runtime-protection` (or equivalent controlled facet references)
- **AND** the same content MAY also appear under other orthogonal dimensions (posture, lifecycle, frameworks, etc.).

### Requirement: Astro Content Collections (required collections)
The system SHALL define these Astro Content Collections:
- `profile`, `stats`, `categories`, `tags`, `tools`, `skills`, `achievements`, `certifications`, `education`, `languages`, `hobbies`, `softSkills`, `experience`, `projects`, `caseStudies`, `blog`, `knowledgeResources`, `contactChannels`, `socialLinks`, `cvFormats`.

### Requirement: i18n compatibility
The system SHALL support i18n across core sections using the existing route strategy (`/[lang]/...`) and language-aware content entries under `src/content/**`.

---

## MODIFIED Requirements

### Requirement: IA v1 → IA v2 (content graph)
Existing IA remains recruiter-first and static-first, but SHALL be extended to include:
- `/toolchain` and `/knowledge` as first-class sections (and `/{lang}/...` equivalents)
- detail routes for portfolio items, case studies, blog posts, and knowledge resources (and localized equivalents)
- “hub” experiences MUST be HTML-first (JS-only filtering is not permitted as the only browsing mode).

### Requirement: Three.js boundaries remain intact
All new graph/island capabilities SHALL remain outside the Three.js canvas, and MUST NOT move essential content into WebGL (per `docs/architecture/threejs-boundaries.md`).

---

## Content Graph Model

### Nodes
Each entry in a collection is a graph node. Node identity uses stable IDs:
- `categoryId`, `tagId`, `toolId`, `skillId`, `projectId`, `experienceId`, `resourceId`, `caseStudyId`, `certificationId`, `achievementId`, and `blogSlug` (slug-based but stable).

### Edges
Edges are typed and resolve to stable IDs:
- Primary typed edges via frontmatter: `links: LinkEdge[]`
- Secondary weak edges via facets: shared `tagIds`, `categoryIds`, `toolIds`, `skillIds`, `security` facets
- Optional body wikilinks: `[[collection:id]]` parsed at build time into derived edges (non-authoritative unless typed).

**LinkEdge shape (architecture-level):**
```ts
type LinkTarget =
  | { collection: 'projects'; projectId: string }
  | { collection: 'caseStudies'; caseStudyId: string }
  | { collection: 'experience'; experienceId: string }
  | { collection: 'blog'; blogSlug: string }
  | { collection: 'tools'; toolId: string }
  | { collection: 'skills'; skillId: string }
  | { collection: 'knowledgeResources'; resourceId: string }
  | { collection: 'achievements'; achievementId: string }
  | { collection: 'certifications'; certificationId: string }
  | { collection: 'categories'; categoryId: string }
  | { collection: 'tags'; tagId: string };

type LinkEdge = {
  type:
    | 'evidence_of'
    | 'uses'
    | 'demonstrates'
    | 'classified_as'
    | 'implements'
    | 'related_to'
    | 'mitigates'
    | 'supersedes'
    | 'references';
  target: LinkTarget;
  label?: string;
  weight?: 1 | 2 | 3 | 4 | 5;
  note?: string;
};
```

### Backlinks
Backlinks are derived by inverting edges. They MUST be generated build-time so pages remain static-first.

---

## Required Site Sections (Content Requirements)

### 1) Whoami / Home
Home MUST include HTML-first modules for:
- Summary and positioning (`profile`)
- Recruiter stats panel (`stats` derived from multiple collections)
- Years of experience, languages, certifications, studies, hobbies, soft skills, achievements (collections listed)
- Recruiter proof links (portfolio/case studies + external links)
- Topology Table + station anchors that surface “what it proves” and link to proof routes (must work with JS disabled)

### 2) Toolchain
Toolchain MUST allow multiple dimensions:
- Development, Operations, Security, AI, Architecture & Integration
Toolchain browsing MUST have:
- HTML-first matrix/list pages
- optional island for client-side filtering (non-essential)

### 3) Experience
Experience MUST be LinkedIn-sync-ready (manual only):
- jobs/roles/companies/clients/achievements/dates/technologies/domains/proof links
- no scraping or automation

### 4) Portfolio
Portfolio MUST include:
- projects, demos, case studies, GitHub links, deployment links
- relationships to tools/skills/blog/experience/resources

### 5) Blog
Blog MUST support:
- tutorials, technical posts, series, related modules

### 6) Knowledge Center
Knowledge resources MUST support:
- books, videos, starred repos, articles, documentaries, courses, talks, papers, playlists
- linkable to toolIds/categoryIds/skillIds/projectIds/blogSlugs/experienceIds/tagIds

### 7) Contact
Contact MUST include:
- email, telegram, slack, GitHub, LinkedIn, availability metadata (optional)
- copy-to-clipboard may be an optional island; core contact info visible without JS

---

## Content Collections (Final List + Schema Requirements)

### Shared Fields (recommended)
For most entries (except `stats`, `socialLinks`, `contactChannels`), support:
- `lang: 'en'|'es'|'fr'|'de'` (required for translatable collections)
- `canonicalId` (required when content is translated across langs and must share a stable ID)
- `visibility: 'public'|'unlisted'|'draft'`
- `tagIds: tagId[]` and `categoryIds: categoryId[]` for flexible and controlled classification
- `links: LinkEdge[]` for typed graph edges
- `needsConfirmation?: string[]` to mark claims requiring confirmation (never invent).

### Collection Definitions
For each collection below, the implementation SHALL define:
- Purpose
- Location under `src/content/<collection>/<lang?>/`
- Filename convention
- Required and optional fields
- Cross-link fields
- Zod schema shape (in `src/content/config.ts`)
- Example frontmatter
- Validation rules
- i18n support
- Body support (MD/MDX)

**Note:** `@astrojs/content` and `src/content/config.ts` do not exist yet (repo audit). This spec defines the target state.

#### profile
- **Purpose:** Primary identity/positioning per language.
- **Location:** `src/content/profile/<lang>/primary.md`
- **ID:** derived `profileId` via `canonicalId` (recommended: `primary`)
- **Body:** allowed (short narrative)
- **Cross-links:** `featuredProjectIds`, `featuredCaseStudyIds`, `featuredResourceIds`

#### stats
- **Purpose:** curated/derived stats inputs (and/or overrides) for homepage recruiter panel.
- **Location:** `src/content/stats/<lang>/recruiter.md` (optional i18n)
- **Body:** not required

#### categories
- **Purpose:** controlled taxonomy, including Security multi-dimensional facets.
- **Location:** `src/content/categories/<lang?>/*.md`
- **Required fields:** `categoryId`, `dimension`, `title`, `slug`
- **Dimension:** MUST be an allowlisted string; Security dimensions live here as separate `dimension` values.

#### tags
- **Purpose:** flexible descriptors.
- **Required fields:** `tagId`, `title`, `slug`

#### tools
- **Purpose:** technologies/platforms/products.
- **Required fields:** `toolId`, `name`, `toolType`, `website?`
- **Cross-links:** tagIds/categoryIds + security facets

#### skills
- **Purpose:** human capability/domain expertise.
- **Required fields:** `skillId`, `name`, `skillType`, `level`
- **Cross-links:** toolIds/categoryIds/tagIds + evidence links

#### achievements
- **Purpose:** proof artifacts tied to experience/projects/certs.
- **Required fields:** `achievementId`, `title`, `summary`, `date|dateRange`

#### certifications
- **Purpose:** certifications, issuers, and mappings to skills/tools/categories.
- **Required fields:** `certificationId`, `name`, `issuer`, `status`

#### education
- **Purpose:** studies/education proof.
- **Required fields:** `educationId`, `institution`, `program`, `status`

#### languages
- **Purpose:** spoken languages + proficiency.
- **Required fields:** `languageId`, `name`, `proficiency`

#### hobbies
- **Purpose:** human signal; minimal.
- **Required fields:** `hobbyId`, `name`, `summary?`

#### softSkills
- **Purpose:** soft skills tied to evidence.
- **Required fields:** `softSkillId`, `name`, `summary`

#### experience
- **Purpose:** roles, companies, clients, achievements, dates, technologies, domains, proof links.
- **Required fields:** `experienceId`, `companyName`, `roleTitle`, `startDate`, `summary`
- **Cross-links:** skills/tools/projects/case studies/blog/resources/achievements

#### projects
- **Purpose:** live projects, demos.
- **Required fields:** `projectId`, `title`, `summary`, `status`, `links?`
- **Cross-links:** toolIds/skillIds/categoryIds/tagIds + related case studies/experience/blog/resources

#### caseStudies
- **Purpose:** flagship narratives proving impact.
- **Required fields:** `caseStudyId`, `slug`, `title`, `excerpt`, `categoryIds`, `problem`, `approach`, `outcome`
- **Body:** required (long-form)

#### blog
- **Purpose:** tutorials and technical posts, series support.
- **Required fields:** `blogSlug`, `title`, `publishedDate`, `summary`, `tagIds`, `categoryIds`
- **Body:** required (markdown)

#### knowledgeResources
- **Purpose:** books/videos/repos/articles/courses/talks/papers/etc with provenance links.
- **Required fields:** `resourceId`, `title`, `resourceType`, `url`
- **Cross-links:** toolIds/skillIds/categoryIds/tagIds + related projects/blog/experience/case studies

#### contactChannels
- **Purpose:** contact info with visibility controls and optional copy actions.
- **Required fields:** `channelId`, `type`, `label`, `value`, `visibility`

#### socialLinks
- **Purpose:** global social links (GitHub, LinkedIn, etc).
- **Required fields:** `socialId`, `label`, `url`, `kind`

---

## Security Taxonomy (Controlled Facets)

### Strategy
- Implement Security taxonomy values as `categories` with `dimension` = one of:
  - `securityDomain`, `securitySubdomain`, `securityLayer`, `securityFunction`, `securityPosture`, `securityLifecycle`, `securityControlType`, `securityThreatFocus`, `securityTechnologyScope`, `securityFramework`, `businessCapability`, `evidenceType`.
- Content types that support security facets SHALL include:
  - `security: { domains: categoryId[]; subdomains: categoryId[]; layers: categoryId[]; functions: categoryId[]; postures: categoryId[]; lifecycle: categoryId[]; controlTypes: categoryId[]; technologyScopes: categoryId[]; frameworks: categoryId[]; threatFocus: categoryId[]; businessCapabilities: categoryId[]; evidenceTypes: categoryId[] }`
- Validation MUST ensure each referenced category belongs to the correct `dimension`.

---

## Derived Indexes (Build-Time Utilities)

The implementation SHALL provide build-time utilities (no runtime backend) under:
- `src/lib/content/collections.ts` (collection loaders + type guards)
- `src/lib/content/relationships.ts` (edge resolution + weights)
- `src/lib/content/backlinks.ts` (inverse edges)
- `src/lib/content/stats.ts` (homepage recruiter stats derivation)
- `src/lib/content/toolchain.ts` (toolchain dimension grouping + matrices)
- `src/lib/content/seo.ts` (canonical/hreflang + sitemap metadata)

Derived outputs:
- related entries by tag/category/tool/skill
- backlinks per entry
- recruiter stats for homepage
- toolchain matrix grouped by dimensions
- experience timeline
- featured projects/resources
- proof graph for claims (evidence chain)
- sitemap/SEO metadata

---

## Islands and State Strategy

### Rule
Use islands only where interactivity is needed; no essential content hidden behind JS/canvas.

### Required islands (planned)
- `ToolchainExplorer` (filters by dimension/category/tool/skill/security facets)
- `KnowledgeGraphExplorer` (graph/list hybrid; static fallback list required)
- `RecruiterStatsPanel` (static by default; island only for animated counters/filters; reduced motion respected)
- `ProjectFilter` (portfolio filtering)
- `BlogFilter` (blog filtering by category/tag/tool/series)
- `ContactActions` (optional copy-to-clipboard only)

### Nanostores
Nanostores MAY be used only for shared client filter state across islands:
- `src/stores/filterStore.ts`
- `src/stores/toolchainStore.ts`
- `src/stores/knowledgeStore.ts`
Build-time utilities remain preferred; stores are optional and MUST be justified by shared state needs.

---

## Required Route Map (v2)

Non-language root:
- `/` (English default or language chooser per IA rules)

Language routes:
- `/{lang}/` (Home / Whoami)
- `/{lang}/about`
- `/{lang}/cv`
- `/{lang}/toolchain`
- `/{lang}/experience`
- `/{lang}/portfolio`
- `/{lang}/portfolio/development`
- `/{lang}/portfolio/infra`
- `/{lang}/portfolio/security`
- `/{lang}/portfolio/{slug}`
- `/{lang}/case-studies/{slug}`
- `/{lang}/blog`
- `/{lang}/blog/{slug}`
- `/{lang}/knowledge`
- `/{lang}/knowledge/{slug}`
- `/{lang}/contact`

---

## Required Documentation Updates (planned; not executed here)

This change SHALL update or create:
- `docs/architecture/content-model.md` (extend to full graph collections + facets)
- `docs/architecture/ia.md` (add toolchain/knowledge routes, keep recruiter flow)
- `docs/architecture/control-room-blueprint.md` (map new sections to control-room narrative modules)
- `docs/architecture/content-graph.md` (node/edge model + backlink rules)
- `docs/architecture/data-flow.md` (build-time derivation pipeline)
- `docs/architecture/islands-and-state.md` (islands + nanostores rules)
- `docs/architecture/linking-taxonomy.md` (categories vs tags vs tools vs skills; security dimensions)
- `docs/architecture/linkedin-sync.md` (manual sync workflow constraints)
- `docs/architecture/seo-content-strategy.md` (hub pages, indexability, canonicals)
- `.trae/documents/master-implementation-plan-hybrid-cloud-control-room.md` (Phase 4 rewrite to align)
- Root `spec.md`, `tasks.md`, `checklist.md`, `README.md` (authoring + validation)

---

## Acceptance Criteria (High Level)
- Collections exist under `src/content/**` with Zod schemas and pass validation.
- Every entry has stable IDs; cross-links resolve; backlinks are generated.
- Toolchain and Knowledge Center render HTML-first indexes with optional islands.
- Security classification supports multiple orthogonal dimensions with validation.
- No React dependency added; no CMS/backend added; static build remains compatible with Fermyon/GitHub Pages.
- Reduced-motion and no-JS experiences preserve core content and navigation.

---

## Handoff (After this spec)
- Send this spec to `portfolio-architect` for IA + recruiter journey review.
- Send this spec to `cv-content-architect` for schema realism + authoring workflow review.
- Do NOT start Astro implementation until those reviews are incorporated.

---

## Architecture Proposal (v2: Obsidian-like Linked System)

### Key principles
- **Static-first:** all index pages and detail pages render as semantic HTML at build time; JS only enhances filtering/interaction.
- **Typed links + derived backlinks:** authoritative relationships use typed edges in frontmatter; backlinks are derived by inverting resolved edges at build time.
- **Stable IDs everywhere:** IDs are never derived from translated titles. Slugs are stable, but are treated as identifiers only where explicitly required (e.g. `blogSlug`).
- **Graph over “tag soup”:** tags remain flexible; categories are controlled; Security is represented via orthogonal controlled facets (dimensioned categories), not a single flat list.
- **Recruiter fast path preserved:** home and primary routes keep direct CTAs to CV downloads, proof, and contact. Graph exploration never becomes a required navigation mode.
- **Three.js boundaries preserved:** no essential content is moved into WebGL; the content graph powers HTML routes and modules, not the 3D layer.

### Canonical node key
All graph operations normalize entries into a canonical node key:
```txt
nodeKey = "<collection>:<stableId>"   // example: "projects:glam-hybrid-cloud"
langKey = "<lang>"                    // example: "en"
```

Rules:
- `stableId` equals the collection’s required ID field (`projectId`, `skillId`, etc.) or the canonical slug (`blogSlug`) where specified.
- Translations share the same `stableId` and differ only by `lang`.

### Authoring model
Each entry can connect to others through:
- **Typed links:** `links: LinkEdge[]` (authoritative, validated)
- **Facet references:** `tagIds`, `categoryIds`, `toolIds`, `skillIds`, and `security` facet references (validated)
- **Body wikilinks (optional):** `[[collection:id]]` extracted for convenience, but never required to discover essential content.

---

## File-by-file Change Plan (Exact; Proposed Only)

### Documentation updates (requested)
- Update [content-model.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/architecture/content-model.md) to:
  - expand from v1 collections to the full required collection set
  - replace ad-hoc `tags: string[]` patterns with stable `tagId[]` references
  - add `security` facet reference model and dimension validation rules
- Update [ia.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/architecture/ia.md) to:
  - add `/toolchain`, `/experience`, `/knowledge` routes (and `/{lang}` equivalents)
  - keep existing `/cv` route (recruiter fast path) unless explicitly removed later
  - define canonical strategy for new hubs/detail pages
- Update [control-room-blueprint.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/architecture/control-room-blueprint.md) to:
  - map “Whoami stats” and “proof links” modules to content-graph-derived panels
  - add Knowledge Center and Toolchain as “non-dashboard” stations/hubs
- Create `docs/architecture/content-graph.md` (node/edge model + backlinks)
- Create `docs/architecture/data-flow.md` (build-time derivation pipeline)
- Create `docs/architecture/islands-and-state.md` (island boundaries + nanostores usage)
- Create `docs/architecture/linking-taxonomy.md` (tags vs categories vs tools vs skills; security facets)
- Create `docs/architecture/linkedin-sync.md` (manual-only workflow + mapping)
- Create `docs/architecture/seo-content-strategy.md` (hub strategy, internal linking, canonicals/hreflang)
- Update master plan: [master-implementation-plan-hybrid-cloud-control-room.md](file:///Users/guillermolammartin/Git/guillermolam/cv/.trae/documents/master-implementation-plan-hybrid-cloud-control-room.md)
- Update canonical project docs: [docs/spec.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/spec.md), [docs/tasks.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/tasks.md), [docs/checklist.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/checklist.md)
- Update [README.md](file:///Users/guillermolammartin/Git/guillermolam/cv/README.md) with authoring workflow and validation commands

### Planned new implementation files (not created in this change)
- `src/content/config.ts` (Astro content collections + Zod schemas)
- `src/content/**` (all collections and entries)
- `src/lib/content/collections.ts` (collection loaders and normalization)
- `src/lib/content/relationships.ts` (edge resolution + weighting)
- `src/lib/content/backlinks.ts` (derived backlinks)
- `src/lib/content/stats.ts` (homepage recruiter stats derivation)
- `src/lib/content/toolchain.ts` (dimension grouping + matrices)
- `src/lib/content/seo.ts` (SEO metadata derivation: canonical/hreflang/sitemap inputs)
- Optional stores (only if shared island state is proven necessary):
  - `src/stores/filterStore.ts`
  - `src/stores/toolchainStore.ts`
  - `src/stores/knowledgeStore.ts`

### Planned route additions/updates (not created in this change)
Existing i18n strategy is already in use under [src/pages](file:///Users/guillermolammartin/Git/guillermolam/cv/src/pages).

Add:
- `/toolchain` and `/{lang}/toolchain`
- `/experience` and `/{lang}/experience`
- `/knowledge` and `/{lang}/knowledge`
- `/knowledge/[slug]` and `/{lang}/knowledge/[slug]`
- `/portfolio/[slug]` and `/{lang}/portfolio/[slug]` (project detail)

Preserve:
- `/` and `/{lang}/` (home)
- `/about`, `/contact`, `/blog`, `/case-studies/*` (and i18n equivalents)
- `/cv` (and i18n equivalents) unless explicitly removed later

---

## Collections & Schemas (Final; Required Set)

### Shared conventions

**Language strategy**
- Language-scoped routes already exist (`/{lang}/...`).
- Collections that are user-facing MAY support i18n.
- Where i18n is supported, `lang` is required and entries share stable IDs across translations.
- Fallback rule for missing translations (implementation requirement): render the English entry and label as “EN only” rather than failing the build, unless the entry is marked `requiredForLang: true`.

**Visibility strategy**
```ts
type Visibility = 'public' | 'unlisted' | 'draft'
```

**Cross-link strategy**
- All cross-links use stable IDs, not titles.
- Each cross-link field MUST be validated to point to an existing entry in the referenced collection.
- A normalized “graph edge set” is derived from:
  - `links` (typed edges)
  - cross-link arrays (`toolIds`, `skillIds`, etc.)
  - optional body wikilinks `[[collection:id]]`

**Security facets strategy (orthogonal dimensions)**
- Security is represented as references to `categories` entries where `dimension` matches a security dimension allowlist.
- Security dimensions are always many-to-many.
- Any content entry that supports security classification uses:
```ts
type SecurityFacetRefs = {
  domains?: string[]              // categoryId[]
  subdomains?: string[]
  layers?: string[]
  functions?: string[]
  postures?: string[]
  lifecycle?: string[]
  controlTypes?: string[]
  frameworks?: string[]
  technologyScopes?: string[]
  threatFocus?: string[]
  skillLevels?: string[]
  businessCapabilities?: string[]
  evidenceTypes?: string[]
}
```

### Collection definitions

For each collection:
- **Location:** `src/content/<collection>/...`
- **Filename convention:** REQUIRED
- **IDs:** REQUIRED stable ID field
- **Body:** “MD/MDX” means markdown body is supported; “None” means frontmatter-only.

---

### profile (required)
- **Purpose:** recruiter-first identity and summary; also owns home-page curated “featured” modules.
- **Location:** `src/content/profile/{lang}/primary.md`
- **Filename:** fixed `primary.md` (one per language)
- **Required fields:** `lang`, `fullName`, `headline`, `summary`
- **Optional fields:** `location`, `timezone`, `focusAreas`, `featuredCvFormatIds`, `featured`
- **Cross-links:**
  - `featured.projectIds[]`, `featured.caseStudyIds[]`, `featured.blogSlugs[]`, `featured.resourceIds[]`, `featured.achievementIds[]`
  - `featuredCvFormatIds[]` references `cvFormats.cvFormatId` entries
- **Zod shape (spec):**
```ts
Profile = {
  lang: Lang
  fullName: string
  headline: string
  subheadline?: string
  location?: string
  timezone?: string
  summary: string
  focusAreas?: string[]
  featuredCvFormatIds?: string[]
  featured?: {
    projectIds?: string[]
    caseStudyIds?: string[]
    blogSlugs?: string[]
    resourceIds?: string[]
    achievementIds?: string[]
  }
  visibility?: Visibility
}
```
- **Example frontmatter:**
```yaml
lang: en
fullName: Guillermo Lam
headline: Cloud Security & DevSecOps Engineer
summary: "..."
featuredCvFormatIds: ["recruiter", "ats"]
featured:
  caseStudyIds: ["glam-hybrid-cloud"]
  projectIds: ["control-room-portfolio"]
```
- **Validation rules:** one `primary.md` per language; if missing for a supported language, fallback to English.
- **i18n:** Yes
- **Body:** MD/MDX allowed (short narrative)

---

### stats (required)
- **Purpose:** recruiter dashboard-style stats inputs and optional overrides; derived outputs are computed at build time.
- **Location:** `src/content/stats/{lang}/recruiter.md`
- **Filename:** `recruiter.md`
- **Required fields:** `lang`
- **Optional fields:** `overrides`, `badges`, `proofLinks`
- **Cross-links:** `proofLinks[]` MAY reference internal pages or external URLs.
- **Zod shape (spec):**
```ts
Stats = {
  lang: Lang
  overrides?: {
    yearsExperience?: number
    certificationsCount?: number
    projectsCount?: number
  }
  badges?: Array<{ label: string; kind?: string }>
  proofLinks?: Array<{ label: string; url: string }>
}
```
- **Example frontmatter:**
```yaml
lang: en
overrides:
  yearsExperience: 8
proofLinks:
  - label: GitHub
    url: https://github.com/guillermolam
```
- **Validation rules:** overrides are optional; derived values MUST exist even if overrides are missing.
- **i18n:** Yes
- **Body:** None (frontmatter-only)

---

### categories (required)
- **Purpose:** controlled taxonomy for dimensions (including security facets).
- **Location:** `src/content/categories/{lang}/{categoryId}.md`
- **Filename:** `{categoryId}.md`
- **Required fields:** `lang`, `categoryId`, `dimension`, `title`, `slug`
- **Optional fields:** `description`, `parentCategoryId`, `aliases`
- **Cross-links:** `parentCategoryId` references another `categoryId`.
- **Dimension allowlist (minimum):**
  - Control Room: `controlRoomStation`
  - Toolchain: `toolchainDimension`
  - Portfolio areas: `portfolioArea`
  - Security facets (required): `securityDomain`, `securitySubdomain`, `securityLayer`, `securityFunction`, `securityPosture`, `securityLifecycle`, `securityControlType`, `securityThreatFocus`, `securityTechnologyScope`, `securityFramework`, `securitySkillLevel`, `businessCapability`, `evidenceType`
- **Zod shape (spec):**
```ts
Category = {
  lang: Lang
  categoryId: string
  dimension: string
  title: string
  slug: string
  description?: string
  parentCategoryId?: string
  aliases?: string[]
  visibility?: Visibility
}
```
- **Example frontmatter:**
```yaml
lang: en
categoryId: kubernetes-security
dimension: securityDomain
title: Kubernetes Security
slug: kubernetes-security
```
- **Validation rules:** `dimension` must be allowlisted; `parentCategoryId` must exist and match compatible dimension rules (implementation detail).
- **i18n:** Yes (titles/descriptions translate; IDs/slugs remain stable)
- **Body:** Optional (short description)

---

### tags (required)
- **Purpose:** flexible descriptors to improve recall and discovery.
- **Location:** `src/content/tags/{lang}/{tagId}.md`
- **Filename:** `{tagId}.md`
- **Required fields:** `lang`, `tagId`, `title`, `slug`
- **Optional fields:** `description`, `aliases`
- **Zod shape (spec):**
```ts
Tag = { lang: Lang; tagId: string; title: string; slug: string; description?: string; aliases?: string[]; visibility?: Visibility }
```
- **Example frontmatter:**
```yaml
lang: en
tagId: gitops
title: GitOps
slug: gitops
```
- **Validation rules:** `tagId` unique per language; translations share `tagId`.
- **i18n:** Yes
- **Body:** Optional

---

### tools (required)
- **Purpose:** technologies/platforms/products with multi-dimensional classification for Toolchain and proof linking.
- **Location:** `src/content/tools/{lang}/{toolId}.md`
- **Filename:** `{toolId}.md`
- **Required fields:** `lang`, `toolId`, `name`
- **Optional fields:** `website`, `vendor`, `toolchainDimensions`, `categoryIds`, `tagIds`, `skillIds`, `security`, `links`
- **Cross-links:** `skillIds`, `categoryIds`, `tagIds` and optional `links: LinkEdge[]`
- **Zod shape (spec):**
```ts
Tool = {
  lang: Lang
  toolId: string
  name: string
  website?: string
  vendor?: string
  toolchainDimensions?: string[]   // categoryId[] where dimension=toolchainDimension
  categoryIds?: string[]
  tagIds?: string[]
  skillIds?: string[]
  security?: SecurityFacetRefs
  links?: LinkEdge[]
  visibility?: Visibility
}
```
- **Example frontmatter:**
```yaml
lang: en
toolId: kubernetes
name: Kubernetes
toolchainDimensions: ["operations"]
security:
  layers: ["kubernetes"]
```
- **Validation rules:** `toolchainDimensions` must reference categories where dimension is `toolchainDimension`; `security` categoryIds must match their dimensions.
- **i18n:** Yes (descriptions may translate; names often stable)
- **Body:** Optional

---

### skills (required)
- **Purpose:** human capability/domain expertise; connects to proof via projects/experience/case studies/blog/resources.
- **Location:** `src/content/skills/{lang}/{skillId}.md`
- **Filename:** `{skillId}.md`
- **Required fields:** `lang`, `skillId`, `name`
- **Optional fields:** `level`, `categoryIds`, `tagIds`, `toolIds`, `security`, `links`
- **Cross-links:** `toolIds`, `categoryIds`, `tagIds`, `links`
- **Zod shape (spec):**
```ts
Skill = {
  lang: Lang
  skillId: string
  name: string
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  toolIds?: string[]
  categoryIds?: string[]
  tagIds?: string[]
  security?: SecurityFacetRefs
  links?: LinkEdge[]
  visibility?: Visibility
}
```
- **Example frontmatter:**
```yaml
lang: en
skillId: detection-engineering
name: Detection Engineering
security:
  domains: ["detection-engineering"]
  postures: ["defensive"]
```
- **Validation rules:** referenced tool/category/tag IDs must resolve.
- **i18n:** Yes
- **Body:** Optional

---

### achievements (required)
- **Purpose:** credibility signals tied to experience/projects/certs; unit of “proof” on Home.
- **Location:** `src/content/achievements/{lang}/{achievementId}.md`
- **Filename:** `{achievementId}.md`
- **Required fields:** `lang`, `achievementId`, `title`, `summary`
- **Optional fields:** `date`, `dateRange`, `evidence`, `toolIds`, `skillIds`, `categoryIds`, `tagIds`, `security`
- **Cross-links:** `evidence` may reference `experienceId`, `projectId`, `caseStudyId`, `certificationId`, `blogSlug`
- **Zod shape (spec):**
```ts
Achievement = {
  lang: Lang
  achievementId: string
  title: string
  summary: string
  date?: string
  dateRange?: { start: string; end?: string }
  evidence?: { experienceIds?: string[]; projectIds?: string[]; caseStudyIds?: string[]; certificationIds?: string[]; blogSlugs?: string[]; resourceIds?: string[] }
  toolIds?: string[]
  skillIds?: string[]
  categoryIds?: string[]
  tagIds?: string[]
  security?: SecurityFacetRefs
  links?: LinkEdge[]
  visibility?: Visibility
}
```
- **Example frontmatter:**
```yaml
lang: en
achievementId: built-eks-zero-trust-platform
title: EKS Zero Trust Platform
summary: "..."
evidence:
  caseStudyIds: ["glam-hybrid-cloud"]
security:
  domains: ["cloud-security", "kubernetes-security"]
  postures: ["defensive", "purple-team"]
```
- **Validation rules:** at least one evidence pointer OR at least one tool/skill/category reference; empty achievements are disallowed.
- **i18n:** Yes
- **Body:** Optional

---

### certifications (required)
- **Purpose:** certifications and issuer metadata, mapped to skills/tools/categories and security facets.
- **Location:** `src/content/certifications/{lang}/{certificationId}.md`
- **Filename:** `{certificationId}.md`
- **Required fields:** `lang`, `certificationId`, `name`, `issuer`
- **Optional fields:** `issuedDate`, `expiresDate`, `credentialId`, `credentialUrl`, `skillIds`, `toolIds`, `categoryIds`, `tagIds`, `security`, `status`
- **Zod shape (spec):**
```ts
Certification = {
  lang: Lang
  certificationId: string
  name: string
  issuer: string
  issuedDate?: string
  expiresDate?: string
  credentialId?: string
  credentialUrl?: string
  status?: 'active' | 'expired' | 'in-progress' | 'unknown'
  toolIds?: string[]
  skillIds?: string[]
  categoryIds?: string[]
  tagIds?: string[]
  security?: SecurityFacetRefs
  links?: LinkEdge[]
  visibility?: Visibility
}
```
- **Example frontmatter:**
```yaml
lang: en
certificationId: aws-security-specialty
name: AWS Certified Security – Specialty
issuer: AWS
credentialUrl: https://...
```
- **Validation rules:** if `credentialUrl` is present it must be a URL; never store secrets/tokens in URLs.
- **i18n:** Yes
- **Body:** Optional

---

### education (required)
- **Purpose:** studies and education proof; supports recruiter “Studies” module.
- **Location:** `src/content/education/{lang}/{educationId}.md`
- **Filename:** `{educationId}.md`
- **Required fields:** `lang`, `educationId`, `institution`, `program`
- **Optional fields:** `startDate`, `endDate`, `status`, `location`, `categoryIds`, `tagIds`, `links`
- **Zod shape (spec):**
```ts
Education = {
  lang: Lang
  educationId: string
  institution: string
  program: string
  startDate?: string
  endDate?: string
  status?: 'completed' | 'in-progress' | 'unknown'
  location?: string
  categoryIds?: string[]
  tagIds?: string[]
  links?: LinkEdge[]
  visibility?: Visibility
}
```
- **Example frontmatter:**
```yaml
lang: en
educationId: ms-cybersecurity
institution: "..."
program: "..."
status: unknown
```
- **Validation rules:** no invented degrees; uncertainties are allowed only when explicitly marked (implementation convention).
- **i18n:** Yes
- **Body:** Optional

---

### languages (required)
- **Purpose:** spoken languages and proficiency.
- **Location:** `src/content/languages/{lang}/{languageId}.md`
- **Filename:** `{languageId}.md`
- **Required fields:** `lang`, `languageId`, `name`, `proficiency`
- **Optional fields:** `certificationId`, `notes`
- **Zod shape (spec):**
```ts
Language = { lang: Lang; languageId: string; name: string; proficiency: string; certificationId?: string; notes?: string; visibility?: Visibility }
```
- **Example frontmatter:**
```yaml
lang: en
languageId: spanish
name: Spanish
proficiency: Native
```
- **i18n:** Yes
- **Body:** None

---

### hobbies (required)
- **Purpose:** hobbies as human signal; minimal but linkable.
- **Location:** `src/content/hobbies/{lang}/{hobbyId}.md`
- **Filename:** `{hobbyId}.md`
- **Required fields:** `lang`, `hobbyId`, `name`
- **Optional fields:** `summary`, `tagIds`
- **Zod shape (spec):**
```ts
Hobby = { lang: Lang; hobbyId: string; name: string; summary?: string; tagIds?: string[]; visibility?: Visibility }
```
- **Example frontmatter:**
```yaml
lang: en
hobbyId: photography
name: Photography
```
- **i18n:** Yes
- **Body:** Optional

---

### softSkills (required)
- **Purpose:** soft skills tied to evidence (experience/projects/achievements).
- **Location:** `src/content/softSkills/{lang}/{softSkillId}.md`
- **Filename:** `{softSkillId}.md`
- **Required fields:** `lang`, `softSkillId`, `name`, `summary`
- **Optional fields:** `evidence`, `tagIds`
- **Zod shape (spec):**
```ts
SoftSkill = {
  lang: Lang
  softSkillId: string
  name: string
  summary: string
  evidence?: { experienceIds?: string[]; projectIds?: string[]; achievementIds?: string[] }
  tagIds?: string[]
  visibility?: Visibility
}
```
- **Example frontmatter:**
```yaml
lang: en
softSkillId: stakeholder-management
name: Stakeholder management
summary: "..."
evidence:
  experienceIds: ["acme-platform-security-2024"]
```
- **i18n:** Yes
- **Body:** Optional

---

### experience (required)
- **Purpose:** LinkedIn-sync-ready roles and work history; primary proof chain for skills/tools/security facets.
- **Location:** `src/content/experience/{lang}/{experienceId}.md`
- **Filename:** `{experienceId}.md`
- **Required fields:** `lang`, `experienceId`, `companyName`, `roleTitle`, `startDate`, `summary`
- **Optional fields:** `clientName`, `endDate`, `isCurrent`, `location`, `highlights`, `toolIds`, `skillIds`, `categoryIds`, `tagIds`, `security`, `proofLinks`
- **Cross-links:** `projectIds`, `caseStudyIds`, `blogSlugs`, `resourceIds`, `achievementIds` (via typed `links` or explicit fields)
- **Zod shape (spec):**
```ts
Experience = {
  lang: Lang
  experienceId: string
  companyName: string
  clientName?: string
  roleTitle: string
  location?: string
  startDate: string
  endDate?: string
  isCurrent?: boolean
  summary: string
  highlights?: string[]
  toolIds?: string[]
  skillIds?: string[]
  categoryIds?: string[]
  tagIds?: string[]
  security?: SecurityFacetRefs
  proofLinks?: Array<{ label: string; url: string }>
  links?: LinkEdge[]
  visibility?: Visibility
  needsConfirmation?: string[]
}
```
- **Example frontmatter:**
```yaml
lang: en
experienceId: acme-platform-security-2024
companyName: ACME
roleTitle: Platform Security Engineer
startDate: "2024-01"
summary: "..."
toolIds: ["kubernetes", "terraform", "cilium"]
security:
  domains: ["kubernetes-security", "platform-security"]
  layers: ["kubernetes", "runtime"]
  postures: ["defensive"]
needsConfirmation:
  - "Confirm exact endDate"
```
- **Validation rules:** if `isCurrent=true` then `endDate` must be absent; all referenced IDs must resolve.
- **i18n:** Yes
- **Body:** Optional (prefer frontmatter + highlights; long narrative belongs in case studies)

---

### projects (required)
- **Purpose:** portfolio projects and demos; connect to tools, skills, experience, blog, resources.
- **Location:** `src/content/projects/{lang}/{projectId}.md`
- **Filename:** `{projectId}.md`
- **Required fields:** `lang`, `projectId`, `title`, `summary`, `status`
- **Optional fields:** `repoUrl`, `demoUrl`, `deploymentUrl`, `toolIds`, `skillIds`, `categoryIds`, `tagIds`, `security`, `featured`
- **Zod shape (spec):**
```ts
Project = {
  lang: Lang
  projectId: string
  title: string
  summary: string
  status: 'active' | 'maintained' | 'archived' | 'experimental'
  repoUrl?: string
  demoUrl?: string
  deploymentUrl?: string
  toolIds?: string[]
  skillIds?: string[]
  categoryIds?: string[]
  tagIds?: string[]
  security?: SecurityFacetRefs
  links?: LinkEdge[]
  featured?: boolean
  visibility?: Visibility
}
```
- **Example frontmatter:**
```yaml
lang: en
projectId: control-room-portfolio
title: Hybrid Cloud Control Room Portfolio
summary: "Astro + progressive enhancement + control room narrative."
status: active
repoUrl: https://github.com/guillermolam/cv
toolIds: ["astro", "threejs", "gsap"]
```
- **Validation rules:** status required; URLs validated; no broken internal references.
- **i18n:** Yes
- **Body:** Optional (use case studies for long form)

---

### caseStudies (required)
- **Purpose:** long-form proof narratives with stable slugs and strong linking.
- **Location:** `src/content/caseStudies/{lang}/{caseStudyId}.md`
- **Filename:** `{caseStudyId}.md`
- **Required fields:** `lang`, `caseStudyId`, `slug`, `title`, `excerpt`, `problem`, `approach`, `outcome`
- **Optional fields:** `responsibilities`, `metrics`, `toolIds`, `skillIds`, `categoryIds`, `tagIds`, `security`, `featured`
- **Zod shape (spec):**
```ts
CaseStudy = {
  lang: Lang
  caseStudyId: string
  slug: string
  title: string
  excerpt: string
  problem: string
  approach: string
  outcome: string
  responsibilities?: string[]
  metrics?: string[]
  toolIds?: string[]
  skillIds?: string[]
  categoryIds?: string[]
  tagIds?: string[]
  security?: SecurityFacetRefs
  links?: LinkEdge[]
  featured?: boolean
  visibility?: Visibility
  needsConfirmation?: string[]
}
```
- **Example frontmatter:**
```yaml
lang: en
caseStudyId: glam-hybrid-cloud
slug: glam-hybrid-cloud
title: Hybrid Cloud Control Room
excerpt: "..."
problem: "..."
approach: "..."
outcome: "..."
```
- **Validation rules:** markdown body is required; `slug` must be stable across languages.
- **i18n:** Yes
- **Body:** MD/MDX required

---

### blog (required)
- **Purpose:** tutorials and technical posts; supports series and proof linking.
- **Location:** `src/content/blog/{lang}/{blogSlug}.md`
- **Filename:** `{blogSlug}.md`
- **Required fields:** `lang`, `blogSlug` (or `slug`), `title`, `publishedDate`, `summary`
- **Optional fields:** `seriesId`, `part`, `updatedDate`, `toolIds`, `skillIds`, `categoryIds`, `tagIds`, `security`
- **Zod shape (spec):**
```ts
BlogPost = {
  lang: Lang
  blogSlug: string
  title: string
  summary: string
  publishedDate: string
  updatedDate?: string
  series?: { seriesId: string; part?: number }
  toolIds?: string[]
  skillIds?: string[]
  categoryIds?: string[]
  tagIds?: string[]
  security?: SecurityFacetRefs
  links?: LinkEdge[]
  visibility?: Visibility
}
```
- **Example frontmatter:**
```yaml
lang: en
blogSlug: writing-sigma-rules-for-cloud
title: Writing Sigma Rules for Cloud
summary: "..."
publishedDate: "2026-05-01"
series:
  seriesId: detection-engineering
  part: 1
```
- **Validation rules:** markdown body required; if series part exists, seriesId required.
- **i18n:** Yes (EN-first acceptable; indexes still exist in all languages)
- **Body:** MD/MDX required

---

### knowledgeResources (required)
- **Purpose:** knowledge center items (books/videos/repos/articles/courses/etc) linked to tools/skills/proof.
- **Location:** `src/content/knowledgeResources/{lang}/{resourceId}.md`
- **Filename:** `{resourceId}.md`
- **Required fields:** `lang`, `resourceId`, `title`, `type`, `summary`
- **Optional fields:** `canonicalId`, `url`, `author`, `publisher`, `level`, `status`, `toolIds`, `skillIds`, `categoryIds`, `tagIds`, `projectIds`, `caseStudyIds`, `blogSlugs`, `links`, `needsConfirmation`, `visibility`
- **Zod shape (spec):**
```ts
KnowledgeResource = {
  lang: Lang
  resourceId: string
  title: string
  type: 'book' | 'article' | 'paper' | 'video' | 'course' | 'repo' | 'documentation' | 'talk' | 'documentary' | 'playlist' | 'tool' | 'other'
  url?: string
  author?: string
  publisher?: string
  summary: string
  level?: 'intro' | 'intermediate' | 'advanced' | 'reference'
  status?: 'planned' | 'reading' | 'completed' | 'reference' | 'archived'
  toolIds?: string[]
  skillIds?: string[]
  categoryIds?: string[]
  tagIds?: string[]
  projectIds?: string[]
  caseStudyIds?: string[]
  blogSlugs?: string[]
  links?: LinkEdge[]
  needsConfirmation?: string[]
  visibility?: Visibility
}
```
- **Example frontmatter:**
```yaml
lang: en
resourceId: astro-content-collections
title: Astro Content Collections (Official Guide)
type: documentation
summary: Official reference for defining schemas, loading content, and generating static routes from validated collections.
url: https://docs.astro.build/en/guides/content-collections/
toolIds: [astro]
categoryIds: [platform-engineering]
```
- **Validation rules:** `resourceId` must be kebab-case; if `url` present it must be a URL and must not use unsafe schemes; references must resolve.
- **i18n:** Yes
- **Body:** Optional (annotations/notes may live in body for longer context)

---

### contactChannels (required)
- **Purpose:** structured contact info and optional availability metadata.
- **Location:** `src/content/contactChannels/{lang}/channels.md`
- **Filename:** fixed `channels.md`
- **Required fields:** `lang`, `channels[]`
- **Optional fields:** `availability`
- **Zod shape (spec):**
```ts
ContactChannels = {
  lang: Lang
  channels: Array<{
    channelId: string
    type: 'email' | 'telegram' | 'slack' | 'github' | 'linkedin' | 'website' | 'other'
    label: string
    value: string
    url?: string
    visibility?: Visibility
    allowCopy?: boolean
  }>
  availability?: { status?: 'open' | 'limited' | 'closed'; notes?: string }
}
```
- **Example frontmatter:**
```yaml
lang: en
channels:
  - channelId: email
    type: email
    label: Email
    value: guillermo@example.com
    allowCopy: true
```
- **Validation rules:** email-type channels must include an email-like value (implementation rule); copy actions are optional and must not hide the value.
- **i18n:** Yes
- **Body:** None

---

### socialLinks (required)
- **Purpose:** global social links for header/footer; complements contact channels.
- **Location:** `src/content/socialLinks/{lang}/links.md`
- **Filename:** fixed `links.md`
- **Required fields:** `lang`, `links[]`
- **Zod shape (spec):**
```ts
SocialLinks = {
  lang: Lang
  links: Array<{ socialId: string; label: string; url: string; kind: 'github' | 'linkedin' | 'twitter' | 'mastodon' | 'blog' | 'other' }>
}
```
- **Example frontmatter:**
```yaml
lang: en
links:
  - socialId: github
    label: GitHub
    url: https://github.com/guillermolam
    kind: github
```
- **Validation rules:** URLs must be valid and must not contain secrets.
- **i18n:** Yes
- **Body:** None

---

### cvFormats (required)
- **Purpose:** CV download format metadata (availability, descriptions, and links to PDFs under `public/cv/`).
- **Location:** `src/content/cvFormats/{lang}/{cvFormatId}.md`
- **Filename:** `{cvFormatId}.md`
- **Required fields:** `lang`, `cvFormatId`, `title`, `description`, `useCase`, `availability`
- **Optional fields:** `downloadPath`
- **Zod shape (spec):**
```ts
CvFormat = {
  lang: Lang
  cvFormatId: 'europass' | 'modern' | 'recruiter' | 'ats' | 'one-page' | 'full-technical'
  title: string
  description: string
  useCase: string
  availability: 'available' | 'coming-soon'
  downloadPath?: string
  visibility?: Visibility
}
```
- **Example frontmatter:**
```yaml
lang: en
cvFormatId: recruiter
title: Recruiter CV
description: "..."
useCase: "Fast screening and shortlists."
availability: coming-soon
```
- **Validation rules:** `downloadPath` is required when `availability=available` and must reference an existing file under `public/cv/`.
- **i18n:** Yes
- **Body:** None

---

## Derived Indexes (Build-time Utilities; Spec Only)

### Backlinks
Goal: provide Obsidian-like “Referenced by” lists on every entry page.

Derived outputs:
- `getOutgoingEdges(nodeKey, lang) -> Edge[]`
- `getIncomingEdges(nodeKey, lang) -> Edge[]` (backlinks)

Rules:
- Typed `links` are authoritative edges.
- Cross-link arrays (`toolIds`, `skillIds`, `categoryIds`, `tagIds`) become edges of inferred type:
  - `uses` (for toolIds)
  - `demonstrates` (for skillIds)
  - `classified_as` (for tags/categories/security facets)
- Body wikilinks become edges of type `references` and are lower weight than typed edges.

### Related items
Goal: show “Related” modules (similar tags/categories/tools/skills/security facets + explicit links).

Minimum related algorithms:
- **Intersection-based:** shared `toolIds`, `skillIds`, `categoryIds`, `tagIds`, and `security` facets.
- **Edge-based:** follow `links` and `backlinks`.

### Recruiter stats
Goal: show stable stats on home:
- years of experience (derived from earliest `experience.startDate` unless overridden)
- counts: certifications, projects, case studies, knowledge resources
- languages list and proficiency
- “proof links” and featured items (from profile/stats)

### Toolchain matrix
Goal: map tools/skills by multiple dimensions:
- Development / Operations / Security / AI / Architecture & Integration
- Security facets filter support (domain, posture, layer, lifecycle, frameworks, etc.)

### Proof graph (for claims)
Goal: demonstrate credibility:
- for a given `skillId` or `security` facet, list evidence:
  - experience entries
  - projects and case studies
  - achievements
  - certifications
  - supporting blog posts

---

## Island and State Strategy (Refined)

### Default: build-time first
- All index pages render as static lists grouped/sorted using build-time utilities.
- Islands add optional filter UIs; they never gate access to the list.

### Islands (required by this change)
- `ToolchainExplorer`:
  - Enhances `/{lang}/toolchain` by filtering tools/skills across dimensions and security facets.
  - Static fallback: pre-rendered sections per toolchain dimension with anchor links.
- `KnowledgeGraphExplorer`:
  - Enhances `/{lang}/knowledge` with a graph/list hybrid.
  - Static fallback: grouped list by resourceType with anchor links; no essential content in canvas.
- `RecruiterStatsPanel`:
  - Default static; optional island only for animated counters.
  - Counters must respect reduced motion: either instant display or user-triggered.
- `ProjectFilter` and `BlogFilter`:
  - Enhance `/portfolio` and `/blog` indexes, respectively; static fallback list always present.
- `ContactActions`:
  - Optional copy-to-clipboard for channels; contact values always visible without JS.

### Nanostores usage
Nanostores are optional and only justified if:
- multiple islands share the same filter state on the same page, and
- that state is not representable as simple URL query params, and
- no essential content depends on it.

---

## Validation Gates (Required)

### Build and type validation
- `pnpm astro check`
- `pnpm build`

### Content validation (new)
- content schema validation must fail on:
  - missing required fields
  - broken references (internal IDs that do not exist)
  - invalid security facet references (dimension mismatch)
- broken internal link detection for:
  - `links: LinkEdge[]` targets
  - wikilinks `[[collection:id]]` (if enabled)

### Data hygiene validation (new)
- orphan detection:
  - tags/categories/tools/skills referenced nowhere (report-only by default; fail if `visibility=public`)
- backlink generation test:
  - known fixture content produces expected backlinks deterministically

### Guardrail validation
- no React dependency added
- no CMS dependency added
- no essential content hidden inside client islands or WebGL
- reduced-motion behavior verified for any animated counters/filters
- JS-disabled fallback preserves core content (hub lists + detail content visible)
