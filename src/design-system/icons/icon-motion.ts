import type { IconDepth, IconMotion, IconTone } from './icon-types';

export const ICON_TONES: readonly IconTone[] = [
  'neutral',
  'accent',
  'security',
  'cloud',
  'infra',
  'automation',
  'compliance',
] as const;

export const ICON_DEPTHS: readonly IconDepth[] = ['flat', 'raised', 'elevated', 'floating'] as const;

export const ICON_MOTIONS: readonly IconMotion[] = ['none', 'hover-lift'] as const;

export const iconToneClass: Record<IconTone, string> = {
  neutral: 'ds-icon-tone-neutral',
  accent: 'ds-icon-tone-accent',
  security: 'ds-icon-tone-security',
  cloud: 'ds-icon-tone-cloud',
  infra: 'ds-icon-tone-infra',
  automation: 'ds-icon-tone-automation',
  compliance: 'ds-icon-tone-compliance',
};

export const iconDepthClass: Record<IconDepth, string> = {
  flat: 'ds-icon-depth-flat',
  raised: 'ds-icon-depth-raised',
  elevated: 'ds-icon-depth-elevated',
  floating: 'ds-icon-depth-floating',
};

export const iconMotionClass: Record<IconMotion, string> = {
  none: 'ds-icon-motion-none',
  'hover-lift': 'ds-icon-motion-hover-lift',
};

export const reducedMotionSafeClassName = 'ds-icon-reduced-motion-safe';

