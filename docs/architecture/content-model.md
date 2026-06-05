# Content Model (Schemas Only) — Hybrid Cloud Control Room

Source of truth: [.trae/documents/master-implementation-plan-hybrid-cloud-control-room.md](file:///Users/guillermolammartin/Git/guillermolam/cv/.trae/documents/master-implementation-plan-hybrid-cloud-control-room.md)

This document defines the content collection schemas only. It does not populate content.

Design goals:
- Current implementation validates content entries for `en|es` (route-level `fr/de` is future work; some pages may render English fallbacks on `/{lang}/...`).
- Keep cross-linking stable via shared IDs.
- Keep claims traceable to existing source material (legacy CV markdown and verified records).

Notation:
- Fields are expressed as Zod-like schemas and equivalent TypeScript shapes for clarity.
- These schemas are intended to map to Astro Content Collections, but this document is architecture-only.

## Implementation Alignment (Current)

This architecture is implemented as Astro Content Collections with build-time graph validation:
- Content collections config: `src/content.config.ts` (Astro v6).
- Content lives under: `src/content/**`.
- Cross-links use controlled taxonomy + stable IDs via `*Ids` fields (no freeform tag arrays).
- Typed graph links use `links: LinkEdge[]` with `type`, `targetCollection`, `targetId`.
- Graph artifact output: `public/data/content-graph.json`.
- Validation scripts:
  - `pnpm content:validate`
  - `pnpm content:graph`
- CV download metadata source of truth: `cvFormats` (the `profile` collection may reference `cvFormatIds`, but must not duplicate download metadata).
- Local dev convenience:
  - `pnpm dev` (default port 4321)
  - `pnpm dev:4324` (reliable fixed-port manual preview, including GLB asset checks)

---

## Shared Types

### Language

```ts
type Lang = 'en' | 'es'
```

Note: `fr/de` are planned for future content translations; the route-level structure may exist before translated content does.

### Links

```ts
type ExternalLink = {
  label: string
  url: string
}

type LinkEdge = {
  type: string
  targetCollection: string
  targetId: string
  weight?: 1 | 2 | 3 | 4 | 5
  context?: string
}
```

### Dates

Rules:
- Use ISO-8601 `YYYY-MM-DD` where possible.
- Allow `YYYY-MM` if day is unknown (implementation may model this as string + validation).

```ts
type ISODate = string
```

---

## Profile (collection: profile)

One entry per language.

```ts
type Profile = {
  lang: Lang
  fullName: string
  headline: string
  subheadline: string
  location?: string
  timezone?: string
  summary: string
  focusAreas: string[]
  primaryCTAs: {
    downloadCv: boolean
    viewPortfolio: boolean
    flagshipCaseStudyId?: string
  }
  socialLinks: ExternalLink[]
}
```

Zod-like:
```ts
const profileSchema = z.object({
  lang: z.enum(['en', 'es']),
  fullName: z.string().min(1),
  headline: z.string().min(1),
  subheadline: z.string().min(1),
  location: z.string().min(1).optional(),
  timezone: z.string().min(1).optional(),
  summary: z.string().min(1),
  focusAreas: z.array(z.string().min(1)).min(1),
  primaryCTAs: z.object({
    downloadCv: z.literal(true),
    viewPortfolio: z.literal(true),
    flagshipCaseStudyId: z.string().min(1).optional()
  }),
  socialLinks: z.array(z.object({
    label: z.string().min(1),
    url: z.string().url()
  })).min(1)
})
```

---

## Experience (collection: experience)

One entry per role per language, keyed by a shared `experienceId` across translations.

```ts
type Experience = {
  experienceId: string
  lang: Lang
  companyName: string
  clientName?: string
  roleTitle: string
  location?: string
  startDate: ISODate
  endDate?: ISODate
  isCurrent?: boolean
  summary: string
  highlights: string[]
  technologies: string[]
  domains: Array<'security' | 'infra' | 'development' | 'platform'>
  evidence?: {
    caseStudyIds?: string[]
    projectIds?: string[]
    blogSlugs?: string[]
  }
}
```

Zod-like:
```ts
const experienceSchema = z.object({
  experienceId: z.string().min(1),
  lang: z.enum(['en', 'es']),
  companyName: z.string().min(1),
  clientName: z.string().min(1).optional(),
  roleTitle: z.string().min(1),
  location: z.string().min(1).optional(),
  startDate: z.string().min(4),
  endDate: z.string().min(4).optional(),
  isCurrent: z.boolean().optional(),
  summary: z.string().min(1),
  highlights: z.array(z.string().min(1)).min(1),
  technologies: z.array(z.string().min(1)).optional().default([]),
  domains: z.array(z.enum(['security', 'infra', 'development', 'platform'])).min(1),
  evidence: z.object({
    caseStudyIds: z.array(z.string().min(1)).optional(),
    projectIds: z.array(z.string().min(1)).optional(),
    blogSlugs: z.array(z.string().min(1)).optional()
  }).optional()
})
```

---

## Projects (collection: projects)

Projects are portfolio items; they may be personal, open-source, or professional (if permissible to describe). Projects can appear in multiple portfolio categories via tags.

```ts
type Project = {
  projectId: string
  lang: Lang
  title: string
  summary: string
  status: 'active' | 'maintained' | 'archived' | 'experimental'
  repoUrl?: string
  demoUrl?: string
  deploymentUrl?: string
  tagIds?: string[]
  categoryIds?: string[]
  toolIds?: string[]
  skillIds?: string[]
  links?: LinkEdge[]
  featured?: boolean
}
```

Zod-like:
```ts
const projectSchema = z.object({
  projectId: z.string().min(1),
  lang: z.enum(['en', 'es']),
  title: z.string().min(1),
  summary: z.string().min(1),
  status: z.enum(['active', 'maintained', 'archived', 'experimental']),
  repoUrl: z.string().url().optional(),
  demoUrl: z.string().url().optional(),
  deploymentUrl: z.string().url().optional(),
  tagIds: z.array(z.string().min(1)).optional(),
  categoryIds: z.array(z.string().min(1)).optional(),
  toolIds: z.array(z.string().min(1)).optional(),
  skillIds: z.array(z.string().min(1)).optional(),
  links: z.array(linkEdgeSchema).optional(),
  featured: z.boolean().optional(),
})
```

---

## Case Studies (collection: caseStudies)

Case studies are the flagship proof artifacts. Each case study is a long-form narrative and may exist in multiple languages. `caseStudyId` is shared across translations.

```ts
type CaseStudy = {
  caseStudyId: string
  lang: Lang
  slug: string
  title: string
  excerpt: string
  category: 'development' | 'infra' | 'security'
  problem: string
  approach: string
  outcome: string
  responsibilities: string[]
  technologies: string[]
  relatedProjectIds?: string[]
  relatedExperienceIds?: string[]
  relatedBlogSlugs?: string[]
  isFlagship?: boolean
}
```

Zod-like:
```ts
const caseStudySchema = z.object({
  caseStudyId: z.string().min(1),
  lang: z.enum(['en', 'es']),
  slug: z.string().min(1),
  title: z.string().min(1),
  excerpt: z.string().min(1),
  category: z.enum(['development', 'infra', 'security']),
  problem: z.string().min(1),
  approach: z.string().min(1),
  outcome: z.string().min(1),
  responsibilities: z.array(z.string().min(1)).min(1),
  technologies: z.array(z.string().min(1)).optional().default([]),
  relatedProjectIds: z.array(z.string().min(1)).optional(),
  relatedExperienceIds: z.array(z.string().min(1)).optional(),
  relatedBlogSlugs: z.array(z.string().min(1)).optional(),
  isFlagship: z.boolean().optional()
})
```

---

## Certifications (collection: certifications)

Certifications should be handled carefully to avoid overclaiming. If any item is uncertain, it must be represented as such in content (implementation detail) rather than invented.

```ts
type Certification = {
  certificationId: string
  lang: Lang
  name: string
  issuer: string
  issuedDate?: ISODate
  expiresDate?: ISODate
  credentialId?: string
  credentialUrl?: string
  notes?: string
}
```

Zod-like:
```ts
const certificationSchema = z.object({
  certificationId: z.string().min(1),
  lang: z.enum(['en', 'es']),
  name: z.string().min(1),
  issuer: z.string().min(1),
  issuedDate: z.string().min(4).optional(),
  expiresDate: z.string().min(4).optional(),
  credentialId: z.string().min(1).optional(),
  credentialUrl: z.string().url().optional(),
  notes: z.string().min(1).optional()
})
```

---

## Blog (collection: blog)

Blog is allowed to be EN-first for long-form posts. Public detail pages MUST NOT be generated for drafts.

```ts
type BlogPost = {
  lang: Lang
  blogSlug: string
  title: string
  summary: string
  publishedDate: ISODate
  updatedDate?: ISODate
  tagIds?: string[]
  categoryIds?: string[]
  toolIds?: string[]
  skillIds?: string[]
  links?: LinkEdge[]
  draft?: boolean
}
```

Zod-like:
```ts
const blogSchema = z.object({
  lang: z.enum(['en', 'es']),
  blogSlug: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  publishedDate: z.string().min(4),
  updatedDate: z.string().min(4).optional(),
  tagIds: z.array(z.string().min(1)).optional(),
  categoryIds: z.array(z.string().min(1)).optional(),
  toolIds: z.array(z.string().min(1)).optional(),
  skillIds: z.array(z.string().min(1)).optional(),
  links: z.array(linkEdgeSchema).optional(),
  draft: z.boolean().optional(),
  visibility: z.enum(['public', 'unlisted', 'draft']).optional()
})
```

---

## Knowledge Resources (collection: knowledgeResources)

Knowledge resources are curated references (official docs, books, papers, repos) that justify or extend the portfolio’s architecture. These entries are content-first and linkable, but do not embed or iframe external content.

Rules:
- Use stable `resourceId` in kebab-case.
- Use `*Ids` relationships only (no freeform tags).
- Do not add tracking/affiliate URLs; reject unsafe URL schemes (javascript:, data:, vbscript:).
- Prefer `status: reference` unless there is clear evidence for another status.

```ts
type KnowledgeResource = {
  resourceId: string
  title: string
  lang: Lang
  canonicalId?: string
  type: 'book' | 'article' | 'paper' | 'video' | 'course' | 'repo' | 'documentation' | 'talk' | 'documentary' | 'playlist' | 'tool' | 'other'
  url?: string
  author?: string
  publisher?: string
  summary: string
  level?: 'intro' | 'intermediate' | 'advanced' | 'reference'
  status?: 'planned' | 'reading' | 'completed' | 'reference' | 'archived'
  tagIds?: string[]
  categoryIds?: string[]
  toolIds?: string[]
  skillIds?: string[]
  projectIds?: string[]
  caseStudyIds?: string[]
  blogSlugs?: string[]
  links?: LinkEdge[]
  needsConfirmation?: string[]
}
```

---

## CV Formats (collection: cvFormats)

CV PDFs live under `public/cv/`. The collection stores metadata only, including availability states.

```ts
type CvFormat = {
  cvFormatId: 'europass' | 'modern' | 'recruiter' | 'ats' | 'one-page' | 'full-technical'
  lang: Lang
  title: string
  description: string
  useCase: string
  availability: 'available' | 'coming-soon'
  downloadPath?: string
}
```

Zod-like:
```ts
const cvFormatSchema = z.object({
  cvFormatId: z.enum(['europass', 'modern', 'recruiter', 'ats', 'one-page', 'full-technical']),
  lang: z.enum(['en', 'es']),
  title: z.string().min(1),
  description: z.string().min(1),
  useCase: z.string().min(1),
  availability: z.enum(['available', 'coming-soon']),
  downloadPath: z.string().min(1).optional()
}).superRefine((v, ctx) => {
  if (v.availability === 'available' && !v.downloadPath) {
    ctx.addIssue({ code: 'custom', message: 'downloadPath required when availability=available' })
  }
})
```
