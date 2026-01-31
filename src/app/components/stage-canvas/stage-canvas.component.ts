import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { World } from '../../three-engine/world';

@Component({
  selector: 'app-stage-canvas',
  template: `<div #sceneContainer style="width: 100%; height: 100%; display: block; background: #000;"></div>`,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
  `]
})
export class StageCanvasComponent implements AfterViewInit {
  @ViewChild('sceneContainer') containerRef?: ElementRef<HTMLDivElement>;
  
  private world?: World;

  ngAfterViewInit() {
    // Use setTimeout to ensure DOM is fully rendered before initializing Three.js
    setTimeout(() => {
      if (this.containerRef?.nativeElement) {
        try {
          console.log('Initializing Three.js World...');
          this.world = new World(this.containerRef.nativeElement);
          console.log('Three.js World initialized successfully');
        } catch (error) {
          console.error('Error initializing World:', error);
        }
      }
    }, 100);
  }

  getWorld() {
    return this.world;
  }
}