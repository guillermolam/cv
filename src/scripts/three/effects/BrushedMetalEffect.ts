// @ts-ignore
import * as THREE from 'three';
import type { SceneEffect } from '../Engine';

export class BrushedMetalEffect implements SceneEffect {
  private mesh: THREE.Mesh;
  private geometry: THREE.PlaneGeometry;
  private scene: THREE.Scene;
  private uniforms: { [key: string]: THREE.IUniform };

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    
    // Create a plane that covers the camera view
    this.geometry = new THREE.PlaneGeometry(2, 2);

    // Procedural Brushed Metal Shader
    // Uses high-frequency noise stretched along one axis to simulate brushing,
    // combined with low-frequency noise for lighting variations.
    this.uniforms = {
      u_time: { value: 0.0 },
      u_resolution: { value: new THREE.Vector2(1, 1) },
      u_baseColor: { value: new THREE.Color('#1a1c23') },
      u_highlightColor: { value: new THREE.Color('#2a303c') }
    };

    const material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float u_time;
        uniform vec2 u_resolution;
        uniform vec3 u_baseColor;
        uniform vec3 u_highlightColor;
        varying vec2 vUv;

        // Pseudo-random noise
        float random(vec2 st) {
            return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
        }

        void main() {
          // Stretch UVs horizontally to create the "brushed" effect
          vec2 brushedUv = vec2(vUv.x * 50.0, vUv.y * 0.5);
          
          // Generate high-frequency noise for the scratches
          float noise = random(floor(brushedUv * 100.0));
          
          // Soften the noise
          float brush = smoothstep(0.2, 0.8, noise) * 0.15;

          // Add a subtle gradient for global lighting/reflection
          float lighting = smoothstep(0.0, 1.0, vUv.y) * 0.4 + smoothstep(1.0, 0.0, vUv.x) * 0.2;

          // Combine base color, highlights, and brush strokes
          vec3 finalColor = mix(u_baseColor, u_highlightColor, lighting + brush);

          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
      depthWrite: false,
      depthTest: false
    });

    this.mesh = new THREE.Mesh(this.geometry, material);
    // Render behind everything in the scene if other objects exist
    this.mesh.renderOrder = -1;
    this.scene.add(this.mesh);
  }

  update(time: number): void {
    // The texture is mostly static metal, but we can subtly shift it if we want it to react to time.
    // For brushed metal, keeping it static is usually more realistic unless simulating camera movement.
    this.uniforms.u_time.value = time;
  }

  public setResolution(width: number, height: number) {
    this.uniforms.u_resolution.value.set(width, height);
  }

  destroy(): void {
    this.scene.remove(this.mesh);
    this.geometry.dispose();
    (this.mesh.material as THREE.Material).dispose();
  }
}
