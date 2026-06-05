import { setLang } from '../stores/control-room';
import type { Lang } from '../lib/i18n';
import { emitSfx } from '../lib/audio/events';
import { Engine } from './three/Engine';
import { LanguageKnobEffect } from './three/effects/LanguageKnobEffect';
import * as THREE from 'three'; // Needed for lights

type DialLink = { code: Lang; href: string; name: string };

const initOne = async (root: HTMLElement) => {
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
  const mount = root.querySelector<HTMLElement>('[data-3d-mount]');
  const prevHit = root.querySelector<HTMLAnchorElement>('[data-dir="prev"]');
  const nextHit = root.querySelector<HTMLAnchorElement>('[data-dir="next"]');
  const stepDeg = links.length > 0 ? 360 / links.length : 90;

  let rotationSteps = 0;
  let knobEffect: LanguageKnobEffect | null = null;

  // Initialize 3D Knob if mount exists
  if (mount) {
    const engine = new Engine(mount);
    const scene = engine.getScene();
    
    // Position camera
    engine.getCamera().position.set(0, 5, 0); // Top-down view
    engine.getCamera().lookAt(0, 0, 0);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(2, 5, 2);
    scene.add(dirLight);

    try {
      const model = await Engine.loadModel('/3d/models/knob.glb');
      model.scale.set(0.8, 0.8, 0.8);
      // Ensure the model is centered
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      model.position.sub(center);
      
      scene.add(model);
      
      knobEffect = new LanguageKnobEffect(model);
      engine.addEffect(knobEffect);
      
      // Set initial rotation
      knobEffect.setTargetRotation(rotationSteps * stepDeg);
    } catch (e) {
      console.error("Failed to load language knob model", e);
    }
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
      knob.dataset['pressed'] = knob.dataset['pressed'] ?? '';
    }
    if (knobEffect) {
      knobEffect.setTargetRotation(rotationSteps * stepDeg);
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

  if (knob) {
    let dragging = false;
    let moved = false;
    let lastAngle = 0;
    let accAngle = 0;

    const getAngle = (clientX: number, clientY: number) => {
      const rect = knob.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      // atan2 returns angle in radians. Convert to degrees.
      let angle = (Math.atan2(clientY - centerY, clientX - centerX) * 180) / Math.PI;
      angle += 90; // Offset so 0 is at the top (12 o'clock)
      if (angle < 0) angle += 360;
      return angle % 360;
    };

    knob.addEventListener('pointerdown', (e) => {
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

      knob.setPointerCapture(e.pointerId);
      press();
    });

    knob.addEventListener('pointermove', (e) => {
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
      } else {
        // If it was a simple click on the already-selected language, we can optionally commit
        // but usually it's better to just leave it. The hit areas (prev/next) still handle
        // immediate navigation for their respective halves.
      }
    };

    knob.addEventListener('pointerup', end);
    knob.addEventListener('pointercancel', end);
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
