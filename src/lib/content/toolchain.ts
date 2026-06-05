import type { ContentGraph } from './graph'

const indexBy = <T, K extends string>(items: T[], toKey: (t: T) => K) => {
  const out = new Map<K, T[]>()
  for (const item of items) {
    const key = toKey(item)
    const arr = out.get(key) ?? []
    arr.push(item)
    out.set(key, arr)
  }
  return out
}

export const getToolsByType = (graph: ContentGraph) => {
  const toolNodes = graph.nodes.filter((n) => n.collection === 'tools')
  return indexBy(toolNodes, () => 'tools')
}

export const getToolsByCategory = (graph: ContentGraph) => {
  const toolNodes = graph.nodes.filter((n) => n.collection === 'tools')
  const out = new Map<string, typeof toolNodes>()

  for (const tool of toolNodes) {
    const cats = tool.categoryIds ?? []
    for (const c of cats) {
      const arr = out.get(c) ?? []
      arr.push(tool)
      out.set(c, arr)
    }
  }

  return out
}

export const getToolsByTag = (graph: ContentGraph) => {
  const toolNodes = graph.nodes.filter((n) => n.collection === 'tools')
  const out = new Map<string, typeof toolNodes>()

  for (const tool of toolNodes) {
    const tags = tool.tagIds ?? []
    for (const t of tags) {
      const arr = out.get(t) ?? []
      arr.push(tool)
      out.set(t, arr)
    }
  }

  return out
}

export const getToolchainMatrix = (graph: ContentGraph) => {
  return {
    byCategory: Object.fromEntries(getToolsByCategory(graph)),
    byTag: Object.fromEntries(getToolsByTag(graph)),
  }
}

