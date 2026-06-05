// @ts-ignore
import * as THREE from 'three';
import type { SceneEffect } from '../Engine';

export class LanguageKnobEffect implements SceneEffect {
  private model: THREE.Group;
  private currentRotation: number = 0;
  private targetRotation: number = 0;

  constructor(model: THREE.Group) {
    this.model = model;
    
    // Initial orientation adjustment depending on how the GLB is exported.
    // Assuming the knob face is pointing up (Y axis) or forward (Z axis).
    // We will bind the target rotation to the Y axis for now, which is typical for dials.
  }

  public setTargetRotation(degrees: number) {
    // Convert degrees to radians.
    // Note: depending on the drag direction in CSS, negative/positive might be inverted in 3D space.
    // The CSS transform was rotate(Xdeg), which rotates clockwise. 
    // In Three.js, negative Y rotation is clockwise if looking from the top.
    this.targetRotation = -degrees * (Math.PI / 180);
  }

  update(time: number): void {
    // Smooth interpolation (lerp) towards the target rotation
    this.currentRotation += (this.targetRotation - this.currentRotation) * 0.15;
    
    // Apply rotation
    this.model.rotation.y = this.currentRotation;
  }

  destroy(): void {
    // Cleanup if needed (Engine handles disposing geometry/materials if we implement a generic traverse)
  }
}
