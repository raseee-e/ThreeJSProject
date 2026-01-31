import { Component } from '@angular/core';
import { informationCircle } from 'ionicons/icons';
import { addIcons } from 'ionicons';

addIcons({ informationCircle });

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomePage {
  showInfo = false;
  informationCircle = informationCircle;

  toggleInfo() {
    this.showInfo = !this.showInfo;
  }
}
