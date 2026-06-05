export type ReducedMotionStrategy = 'none' | 'minimal' | 'static-depth' | 'opacity-only';

export type AnimationKind = 'opacity' | 'transform' | 'filter';

export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return true;
  if (typeof window.matchMedia !== 'function') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const watchReducedMotion = (callback: (reduced: boolean) => void) => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return () => {};

  const media = window.matchMedia('(prefers-reduced-motion: reduce)');

  const handler = () => callback(media.matches);
  callback(media.matches);

  if (typeof media.addEventListener === 'function') {
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }

  return () => {};
};

export const getReducedMotionStrategy = (): ReducedMotionStrategy => {
  if (typeof window === 'undefined') return 'static-depth';
  return prefersReducedMotion() ? 'opacity-only' : 'none';
};

export const shouldAnimate = (options?: { kind?: AnimationKind; strategy?: ReducedMotionStrategy }) => {
  if (typeof window === 'undefined') return false;

  const kind: AnimationKind = options?.kind ?? 'transform';
  const strategy = options?.strategy ?? getReducedMotionStrategy();

  if (strategy === 'none') return true;
  if (strategy === 'static-depth') return false;
  if (strategy === 'minimal') return kind === 'opacity';
  if (strategy === 'opacity-only') return kind === 'opacity';

  return false;
};

