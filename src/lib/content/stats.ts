import type { ContentGraph } from './graph'

export type RecruiterStats = {
  collectionCounts: Record<string, number>
  totalNodes: number
  totalEdges: number
}

export const getCountsByCollection = (graph: ContentGraph) => {
  const counts: Record<string, number> = {}
  for (const node of graph.nodes) counts[node.collection] = (counts[node.collection] ?? 0) + 1
  return counts
}

export const getRecruiterStats = (graph: ContentGraph): RecruiterStats => {
  return {
    collectionCounts: getCountsByCollection(graph),
    totalNodes: graph.nodes.length,
    totalEdges: graph.edges.length,
  }
}

export const getFeaturedProofChains = (graph: ContentGraph) => {
  const primaryProfile = graph.nodes.find((n) => n.collection === 'profile')
  if (!primaryProfile) return []

  const next = (from: string) => graph.edges.filter((e) => e.from === from).map((e) => e.to)
  const project = next(primaryProfile.key).find((k) => k.startsWith('projects:'))
  if (!project) return []
  const caseStudy = next(project).find((k) => k.startsWith('caseStudies:'))
  const skills = next(project).filter((k) => k.startsWith('skills:'))

  return [
    {
      chain: [primaryProfile.key, project, ...(caseStudy ? [caseStudy] : []), ...skills].filter(Boolean),
    },
  ]
}

