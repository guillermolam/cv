---
alwaysApply: false
globs: .github/**,spin.toml,scripts/**
description: Apply when modifying deployment, CI/CD, build pipelines, hosting, routing, or infrastructure configuration.
---
# Deployment Constraints

Target platforms:

- Fermyon
- GitHub Pages

Assume:

- Static hosting
- CDN delivery
- No server runtime

Do not introduce SSR without approval.