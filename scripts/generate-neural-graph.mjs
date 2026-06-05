import fs from 'node:fs/promises'
import path from 'node:path'

const contentRoot = path.resolve('src/content')
const outputPath = path.resolve('public/data/neural-graph.json')

// ── Neuron group definitions ────────────────────────────────────────────────
// Maps each top-level neuron to the category/skill IDs it owns.
const NEURON_DEFS = [
  {
    id: 'development',
    label: 'Development',
    color: '#4cc9f0',
    description: 'Frontend architecture, static sites, creative engineering',
    categoryIds: ['creative-frontend', 'static-site-architecture'],
    skillIds: ['static-site-architecture', 'interactive-frontend-architecture'],
  },
  {
    id: 'infra',
    label: 'Infrastructure',
    color: '#7b5ea7',
    description: 'Kubernetes platforms, cloud infrastructure, edge computing',
    categoryIds: ['kubernetes-platform', 'platform-engineering', 'hybrid-edge'],
    skillIds: ['kubernetes-platform-engineering'],
  },
  {
    id: 'network',
    label: 'Network',
    color: '#00b4d8',
    description: 'Service mesh, eBPF networking, observability',
    categoryIds: [],
    skillIds: [],
    explicitToolIds: ['istio', 'cilium', 'prometheus', 'grafana', 'opentelemetry'],
  },
  {
    id: 'cicd',
    label: 'CI/CD',
    color: '#ff6b35',
    description: 'GitOps delivery, pipeline automation, build tooling',
    categoryIds: ['gitops-delivery'],
    skillIds: ['devsecops'],
  },
  {
    id: 'security',
    label: 'Security',
    color: '#e63946',
    description: 'Cloud security, runtime protection, supply chain integrity',
    categoryIds: [
      'cloud-security',
      'kubernetes-security',
      'runtime-security',
      'supply-chain-security',
      'ai-security',
      'secops',
      'supply-chain',
      'devsecops',
    ],
    skillIds: ['cloud-security', 'software-supply-chain-security', 'detection-engineering'],
  },
  {
    id: 'ai',
    label: 'AI',
    color: '#9b5de5',
    description: 'AI security, model safety, intelligent automation',
    categoryIds: ['ai-security'],
    skillIds: [],
    explicitToolIds: ['opa', 'falco', 'cosign'],
  },
]

// ── YAML frontmatter parser (same subset as generate-content-graph.mjs) ─────

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

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i]
    if (!rawLine.trim() || rawLine.trim().startsWith('#')) continue

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
      if (next.trim().startsWith('- ')) {
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

    const inlineArr = rest.match(/^\[(.*)\]$/)
    if (inlineArr) {
      parent[key] = parseInlineArray(rest)
      continue
    }
    parent[key] = parseScalar(rest)
  }

  return rootObj
}

const listMarkdown = async (dir) => {
  const out = []
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    for (const ent of entries) {
      const p = path.join(dir, ent.name)
      if (ent.isDirectory()) out.push(...(await listMarkdown(p)))
      else if (ent.isFile() && p.endsWith('.md')) out.push(p)
    }
  } catch { /* dir missing */ }
  return out
}

// ── Read collection into a Map<id, data> ────────────────────────────────────

const readCollection = async (collectionName, idField) => {
  const dir = path.join(contentRoot, collectionName)
  const files = await listMarkdown(dir)
  const map = new Map()
  for (const filePath of files) {
    let raw
    try { raw = await fs.readFile(filePath, 'utf8') } catch { continue } // skip unreadable
    const fm = frontmatterBlock(raw)
    if (!fm) continue
    const data = parseYamlSubset(fm)
    const id = typeof data[idField] === 'string' ? data[idField]
      : path.basename(filePath, '.md')
    map.set(id, data)
  }
  return map
}

// ── Main builder ─────────────────────────────────────────────────────────────

const buildNeuralGraph = async () => {
  const categories = await readCollection('categories/en', 'categoryId')
  const skills = await readCollection('skills/en', 'skillId')
  const tools = await readCollection('tools/en', 'toolId')
  const experience = await readCollection('experience/en', 'experienceId')

  // Count how many experience entries reference each tool
  const toolUsage = new Map()
  for (const exp of experience.values()) {
    const toolIds = Array.isArray(exp.toolIds) ? exp.toolIds : []
    for (const tid of toolIds) toolUsage.set(tid, (toolUsage.get(tid) ?? 0) + 1)
  }

  // Track which category IDs are already claimed to avoid duplicate axons
  const claimedCategoryIds = new Set()
  const claimedSkillIds = new Set()
  const claimedToolIds = new Set()

  const neurons = []
  const axons = []
  const dendrites = []
  const synapses = []

  for (const def of NEURON_DEFS) {
    neurons.push({
      id: def.id,
      label: def.label,
      color: def.color,
      description: def.description,
    })

    // Category axons
    for (const catId of def.categoryIds) {
      if (claimedCategoryIds.has(catId)) continue
      claimedCategoryIds.add(catId)
      const cat = categories.get(catId)
      if (!cat) continue

      const axonId = `cat:${catId}`
      axons.push({
        id: axonId,
        label: cat.title ?? catId,
        neuronId: def.id,
        type: 'category',
      })

      // Tools that belong to this category → dendrites
      for (const [toolId, toolData] of tools.entries()) {
        const toolCats = Array.isArray(toolData.categoryIds) ? toolData.categoryIds : []
        if (!toolCats.includes(catId)) continue
        if (claimedToolIds.has(toolId)) {
          // Already a dendrite elsewhere — add a cross-synapse
          synapses.push({ from: axonId, to: `tool:${toolId}`, type: 'uses' })
          continue
        }
        claimedToolIds.add(toolId)
        dendrites.push({
          id: `tool:${toolId}`,
          label: toolData.name ?? toolId,
          axonId,
          neuronId: def.id,
          usageCount: toolUsage.get(toolId) ?? 0,
          website: toolData.website ?? null,
          tagIds: Array.isArray(toolData.tagIds) ? toolData.tagIds : [],
        })
        synapses.push({ from: axonId, to: `tool:${toolId}`, type: 'uses' })
      }
    }

    // Skill axons — skip if a category with same ID was already processed for this neuron
    for (const skillId of def.skillIds ?? []) {
      if (claimedSkillIds.has(skillId)) continue
      if (def.categoryIds?.includes(skillId)) continue // category already covers it
      claimedSkillIds.add(skillId)
      const skill = skills.get(skillId)
      if (!skill) continue

      const axonId = `skill:${skillId}`
      axons.push({
        id: axonId,
        label: skill.name ?? skillId,
        neuronId: def.id,
        type: 'skill',
      })

      // Tools referenced by this skill → dendrites
      const skillToolIds = Array.isArray(skill.toolIds) ? skill.toolIds : []
      for (const toolId of skillToolIds) {
        const toolData = tools.get(toolId)
        if (!toolData) continue
        if (claimedToolIds.has(toolId)) {
          synapses.push({ from: axonId, to: `tool:${toolId}`, type: 'implements' })
          continue
        }
        claimedToolIds.add(toolId)
        dendrites.push({
          id: `tool:${toolId}`,
          label: toolData.name ?? toolId,
          axonId,
          neuronId: def.id,
          usageCount: toolUsage.get(toolId) ?? 0,
          website: toolData.website ?? null,
          tagIds: Array.isArray(toolData.tagIds) ? toolData.tagIds : [],
        })
        synapses.push({ from: axonId, to: `tool:${toolId}`, type: 'implements' })
      }
    }

    // Explicit tool IDs (e.g. Network neuron has no categories)
    for (const toolId of def.explicitToolIds ?? []) {
      const toolData = tools.get(toolId)
      if (!toolData) continue
      const axonId = `tool-group:${def.id}`

      // Ensure a synthetic axon exists for this neuron
      if (!axons.find((a) => a.id === axonId)) {
        axons.push({
          id: axonId,
          label: def.label,
          neuronId: def.id,
          type: 'category',
        })
      }

      if (claimedToolIds.has(toolId)) {
        synapses.push({ from: axonId, to: `tool:${toolId}`, type: 'uses' })
        continue
      }
      claimedToolIds.add(toolId)
      dendrites.push({
        id: `tool:${toolId}`,
        label: toolData.name ?? toolId,
        axonId,
        neuronId: def.id,
        usageCount: toolUsage.get(toolId) ?? 0,
        website: toolData.website ?? null,
        tagIds: Array.isArray(toolData.tagIds) ? toolData.tagIds : [],
      })
      synapses.push({ from: axonId, to: `tool:${toolId}`, type: 'uses' })
    }
  }

  return { neurons, axons, dendrites, synapses, generatedAt: new Date().toISOString() }
}

const main = async () => {
  const graph = await buildNeuralGraph()
  await fs.mkdir(path.dirname(outputPath), { recursive: true })
  await fs.writeFile(outputPath, JSON.stringify(graph, null, 2) + '\n', 'utf8')
  console.log(JSON.stringify({
    outputPath,
    neurons: graph.neurons.length,
    axons: graph.axons.length,
    dendrites: graph.dendrites.length,
    synapses: graph.synapses.length,
  }, null, 2))
}

await main()
