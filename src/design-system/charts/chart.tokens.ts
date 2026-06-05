export const CHART_KINDS = [
  'bar',
  'line',
  'radar',
  'doughnut',
  'skillMatrix',
  'experienceTimeline',
  'securityDomainRadar',
  'toolchainDistribution',
] as const;

export type ChartKind = (typeof CHART_KINDS)[number];

export type ChartVariant = 'default' | 'module';
export type ChartTone = 'neutral' | 'accent' | 'security' | 'cloud' | 'infra' | 'automation' | 'compliance';
export type ChartDepth = 'flat' | 'raised' | 'elevated' | 'floating';

export const CHART_INTERACTION_STATES = [
  'idle',
  'chartEnter',
  'chartLeave',
  'pointHoverIn',
  'pointHoverOut',
  'legendHoverIn',
  'legendHoverOut',
  'tooltipOpen',
  'tooltipClose',
] as const;

export type ChartInteractionState = (typeof CHART_INTERACTION_STATES)[number];

export type ChartReducedMotionStrategy = 'disable-animations' | 'opacity-only' | 'static';

export type ChartDatasetInput = {
  label: string;
  data: readonly number[];
};

export type ChartDataInput = {
  labels: readonly string[];
  datasets: readonly ChartDatasetInput[];
};
