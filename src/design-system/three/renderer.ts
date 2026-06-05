import * as THREE from 'three';
import { deviceQuality } from './capability';

/**
 * Renderer + scene + camera factory with resize handling.
 * Pixel ratio is capped by device quality to protect low-end GPUs.
 */
export type RenderCore = {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  resize: () => void;
};

export function createRenderCore(canvas: HTMLCanvasElement): RenderCore {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: false,
    alpha: true,
    powerPreference: 'low-power',
  });

  const quality = deviceQuality();
  const maxRatio = quality === 'high' ? 2 : quality === 'medium' ? 1.5 : 1;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxRatio));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
  camera.position.set(0, 0, 9);

  const resize = () => {
    const parent = canvas.parentElement;
    const w = parent?.clientWidth ?? canvas.clientWidth ?? 1;
    const h = parent?.clientHeight ?? canvas.clientHeight ?? 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / Math.max(1, h);
    camera.updateProjectionMatrix();
  };
  resize();

  return { renderer, scene, camera, resize };
}
