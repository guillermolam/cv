import { emitSfx } from '../lib/audio/events';

/**
 * Wires SFX onto the section nav rail. Glyph draw-on + 3D hover are pure CSS in
 * NavSectionGlyph; this only adds the audio cue (hover tick, click) and is a
 * no-op when audio is muted (the engine decides).
 */
let bound = false;
export async function initSectionNav(): Promise<void> {
  if (typeof window === 'undefined' || bound) return;
  bound = true;

  document.querySelectorAll<HTMLElement>('[data-section-nav] [data-nav-link]').forEach((link) => {
    link.addEventListener('pointerenter', () => emitSfx('hover'));
    link.addEventListener('focus', () => emitSfx('hover'));
    link.addEventListener('click', () => emitSfx('click'));
  });
}
