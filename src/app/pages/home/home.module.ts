import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HomePage } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { StageCanvasComponent } from '../../components/stage-canvas/stage-canvas.component';

@NgModule({
  declarations: [HomePage, StageCanvasComponent],
  imports: [
    CommonModule,
    IonicModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
