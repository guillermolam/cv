// @ts-ignore
import * as THREE from 'three';
import type { SceneEffect } from '../Engine';

// Reuse the noise function for randomness
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

export class GeometricalBackgroundEffect implements SceneEffect {
  private mesh: THREE.Points;
  private geometry: THREE.PlaneGeometry;
  private scene: THREE.Scene;

  constructor(scene: THREE.Scene, color = 0x4cc9f0) {
    this.scene = scene;

    // Large grid for full viewport coverage
    const width = 40;
    const height = 40;
    const segments = 50;

    this.geometry = new THREE.PlaneGeometry(width, height, segments, segments);
    this.geometry.rotateX(-Math.PI / 2.2); // Slight tilt

    const material = new THREE.PointsMaterial({
      color: color,
      size: 0.08,
      transparent: true,
      opacity: 0.15, // Very subtle for background
      sizeAttenuation: true
    });

    this.mesh = new THREE.Points(this.geometry, material);
    this.mesh.position.y = -5; // Move below content
    this.scene.add(this.mesh);
  }

  update(time: number): void {
    const positions = this.geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const z = positions.getZ(i);

      // Complex geometrical wave with built-in randomness (noise)
      const s1 = Math.sin(x * 0.2 + time * 0.15) * Math.cos(z * 0.15 + time * 0.1);
      const s2 = Math.sin(z * 0.1 + time * 0.05);
      const n = noise(x * 0.1 + time * 0.02, z * 0.1 - time * 0.01);

      const y = (s1 + s2 * 0.5 + n * 1.5) * 1.5;

      positions.setY(i, y);
    }
    positions.needsUpdate = true;
  }

  destroy(): void {
    this.scene.remove(this.mesh);
    this.geometry.dispose();
    (this.mesh.material as THREE.Material).dispose();
  }
}
