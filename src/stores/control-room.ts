import { atom, computed } from 'nanostores';
import { persistentAtom } from './persistent';
import { SUPPORTED_LANGS, DEFAULT_LANG, isLang, type Lang } from '../lib/i18n';

/**
 * control-room store — the shared brain for the homepage console islands.
 *
 * Every interactive island (LanguageDial, SectionNavRail, AudioToggle,
 * HeroParticleField, lazy charts) subscribes here instead of prop-drilling.
 * The store is the project's first real nanostores usage.
 */

// ─── Section switcher ──────────────────────────────────────────────────────
export const SECTION_IDS = [
  'bio',
  'edu',
  'lang',
  'cert',
  'skills',
  'achv',
  'soft',
  'terminal',
] as const;
export type SectionId = (typeof SECTION_IDS)[number];

export const $activeSection = atom<SectionId>('bio');

export function setActiveSection(id: SectionId) {
  $activeSection.set(id);
}

// ─── Language ──────────────────────────────────────────────────────────────
const detectLang = (): Lang => {
  if (typeof window === 'undefined') return DEFAULT_LANG;
  const seg = window.location.pathname.split('/').filter(Boolean)[0];
  return seg && isLang(seg) ? seg : DEFAULT_LANG;
};

export const $lang = atom<Lang>(detectLang());

/** cycle to the next/previous language in SUPPORTED_LANGS order */
export function cycleLang(direction: 1 | -1) {
  const current = $lang.get();
  const idx = SUPPORTED_LANGS.indexOf(current);
  const next = (idx + direction + SUPPORTED_LANGS.length) % SUPPORTED_LANGS.length;
  $lang.set(SUPPORTED_LANGS[next] as Lang);
}

export function setLang(lang: Lang) {
  $lang.set(lang);
}

// ─── Audio ─────────────────────────────────────────────────────────────────
/** muted by default; persisted so the user's choice survives reloads */
export const $audioMuted = persistentAtom<boolean>('cr.audioMuted', true);

export function toggleAudio() {
  $audioMuted.set(!$audioMuted.get());
}

// ─── Capability / preference flags ─────────────────────────────────────────
export const $reducedMotion = atom<boolean>(false);
export const $webglSupported = atom<boolean>(false);

/** WebGL effects run only when supported AND motion is not reduced */
export const $webglEnabled = computed(
  [$webglSupported, $reducedMotion],
  (supported, reduced) => supported && !reduced,
);

let capabilitiesInited = false;
/**
 * Call once on the client to populate capability/preference atoms.
 * Keeps detection logic out of every island. Idempotent.
 */
export function initCapabilities() {
  if (typeof window === 'undefined' || capabilitiesInited) return;
  capabilitiesInited = true;

  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  $reducedMotion.set(mq.matches);
  mq.addEventListener?.('change', (e) => $reducedMotion.set(e.matches));

  // honor an explicit ?no3d=1 opt-out
  const noWebgl = new URLSearchParams(window.location.search).get('no3d') === '1';

  let supported = false;
  if (!noWebgl) {
    try {
      const canvas = document.createElement('canvas');
      supported = Boolean(
        canvas.getContext('webgl2') || canvas.getContext('webgl'),
      );
    } catch {
      supported = false;
    }
  }
  $webglSupported.set(supported);
}
