import fs from 'node:fs/promises'
import path from 'node:path'

const contentRoot = path.resolve('src/content')
const publicRoot = path.resolve('public')

const kebab = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const unsafeSchemes = ['javascript:', 'data:', 'vbscript:']

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
  education: 'educationId',
  languages: 'languageId',
  companies: 'companyId',
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

const isUnsafeUrl = (value) => {
  if (typeof value !== 'string') return false
  const normalized = value.trim().toLowerCase()
  return unsafeSchemes.some((s) => normalized.startsWith(s))
}

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
  const base = relPath.split('/').at(-1)?.replace(/\.md$/, '')
  return base
}

const buildGraph = async () => {
  const markdownFiles = await listMarkdown(contentRoot)
  const nodes = []
  const edges = []
  const nodeDataByKey = {}
  const fileByNodeKey = {}
  const externalUrls = []

  const addExternalUrl = (nodeKey, field, url) => {
    if (typeof url === 'string' && url.length > 0) externalUrls.push({ nodeKey, field, url })
  }

  for (const filePath of markdownFiles) {
    const relPath = fileKey(filePath)
    const collection = getCollection(relPath)

    const raw = await fs.readFile(filePath, 'utf8')
    const fm = frontmatterBlock(raw)
    if (!fm) throw new Error(`Missing frontmatter: ${relPath}`)

    const data = parseYamlSubset(fm)
    const stableId = getStableId(collection, relPath, data)
    if (typeof stableId !== 'string' || stableId.length === 0) throw new Error(`Missing stable ID: ${relPath}`)

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

    const key = getNodeKey(collection, stableId)
    const node = {
      key,
      collection,
      id: stableId,
      slug,
      lang: typeof data.lang === 'string' ? data.lang : undefined,
      title,
      categoryIds: Array.isArray(data.categoryIds) ? data.categoryIds : undefined,
      tagIds: Array.isArray(data.tagIds) ? data.tagIds : undefined,
      toolIds: Array.isArray(data.toolIds) ? data.toolIds : undefined,
      skillIds: Array.isArray(data.skillIds) ? data.skillIds : undefined,
    }

    nodes.push(node)
    nodeDataByKey[key] = data
    fileByNodeKey[key] = relPath

    addExternalUrl(key, 'repoUrl', data.repoUrl)
    addExternalUrl(key, 'demoUrl', data.demoUrl)
    addExternalUrl(key, 'deploymentUrl', data.deploymentUrl)
    addExternalUrl(key, 'website', data.website)
    addExternalUrl(key, 'credentialUrl', data.credentialUrl)
    addExternalUrl(key, 'url', data.url)

    if (Array.isArray(data.proofLinks)) for (const p of data.proofLinks ?? []) addExternalUrl(key, 'proofLinks.url', p?.url)
    if (Array.isArray(data.channels)) for (const c of data.channels ?? []) addExternalUrl(key, 'channels.url', c?.url)
    if (Array.isArray(data.links)) for (const l of data.links ?? []) addExternalUrl(key, 'links.context', l?.context)

    if (Array.isArray(data.links)) {
      for (const link of data.links) {
        if (!link || typeof link !== 'object') continue
        if (typeof link.type !== 'string') continue
        if (typeof link.targetCollection !== 'string') continue
        if (typeof link.targetId !== 'string') continue
        edges.push({
          from: key,
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
        edges.push({ from: key, to: getNodeKey(targetCollection, id), type: field, source: 'reference' })
      }
    }

    if (collection === 'profile' && data.featured && typeof data.featured === 'object') {
      const f = data.featured
      if (Array.isArray(f.projectIds)) for (const id of f.projectIds) edges.push({ from: key, to: getNodeKey('projects', id), type: 'featuredProject', source: 'reference' })
      if (Array.isArray(f.caseStudyIds)) for (const id of f.caseStudyIds) edges.push({ from: key, to: getNodeKey('caseStudies', id), type: 'featuredCaseStudy', source: 'reference' })
      if (Array.isArray(f.blogSlugs)) for (const id of f.blogSlugs) edges.push({ from: key, to: getNodeKey('blog', id), type: 'featuredBlog', source: 'reference' })
    }
  }

  return { nodes, edges, nodeDataByKey, fileByNodeKey, externalUrls }
}

const validateGraph = async () => {
  const { nodes, edges, nodeDataByKey, fileByNodeKey, externalUrls } = await buildGraph()
  const nodeKeys = new Set(nodes.map((n) => n.key))

  const issues = []
  const warnings = []

  const addIssue = (severity, nodeKey, message, recommendedFix) => {
    issues.push({ severity, nodeKey, file: nodeKey ? fileByNodeKey[nodeKey] : undefined, message, recommendedFix })
  }

  const addWarning = (nodeKey, message) => warnings.push({ nodeKey, file: nodeKey ? fileByNodeKey[nodeKey] : undefined, message })

  const seen = new Set()
  for (const node of nodes) {
    if (seen.has(node.key)) addIssue('blocker', node.key, `Duplicate node key "${node.key}".`, 'Ensure IDs are unique per collection.')
    seen.add(node.key)
    if (!kebab.test(node.id)) addIssue('blocker', node.key, `Non-kebab stable ID "${node.id}".`, 'Rename to kebab-case and update references.')
  }

  for (const edge of edges) {
    if (!nodeKeys.has(edge.to)) addIssue('blocker', edge.from, `Missing target "${edge.to}" referenced by "${edge.type}".`, 'Create the target entry or fix the reference.')
  }

  for (const { nodeKey, field, url } of externalUrls) {
    if (isUnsafeUrl(url)) addIssue('blocker', nodeKey, `Unsafe URL scheme detected in ${field}: "${url}".`, 'Replace with a safe https:// URL or remove it.')
  }

  for (const node of nodes) {
    const data = nodeDataByKey[node.key] ?? {}

    if (node.collection === 'cvFormats' && data.availability === 'available') {
      if (typeof data.downloadPath !== 'string' || data.downloadPath.length === 0) {
        addIssue('blocker', node.key, 'cvFormats availability=available but downloadPath is missing.', 'Add downloadPath or set availability=coming-soon.')
      } else {
        const resolved = path.resolve(publicRoot, data.downloadPath.replace(/^\//, ''))
        try {
          await fs.access(resolved)
        } catch {
          addIssue('blocker', node.key, `cvFormats downloadPath does not exist: ${data.downloadPath}`, 'Add the file under public/cv/ or set availability=coming-soon.')
        }
      }
    }

    if (node.collection === 'certifications' && data.status === 'active') {
      const hasEvidence =
        typeof data.credentialUrl === 'string' ||
        typeof data.credentialId === 'string' ||
        typeof data.issuedDate === 'string'
      if (!hasEvidence) {
        addIssue(
          'blocker',
          node.key,
          'certifications status=active but evidence fields are missing (credentialUrl/credentialId/issuedDate).',
          'Add evidence fields or set status=in-progress/unknown.',
        )
      }
    }

    const security = data.security
    if (security && typeof security === 'object') {
      const categoryIds = new Set(nodes.filter((n) => n.collection === 'categories').map((n) => n.id))
      const facetFields = [
        'domainIds',
        'subdomainIds',
        'layerIds',
        'operationalFunctionIds',
        'postureIds',
        'lifecycleStageIds',
        'controlTypeIds',
        'threatFocusIds',
        'technologyScopeIds',
        'frameworkIds',
        'businessCapabilityIds',
        'skillLevelIds',
      ]

      for (const f of facetFields) {
        if (!Array.isArray(security[f])) continue
        for (const id of security[f]) {
          if (typeof id !== 'string') continue
          if (!categoryIds.has(id)) {
            addIssue('blocker', node.key, `Security facet "${f}" references missing categoryId "${id}".`, 'Create the category entry or remove the invalid facet ID.')
          }
        }
      }
    }

    if (Array.isArray(data.needsConfirmation) && data.needsConfirmation.length > 0) {
      addWarning(node.key, 'Entry contains needsConfirmation.')
    }
  }

  const outCount = new Map()
  const inCount = new Map()
  for (const e of edges) {
    outCount.set(e.from, (outCount.get(e.from) ?? 0) + 1)
    inCount.set(e.to, (inCount.get(e.to) ?? 0) + 1)
  }

  for (const node of nodes) {
    if (!(outCount.get(node.key) ?? 0) && !(inCount.get(node.key) ?? 0)) addWarning(node.key, 'Orphan node (no incoming/outgoing edges).')
  }

  const docsWarnings = []
  try {
    const contentModel = await fs.readFile(path.resolve('docs/architecture/content-model.md'), 'utf8')
    if (contentModel.includes('pubDate') || contentModel.includes('src/content/config.ts') || contentModel.includes('tags: string[]')) {
      docsWarnings.push('docs/architecture/content-model.md appears out of date vs current schemas (pubDate/src/content/config.ts/freeform tags).')
    }
  } catch {}

  for (const message of docsWarnings) warnings.push({ message })

  const summary = {
    nodeCount: nodes.length,
    edgeCount: edges.length,
    issueCount: issues.length,
    warningCount: warnings.length,
  }

  console.log(JSON.stringify({ summary, issues, warnings }, null, 2))

  const shouldFail = issues.some((i) => i.severity === 'blocker' || i.severity === 'high')
  if (shouldFail) process.exit(1)
}

await validateGraph()
