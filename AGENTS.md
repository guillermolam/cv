# AGENTS.md

# Portfolio Project

## Mission

Build a world-class portfolio for Guillermo Lam that communicates expertise in:

- Cloud Architecture
- Platform Engineering
- DevSecOps
- Cloud Security
- Internal Developer Platforms
- AI Infrastructure
- Kubernetes
- Multi-Cloud Operations

The experience should resemble a modern cloud control room and demonstrate engineering excellence without sacrificing usability.

---

## Primary Audience

1. Recruiters
2. Hiring Managers
3. Engineering Directors
4. CTOs
5. Platform Engineering Leaders

Technical peers are a secondary audience.

---

## Success Criteria

Within 30 seconds a visitor should understand:

- Who Guillermo Lam is
- What he specializes in
- What differentiates him from other candidates
- How to contact him

Every page should support hiring outcomes.

---

## Source Of Truth

Before implementing changes consult:

### Architecture

docs/architecture/

### Design

docs/design/

### Specifications

docs/spec.md

### Tasks

docs/tasks.md

### Validation

docs/checklist.md

If implementation conflicts with documentation:

STOP.

Update the appropriate specification or architecture document first.

---

## Decision Hierarchy

When guidance conflicts:

1. docs/spec.md
2. Architecture documents
3. Design documents
4. AGENTS.md
5. Local implementation preferences

Specifications always take precedence.

---

## Architecture Principles

The project is:

- Astro-first
- Accessibility-first
- Recruiter-first
- SEO-first
- Performance-first
- Motion-first (when it improves understanding)

Prefer:

- Content-first, indexable HTML
- Progressive enhancement (motion/3D as enhancements)
- Build-time rendering where possible
- Islands architecture and hydration only when interaction requires it

Avoid introducing SSR unless explicitly approved.

---

## Recruiter Experience Principles

Prioritize:

- Clarity
- Credibility
- Discoverability
- Conversion

Motion is a product feature when it improves understanding.

Visual effects must never reduce readability or hide critical content.

Understanding is more important than novelty.

---

## Control Room Narrative

The portfolio represents a cloud operations control room.

Every feature should reinforce one or more of:

- Observability
- Cloud Operations
- Platform Engineering
- Security Engineering
- Distributed Systems
- Reliability Engineering

Avoid:

- Generic SaaS aesthetics
- Startup landing-page clichés
- Decorative dashboards
- Visual effects without narrative purpose

---

## ThreeJS Philosophy

ThreeJS enhances storytelling.

ThreeJS is never the primary content.

All critical content must remain accessible:

- Without WebGL
- Without JavaScript
- With reduced motion enabled

Follow:

docs/architecture/threejs-boundaries.md

---

## Design Philosophy

Follow:

- docs/design/design-system.md
- docs/design/art-direction.md
- docs/design/motion-system.md
- docs/design/ui-patterns.md

Reuse existing patterns.

Do not create competing visual systems.

---

## Accessibility Requirements

All features must support:

- Keyboard navigation
- Semantic HTML
- Screen readers
- Reduced motion preferences
- Responsive layouts

Animations must never block access to content.

---

## Performance Requirements

Prioritize:

1. Accessibility
2. Performance
3. SEO
4. Visual effects

Prefer build-time solutions over runtime solutions.

Avoid unnecessary dependencies.

Minimize client-side JavaScript.

---

## Agent Workflow

Before implementation determine:

- Architecture exists
- Specification exists
- Ownership exists
- Validation exists

If any are missing:

STOP.

Create the missing artifact first.

### Planning

Use:

SOLO /plan

### Specification

Use:

SOLO /spec

### Implementation

Implementation agents must not redesign architecture.

Large architectural changes require returning to planning and specification phases.

---

## Agent Ownership

Respect agent ownership boundaries.

Avoid modifying unrelated directories.

Keep changes scoped to assigned responsibilities.

Large repository-wide changes require explicit justification.

---

## Validation Requirements

Before completing work verify:

- Build passes
- Lint passes
- Type checking passes
- Accessibility remains valid
- Mobile layouts remain valid

Do not mark work complete without validation.

---

## Deployment

Deployment targets:

- Fermyon
- GitHub Pages

Assume:

- Static hosting
- CDN delivery
- No server runtime

Do not introduce SSR without explicit approval.

---

## Guiding Principle

When choosing between:

- Complexity and simplicity
- Animation and clarity
- Novelty and usability
- Visual impact and recruiter comprehension

Choose the option that improves understanding and hiring outcomes.
