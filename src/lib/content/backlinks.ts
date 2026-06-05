import type { ContentGraph, ContentGraphEdge } from './graph'

export const getOutgoingLinks = (nodeKey: string, graph: ContentGraph): ContentGraphEdge[] =>
  graph.edges.filter((e) => e.from === nodeKey)

export const getIncomingLinks = (nodeKey: string, graph: ContentGraph): ContentGraphEdge[] =>
  graph.edges.filter((e) => e.to === nodeKey)

export const getBacklinks = (nodeKey: string, graph: ContentGraph): ContentGraphEdge[] => getIncomingLinks(nodeKey, graph)

