import type * as THREE from 'three';

/**
 * Recursive Three.js resource disposal — geometries, materials, textures, and
 * the renderer. Call on teardown to release GPU memory (required by the
 * .trae threejs-boundaries rule: strict GPU cleanup).
 */

const disposeMaterial = (material: THREE.Material) => {
  const mat = material as THREE.Material & Record<string, unknown>;
  for (const key of Object.keys(mat)) {
    const value = mat[key];
    if (value && typeof value === 'object' && 'isTexture' in (value as object)) {
      (value as THREE.Texture).dispose();
    }
  }
  material.dispose();
};

export function disposeObject(root: THREE.Object3D): void {
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (mesh.geometry) mesh.geometry.dispose();
    if (mesh.material) {
      if (Array.isArray(mesh.material)) mesh.material.forEach(disposeMaterial);
      else disposeMaterial(mesh.material);
    }
  });
}

export function disposeScene(scene: THREE.Scene, renderer: THREE.WebGLRenderer): void {
  disposeObject(scene);
  scene.clear();
  renderer.dispose();
  renderer.forceContextLoss?.();
  const el = renderer.domElement;
  el.parentNode?.removeChild(el);
}
