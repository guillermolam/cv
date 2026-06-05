# Tasks

- [ ] Task 0: Architecture review handoff (Portfolio Architect + CV Content Architect).
  - [ ] Confirm IA changes preserve recruiter fast path (Home → CV/Proof → Contact).
  - [ ] Confirm security facet dimensions and category strategy are acceptable and maintainable.
  - [ ] Confirm per-collection schemas are realistic given existing CV source material and current pages.

- [ ] Task 1: Update architecture documentation (docs/*).
  - [ ] Update `docs/architecture/content-model.md` to include required collections and stable-ID references.
  - [ ] Update `docs/architecture/ia.md` with `/toolchain`, `/experience`, `/knowledge` routes (and i18n equivalents) while preserving `/cv`.
  - [ ] Update `docs/architecture/control-room-blueprint.md` to map the new home modules (stats + proof links) and hubs.
  - [ ] Create `docs/architecture/content-graph.md` (node/edge model, backlinks rules, wikilinks policy).
  - [ ] Create `docs/architecture/data-flow.md` (build-time derivation pipeline and trust boundaries).
  - [ ] Create `docs/architecture/islands-and-state.md` (islands + nanostores constraints).
  - [ ] Create `docs/architecture/linking-taxonomy.md` (tags vs categories vs tools vs skills; security facets).
  - [ ] Create `docs/architecture/linkedin-sync.md` (manual-only; mapping to collections).
  - [ ] Create `docs/architecture/seo-content-strategy.md` (hub/index strategy, canonicals, hreflang, sitemap inputs).

- [ ] Task 2: Update project-level spec/docs entry points.
  - [ ] Update `.trae/documents/master-implementation-plan-hybrid-cloud-control-room.md` (Phase 4 becomes content-graph-driven).
  - [ ] Update `docs/spec.md` to include the content graph as a first-class product capability.
  - [ ] Update `docs/tasks.md` to include the content graph workstream.
  - [ ] Update `docs/checklist.md` with content-graph validation gates.
  - [ ] Update `README.md` with authoring workflow: adding tools/projects/resources, linking entries, backlinks, recruiter stats derivation, manual LinkedIn sync, validation commands.

- [ ] Task 3: Add Astro Content Collections foundation (no React, static-first).
  - [ ] Add `@astrojs/content` and create `src/content/config.ts`.
  - [ ] Create folder scaffolding under `src/content/**` for all required collections.
  - [ ] Implement Zod schemas per this spec, including security facet dimension validation.

- [ ] Task 4: Build-time content graph utilities.
  - [ ] Add `src/lib/content/collections.ts` (loaders, normalization to nodeKey).
  - [ ] Add `src/lib/content/relationships.ts` (typed edge resolution + inferred edges).
  - [ ] Add `src/lib/content/backlinks.ts` (incoming edges map).
  - [ ] Add `src/lib/content/stats.ts` (recruiter stats derivation + overrides).
  - [ ] Add `src/lib/content/toolchain.ts` (dimension grouping + security facet slicing).
  - [ ] Add `src/lib/content/seo.ts` (page metadata derivation + sitemap inputs).

- [ ] Task 5: Content authoring and migration (manual, evidence-based).
  - [ ] Populate controlled taxonomy (`categories`, `tags`) including security facet dimensions.
  - [ ] Populate `tools` and `skills` with stable IDs and cross-links.
  - [ ] Populate `experience` entries (LinkedIn-sync-ready; manual-only).
  - [ ] Populate `projects` and `caseStudies` with proof links and relationships.
  - [ ] Populate `knowledgeResources` with resource types and linkages.
  - [ ] Populate `achievements`, `certifications`, `education`, `languages`, `hobbies`, `softSkills`.
  - [ ] Populate `profile`, `stats`, `contactChannels`, `socialLinks`.
  - [ ] Populate `cvFormats` (metadata only; PDFs under `public/cv/`).

- [ ] Task 6: Route additions and updates (HTML-first hubs + detail pages).
  - [ ] Add `/toolchain` and `/{lang}/toolchain` (static list + optional ToolchainExplorer island).
  - [ ] Add `/experience` and `/{lang}/experience` (timeline view + indexable details).
  - [ ] Add `/knowledge` and `/{lang}/knowledge` (static list + optional KnowledgeGraphExplorer island).
  - [ ] Add `/knowledge/[slug]` and `/{lang}/knowledge/[slug]` (resource detail).
  - [ ] Add `/portfolio/[slug]` and `/{lang}/portfolio/[slug]` (project detail).
  - [ ] Update Home (`/` and `/{lang}/`) to render recruiter stats, proof links, and featured modules from collections.

- [ ] Task 7: Islands (optional enhancements only).
  - [ ] Implement `ToolchainExplorer` with static fallback list preserved.
  - [ ] Implement `KnowledgeGraphExplorer` with static fallback list preserved.
  - [ ] Implement `ProjectFilter` and `BlogFilter` with static fallback lists preserved.
  - [ ] Implement `ContactActions` (copy-to-clipboard only; values always visible).
  - [ ] Only add nanostores if shared filter state is proven necessary.

- [ ] Task 8: Validation, QA, and regression protection.
  - [ ] Add content validation tests: broken references, invalid security facet dimensions, backlink determinism.
  - [ ] Add internal link checks for hubs and detail routes.
  - [ ] Confirm no React and no CMS dependencies.
  - [ ] Run `pnpm astro check`, `pnpm build`, `pnpm test`, `pnpm test:e2e`.
  - [ ] Verify reduced-motion and JS-disabled fallbacks preserve core content and navigation.

# Task Dependencies
- Task 3 depends on Task 0
- Task 4 depends on Task 3
- Task 6 depends on Task 3 and Task 4
- Task 7 depends on Task 6
- Task 8 depends on Task 3, Task 4, and Task 6
