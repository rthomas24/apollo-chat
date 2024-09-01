import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { SideBarComponent } from '../components/side-bar/side-bar.component';
import { ThreadsComponent } from '../components/threads/threads.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, HomePageRoutingModule],
  declarations: [HomePage, SideBarComponent, ThreadsComponent],
})
export class HomePageModule {}
