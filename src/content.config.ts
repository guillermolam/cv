import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const base = (collection: string) => new URL(`./content/${collection}/`, import.meta.url)

const markdownLoader = (collection: string, excludePattern?: string | string[]) => {
  const excludePatterns = Array.isArray(excludePattern)
    ? excludePattern
    : excludePattern
      ? [excludePattern]
      : []
  return (
  glob({
    pattern: excludePatterns.length > 0
      ? ['**/*.{md,mdx}', ...excludePatterns]
      : '**/*.{md,mdx}',
    base: base(collection),
  })
  )
}

const langSchema = z.enum(['en', 'es'])

const canonicalIdSchema = z.string().min(1)

const visibilitySchema = z.enum(['public', 'unlisted', 'draft'])

const urlSchema = z.string().refine((value) => {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
})

const isoDateLikeSchema = z.string().min(4)

const linkEdgeTypeSchema = z.enum([
  'evidence_of',
  'implements',
  'uses',
  'mitigates',
  'related_to',
  'supersedes',
  'evolves_from',
  'proves',
  'explains',
  'references',
  'inspired_by',
  'part_of',
  'prerequisite_for',
  'teaches',
  'demonstrates',
  'achieved_at',
  'implemented_with',
  'deployed_on',
  'certified_by',
  'belongs_to_category',
  'tagged_with',
  'classified_as',
])

const linkEdgeTargetCollectionSchema = z.enum([
  'profile',
  'experience',
  'projects',
  'caseStudies',
  'blog',
  'certifications',
  'cvFormats',
  'categories',
  'tags',
  'tools',
  'skills',
  'contactChannels',
  'socialLinks',
])

const linkEdgeSchema = z.object({
  type: linkEdgeTypeSchema,
  targetCollection: linkEdgeTargetCollectionSchema,
  targetId: z.string().min(1),
  weight: z.number().refine(Number.isFinite).optional(),
  context: z.string().min(1).optional(),
})

const securityFacetSchema = z.object({
  domainIds: z.array(z.string().min(1)).optional(),
  subdomainIds: z.array(z.string().min(1)).optional(),
  layerIds: z.array(z.string().min(1)).optional(),
  operationalFunctionIds: z.array(z.string().min(1)).optional(),
  postureIds: z.array(z.string().min(1)).optional(),
  lifecycleStageIds: z.array(z.string().min(1)).optional(),
  controlTypeIds: z.array(z.string().min(1)).optional(),
  threatFocusIds: z.array(z.string().min(1)).optional(),
  technologyScopeIds: z.array(z.string().min(1)).optional(),
  frameworkIds: z.array(z.string().min(1)).optional(),
  businessCapabilityIds: z.array(z.string().min(1)).optional(),
  skillLevelIds: z.array(z.string().min(1)).optional(),
})

const categoryDimensionSchema = z.enum([
  'general',
  'controlRoomStation',
  'toolchainDimension',
  'development',
  'operations',
  'securityDomain',
  'securitySubdomain',
  'securityLayer',
  'securityOperationalFunction',
  'securityPosture',
  'securityLifecycleStage',
  'securityControlType',
  'securityThreatFocus',
  'securityTechnologyScope',
  'securityFramework',
  'securityBusinessCapability',
  'securitySkillLevel',
  'aiDomain',
  'architecturePattern',
])

const profile = defineCollection({
  loader: markdownLoader('profile'),
  schema: z.object({
    lang: langSchema,
    canonicalId: canonicalIdSchema.optional(),
    fullName: z.string().min(1),
    headline: z.string().min(1),
    subheadline: z.string().min(1).optional(),
    location: z.string().min(1).optional(),
    timezone: z.string().min(1).optional(),
    summary: z.string().min(1),
    focusAreas: z.array(z.string().min(1)).optional(),
    cvFormatIds: z
      .array(z.enum(['europass', 'modern', 'recruiter', 'ats', 'one-page', 'full-technical']))
      .optional(),
    featured: z
      .object({
        projectIds: z.array(z.string().min(1)).optional(),
        caseStudyIds: z.array(z.string().min(1)).optional(),
        blogSlugs: z.array(z.string().min(1)).optional(),
      })
      .optional(),
    links: z.array(linkEdgeSchema).optional(),
    visibility: visibilitySchema.optional(),
  }),
})

const experience = defineCollection({
  loader: markdownLoader('experience'),
  schema: z.object({
    lang: langSchema,
    canonicalId: canonicalIdSchema.optional(),
    experienceId: z.string().min(1),
    companyName: z.string().min(1),
    clientName: z.string().min(1).optional(),
    roleTitle: z.string().min(1),
    location: z.string().min(1).optional(),
    startDate: isoDateLikeSchema,
    endDate: isoDateLikeSchema.optional(),
    isCurrent: z.boolean().optional(),
    summary: z.string().min(1),
    highlights: z.array(z.string().min(1)).optional(),
    tagIds: z.array(z.string().min(1)).optional(),
    categoryIds: z.array(z.string().min(1)).optional(),
    toolIds: z.array(z.string().min(1)).optional(),
    skillIds: z.array(z.string().min(1)).optional(),
    security: securityFacetSchema.optional(),
    proofLinks: z.array(z.object({ label: z.string().min(1), url: urlSchema })).optional(),
    links: z.array(linkEdgeSchema).optional(),
    needsConfirmation: z.array(z.string().min(1)).optional(),
    visibility: visibilitySchema.optional(),
  }),
})

const projects = defineCollection({
  loader: markdownLoader('projects'),
  schema: z.object({
    lang: langSchema,
    canonicalId: canonicalIdSchema.optional(),
    projectId: z.string().min(1),
    title: z.string().min(1),
    summary: z.string().min(1),
    status: z.enum(['active', 'maintained', 'archived', 'experimental']),
    repoUrl: urlSchema.optional(),
    demoUrl: urlSchema.optional(),
    deploymentUrl: urlSchema.optional(),
    tagIds: z.array(z.string().min(1)).optional(),
    categoryIds: z.array(z.string().min(1)).optional(),
    toolIds: z.array(z.string().min(1)).optional(),
    skillIds: z.array(z.string().min(1)).optional(),
    security: securityFacetSchema.optional(),
    featured: z.boolean().optional(),
    links: z.array(linkEdgeSchema).optional(),
    visibility: visibilitySchema.optional(),
  }),
})

const caseStudies = defineCollection({
  loader: markdownLoader('caseStudies'),
  schema: z.object({
    lang: langSchema,
    canonicalId: canonicalIdSchema.optional(),
    caseStudyId: z.string().min(1),
    slug: z.string().min(1),
    title: z.string().min(1),
    excerpt: z.string().min(1),
    problem: z.string().min(1),
    approach: z.string().min(1),
    outcome: z.string().min(1),
    responsibilities: z.array(z.string().min(1)).optional(),
    metrics: z.array(z.string().min(1)).optional(),
    tagIds: z.array(z.string().min(1)).optional(),
    categoryIds: z.array(z.string().min(1)).optional(),
    toolIds: z.array(z.string().min(1)).optional(),
    skillIds: z.array(z.string().min(1)).optional(),
    security: securityFacetSchema.optional(),
    featured: z.boolean().optional(),
    links: z.array(linkEdgeSchema).optional(),
    needsConfirmation: z.array(z.string().min(1)).optional(),
    visibility: visibilitySchema.optional(),
  }),
})

const blog = defineCollection({
  loader: markdownLoader('blog'),
  schema: z.object({
    lang: langSchema,
    canonicalId: canonicalIdSchema.optional(),
    blogSlug: z.string().min(1),
    title: z.string().min(1),
    summary: z.string().min(1),
    publishedDate: isoDateLikeSchema,
    updatedDate: isoDateLikeSchema.optional(),
    series: z
      .object({
        seriesId: z.string().min(1),
        part: z.number().int().positive().optional(),
      })
      .optional(),
    tagIds: z.array(z.string().min(1)).optional(),
    categoryIds: z.array(z.string().min(1)).optional(),
    toolIds: z.array(z.string().min(1)).optional(),
    skillIds: z.array(z.string().min(1)).optional(),
    security: securityFacetSchema.optional(),
    links: z.array(linkEdgeSchema).optional(),
    draft: z.boolean().optional(),
    visibility: visibilitySchema.optional(),
  }),
})

const knowledgeResources = defineCollection({
  loader: markdownLoader('knowledgeResources', [
    '!**/_MOC*.md',
    '!vault/**/*#*.md',
  ]),
  schema: z.object({
    lang: langSchema,
    canonicalId: canonicalIdSchema.optional(),
    resourceId: z.string().min(1),
    title: z.string().min(1),
    type: z.enum([
      'book',
      'article',
      'paper',
      'video',
      'course',
      'repo',
      'documentation',
      'talk',
      'documentary',
      'playlist',
      'tool',
      'other',
    ]),
    url: urlSchema.optional(),
    author: z.string().min(1).optional(),
    publisher: z.string().min(1).optional(),
    summary: z.string().min(1),
    level: z.enum(['intro', 'intermediate', 'advanced', 'reference']).optional(),
    status: z.enum(['planned', 'reading', 'completed', 'reference', 'archived']).optional(),
    tagIds: z.array(z.string().min(1)).optional(),
    categoryIds: z.array(z.string().min(1)).optional(),
    toolIds: z.array(z.string().min(1)).optional(),
    skillIds: z.array(z.string().min(1)).optional(),
    projectIds: z.array(z.string().min(1)).optional(),
    caseStudyIds: z.array(z.string().min(1)).optional(),
    blogSlugs: z.array(z.string().min(1)).optional(),
    links: z.array(linkEdgeSchema).optional(),
    needsConfirmation: z.array(z.string().min(1)).optional(),
    visibility: visibilitySchema.optional(),
  }),
})

const certifications = defineCollection({
  loader: markdownLoader('certifications'),
  schema: z.object({
    lang: langSchema,
    canonicalId: canonicalIdSchema.optional(),
    certificationId: z.string().min(1),
    name: z.string().min(1),
    issuer: z.string().min(1),
    issuedDate: isoDateLikeSchema.optional(),
    expiresDate: isoDateLikeSchema.optional(),
    credentialId: z.string().min(1).optional(),
    credentialUrl: urlSchema.optional(),
    status: z.enum(['active', 'expired', 'in-progress', 'unknown']).optional(),
    tagIds: z.array(z.string().min(1)).optional(),
    categoryIds: z.array(z.string().min(1)).optional(),
    toolIds: z.array(z.string().min(1)).optional(),
    skillIds: z.array(z.string().min(1)).optional(),
    security: securityFacetSchema.optional(),
    links: z.array(linkEdgeSchema).optional(),
    needsConfirmation: z.array(z.string().min(1)).optional(),
    visibility: visibilitySchema.optional(),
  }),
})

const cvFormats = defineCollection({
  loader: markdownLoader('cvFormats'),
  schema: z
    .object({
      lang: langSchema,
      canonicalId: canonicalIdSchema.optional(),
      cvFormatId: z.enum(['europass', 'modern', 'recruiter', 'ats', 'one-page', 'full-technical']),
      title: z.string().min(1),
      description: z.string().min(1),
      useCase: z.string().min(1),
      availability: z.enum(['available', 'coming-soon']),
      downloadPath: z.string().min(1).optional(),
      visibility: visibilitySchema.optional(),
    })
    .superRefine((value, ctx) => {
      if (value.availability === 'available' && !value.downloadPath) {
        ctx.addIssue({ code: 'custom', message: 'downloadPath required when availability=available' })
      }
    }),
})

const categories = defineCollection({
  loader: markdownLoader('categories'),
  schema: z.object({
    lang: langSchema,
    canonicalId: canonicalIdSchema.optional(),
    categoryId: z.string().min(1),
    dimension: categoryDimensionSchema,
    title: z.string().min(1),
    slug: z.string().min(1),
    description: z.string().min(1).optional(),
    parentCategoryId: z.string().min(1).optional(),
    aliases: z.array(z.string().min(1)).optional(),
    visibility: visibilitySchema.optional(),
  }),
})

const tags = defineCollection({
  loader: markdownLoader('tags'),
  schema: z.object({
    lang: langSchema,
    canonicalId: canonicalIdSchema.optional(),
    tagId: z.string().min(1),
    title: z.string().min(1),
    slug: z.string().min(1),
    description: z.string().min(1).optional(),
    aliases: z.array(z.string().min(1)).optional(),
    visibility: visibilitySchema.optional(),
  }),
})

const tools = defineCollection({
  loader: markdownLoader('tools'),
  schema: z.object({
    lang: langSchema,
    canonicalId: canonicalIdSchema.optional(),
    toolId: z.string().min(1),
    name: z.string().min(1),
    website: urlSchema.optional(),
    vendor: z.string().min(1).optional(),
    tagIds: z.array(z.string().min(1)).optional(),
    categoryIds: z.array(z.string().min(1)).optional(),
    skillIds: z.array(z.string().min(1)).optional(),
    security: securityFacetSchema.optional(),
    links: z.array(linkEdgeSchema).optional(),
    visibility: visibilitySchema.optional(),
  }),
})

const skills = defineCollection({
  loader: markdownLoader('skills'),
  schema: z.object({
    lang: langSchema,
    canonicalId: canonicalIdSchema.optional(),
    skillId: z.string().min(1),
    name: z.string().min(1),
    level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).optional(),
    tagIds: z.array(z.string().min(1)).optional(),
    categoryIds: z.array(z.string().min(1)).optional(),
    toolIds: z.array(z.string().min(1)).optional(),
    security: securityFacetSchema.optional(),
    links: z.array(linkEdgeSchema).optional(),
    visibility: visibilitySchema.optional(),
  }),
})

const education = defineCollection({
  loader: markdownLoader('education'),
  schema: z.object({
    lang: langSchema,
    canonicalId: canonicalIdSchema.optional(),
    educationId: z.string().min(1),
    institution: z.string().min(1),
    degree: z.string().min(1),
    field: z.string().min(1).optional(),
    location: z.string().min(1).optional(),
    startDate: isoDateLikeSchema.optional(),
    endDate: isoDateLikeSchema.optional(),
    isCurrent: z.boolean().optional(),
    summary: z.string().min(1).optional(),
    logo: z.string().min(1).optional(),
    credentialUrl: urlSchema.optional(),
    tagIds: z.array(z.string().min(1)).optional(),
    categoryIds: z.array(z.string().min(1)).optional(),
    skillIds: z.array(z.string().min(1)).optional(),
    links: z.array(linkEdgeSchema).optional(),
    needsConfirmation: z.array(z.string().min(1)).optional(),
    visibility: visibilitySchema.optional(),
  }),
})

const languages = defineCollection({
  loader: markdownLoader('languages'),
  schema: z.object({
    lang: langSchema,
    canonicalId: canonicalIdSchema.optional(),
    languageId: z.string().min(1),
    name: z.string().min(1),
    nativeName: z.string().min(1).optional(),
    /** CEFR level or "native" */
    level: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'native']),
    /** ISO 3166-1 alpha-2 region for the flag (e.g. gb, es, fr, de) */
    flagRegion: z.string().length(2),
    summary: z.string().min(1).optional(),
    visibility: visibilitySchema.optional(),
  }),
})

const companies = defineCollection({
  loader: markdownLoader('companies'),
  schema: z.object({
    lang: langSchema,
    canonicalId: canonicalIdSchema.optional(),
    companyId: z.string().min(1),
    name: z.string().min(1),
    slug: z.string().min(1),
    url: urlSchema.optional(),
    logo: z.string().min(1).optional(),
    industry: z.string().min(1).optional(),
    location: z.string().min(1).optional(),
    summary: z.string().min(1).optional(),
    visibility: visibilitySchema.optional(),
  }),
})

const contactChannels = defineCollection({
  loader: markdownLoader('contactChannels'),
  schema: z.object({
    lang: langSchema,
    canonicalId: canonicalIdSchema.optional(),
    channels: z.array(
      z.object({
        channelId: z.string().min(1),
        type: z.enum(['email', 'telegram', 'slack', 'github', 'linkedin', 'website', 'other']),
        label: z.string().min(1),
        value: z.string().min(1),
        url: urlSchema.optional(),
        allowCopy: z.boolean().optional(),
        visibility: visibilitySchema.optional(),
      }),
    ),
    availability: z
      .object({
        status: z.enum(['open', 'limited', 'closed']).optional(),
        notes: z.string().min(1).optional(),
      })
      .optional(),
    visibility: visibilitySchema.optional(),
  }),
})

const socialLinks = defineCollection({
  loader: markdownLoader('socialLinks'),
  schema: z.object({
    lang: langSchema,
    canonicalId: canonicalIdSchema.optional(),
    links: z.array(
      z.object({
        socialId: z.string().min(1),
        label: z.string().min(1),
        url: urlSchema,
        kind: z.enum(['github', 'linkedin', 'telegram', 'slack', 'twitter', 'mastodon', 'blog', 'website', 'other']),
      }),
    ),
    visibility: visibilitySchema.optional(),
  }),
})

export const collections = {
  profile,
  experience,
  projects,
  caseStudies,
  blog,
  knowledgeResources,
  certifications,
  cvFormats,
  categories,
  tags,
  tools,
  skills,
  education,
  languages,
  companies,
  contactChannels,
  socialLinks,
}
