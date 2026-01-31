import { Injectable } from '@angular/core';
// @ts-ignore
import { BodybuildingStageScene } from '../../js/scene/main.js';

@Injectable({
  providedIn: 'root'
})
export class ThreeJsService {
  private scene?: BodybuildingStageScene;

  constructor() {}

  initScene(canvas: HTMLCanvasElement): BodybuildingStageScene {
    this.scene = new BodybuildingStageScene(canvas);
    return this.scene;
  }

  getScene(): BodybuildingStageScene | undefined {
    return this.scene;
  }

  toggleAnimation(): void {
    if (this.scene?.controls) {
      this.scene.controls.autoRotate = !this.scene.controls.autoRotate;
    }
  }
}
