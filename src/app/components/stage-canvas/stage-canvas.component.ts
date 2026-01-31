import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { BuyldingStageScene } from '../../../js/scene/main.js';

@Component({
  selector: 'app-stage-canvas',
  templateUrl: './stage-canvas.component.html',
  styleUrls: ['./stage-canvas.component.css']
})
export class StageCanvasComponent implements AfterViewInit {
  @ViewChild('canvasElement') canvasElement?: ElementRef<HTMLCanvasElement>;
  private scene?: BuyldingStageScene;

  ngAfterViewInit() {
    if (this.canvasElement?.nativeElement) {
      const canvas = this.canvasElement.nativeElement;
      this.scene = new BuyldingStageScene(canvas);
    }
  }

  getScene() {
    return this.scene;
  }
}
