import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { World } from '../../three-engine/world'; // Pfad zur neuen World Datei

@Component({
  selector: 'app-stage-canvas',
  templateUrl: './stage-canvas.component.html',
  styleUrls: ['./stage-canvas.component.css']
})
export class StageCanvasComponent implements AfterViewInit {
  // Wir suchen nach einem Element mit #sceneContainer im HTML
  @ViewChild('sceneContainer') containerRef?: ElementRef<HTMLDivElement>;
  
  private world?: World;

  ngAfterViewInit() {
    if (this.containerRef?.nativeElement) {
      // Wir übergeben das Div an die World-Klasse
      this.world = new World(this.containerRef.nativeElement);
    }
  }

  getWorld() {
    return this.world;
  }
}