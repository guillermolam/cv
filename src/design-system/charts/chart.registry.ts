import type { ChartKind } from './chart.tokens';

export type ChartRegistryEntry = {
  id: string;
  kind: ChartKind;
  label: string;
  description: string;
  icon?: string;
  datasetNotes: string;
  requiresFallback: true;
};

const entries: readonly ChartRegistryEntry[] = [
  {
    id: 'bar',
    kind: 'bar',
    label: 'Bar chart',
    description: 'Categorical comparison across labels.',
    icon: 'chart-radar',
    datasetNotes: 'datasets[].data length must match labels.length',
    requiresFallback: true,
  },
  {
    id: 'line',
    kind: 'line',
    label: 'Line chart',
    description: 'Trend across ordered labels.',
    icon: 'graph-link',
    datasetNotes: 'datasets[].data length must match labels.length',
    requiresFallback: true,
  },
  {
    id: 'radar',
    kind: 'radar',
    label: 'Radar chart',
    description: 'Multi-axis comparison across domains.',
    icon: 'chart-radar',
    datasetNotes: 'datasets[].data length must match labels.length',
    requiresFallback: true,
  },
  {
    id: 'doughnut',
    kind: 'doughnut',
    label: 'Doughnut chart',
    description: 'Distribution across labels.',
    icon: 'settings',
    datasetNotes: 'Single dataset recommended; data length must match labels.length',
    requiresFallback: true,
  },
  {
    id: 'skill-matrix',
    kind: 'skillMatrix',
    label: 'Skill matrix',
    description: 'Skill-category distribution from explicit input data.',
    icon: 'code-window',
    datasetNotes: 'Explicit values only; do not infer scoring from content.',
    requiresFallback: true,
  },
  {
    id: 'experience-timeline',
    kind: 'experienceTimeline',
    label: 'Experience timeline',
    description: 'Timeline view from explicit input data.',
    icon: 'terminal',
    datasetNotes: 'Explicit values only; do not infer years/tenure.',
    requiresFallback: true,
  },
  {
    id: 'security-domain-radar',
    kind: 'securityDomainRadar',
    label: 'Security domain radar',
    description: 'Security facets from explicit input data.',
    icon: 'shield-check',
    datasetNotes: 'Explicit values only; label as demo unless sourced.',
    requiresFallback: true,
  },
  {
    id: 'toolchain-distribution',
    kind: 'toolchainDistribution',
    label: 'Toolchain distribution',
    description: 'Tool/category distribution from explicit input data.',
    icon: 'cloud-node',
    datasetNotes: 'Explicit counts only; do not infer from collections unless provided.',
    requiresFallback: true,
  },
];

export const chartRegistry = {
  list: () => entries,
  get: (id: string) => entries.find((e) => e.id === id),
} as const;

