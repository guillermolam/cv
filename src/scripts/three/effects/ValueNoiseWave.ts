// @ts-ignore
import * as THREE from 'three';
import type { SceneEffect } from '../Engine';

// Simple 2D Value Noise
const hash = (x: number, y: number) => {
  const h = x * 127.1 + y * 311.7;
  return Math.abs(Math.sin(h) * 43758.5453123) % 1;
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const noise = (x: number, y: number) => {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;

  const a = hash(ix, iy);
  const b = hash(ix + 1, iy);
  const c = hash(ix, iy + 1);
  const d = hash(ix + 1, iy + 1);

  const ux = fx * fx * (3.0 - 2.0 * fx);
  const uy = fy * fy * (3.0 - 2.0 * fy);

  return lerp(lerp(a, b, ux), lerp(c, d, ux), uy);
};

export class ValueNoiseWave implements SceneEffect {
  private points: THREE.Points;
  private geometry: THREE.PlaneGeometry;
  private scene: THREE.Scene;

  constructor(scene: THREE.Scene, color = 0x00aaff) {
    this.scene = scene;
    const width = 10;
    const height = 10;
    const segments = 64;

    this.geometry = new THREE.PlaneGeometry(width, height, segments, segments);
    this.geometry.rotateX(-Math.PI / 2);

    const material = new THREE.PointsMaterial({
      color: color,
      size: 0.05,
      transparent: true,
      opacity: 0.8,
      fog: true, // Enable fog interaction for analog blending
    });

    this.points = new THREE.Points(this.geometry, material);
    this.scene.add(this.points);
  }

  update(time: number): void {
    const positions = this.geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const z = positions.getZ(i);
      
      const n1 = noise(x * 0.5 + time * 0.2, z * 0.5 + time * 0.1);
      const n2 = noise(x * 1.0 - time * 0.1, z * 1.0 + time * 0.3);
      const y = (n1 + n2 * 0.5) * 0.8;
      
      positions.setY(i, y);
    }
    positions.needsUpdate = true;
  }

  destroy(): void {
    this.scene.remove(this.points);
    this.geometry.dispose();
    (this.points.material as THREE.Material).dispose();
  }
}
