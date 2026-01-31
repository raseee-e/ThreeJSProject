/**
 * Three.js Service
 */

import { Injectable } from '@angular/core';
import { BodybuildingStageScene } from '../js/scene/main.js';

@Injectable({
  providedIn: 'root'
})
export class ThreeJSService {
  private scene: BodybuildingStageScene | null = null;

  constructor() { }

  initScene(canvas: HTMLCanvasElement): BodybuildingStageScene {
    this.scene = new BodybuildingStageScene(canvas);
    return this.scene;
  }

  getScene(): BodybuildingStageScene | null {
    return this.scene;
  }

  toggleAnimation(enabled: boolean) {
    if (this.scene) {
      this.scene.controls.autoRotate = enabled;
    }
  }
}
