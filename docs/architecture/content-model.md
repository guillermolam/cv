# Content Model (Schemas Only) — Hybrid Cloud Control Room

Source of truth: [.trae/documents/master-implementation-plan-hybrid-cloud-control-room.md](file:///Users/guillermolammartin/Git/guillermolam/cv/.trae/documents/master-implementation-plan-hybrid-cloud-control-room.md)

This document defines the content collection schemas only. It does not populate content.

Design goals:
- Support `en/es/fr/de` across core content.
- Keep cross-linking stable via shared IDs.
- Keep claims traceable to existing source material (legacy CV markdown and verified records).

Notation:
- Fields are expressed as Zod-like schemas and equivalent TypeScript shapes for clarity.
- These schemas are intended to map to Astro Content Collections, but this document is architecture-only.

---

## Shared Types

### Language

```ts
type Lang = 'en' | 'es' | 'fr' | 'de'
```

### Links

```ts
type ExternalLink = {
  label: string
  url: string
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
  lang: z.enum(['en', 'es', 'fr', 'de']),
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
  lang: z.enum(['en', 'es', 'fr', 'de']),
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
  category: 'development' | 'infra' | 'security'
  tags: string[]
  status?: 'active' | 'maintained' | 'archived' | 'experimental'
  links?: {
    repo?: string
    demo?: string
    docs?: string
  }
  featured?: boolean
  relatedCaseStudyIds?: string[]
}
```

Zod-like:
```ts
const projectSchema = z.object({
  projectId: z.string().min(1),
  lang: z.enum(['en', 'es', 'fr', 'de']),
  title: z.string().min(1),
  summary: z.string().min(1),
  category: z.enum(['development', 'infra', 'security']),
  tags: z.array(z.string().min(1)).optional().default([]),
  status: z.enum(['active', 'maintained', 'archived', 'experimental']).optional(),
  links: z.object({
    repo: z.string().url().optional(),
    demo: z.string().url().optional(),
    docs: z.string().url().optional()
  }).optional(),
  featured: z.boolean().optional(),
  relatedCaseStudyIds: z.array(z.string().min(1)).optional()
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
  lang: z.enum(['en', 'es', 'fr', 'de']),
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
  lang: z.enum(['en', 'es', 'fr', 'de']),
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

Blog is allowed to be EN-first for long-form posts, but the IA expects the index route in all languages. Architecture supports translations by keeping stable `postId` across languages.

```ts
type BlogPost = {
  postId: string
  lang: Lang
  slug: string
  title: string
  excerpt: string
  publishedDate: ISODate
  updatedDate?: ISODate
  tags: string[]
  category?: 'security' | 'infra' | 'development' | 'platform'
  draft?: boolean
  relatedCaseStudyIds?: string[]
  relatedProjectIds?: string[]
}
```

Zod-like:
```ts
const blogSchema = z.object({
  postId: z.string().min(1),
  lang: z.enum(['en', 'es', 'fr', 'de']),
  slug: z.string().min(1),
  title: z.string().min(1),
  excerpt: z.string().min(1),
  publishedDate: z.string().min(4),
  updatedDate: z.string().min(4).optional(),
  tags: z.array(z.string().min(1)).optional().default([]),
  category: z.enum(['security', 'infra', 'development', 'platform']).optional(),
  draft: z.boolean().optional(),
  relatedCaseStudyIds: z.array(z.string().min(1)).optional(),
  relatedProjectIds: z.array(z.string().min(1)).optional()
})
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
  lang: z.enum(['en', 'es', 'fr', 'de']),
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

