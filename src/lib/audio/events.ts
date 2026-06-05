/**
 * Decoupled SFX event bus.
 *
 * UI components call `emitSfx('click')` without importing the audio engine.
 * The engine (src/lib/audio/sfx.ts) listens for `cr:sfx` events and plays the
 * sound only if audio is unmuted. This keeps components free of audio deps and
 * lets the (heavier) Web Audio engine load lazily/independently.
 */
export type SfxType = 'click' | 'hover' | 'key' | 'boot';

export const SFX_EVENT = 'cr:sfx';

export function emitSfx(type: SfxType): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<SfxType>(SFX_EVENT, { detail: type }));
}
