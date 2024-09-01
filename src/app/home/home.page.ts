import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SignUpComponent } from '../components/sign-up/sign-up.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(private modalController: ModalController) {}

  async signIn() {
    const modal = await this.modalController.create({
      component: SignUpComponent,
      cssClass: ['signUp']
    });
    return await modal.present();
  }
}

