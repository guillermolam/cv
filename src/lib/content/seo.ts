import type { ContentGraphNode } from './graph'
import { titleFor } from '../site'

export const getCanonicalUrlForNode = (node: ContentGraphNode) => node.url

export const getSeoTitleForNode = (node: ContentGraphNode) => {
  if (node.collection === 'profile') return titleFor('Home')
  return titleFor(node.title)
}

export const getSeoDescriptionForNode = (_node: ContentGraphNode) => undefined

