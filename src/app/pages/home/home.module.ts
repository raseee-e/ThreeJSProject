import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.component';

import { HomeRoutingModule } from './home-routing.module';

// 1. IMPORTIEREN
import { StageCanvasComponent } from '../../components/stage-canvas/stage-canvas.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeRoutingModule
  ],
  declarations: [
    HomePage,
    StageCanvasComponent // 2. HIER HINZUFÜGEN
  ]
})
export class HomeModule {}