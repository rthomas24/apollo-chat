import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { SideBarComponent } from '../components/side-bar/side-bar.component';
import { ThreadsComponent } from '../components/threads/threads.component';
import { SignUpComponent } from '../components/sign-up/sign-up.component';
import { TopBarComponent } from '../components/top-bar/top-bar.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, HomePageRoutingModule],
  declarations: [HomePage, SideBarComponent, ThreadsComponent, SignUpComponent, TopBarComponent],
})
export class HomePageModule {}
