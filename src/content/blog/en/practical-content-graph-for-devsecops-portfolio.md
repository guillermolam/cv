---
lang: en
blogSlug: practical-content-graph-for-devsecops-portfolio
title: Practical Content Graph for a DevSecOps Portfolio
summary: A schema-first approach to linking tools, skills, and proof without a backend.
publishedDate: "2026-06-04"
draft: true
visibility: draft
tagIds: [astro, ci-cd]
categoryIds: [devsecops]
toolIds: [astro, typescript]
skillIds: [static-site-architecture, devsecops]
links:
  - type: references
    targetCollection: caseStudies
    targetId: control-room-portfolio-content-graph
  - type: references
    targetCollection: projects
    targetId: control-room-portfolio
---

## Why

Portfolios often become static pages with weak linking, which makes it hard to prove claims across
security, delivery, and platform work.

## What this post covers

- Stable IDs for content entries
- Typed link edges and conservative cross-link fields
- Build-time derived navigation (related/backlinks) as progressive enhancement
