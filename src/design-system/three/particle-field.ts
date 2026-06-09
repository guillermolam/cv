import * as THREE from 'three';
import { createRenderCore } from './renderer';
import { disposeScene } from './dispose';
import { deviceQuality } from './capability';

/**
 * Hero particle topology field.
 *
 * A grid of points displaced by layered sine "ripples/waves" in a vertex
 * shader, drifting calmly. Accent-tinted, additive, low-power. Returns a
 * controller with start/stop/pause/dispose so the host island can manage the
 * lifecycle (pause offscreen, dispose on teardown).
 */

export type HeroFieldController = {
  start: () => void;
  pause: () => void;
  dispose: () => void;
  resize: () => void;
};

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uAmp;
  attribute float aScale;
  varying float vGlow;

  void main() {
    vec3 p = position;
    float w =
      sin(p.x * 0.6 + uTime * 0.6) * 0.5 +
      sin(p.y * 0.5 - uTime * 0.45) * 0.5 +
      sin((p.x + p.y) * 0.3 + uTime * 0.3) * 0.4;
    p.z += w * uAmp;
    vGlow = smoothstep(-1.0, 1.0, w);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = aScale * (140.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  precision mediump float;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying float vGlow;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.0, d) * (0.35 + vGlow * 0.5);
    vec3 col = mix(uColorA, uColorB, vGlow);
    gl_FragColor = vec4(col, alpha);
  }
`;

const cssColor = (name: string, fallback: string): THREE.Color => {
  if (typeof window === 'undefined') return new THREE.Color(fallback);
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  try {
    return new THREE.Color(v || fallback);
  } catch {
    return new THREE.Color(fallback);
  }
};

export function createHeroField(
  canvas: HTMLCanvasElement,
): HeroFieldController {
  const core = createRenderCore(canvas);
  const { renderer, scene, camera } = core;

  const q = deviceQuality();
  const grid = q === 'high' ? 80 : q === 'medium' ? 56 : 36;
  const spacing = 0.34;
  const count = grid * grid;

  const positions = new Float32Array(count * 3);
  const scales = new Float32Array(count);
  let i = 0;
  for (let x = 0; x < grid; x++) {
    for (let y = 0; y < grid; y++) {
      positions[i * 3] = (x - grid / 2) * spacing;
      positions[i * 3 + 1] = (y - grid / 2) * spacing;
      positions[i * 3 + 2] = 0;
      scales[i] = 0.6 + Math.random() * 0.8;
      i++;
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uAmp: { value: 1.1 },
      uColorA: { value: cssColor('--color-cta', '#4cc9f0') },
      uColorB: { value: cssColor('--color-link-hover', '#6ad7f5') },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geometry, material);
  points.rotation.x = -0.9;
  scene.add(points);

  let raf = 0;
  let running = false;
  let lastTimeMs = 0;
  let elapsedSeconds = 0;

  const tick = () => {
    if (!running) return;
    const nowMs = performance.now();
    if (lastTimeMs === 0) lastTimeMs = nowMs;
    const deltaMs = Math.max(0, nowMs - lastTimeMs);
    lastTimeMs = nowMs;
    elapsedSeconds += deltaMs / 1000;
    material.uniforms['uTime']!.value = elapsedSeconds;
    points.rotation.z += 0.0008;
    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  };

  return {
    start() {
      if (running) return;
      running = true;
      lastTimeMs = performance.now();
      elapsedSeconds = 0;
      tick();
    },
    pause() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    },
    resize() {
      core.resize();
    },
    dispose() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      disposeScene(scene, renderer);
    },
  };
}
