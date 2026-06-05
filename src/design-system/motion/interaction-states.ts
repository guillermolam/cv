export const INTERACTION_STATES = [
  'idle',
  'hoverIn',
  'hoverOut',
  'press',
  'release',
  'focus',
  'blur',
  'selected',
  'disabled',
  'chartEnter',
  'chartLeave',
  'pointHoverIn',
  'pointHoverOut',
  'legendHoverIn',
  'legendHoverOut',
  'tooltipOpen',
  'tooltipClose',
  'routeEnter',
  'routeLeave',
  'revealEnter',
  'revealLeave',
] as const;

export type InteractionState = (typeof INTERACTION_STATES)[number];

export const INTERACTIVE_STATES = new Set<InteractionState>([
  'hoverIn',
  'hoverOut',
  'press',
  'release',
  'focus',
  'blur',
  'selected',
  'disabled',
]);

export const CHART_INTERACTION_STATES = new Set<InteractionState>([
  'chartEnter',
  'chartLeave',
  'pointHoverIn',
  'pointHoverOut',
  'legendHoverIn',
  'legendHoverOut',
  'tooltipOpen',
  'tooltipClose',
]);

export const ROUTE_INTERACTION_STATES = new Set<InteractionState>(['routeEnter', 'routeLeave']);

export const REVEAL_INTERACTION_STATES = new Set<InteractionState>(['revealEnter', 'revealLeave']);

export const isInteractionState = (value: unknown): value is InteractionState =>
  typeof value === 'string' && (INTERACTION_STATES as readonly string[]).includes(value);

export const getMotionStateAttributes = (state?: InteractionState) =>
  state ? ({ 'data-motion-state': state } as const) : ({} as const);

