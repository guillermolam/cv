export type ContentGraphNode = {
  key: string
  collection: string
  id: string
  slug: string
  lang?: string
  title: string
  url?: string
  categoryIds?: string[]
  tagIds?: string[]
  toolIds?: string[]
  skillIds?: string[]
}

export type ContentGraphEdge = {
  from: string
  to: string
  type: string
  weight?: number
  context?: string
  source: 'explicit' | 'reference' | 'derived'
}

export type ContentGraph = {
  nodes: ContentGraphNode[]
  edges: ContentGraphEdge[]
}

export const getNodeKey = (collection: string, id: string) => `${collection}:${id}`

const asStringArray = (value: unknown): string[] | undefined => {
  if (!Array.isArray(value)) return undefined
  const out = value.filter((v): v is string => typeof v === 'string' && v.length > 0)
  return out.length > 0 ? out : undefined
}

export const inferNodeUrl = (node: ContentGraphNode): string | undefined => {
  const langPrefix = node.lang ? `/${node.lang}` : ''

  if (node.collection === 'profile') return `${langPrefix}/` || '/'
  if (node.collection === 'cvFormats') return `${langPrefix}/cv`
  if (node.collection === 'contactChannels' || node.collection === 'socialLinks') return `${langPrefix}/contact`

  if (node.collection === 'blog') return `${langPrefix}/blog/${node.slug}`
  if (node.collection === 'caseStudies') return `${langPrefix}/case-studies/${node.slug}`
  if (node.collection === 'knowledgeResources') return `${langPrefix}/knowledge/${node.slug}`

  return undefined
}

export const buildNodesFromEntries = (entriesByCollection: Record<string, Array<{ id: string; data: any }>>) => {
  const nodes: ContentGraphNode[] = []

  for (const [collection, entries] of Object.entries(entriesByCollection)) {
    for (const entry of entries) {
      const data = entry.data ?? {}
      const lang = typeof data.lang === 'string' ? data.lang : undefined

      const id =
        (collection === 'profile' || collection === 'contactChannels' || collection === 'socialLinks'
          ? entry.id.split('/').at(-1)
          : data[`${collection.slice(0, -1)}Id`]) ??
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
        entry.id.split('/').at(-1) ??
        entry.id

      const slug =
        (collection === 'caseStudies' && typeof data.slug === 'string' ? data.slug : undefined) ??
        (collection === 'blog' && typeof data.blogSlug === 'string' ? data.blogSlug : undefined) ??
        id

      const title =
        (collection === 'tools' && data.name) ||
        (collection === 'skills' && data.name) ||
        (collection === 'categories' && data.title) ||
        (collection === 'tags' && data.title) ||
        (collection === 'projects' && data.title) ||
        (collection === 'caseStudies' && data.title) ||
        (collection === 'blog' && data.title) ||
        (collection === 'knowledgeResources' && data.title) ||
        (collection === 'certifications' && data.name) ||
        (collection === 'cvFormats' && data.title) ||
        (collection === 'profile' && data.headline) ||
        (collection === 'experience' && `${data.companyName ?? 'Experience'} — ${data.roleTitle ?? ''}`.trim()) ||
        (collection === 'contactChannels' && 'Contact Channels') ||
        (collection === 'socialLinks' && 'Social Links') ||
        `${collection}:${id}`

      const node: ContentGraphNode = {
        key: getNodeKey(collection, id),
        collection,
        id,
        slug,
        lang,
        title,
        categoryIds: asStringArray(data.categoryIds),
        tagIds: asStringArray(data.tagIds),
        toolIds: asStringArray(data.toolIds),
        skillIds: asStringArray(data.skillIds),
      }

      node.url = inferNodeUrl(node)

      nodes.push(node)
    }
  }

  return nodes
}

export const buildEdgesFromEntries = (entriesByCollection: Record<string, Array<{ id: string; data: any }>>) => {
  const edges: ContentGraphEdge[] = []

  const addReferenceEdges = (fromKey: string, ids: unknown, targetCollection: string, type: string) => {
    const values = asStringArray(ids)
    if (!values) return
    for (const id of values) {
      edges.push({
        from: fromKey,
        to: getNodeKey(targetCollection, id),
        type,
        source: 'reference',
      })
    }
  }

  for (const [collection, entries] of Object.entries(entriesByCollection)) {
    for (const entry of entries) {
      const data = entry.data ?? {}
      const stableId =
        (collection === 'profile' || collection === 'contactChannels' || collection === 'socialLinks'
          ? entry.id.split('/').at(-1)
          : data[`${collection.slice(0, -1)}Id`]) ??
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
        entry.id.split('/').at(-1) ??
        entry.id

      const fromKey = getNodeKey(collection, stableId)

      if (Array.isArray(data.links)) {
        for (const link of data.links) {
          if (!link || typeof link !== 'object') continue
          if (typeof link.type !== 'string') continue
          if (typeof link.targetCollection !== 'string') continue
          if (typeof link.targetId !== 'string') continue

          edges.push({
            from: fromKey,
            to: getNodeKey(link.targetCollection, link.targetId),
            type: link.type,
            weight: typeof link.weight === 'number' ? link.weight : undefined,
            context: typeof link.context === 'string' ? link.context : undefined,
            source: 'explicit',
          })
        }
      }

      addReferenceEdges(fromKey, data.tagIds, 'tags', 'tagged_with')
      addReferenceEdges(fromKey, data.categoryIds, 'categories', 'belongs_to_category')
      addReferenceEdges(fromKey, data.toolIds, 'tools', 'implemented_with')
      addReferenceEdges(fromKey, data.skillIds, 'skills', 'demonstrates')
      addReferenceEdges(fromKey, data.projectIds, 'projects', 'references')
      addReferenceEdges(fromKey, data.caseStudyIds, 'caseStudies', 'references')
      addReferenceEdges(fromKey, data.blogSlugs, 'blog', 'references')
      addReferenceEdges(fromKey, data.cvFormatIds, 'cvFormats', 'references')

      if (collection === 'profile' && data.featured && typeof data.featured === 'object') {
        addReferenceEdges(fromKey, data.featured.projectIds, 'projects', 'references')
        addReferenceEdges(fromKey, data.featured.caseStudyIds, 'caseStudies', 'references')
        addReferenceEdges(fromKey, data.featured.blogSlugs, 'blog', 'references')
      }
    }
  }

  return edges
}

export const buildNodes = async () => {
  const { getAllContentNodes } = await import('./collections')
  const entriesByCollection = await getAllContentNodes()
  return buildNodesFromEntries(entriesByCollection as any)
}

export const buildEdges = async () => {
  const { getAllContentNodes } = await import('./collections')
  const entriesByCollection = await getAllContentNodes()
  return buildEdgesFromEntries(entriesByCollection as any)
}

export const buildContentGraph = async (): Promise<ContentGraph> => {
  const { getAllContentNodes } = await import('./collections')
  const entriesByCollection = await getAllContentNodes()
  const nodes = buildNodesFromEntries(entriesByCollection as any)
  const edges = buildEdgesFromEntries(entriesByCollection as any)
  return { nodes, edges }
}
