# Audio / SFX (Architecture)

A synthesised Web Audio engine for control-room SFX + ambient hum. Muted by
default, persisted, decoupled from the UI.

## Files
- `src/lib/audio/events.ts` — decoupled event bus. Components call
  `emitSfx('click'|'hover'|'key'|'boot')` → dispatches a `cr:sfx` CustomEvent.
  No audio dependency in UI components.
- `src/lib/audio/sfx.ts` — the engine. Listens for `cr:sfx`, synthesises blips
  with an Oscillator→Gain (no audio files shipped), and runs a low ambient hum.
- `src/components/control-room/AudioToggle.astro` — the 🔊 toggle, bound to
  `$audioMuted`.

## Rules
- **Muted by default** — `$audioMuted` is a persistent atom defaulting to `true`.
- **Autoplay-safe** — `AudioContext` is created lazily and `resume()`d on the
  first gesture.
- **Reduced motion** — `canPlay()` returns false under `$reducedMotion`, so the
  engine stays silent (no SFX, no ambient).
- **Toggle reactions** — unmuting plays a `boot` cue and starts ambient; muting
  stops ambient.

## Flow
```
UI component → emitSfx(type) → window 'cr:sfx' → sfx engine → (if canPlay) play
AudioToggle  → toggleAudio() → $audioMuted ↔ localStorage → engine ambient on/off
```
