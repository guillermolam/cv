import type { ContentGraph, ContentGraphNode } from './graph'

const uniq = <T>(values: T[]) => [...new Set(values)]

const getNode = (graph: ContentGraph, nodeKey: string) => graph.nodes.find((n) => n.key === nodeKey)

const sharedCount = (a?: string[], b?: string[]) => {
  if (!a?.length || !b?.length) return 0
  const s = new Set(a)
  let c = 0
  for (const v of b) if (s.has(v)) c += 1
  return c
}

export type RelatedEntryScore = {
  nodeKey: string
  score: number
  reasons: string[]
}

export const getRelatedEntries = (nodeKey: string, graph: ContentGraph): ContentGraphNode[] => {
  const node = getNode(graph, nodeKey)
  if (!node) return []

  const relatedKeys = new Set<string>()
  for (const edge of graph.edges) {
    if (edge.from === nodeKey) relatedKeys.add(edge.to)
    if (edge.to === nodeKey) relatedKeys.add(edge.from)
  }

  for (const other of graph.nodes) {
    if (other.key === nodeKey) continue
    if (sharedCount(node.skillIds, other.skillIds) > 0) relatedKeys.add(other.key)
    if (sharedCount(node.toolIds, other.toolIds) > 0) relatedKeys.add(other.key)
    if (sharedCount(node.categoryIds, other.categoryIds) > 0) relatedKeys.add(other.key)
    if (sharedCount(node.tagIds, other.tagIds) > 0) relatedKeys.add(other.key)
  }

  return graph.nodes.filter((n) => relatedKeys.has(n.key))
}

export const getRelatedBySharedTags = (nodeKey: string, graph: ContentGraph) => {
  const node = getNode(graph, nodeKey)
  if (!node?.tagIds?.length) return []
  return graph.nodes.filter((n) => n.key !== nodeKey && sharedCount(node.tagIds, n.tagIds) > 0)
}

export const getRelatedBySharedCategories = (nodeKey: string, graph: ContentGraph) => {
  const node = getNode(graph, nodeKey)
  if (!node?.categoryIds?.length) return []
  return graph.nodes.filter((n) => n.key !== nodeKey && sharedCount(node.categoryIds, n.categoryIds) > 0)
}

export const getRelatedBySharedTools = (nodeKey: string, graph: ContentGraph) => {
  const node = getNode(graph, nodeKey)
  if (!node?.toolIds?.length) return []
  return graph.nodes.filter((n) => n.key !== nodeKey && sharedCount(node.toolIds, n.toolIds) > 0)
}

export const getRelatedBySharedSkills = (nodeKey: string, graph: ContentGraph) => {
  const node = getNode(graph, nodeKey)
  if (!node?.skillIds?.length) return []
  return graph.nodes.filter((n) => n.key !== nodeKey && sharedCount(node.skillIds, n.skillIds) > 0)
}

export const scoreRelatedEntries = (nodeKey: string, graph: ContentGraph): RelatedEntryScore[] => {
  const node = getNode(graph, nodeKey)
  if (!node) return []

  const outgoing = graph.edges.filter((e) => e.from === nodeKey)
  const incoming = graph.edges.filter((e) => e.to === nodeKey)

  const explicitTargets = new Set(outgoing.filter((e) => e.source === 'explicit').map((e) => e.to))
  const explicitSources = new Set(incoming.filter((e) => e.source === 'explicit').map((e) => e.from))

  const candidates = uniq([...explicitTargets, ...explicitSources, ...getRelatedEntries(nodeKey, graph).map((n) => n.key)])
    .filter((k) => k !== nodeKey)
    .map((k) => getNode(graph, k))
    .filter((n): n is ContentGraphNode => Boolean(n))

  const tagCap = 2

  const scores: RelatedEntryScore[] = []
  for (const other of candidates) {
    let score = 0
    const reasons: string[] = []

    const explicitEdgeCount = graph.edges.filter((e) => (e.from === nodeKey && e.to === other.key) || (e.to === nodeKey && e.from === other.key)).length
    if (explicitEdgeCount > 0) {
      score += 50 + Math.min(10, explicitEdgeCount * 5)
      reasons.push('explicit edge')
    }

    const sharedSkills = sharedCount(node.skillIds, other.skillIds)
    if (sharedSkills > 0) {
      score += sharedSkills * 10
      reasons.push('shared skills')
    }

    const sharedTools = sharedCount(node.toolIds, other.toolIds)
    if (sharedTools > 0) {
      score += sharedTools * 6
      reasons.push('shared tools')
    }

    const sharedCategories = sharedCount(node.categoryIds, other.categoryIds)
    if (sharedCategories > 0) {
      score += sharedCategories * 3
      reasons.push('shared categories')
    }

    const sharedTags = Math.min(tagCap, sharedCount(node.tagIds, other.tagIds))
    if (sharedTags > 0) {
      score += sharedTags * 1
      reasons.push('shared tags')
    }

    if (score > 0) scores.push({ nodeKey: other.key, score, reasons: uniq(reasons) })
  }

  return scores.sort((a, b) => b.score - a.score)
}
