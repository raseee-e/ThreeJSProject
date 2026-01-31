import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { BodybuildingStageScene } from "../../../ts/scene/main";

@Component({
  selector: 'app-stage-canvas',
  templateUrl: './stage-canvas.component.html',
  styleUrls: ['./stage-canvas.component.css']
})
export class StageCanvasComponent implements AfterViewInit {
  @ViewChild('canvasElement') canvasElement?: ElementRef<HTMLCanvasElement>;
  private scene?: BodybuildingStageScene;

  ngAfterViewInit() {
    if (this.canvasElement?.nativeElement) {
      const canvas = this.canvasElement.nativeElement;
      this.scene = new BodybuildingStageScene(canvas);
    }
  }

  getScene() {
    return this.scene;
  }
}
