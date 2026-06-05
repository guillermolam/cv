import fs from 'node:fs/promises'
import path from 'node:path'

const contentRoot = path.resolve('src/content')
const outputPath = path.resolve('public/data/content-graph.json')

const kebab = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

const idFieldByCollection = {
  profile: null,
  experience: 'experienceId',
  projects: 'projectId',
  caseStudies: 'caseStudyId',
  blog: 'blogSlug',
  knowledgeResources: 'resourceId',
  certifications: 'certificationId',
  cvFormats: 'cvFormatId',
  categories: 'categoryId',
  tags: 'tagId',
  tools: 'toolId',
  skills: 'skillId',
  contactChannels: null,
  socialLinks: null,
}

const relationshipFields = [
  ['tagIds', 'tags'],
  ['categoryIds', 'categories'],
  ['toolIds', 'tools'],
  ['skillIds', 'skills'],
  ['projectIds', 'projects'],
  ['caseStudyIds', 'caseStudies'],
  ['experienceIds', 'experience'],
  ['cvFormatIds', 'cvFormats'],
  ['blogSlugs', 'blog'],
]

const getNodeKey = (collection, id) => `${collection}:${id}`

const listMarkdown = async (dir) => {
  const out = []
  const entries = await fs.readdir(dir, { withFileTypes: true })
  for (const ent of entries) {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) out.push(...(await listMarkdown(p)))
    else if (ent.isFile() && p.endsWith('.md')) out.push(p)
  }
  return out
}

const fileKey = (filePath) => path.relative(contentRoot, filePath).split(path.sep).join('/')

const getCollection = (relativePath) => relativePath.split('/')[0]

const frontmatterBlock = (text) => {
  const m = text.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/)
  return m ? m[1] : null
}

const parseInlineArray = (value) => {
  const inner = value.trim().replace(/^\[/, '').replace(/\]$/, '')
  if (!inner.trim()) return []
  return inner
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean)
    .map((x) => x.replace(/^['"]|['"]$/g, ''))
}

const parseScalar = (value) => value.replace(/^['"]|['"]$/g, '')

const parseYamlSubset = (yamlText) => {
  const lines = yamlText.split(/\r?\n/)
  const rootObj = {}
  const stack = [{ indent: -1, value: rootObj }]

  const current = (indent) => {
    while (stack.length > 1 && stack[stack.length - 1].indent >= indent) stack.pop()
    return stack[stack.length - 1].value
  }

  const toIndent = (line) => (line.match(/^\s*/)?.[0].length ?? 0)

  for (let i = 0; i < lines.length; i += 1) {
    const rawLine = lines[i]
    if (!rawLine.trim()) continue
    if (rawLine.trim().startsWith('#')) continue

    const indent = toIndent(rawLine)
    const line = rawLine.trim()

    if (line.startsWith('- ')) {
      const parent = current(indent)
      if (Array.isArray(parent)) parent.push(parseScalar(line.slice(2).trim()))
      continue
    }

    const mKey = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/)
    if (!mKey) continue

    const key = mKey[1]
    const rest = mKey[2]
    const parent = current(indent)

    if (rest === '') {
      const next = lines[i + 1] ?? ''
      const nextTrim = next.trim()
      if (nextTrim.startsWith('- ')) {
        const arr = []
        parent[key] = arr
        stack.push({ indent, value: arr })
      } else {
        const obj = {}
        parent[key] = obj
        stack.push({ indent, value: obj })
      }
      continue
    }

    if (rest === '>-'
      || rest === '>'
      || rest === '|'
      || rest === '|-') {
      const parts = []
      const baseIndent = indent
      for (let j = i + 1; j < lines.length; j += 1) {
        const l = lines[j]
        if (!l.trim()) {
          parts.push('')
          continue
        }
        const li = toIndent(l)
        if (li <= baseIndent) break
        parts.push(l.trim())
        i = j
      }
      parent[key] = parts.join(rest.startsWith('|') ? '\n' : ' ').trim()
      continue
    }

    const inlineArr = rest.match(/^\[(.*)\]$/)
    if (inlineArr) {
      parent[key] = parseInlineArray(rest)
      continue
    }

    parent[key] = parseScalar(rest)
  }

  return rootObj
}

const getStableId = (collection, relPath, data) => {
  const idField = idFieldByCollection[collection]
  if (idField && typeof data[idField] === 'string') return data[idField]
  return relPath.split('/').at(-1)?.replace(/\.md$/, '')
}

const inferInternalUrl = (node) => {
  const langPrefix = node.lang ? `/${node.lang}` : ''
  if (node.collection === 'profile') return `${langPrefix}/` || '/'
  if (node.collection === 'cvFormats') return `${langPrefix}/cv`
  if (node.collection === 'contactChannels' || node.collection === 'socialLinks') return `${langPrefix}/contact`
  if (node.collection === 'blog') return `${langPrefix}/blog/${node.slug}`
  if (node.collection === 'caseStudies') return `${langPrefix}/case-studies/${node.slug}`
  if (node.collection === 'knowledgeResources') return `${langPrefix}/knowledge/${node.slug}`
  return undefined
}

const buildGraph = async () => {
  const markdownFiles = await listMarkdown(contentRoot)
  const nodes = []
  const edges = []
  const warnings = []

  for (const filePath of markdownFiles) {
    const relPath = fileKey(filePath)
    const collection = getCollection(relPath)

    const raw = await fs.readFile(filePath, 'utf8')
    const fm = frontmatterBlock(raw)
    if (!fm) throw new Error(`Missing frontmatter: ${relPath}`)

    const data = parseYamlSubset(fm)
    const stableId = getStableId(collection, relPath, data)
    if (typeof stableId !== 'string' || stableId.length === 0) throw new Error(`Missing stable ID: ${relPath}`)
    if (!kebab.test(stableId)) warnings.push({ message: `Non-kebab id detected (will fail validation): ${collection}:${stableId}`, file: relPath })

    const slug =
      (collection === 'caseStudies' && typeof data.slug === 'string' ? data.slug : undefined) ??
      (collection === 'blog' && typeof data.blogSlug === 'string' ? data.blogSlug : undefined) ??
      stableId

    const title =
      (collection === 'profile' && data.headline) ||
      (collection === 'experience' && (data.roleTitle ? `${data.companyName ?? 'Experience'} — ${data.roleTitle}` : undefined)) ||
      (collection === 'projects' && data.title) ||
      (collection === 'caseStudies' && data.title) ||
      (collection === 'blog' && data.title) ||
      (collection === 'knowledgeResources' && data.title) ||
      (collection === 'certifications' && data.name) ||
      (collection === 'cvFormats' && data.title) ||
      (collection === 'categories' && data.title) ||
      (collection === 'tags' && data.title) ||
      (collection === 'tools' && data.name) ||
      (collection === 'skills' && data.name) ||
      (collection === 'contactChannels' && 'Contact Channels') ||
      (collection === 'socialLinks' && 'Social Links') ||
      `${collection}:${stableId}`

    const node = {
      key: getNodeKey(collection, stableId),
      collection,
      id: stableId,
      slug,
      lang: typeof data.lang === 'string' ? data.lang : undefined,
      title,
      url: undefined,
      categoryIds: Array.isArray(data.categoryIds) ? data.categoryIds : undefined,
      tagIds: Array.isArray(data.tagIds) ? data.tagIds : undefined,
      toolIds: Array.isArray(data.toolIds) ? data.toolIds : undefined,
      skillIds: Array.isArray(data.skillIds) ? data.skillIds : undefined,
    }
    node.url = inferInternalUrl(node)
    nodes.push(node)
    if (Array.isArray(data.needsConfirmation) && data.needsConfirmation.length > 0) {
      warnings.push({ nodeKey: node.key, file: relPath, message: 'Entry contains needsConfirmation.' })
    }

    if (Array.isArray(data.links)) {
      for (const link of data.links) {
        if (!link || typeof link !== 'object') continue
        if (typeof link.type !== 'string') continue
        if (typeof link.targetCollection !== 'string') continue
        if (typeof link.targetId !== 'string') continue
        edges.push({
          from: node.key,
          to: getNodeKey(link.targetCollection, link.targetId),
          type: link.type,
          weight: typeof link.weight === 'number' ? link.weight : undefined,
          context: typeof link.context === 'string' ? link.context : undefined,
          source: 'explicit',
        })
      }
    }

    for (const [field, targetCollection] of relationshipFields) {
      if (!Array.isArray(data[field])) continue
      for (const id of data[field]) {
        if (typeof id !== 'string' || !id.length) continue
        edges.push({ from: node.key, to: getNodeKey(targetCollection, id), type: field, source: 'reference' })
      }
    }

    if (collection === 'profile' && data.featured && typeof data.featured === 'object') {
      const f = data.featured
      if (Array.isArray(f.projectIds)) for (const id of f.projectIds) edges.push({ from: node.key, to: getNodeKey('projects', id), type: 'featuredProject', source: 'reference' })
      if (Array.isArray(f.caseStudyIds)) for (const id of f.caseStudyIds) edges.push({ from: node.key, to: getNodeKey('caseStudies', id), type: 'featuredCaseStudy', source: 'reference' })
      if (Array.isArray(f.blogSlugs)) for (const id of f.blogSlugs) edges.push({ from: node.key, to: getNodeKey('blog', id), type: 'featuredBlog', source: 'reference' })
    }
  }

  const collectionCounts = {}
  for (const n of nodes) collectionCounts[n.collection] = (collectionCounts[n.collection] ?? 0) + 1

  const nodeKeys = new Set(nodes.map((n) => n.key))
  const outCount = new Map()
  const inCount = new Map()
  for (const e of edges) {
    if (!nodeKeys.has(e.to)) warnings.push({ message: `Edge target missing (will fail validation): ${e.from} -> ${e.to}`, type: e.type })
    outCount.set(e.from, (outCount.get(e.from) ?? 0) + 1)
    inCount.set(e.to, (inCount.get(e.to) ?? 0) + 1)
  }

  for (const n of nodes) {
    if (!(outCount.get(n.key) ?? 0) && !(inCount.get(n.key) ?? 0)) warnings.push({ nodeKey: n.key, message: 'Orphan node (no incoming/outgoing edges).' })
  }

  try {
    const contentModel = await fs.readFile(path.resolve('docs/architecture/content-model.md'), 'utf8')
    if (contentModel.includes('pubDate') || contentModel.includes('src/content/config.ts') || contentModel.includes('tags: string[]')) {
      warnings.push({ message: 'docs/architecture/content-model.md appears out of date vs current schemas (pubDate/src/content/config.ts/freeform tags).' })
    }
  } catch {}

  const stats = {
    collectionCounts,
    totalNodes: nodes.length,
    totalEdges: edges.length,
  }

  return { nodes, edges, stats, warnings }
}

const ensureDir = async (filePath) => {
  const dir = path.dirname(filePath)
  await fs.mkdir(dir, { recursive: true })
}

const main = async () => {
  const { nodes, edges, stats, warnings } = await buildGraph()
  const payload = {
    generatedAt: new Date().toISOString(),
    nodes,
    edges,
    stats,
    warnings,
  }

  await ensureDir(outputPath)
  await fs.writeFile(outputPath, JSON.stringify(payload, null, 2) + '\n', 'utf8')

  console.log(JSON.stringify({ outputPath, nodes: nodes.length, edges: edges.length, warnings: warnings.length }, null, 2))
}

await main()
