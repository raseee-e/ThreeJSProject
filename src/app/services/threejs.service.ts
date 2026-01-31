import { Injectable } from '@angular/core';
import { World } from '../three-engine/world';

@Injectable({
  providedIn: 'root'
})
export class ThreeJsService {
  private world?: World;

  constructor() {}

  // Wir erwarten jetzt ein Container-Div (HTMLElement), keinen Canvas direkt
  initScene(container: HTMLElement): World {
    this.world = new World(container);
    return this.world;
  }

  getScene(): World | undefined {
    return this.world;
  }

  // Optional: Aufräumen (Memory Leak Prevention)
  dispose() {
    // Hier könntest du später Logik einbauen, um den Renderer zu stoppen
    this.world = undefined;
  }
}