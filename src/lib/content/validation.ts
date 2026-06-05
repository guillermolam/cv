import { getNodeKey, type ContentGraph, type ContentGraphNode } from './graph'

export type ValidationSeverity = 'blocker' | 'high' | 'medium' | 'low'

export type ContentGraphIssue = {
  severity: ValidationSeverity
  nodeKey?: string
  message: string
  recommendedFix: string
}

export type ContentGraphValidationContext = {
  nodeDataByKey?: Record<string, any>
  externalUrls?: Array<{ nodeKey: string; field: string; url: string }>
}

const isKebabCase = (value: string) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)

const isUnsafeUrl = (value: string) => {
  const normalized = value.trim().toLowerCase()
  return normalized.startsWith('javascript:') || normalized.startsWith('data:') || normalized.startsWith('vbscript:')
}

export const validateNoDuplicateNodeKeys = (graph: ContentGraph): ContentGraphIssue[] => {
  const issues: ContentGraphIssue[] = []
  const seen = new Set<string>()

  for (const node of graph.nodes) {
    if (seen.has(node.key)) {
      issues.push({
        severity: 'blocker',
        nodeKey: node.key,
        message: `Duplicate node key "${node.key}".`,
        recommendedFix: 'Ensure stable IDs are unique within each collection.',
      })
    }
    seen.add(node.key)
  }

  return issues
}

export const validateKebabIds = (graph: ContentGraph): ContentGraphIssue[] => {
  const issues: ContentGraphIssue[] = []

  for (const node of graph.nodes) {
    const id = node.id
    if (!isKebabCase(id) && node.collection !== 'profile' && node.collection !== 'contactChannels' && node.collection !== 'socialLinks') {
      issues.push({
        severity: 'blocker',
        nodeKey: node.key,
        message: `Non-kebab stable id "${id}".`,
        recommendedFix: 'Rename the entry ID to kebab-case and update all references.',
      })
    }
  }

  return issues
}

export const validateNoMissingTargets = (graph: ContentGraph): ContentGraphIssue[] => {
  const issues: ContentGraphIssue[] = []
  const keys = new Set(graph.nodes.map((n) => n.key))

  for (const edge of graph.edges) {
    if (!keys.has(edge.to)) {
      issues.push({
        severity: 'blocker',
        nodeKey: edge.from,
        message: `Missing target "${edge.to}" referenced by edge type "${edge.type}".`,
        recommendedFix: 'Create the missing entry or correct the targetId/targetCollection.',
      })
    }
  }

  return issues
}

export const validateCvFormatAvailability = (
  graph: ContentGraph,
  context?: ContentGraphValidationContext,
): ContentGraphIssue[] => {
  const issues: ContentGraphIssue[] = []
  const nodeDataByKey = context?.nodeDataByKey ?? {}

  for (const node of graph.nodes) {
    if (node.collection !== 'cvFormats') continue
    const data = nodeDataByKey[node.key]
    if (!data) continue
    if (data.availability === 'available' && typeof data.downloadPath !== 'string') {
      issues.push({
        severity: 'blocker',
        nodeKey: node.key,
        message: 'cvFormats availability=available but downloadPath is missing.',
        recommendedFix: 'Set availability=coming-soon or add downloadPath pointing to an existing file under public/cv/.',
      })
    }
  }

  return issues
}

export const validateCertificationTruthfulness = (
  graph: ContentGraph,
  context?: ContentGraphValidationContext,
): ContentGraphIssue[] => {
  const issues: ContentGraphIssue[] = []
  const nodeDataByKey = context?.nodeDataByKey ?? {}

  for (const node of graph.nodes) {
    if (node.collection !== 'certifications') continue
    const data = nodeDataByKey[node.key]
    if (!data) continue

    if (data.status === 'active') {
      const hasEvidence = typeof data.credentialUrl === 'string' || typeof data.credentialId === 'string' || typeof data.issuedDate === 'string'
      if (!hasEvidence) {
        issues.push({
          severity: 'blocker',
          nodeKey: node.key,
          message: 'certifications status=active but no evidence fields are present (credentialUrl/credentialId/issuedDate).',
          recommendedFix: 'Add credentialUrl/credentialId/issuedDate, or set status=in-progress/unknown.',
        })
      }
    }
  }

  return issues
}

export const validateSecurityFacetTargets = (
  graph: ContentGraph,
  context?: ContentGraphValidationContext,
): ContentGraphIssue[] => {
  const issues: ContentGraphIssue[] = []
  const categoryIds = new Set(graph.nodes.filter((n) => n.collection === 'categories').map((n) => n.id))
  const nodeDataByKey = context?.nodeDataByKey ?? {}

  const check = (node: ContentGraphNode, ids?: string[]) => {
    if (!ids) return
    for (const id of ids) {
      if (!categoryIds.has(id)) {
        issues.push({
          severity: 'blocker',
          nodeKey: node.key,
          message: `Security facet references missing categoryId "${id}".`,
          recommendedFix: 'Create the missing category entry or remove the invalid security facet ID.',
        })
      }
    }
  }

  for (const node of graph.nodes) {
    const data = nodeDataByKey[node.key]
    const security = data?.security
    if (!security || typeof security !== 'object') continue

    check(node, security.domainIds)
    check(node, security.subdomainIds)
    check(node, security.layerIds)
    check(node, security.operationalFunctionIds)
    check(node, security.postureIds)
    check(node, security.lifecycleStageIds)
    check(node, security.controlTypeIds)
    check(node, security.threatFocusIds)
    check(node, security.technologyScopeIds)
    check(node, security.frameworkIds)
    check(node, security.businessCapabilityIds)
    check(node, security.skillLevelIds)
  }

  return issues
}

export const validateNoUnsafeExternalUrls = (
  graph: ContentGraph,
  context?: ContentGraphValidationContext,
): ContentGraphIssue[] => {
  const issues: ContentGraphIssue[] = []
  const urlNodes = graph.nodes.filter((n) => typeof n.url === 'string')

  for (const node of urlNodes) {
    if (node.url && isUnsafeUrl(node.url)) {
      issues.push({
        severity: 'blocker',
        nodeKey: node.key,
        message: `Unsafe URL scheme detected in node.url: "${node.url}".`,
        recommendedFix: 'Replace the URL with a safe https:// or mailto: link, or remove it.',
      })
    }
  }

  for (const u of context?.externalUrls ?? []) {
    if (isUnsafeUrl(u.url)) {
      issues.push({
        severity: 'blocker',
        nodeKey: u.nodeKey,
        message: `Unsafe URL scheme detected in ${u.field}: "${u.url}".`,
        recommendedFix: 'Replace the URL with a safe https:// link, or remove it.',
      })
    }
  }

  for (const edge of graph.edges) {
    if (edge.context && isUnsafeUrl(edge.context)) {
      issues.push({
        severity: 'blocker',
        nodeKey: edge.from,
        message: `Unsafe URL scheme detected in edge.context: "${edge.context}".`,
        recommendedFix: 'Remove the unsafe URL scheme from context.',
      })
    }
  }

  return issues
}

export const validateContentGraph = (graph: ContentGraph, context?: ContentGraphValidationContext): ContentGraphIssue[] => {
  return [
    ...validateNoDuplicateNodeKeys(graph),
    ...validateKebabIds(graph),
    ...validateNoMissingTargets(graph),
    ...validateCvFormatAvailability(graph, context),
    ...validateCertificationTruthfulness(graph, context),
    ...validateSecurityFacetTargets(graph, context),
    ...validateNoUnsafeExternalUrls(graph, context),
  ]
}

export const getNode = (graph: ContentGraph, collection: string, id: string) =>
  graph.nodes.find((n) => n.key === getNodeKey(collection, id))
