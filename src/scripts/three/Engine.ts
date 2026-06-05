// @ts-ignore
import * as THREE from 'three';
// @ts-ignore
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// @ts-ignore
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

export interface SceneEffect {
  update(time: number): void;
  destroy(): void;
}

export class Engine {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private startTime: number;
  private effects: SceneEffect[] = [];
  private animationFrameId: number | null = null;
  private resizeObserver: ResizeObserver;

  constructor(container: HTMLElement) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    this.camera.position.z = 5;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(this.renderer.domElement);

    this.startTime = performance.now();

    this.resizeObserver = new ResizeObserver(() => this.onResize(container));
    this.resizeObserver.observe(container);

    this.animate();
  }

  private onResize(container: HTMLElement) {
    this.camera.aspect = container.clientWidth / container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(container.clientWidth, container.clientHeight);
  }

  public addEffect(effect: SceneEffect) {
    this.effects.push(effect);
  }

  public getScene() {
    return this.scene;
  }

  public getCamera() {
    return this.camera;
  }

  private animate() {
    const elapsedSeconds = (performance.now() - this.startTime) / 1000;
    this.effects.forEach(effect => effect.update(elapsedSeconds));
    this.renderer.render(this.scene, this.camera);
    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  public destroy() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.resizeObserver.disconnect();
    this.effects.forEach(effect => effect.destroy());
    this.renderer.dispose();
    if (this.renderer.domElement.parentElement) {
        this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }

  public static loadModel(url: string): Promise<THREE.Group> {
    const loader = new GLTFLoader();
    
    // Configure Draco
    const dracoLoader = new DRACOLoader();
    // Use a CDN for the decoder if we don't have it locally
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
    loader.setDRACOLoader(dracoLoader);

    return new Promise((resolve, reject) => {
      loader.load(url, (gltf: any) => resolve(gltf.scene), undefined, reject);
    });
  }
}
