import { motionTokens } from './motion.tokens';

export const ROUTE_TRANSITION_NAMES = ['none', 'fade', 'phosphor-wipe'] as const;
export type RouteTransitionName = (typeof ROUTE_TRANSITION_NAMES)[number];

export type RouteTransitionConfig = {
  name: RouteTransitionName;
  duration: string;
  ease: string;
};

export const getRouteTransitionConfig = (name: RouteTransitionName = 'phosphor-wipe'): RouteTransitionConfig => ({
  name,
  duration: motionTokens.routeTransition.duration,
  ease: motionTokens.routeTransition.ease,
});

export const prepareRouteTransitionElement = (element: HTMLElement | null | undefined, name?: RouteTransitionName) => {
  if (!element) return;
  const config = getRouteTransitionConfig(name);
  element.dataset.routeTransition = config.name;
  element.style.setProperty('--ds-route-duration', config.duration);
  element.style.setProperty('--ds-route-ease', config.ease);
};

export const cleanupRouteTransitionElement = (element: HTMLElement | null | undefined) => {
  if (!element) return;
  delete element.dataset.routeTransition;
  element.style.removeProperty('--ds-route-duration');
  element.style.removeProperty('--ds-route-ease');
};

