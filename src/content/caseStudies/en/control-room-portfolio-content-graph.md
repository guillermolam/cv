---
lang: en
caseStudyId: control-room-portfolio-content-graph
slug: control-room-portfolio-content-graph
title: Content Graph Foundations for a DevSecOps Portfolio
excerpt: Build an Obsidian-like, linkable content system in Astro without adding a backend.
problem: >-
  Traditional portfolios turn into unstructured pages and tag soup over time, making it hard to
  prove claims across security, platform engineering, and delivery work.
approach: >-
  Define a static content graph using Astro Content Collections with stable IDs and typed link
  edges, then derive related/backlink views at build time.
outcome: >-
  A schema-first foundation that enables recruiter-friendly navigation while supporting
  multi-dimensional security classification and evidence linking.
categoryIds: [devsecops, platform-engineering, creative-frontend]
tagIds: [astro, threejs, sbom, wasm]
toolIds: [astro, typescript]
skillIds: [static-site-architecture, interactive-frontend-architecture, devsecops]
security:
  domainIds: [devsecops, supply-chain-security]
links:
  - type: evidence_of
    targetCollection: projects
    targetId: control-room-portfolio
  - type: demonstrates
    targetCollection: skills
    targetId: static-site-architecture
  - type: demonstrates
    targetCollection: skills
    targetId: interactive-frontend-architecture
visibility: public
---

## Context

This is a minimal seed case study used to validate content collection schemas and cross-linking.

## Notes

- No runtime database.
- No headless CMS.
- All essential content remains accessible in HTML.
