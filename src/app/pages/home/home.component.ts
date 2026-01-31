import { Component, ElementRef, ViewChild, AfterViewInit, NgZone } from '@angular/core';
import { World } from '../../three-engine/world'; // Hier importieren wir unsere neue Klasse

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomePage implements AfterViewInit {
  @ViewChild('sceneContainer') sceneContainer!: ElementRef;
  
  private world!: World;

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit() {
    // Sobald die Seite geladen ist, starten wir Three.js
    if (this.sceneContainer) {
      this.world = new World(this.sceneContainer.nativeElement, this.ngZone);
    }
  }
}