import { Component } from '@angular/core';
import { informationCircle } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomePage {
  // Variable für das HTML verfügbar machen
  informationCircle = informationCircle;
  showInfo = false;

  constructor() {
    // Icon registrieren
    addIcons({ informationCircle });
  }

  toggleInfo() {
    this.showInfo = !this.showInfo;
  }
}