/**
 * WebGL capability + device-quality detection for the hero scene.
 * Pure functions, no Three.js import — safe to call before lazy-loading three.
 */

export type DeviceQuality = 'low' | 'medium' | 'high';

export function hasWebGL(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

/** Coarse device-quality heuristic to scale particle counts / pixel ratio. */
export function deviceQuality(): DeviceQuality {
  if (typeof window === 'undefined') return 'low';
  const cores = navigator.hardwareConcurrency ?? 4;
  const mem = (navigator as unknown as { deviceMemory?: number }).deviceMemory ?? 4;
  const mobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
  if (mobile || cores <= 4 || mem <= 4) return 'low';
  if (cores <= 8 || mem <= 8) return 'medium';
  return 'high';
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return true;
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

/** Final gate: WebGL present, not reduced-motion, and ?no3d not set. */
export function heroWebglAllowed(): boolean {
  if (typeof window === 'undefined') return false;
  if (new URLSearchParams(window.location.search).get('no3d') === '1') return false;
  return hasWebGL() && !prefersReducedMotion();
}
