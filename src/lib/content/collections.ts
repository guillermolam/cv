import { getCollection } from 'astro:content'
import type { CollectionEntry } from 'astro:content'

export type SupportedCollectionName =
  | 'profile'
  | 'experience'
  | 'projects'
  | 'caseStudies'
  | 'blog'
  | 'knowledgeResources'
  | 'certifications'
  | 'cvFormats'
  | 'categories'
  | 'tags'
  | 'tools'
  | 'skills'
  | 'contactChannels'
  | 'socialLinks'

export const supportedCollections: SupportedCollectionName[] = [
  'profile',
  'experience',
  'projects',
  'caseStudies',
  'blog',
  'knowledgeResources',
  'certifications',
  'cvFormats',
  'categories',
  'tags',
  'tools',
  'skills',
  'contactChannels',
  'socialLinks',
]

export const getCollectionEntries = async <C extends SupportedCollectionName>(
  collectionName: C,
): Promise<CollectionEntry<C>[]> => {
  return getCollection(collectionName)
}

export const getEntryLang = (entry: { data?: { lang?: string } }) => entry.data?.lang

export const getEntryStableIdForCollection = (collection: SupportedCollectionName, entry: { id: string; data: any }) => {
  const data = entry.data ?? {}

  if (collection === 'profile') return entry.id.split('/').at(-1) ?? entry.id
  if (collection === 'contactChannels') return entry.id.split('/').at(-1) ?? entry.id
  if (collection === 'socialLinks') return entry.id.split('/').at(-1) ?? entry.id

  if (collection === 'experience') return data.experienceId
  if (collection === 'projects') return data.projectId
  if (collection === 'caseStudies') return data.caseStudyId
  if (collection === 'blog') return data.blogSlug
  if (collection === 'knowledgeResources') return data.resourceId
  if (collection === 'certifications') return data.certificationId
  if (collection === 'cvFormats') return data.cvFormatId
  if (collection === 'categories') return data.categoryId
  if (collection === 'tags') return data.tagId
  if (collection === 'tools') return data.toolId
  if (collection === 'skills') return data.skillId

  return entry.id
}

export const getEntryStableId = (entry: { id: string; data: any }) => {
  const data = entry.data ?? {}
  return (
    data.experienceId ??
    data.projectId ??
    data.caseStudyId ??
    data.blogSlug ??
    data.resourceId ??
    data.certificationId ??
    data.cvFormatId ??
    data.categoryId ??
    data.tagId ??
    data.toolId ??
    data.skillId ??
    (entry.id.split('/').at(-1) ?? entry.id)
  )
}

export const getEntrySlugForCollection = (collection: SupportedCollectionName, entry: { id: string; data: any }) => {
  const data = entry.data ?? {}

  if (collection === 'caseStudies' && typeof data.slug === 'string') return data.slug
  if (collection === 'blog' && typeof data.blogSlug === 'string') return data.blogSlug
  if (collection === 'knowledgeResources' && typeof data.resourceId === 'string') return data.resourceId

  const stableId = getEntryStableIdForCollection(collection, entry)
  if (typeof stableId === 'string' && stableId.length > 0) return stableId

  return entry.id.split('/').at(-1) ?? entry.id
}

export const getEntrySlug = (entry: { id: string; data: any }) => {
  const data = entry.data ?? {}
  return data.slug ?? data.blogSlug ?? getEntryStableId(entry)
}

export const getEntryTitleForCollection = (collection: SupportedCollectionName, entry: { data: any }) => {
  const data = entry.data ?? {}

  if (collection === 'profile') return data.headline ?? 'Profile'
  if (collection === 'experience') return `${data.companyName ?? 'Experience'} — ${data.roleTitle ?? ''}`.trim()
  if (collection === 'projects') return data.title ?? 'Project'
  if (collection === 'caseStudies') return data.title ?? 'Case Study'
  if (collection === 'blog') return data.title ?? 'Post'
  if (collection === 'knowledgeResources') return data.title ?? 'Resource'
  if (collection === 'certifications') return data.name ?? 'Certification'
  if (collection === 'cvFormats') return data.title ?? 'CV'
  if (collection === 'categories') return data.title ?? 'Category'
  if (collection === 'tags') return data.title ?? 'Tag'
  if (collection === 'tools') return data.name ?? 'Tool'
  if (collection === 'skills') return data.name ?? 'Skill'
  if (collection === 'contactChannels') return 'Contact Channels'
  if (collection === 'socialLinks') return 'Social Links'

  return 'Content'
}

export const getEntryTitle = (entry: { id: string; data: any }) => {
  const data = entry.data ?? {}
  return data.title ?? data.name ?? data.headline ?? `${entry.id.split('/').at(-1) ?? entry.id}`
}

export const getAllContentNodes = async () => {
  const entriesByCollection = await Promise.all(
    supportedCollections.map(async (collection) => [collection, await getCollectionEntries(collection)] as const),
  )

  return Object.fromEntries(entriesByCollection) as Record<SupportedCollectionName, CollectionEntry<any>[]>
}
