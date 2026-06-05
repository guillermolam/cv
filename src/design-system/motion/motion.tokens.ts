export const motionTokens = {
  duration: {
    instant: 'var(--ds-duration-instant)',
    fast: 'var(--ds-duration-fast)',
    normal: 'var(--ds-duration-normal)',
    deliberate: 'var(--ds-duration-deliberate)',
    route: 'var(--ds-duration-route)',
  },
  ease: {
    softOut: 'var(--ds-ease-soft-out)',
    pressIn: 'var(--ds-ease-press-in)',
    springOut: 'var(--ds-ease-spring-out)',
    magnetic: 'var(--ds-ease-magnetic)',
    cinematicReveal: 'var(--ds-ease-soft-out)',
  },
  transform: {
    hover: 'var(--ds-transform-hover)',
    press: 'var(--ds-transform-press)',
  },
  depthMotion: {
    raisedShadow: 'var(--ds-shadow-raised)',
    elevatedShadow: 'var(--ds-shadow-elevated)',
    floatingShadow: 'var(--ds-shadow-floating)',
    accentGlow: 'var(--ds-glow-accent)',
    perspectiveSm: 'var(--ds-perspective-sm)',
    perspectiveMd: 'var(--ds-perspective-md)',
    perspectiveLg: 'var(--ds-perspective-lg)',
  },
  routeTransition: {
    duration: 'var(--ds-duration-route)',
    ease: 'var(--ds-ease-soft-out)',
  },
  chartMotion: {
    enterDuration: 'var(--ds-duration-normal)',
    exitDuration: 'var(--ds-duration-fast)',
    ease: 'var(--ds-ease-soft-out)',
  },
  iconMotion: {
    hoverLiftDuration: 'var(--ds-duration-fast)',
    hoverLiftEase: 'var(--ds-ease-soft-out)',
  },
} as const;

export type MotionTokens = typeof motionTokens;
export type MotionDurationTokenName = keyof MotionTokens['duration'];
export type MotionEaseTokenName = keyof MotionTokens['ease'];
