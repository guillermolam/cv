import gsap from 'gsap';

import { motionTokens } from './motion.tokens';
import { shouldAnimate, type ReducedMotionStrategy } from './reduced-motion';

export type Killable = {
  kill: () => void;
};

export type ScopedTimeline = {
  timeline?: Killable;
  cleanup: () => void;
};

export type ActionOptions = {
  strategy?: ReducedMotionStrategy;
  durationMs?: number;
  opacityOnly?: boolean;
};

const readCssVar = (cssVar: string) => {
  if (typeof window === 'undefined') return '';
  const value = getComputedStyle(document.documentElement).getPropertyValue(cssVar);
  return value.trim();
};

const parseTimeMs = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (trimmed.endsWith('ms')) {
    const n = Number(trimmed.slice(0, -2));
    return Number.isFinite(n) ? n : undefined;
  }
  if (trimmed.endsWith('s')) {
    const n = Number(trimmed.slice(0, -1));
    return Number.isFinite(n) ? n * 1000 : undefined;
  }
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : undefined;
};

const resolveCssTimeMs = (cssVar: string) => {
  const first = readCssVar(cssVar);
  const match = first.match(/^var\((--[^)]+)\)$/);
  if (match?.[1]) return parseTimeMs(readCssVar(match[1]));
  return parseTimeMs(first);
};

const getDurationSeconds = (cssVar: string, fallbackMs: number) => {
  const ms = resolveCssTimeMs(cssVar) ?? fallbackMs;
  return Math.max(0, ms / 1000);
};

const gsapEase = {
  softOut: 'power3.out',
  pressIn: 'power2.in',
  springOut: 'power3.out',
  magnetic: 'power2.out',
  cinematicReveal: 'power4.out',
} as const;

export const createScopedTimeline = (
  root: Element | null | undefined,
  options?: { strategy?: ReducedMotionStrategy; defaults?: gsap.TweenVars },
): ScopedTimeline => {
  if (!root || typeof window === 'undefined') return { cleanup: () => {} };

  const strategy = options?.strategy;
  if (!shouldAnimate({ kind: 'transform', strategy })) return { cleanup: () => {} };

  let timeline: gsap.core.Timeline | undefined;
  const ctx = gsap.context(() => {
    timeline = gsap.timeline({
      defaults: {
        duration: getDurationSeconds('--ds-duration-normal', 220),
        ease: gsapEase.softOut,
        ...(options?.defaults ?? {}),
      },
    });
  }, root);

  return {
    timeline,
    cleanup: () => {
      try {
        timeline?.kill();
      } catch {
      }
      try {
        ctx.revert();
      } catch {
      }
    },
  };
};

const animateTo = (target: gsap.TweenTarget, vars: gsap.TweenVars): Killable | undefined => {
  if (typeof window === 'undefined') return undefined;
  const tween = gsap.to(target, vars);
  return tween;
};

const animateFromTo = (
  target: gsap.TweenTarget,
  fromVars: gsap.TweenVars,
  toVars: gsap.TweenVars,
): Killable | undefined => {
  if (typeof window === 'undefined') return undefined;
  const tween = gsap.fromTo(target, fromVars, toVars);
  return tween;
};

export const animateHoverIn = (target: Element | null | undefined, options?: ActionOptions) => {
  if (!target) return undefined;
  const strategy = options?.strategy;
  if (!shouldAnimate({ kind: 'transform', strategy })) return undefined;

  return animateTo(target, {
    duration: getDurationSeconds('--ds-duration-fast', options?.durationMs ?? 160),
    ease: gsapEase.softOut,
    y: -2,
    scale: 1.01,
    filter: 'drop-shadow(0 10px 22px rgba(0,0,0,0.35))',
  });
};

export const animateHoverOut = (target: Element | null | undefined, options?: ActionOptions) => {
  if (!target) return undefined;
  const strategy = options?.strategy;
  if (!shouldAnimate({ kind: 'transform', strategy })) return undefined;

  return animateTo(target, {
    duration: getDurationSeconds('--ds-duration-fast', options?.durationMs ?? 160),
    ease: gsapEase.softOut,
    y: 0,
    scale: 1,
    filter: 'none',
  });
};

export const animatePress = (target: Element | null | undefined, options?: ActionOptions) => {
  if (!target) return undefined;
  const strategy = options?.strategy;
  if (!shouldAnimate({ kind: 'transform', strategy })) return undefined;

  return animateTo(target, {
    duration: getDurationSeconds('--ds-duration-fast', options?.durationMs ?? 120),
    ease: gsapEase.pressIn,
    y: 1,
    scale: 0.99,
  });
};

export const animateRelease = (target: Element | null | undefined, options?: ActionOptions) => {
  if (!target) return undefined;
  const strategy = options?.strategy;
  if (!shouldAnimate({ kind: 'transform', strategy })) return undefined;

  return animateTo(target, {
    duration: getDurationSeconds('--ds-duration-fast', options?.durationMs ?? 160),
    ease: gsapEase.springOut,
    y: 0,
    scale: 1,
  });
};

export const animateFocus = (target: Element | null | undefined, options?: ActionOptions) => {
  if (!target) return undefined;
  const strategy = options?.strategy;
  if (!shouldAnimate({ kind: 'opacity', strategy })) return undefined;

  return animateTo(target, {
    duration: getDurationSeconds('--ds-duration-fast', options?.durationMs ?? 140),
    ease: gsapEase.softOut,
    opacity: 1,
  });
};

export const animateBlur = (target: Element | null | undefined, options?: ActionOptions) => {
  if (!target) return undefined;
  const strategy = options?.strategy;
  if (!shouldAnimate({ kind: 'opacity', strategy })) return undefined;

  return animateTo(target, {
    duration: getDurationSeconds('--ds-duration-fast', options?.durationMs ?? 140),
    ease: gsapEase.softOut,
    opacity: 1,
  });
};

export const animateReveal = (target: Element | null | undefined, options?: ActionOptions) => {
  if (!target) return undefined;
  const strategy = options?.strategy;

  const canTransform = shouldAnimate({ kind: 'transform', strategy });
  const canOpacity = shouldAnimate({ kind: 'opacity', strategy });
  if (!canTransform && !canOpacity) return undefined;

  const durationSeconds = getDurationSeconds('--ds-duration-normal', options?.durationMs ?? 220);

  return animateFromTo(
    target,
    {
      ...(canOpacity ? { opacity: 0 } : {}),
      ...(canTransform ? { y: 10 } : {}),
    },
    {
    duration: durationSeconds,
    ease: gsapEase.cinematicReveal,
      ...(canOpacity ? { opacity: 1 } : {}),
      ...(canTransform ? { y: 0 } : {}),
    },
  );
};

export const animateExit = (target: Element | null | undefined, options?: ActionOptions) => {
  if (!target) return undefined;
  const strategy = options?.strategy;

  const canTransform = shouldAnimate({ kind: 'transform', strategy });
  const canOpacity = shouldAnimate({ kind: 'opacity', strategy });
  if (!canTransform && !canOpacity) return undefined;

  return animateTo(target, {
    duration: getDurationSeconds('--ds-duration-fast', options?.durationMs ?? 160),
    ease: gsapEase.softOut,
    ...(canOpacity ? { opacity: 0 } : {}),
    ...(canTransform ? { y: -8 } : {}),
  });
};

export const iconHoverLiftDefaults = {
  duration: motionTokens.iconMotion.hoverLiftDuration,
  ease: motionTokens.iconMotion.hoverLiftEase,
} as const;
