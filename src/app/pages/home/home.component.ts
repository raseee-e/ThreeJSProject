import { Component } from '@angular/core';
import { informationCircle } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-home',
  template: `
    <ion-header>
      <ion-toolbar color="dark">
        <ion-title>Bodybuilding-Stage</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="toggleInfo()">
            <ion-icon [icon]="informationCircle" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true">
      <app-stage-canvas style="width: 100%; height: 100%; display: block;"></app-stage-canvas>

      <div *ngIf="showInfo" style="position: absolute; top: 10px; left: 10px; background: rgba(0,0,0,0.7); color: white; padding: 10px; border-radius: 8px;">
        <p>Steuerung: Links-Klick drehen, Rechts-Klick bewegen</p>
      </div>
    </ion-content>
  `,
  styles: [`
    ion-content {
      --background: #1a1a1a;
      overflow: hidden;
    }

    app-stage-canvas {
      width: 100%;
      height: 100%;
      display: block;
    }
  `]
})
export class HomePage {
  informationCircle = informationCircle;
  showInfo = false;

  constructor() {
    addIcons({ informationCircle });
  }

  toggleInfo() {
    this.showInfo = !this.showInfo;
  }
}