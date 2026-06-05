// @ts-ignore
import * as THREE from 'three';
import type { SceneEffect } from '../Engine';

export class TrigWireframeWave implements SceneEffect {
  private mesh: THREE.Mesh;
  private geometry: THREE.PlaneGeometry;
  private scene: THREE.Scene;

  constructor(scene: THREE.Scene, color = 0x00ffcc, matcap?: THREE.Texture) {
    this.scene = scene;
    const width = 12;
    const height = 12;
    const segments = 40;

    this.geometry = new THREE.PlaneGeometry(width, height, segments, segments);
    this.geometry.rotateX(-Math.PI / 2);

    // Use Matcap for realistic lighting without expensive lights
    const material = matcap 
      ? new THREE.MeshMatcapMaterial({
          matcap: matcap,
          color: color,
          transparent: true,
          opacity: 0.6,
        })
      : new THREE.MeshBasicMaterial({
          color: color,
          wireframe: true,
          transparent: true,
          opacity: 0.4,
        });

    if (matcap) {
      // If using matcap, we don't necessarily want standard wireframe mode
      // as it might look thin. We'll stick to solid for matcap demonstration.
      (material as any).wireframe = true;
    }

    this.mesh = new THREE.Mesh(this.geometry, material);
    this.scene.add(this.mesh);
  }

  update(time: number): void {
    const positions = this.geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const z = positions.getZ(i);
      
      const y = Math.sin(x * 0.8 + time) * Math.cos(z * 0.6 + time * 0.5) * 0.5 +
                Math.sin(z * 0.3 + time * 1.2) * 0.3;
      
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
