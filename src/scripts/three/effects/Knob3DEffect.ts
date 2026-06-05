import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap';

export class Knob3DEffect {
  private group: THREE.Group;
  private scene: THREE.Scene;
  private knobModel: THREE.Object3D | null = null;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.setupLighting();
    this.loadModel();
  }

  private setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.group.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(2, 5, 3);
    this.group.add(directionalLight);

    const backLight = new THREE.DirectionalLight(0x4cc9f0, 0.8);
    backLight.position.set(-2, -1, -2);
    this.group.add(backLight);
  }

  private loadModel() {
    const loader = new GLTFLoader();
    loader.load(
      '/3d/models/knob.glb',
      (gltf) => {
        this.knobModel = gltf.scene;

        // Scale and position the model to fit the container
        this.knobModel.scale.set(0.5, 0.5, 0.5);

        // Ensure materials look good (metallic/roughness)
        this.knobModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            const material = mesh.material as THREE.MeshStandardMaterial;
            if (material) {
              material.metalness = 0.8;
              material.roughness = 0.3;
            }
          }
        });

        this.group.add(this.knobModel);
      },
      undefined,
      (error) => {
        console.error('Error loading knob.glb:', error);
      }
    );
  }

  /**
   * Sets the rotation of the knob around the Y axis.
   * Uses GSAP for smooth interpolation.
   * @param angleDegrees The target angle in degrees.
   */
  public setRotation(angleDegrees: number) {
    if (!this.knobModel) return;

    // Convert degrees to radians.
    // Three.js Y-axis rotation maps to the typical 2D dial rotation
    // assuming the model is oriented correctly. Adjust axis if needed.
    const radians = (angleDegrees * Math.PI) / 180;

    gsap.to(this.knobModel.rotation, {
      y: radians,
      duration: 0.2,
      ease: 'power2.out',
    });
  }

  public tick(dt: number, time: number) {
    // Optional: Add idle breathing or subtle floating if desired,
    // but a physical knob should probably remain stationary when not interacting.
  }

  public update(time: number) {
    this.tick(0, time);
  }

  public destroy() {
    this.dispose();
  }

  public dispose() {
    this.scene.remove(this.group);
    // Deep disposal is typically handled by the Engine's disposeScene,
    // but explicit cleanup is good practice.
  }
}
