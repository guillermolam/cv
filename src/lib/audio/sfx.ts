import { $audioMuted, $reducedMotion } from '../../stores/control-room';
import { SFX_EVENT, type SfxType } from './events';

/**
 * Web Audio SFX engine for the control room.
 *
 * - Synthesises short blips with an OscillatorGain (no audio files to ship).
 * - Muted by default ($audioMuted persists the user's choice).
 * - AudioContext is created lazily on the first user gesture (autoplay policy).
 * - Silent under prefers-reduced-motion.
 * - Listens on the decoupled `cr:sfx` event so UI components stay audio-free.
 */

let ctx: AudioContext | null = null;
let ambientNode: { stop: () => void } | null = null;

const ensureCtx = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  if (ctx) return ctx;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  ctx = new Ctor();
  return ctx;
};

type Blip = { freq: number; dur: number; type: OscillatorType; gain: number };

const PRESETS: Record<SfxType, Blip> = {
  hover: { freq: 880, dur: 0.04, type: 'sine', gain: 0.04 },
  key: { freq: 440, dur: 0.06, type: 'square', gain: 0.05 },
  click: { freq: 320, dur: 0.09, type: 'triangle', gain: 0.07 },
  boot: { freq: 180, dur: 0.5, type: 'sawtooth', gain: 0.06 },
};

const canPlay = (): boolean => !$audioMuted.get() && !$reducedMotion.get();

const play = (type: SfxType) => {
  if (!canPlay()) return;
  const ac = ensureCtx();
  if (!ac) return;
  if (ac.state === 'suspended') void ac.resume();

  const preset = PRESETS[type];
  const now = ac.currentTime;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = preset.type;
  osc.frequency.setValueAtTime(preset.freq, now);
  // quick downward chirp for a mechanical feel
  osc.frequency.exponentialRampToValueAtTime(Math.max(60, preset.freq * 0.6), now + preset.dur);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(preset.gain, now + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + preset.dur);
  osc.connect(gain).connect(ac.destination);
  osc.start(now);
  osc.stop(now + preset.dur + 0.02);
};

/** Low ambient control-room hum, started when audio is enabled. */
const startAmbient = () => {
  if (ambientNode || !canPlay()) return;
  const ac = ensureCtx();
  if (!ac) return;
  if (ac.state === 'suspended') void ac.resume();

  const osc = ac.createOscillator();
  const osc2 = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = 'sine';
  osc.frequency.value = 58;
  osc2.type = 'sine';
  osc2.frequency.value = 87;
  gain.gain.value = 0.012;
  osc.connect(gain);
  osc2.connect(gain);
  gain.connect(ac.destination);
  osc.start();
  osc2.start();
  ambientNode = {
    stop: () => {
      try {
        osc.stop();
        osc2.stop();
      } catch {
        /* already stopped */
      }
    },
  };
};

const stopAmbient = () => {
  ambientNode?.stop();
  ambientNode = null;
};

let bound = false;
/** Call once on the client to activate the engine. */
export function initAudioEngine(): void {
  if (typeof window === 'undefined' || bound) return;
  bound = true;

  window.addEventListener(SFX_EVENT, (e) => {
    const detail = (e as CustomEvent<SfxType>).detail;
    if (detail) play(detail);
  });

  // react to mute toggles: manage ambient + boot cue
  $audioMuted.subscribe((muted) => {
    if (muted) {
      stopAmbient();
    } else {
      play('boot');
      startAmbient();
    }
  });
}
