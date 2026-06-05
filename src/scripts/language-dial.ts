import { setLang } from '../stores/control-room';
import type { Lang } from '../lib/i18n';
import { emitSfx } from '../lib/audio/events';
import { Engine } from './three/Engine';
import { BrushedMetalEffect } from './three/effects/BrushedMetalEffect';

type DialLink = { code: Lang; href: string; name: string };

const initOne = (root: HTMLElement) => {
  let links: DialLink[] = [];
  try {
    links = JSON.parse(root.dataset['links'] ?? '[]');
  } catch {
    return;
  }
  if (links.length === 0) return;

  const current = (root.dataset['current'] ?? links[0]!.code) as Lang;
  let previewIdx = Math.max(0, links.findIndex((l) => l.code === current));

  const items = Array.from(root.querySelectorAll<HTMLElement>('[data-lcd-item]'));
  const knob = root.querySelector<HTMLElement>('[data-lang-knob]');
  const knobCore = root.querySelector<HTMLElement>('[data-knob-core]');
  const bgMount = root.querySelector<HTMLElement>('[data-bg-mount]');
  const prevHit = root.querySelector<HTMLAnchorElement>('[data-dir="prev"]');
  const nextHit = root.querySelector<HTMLAnchorElement>('[data-dir="next"]');
  const stepDeg = links.length > 0 ? 360 / links.length : 90;

  let rotationSteps = 0;

  if (bgMount && !bgMount.dataset.initialized) {
    const engine = new Engine(bgMount);
    const scene = engine.getScene();
    
    // Setup camera so it looks directly at the plane
    const camera = engine.getCamera();
    camera.position.z = 1;

    const metalEffect = new BrushedMetalEffect(scene);
    engine.addEffect(metalEffect);
    
    bgMount.dataset.initialized = 'true';
  }

  const render = () => {
    const active = links[previewIdx]!;
    const prev = links[(previewIdx - 1 + links.length) % links.length]!;
    const next = links[(previewIdx + 1) % links.length]!;
    for (const item of items) {
      item.dataset['active'] = item.dataset['lcdItem'] === active.code ? 'true' : '';
    }
    if (prevHit) {
      prevHit.href = prev.href;
      prevHit.setAttribute('aria-label', `Previous language (${prev.name})`);
    }
    if (nextHit) {
      nextHit.href = next.href;
      nextHit.setAttribute('aria-label', `Next language (${next.name})`);
    }
    if (knob) {
      knob.style.setProperty('--lang-knob-rot', `${rotationSteps * stepDeg}deg`);
      knob.dataset['pressed'] = knob.dataset['pressed'] ?? '';
    }
    setLang(active.code);
  };

  const cycle = (dir: 1 | -1) => {
    previewIdx = (previewIdx + dir + links.length) % links.length;
    rotationSteps += dir;
    render();
    emitSfx('key');
  };

  const commit = () => {
    emitSfx('click');
    window.location.href = links[previewIdx]!.href;
  };

  const press = () => {
    if (!knob) return;
    knob.dataset['pressed'] = 'true';
    emitSfx('hover');
  };

  const release = () => {
    if (!knob) return;
    delete knob.dataset['pressed'];
  };

  const bindHit = (btn: HTMLAnchorElement | null, dir: 1 | -1) => {
    if (!btn) return;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      cycle(dir);
      commit();
    });
    btn.addEventListener('pointerdown', press);
    btn.addEventListener('pointerup', release);
    btn.addEventListener('pointerleave', release);
  };

  bindHit(prevHit, -1);
  bindHit(nextHit, 1);

  const jump = (targetIdx: number) => {
    let diff = targetIdx - previewIdx;
    if (diff > links.length / 2) diff -= links.length;
    if (diff < -links.length / 2) diff += links.length;

    if (diff !== 0) {
      previewIdx = (targetIdx + links.length) % links.length;
      rotationSteps += diff;
      render();
      emitSfx('key');
    }
  };

  if (knobCore) {
    let dragging = false;
    let moved = false;
    let lastAngle = 0;
    let accAngle = 0;

    const getAngle = (clientX: number, clientY: number) => {
      const rect = knobCore.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      // atan2 returns angle in radians. Convert to degrees.
      let angle = (Math.atan2(clientY - centerY, clientX - centerX) * 180) / Math.PI;
      angle += 90; // Offset so 0 is at the top (12 o'clock)
      if (angle < 0) angle += 360;
      return angle % 360;
    };

    knobCore.addEventListener('pointerdown', (e) => {
      dragging = true;
      moved = false;
      const startAngle = getAngle(e.clientX, e.clientY);
      lastAngle = startAngle;
      accAngle = 0;

      // Selection: Jump to the nearest language slice immediately
      const targetIdx = Math.round(startAngle / stepDeg) % links.length;
      if (targetIdx !== previewIdx) {
        jump(targetIdx);
        moved = true;
      }

      knobCore.setPointerCapture(e.pointerId);
      press();
    });

    knobCore.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const currentAngle = getAngle(e.clientX, e.clientY);
      let diff = currentAngle - lastAngle;

      // Handle wrap-around
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;

      accAngle += diff;
      lastAngle = currentAngle;

      if (Math.abs(accAngle) >= stepDeg) {
        const steps = Math.trunc(accAngle / stepDeg);
        accAngle -= steps * stepDeg;
        const dir = steps > 0 ? 1 : -1;
        for (let i = 0; i < Math.abs(steps); i++) cycle(dir);
        moved = true;
      }
    });

    const end = () => {
      if (!dragging) return;
      dragging = false;
      release();
      // If we interacted (clicked a different lang or dragged), commit the change.
      if (moved) {
        commit();
      }
    };

    knobCore.addEventListener('pointerup', end);
    knobCore.addEventListener('pointercancel', end);
  }

  // Keyboard: arrows switch immediately (no OK button).
  root.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault();
        cycle(-1);
        commit();
        break;
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault();
        cycle(1);
        commit();
        break;
    }
  });

  render();
};

let bound = false;
export async function initLanguageDials(): Promise<void> {
  if (typeof window === 'undefined' || bound) return;
  bound = true;
  document.querySelectorAll<HTMLElement>('[data-lang-dial]').forEach(initOne);
}
