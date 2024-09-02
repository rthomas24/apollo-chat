import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {
  SignUpComponent,
  UserProfile,
} from '../components/sign-up/sign-up.component';
import { filter, Observable, switchMap, from } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectUserProfile } from '../events/chat.selectors';
import { FirestoreService } from '../services/firestore.service';
import { Threads } from '../events/chat.reducer';
import { storeUserThreads } from '../events/chat.actions';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  public profile$: Observable<UserProfile>;
  public signedIn: boolean = false;
  public displayName: string = '';

  constructor(
    private modalController: ModalController,
    private store: Store,
    private fireStore: FirestoreService
  ) {
    this.profile$ = this.store.select(selectUserProfile);
  }

  ngOnInit(): void {
    this.profile$
      .pipe(
        filter((profile) => !!profile.id),
        switchMap((profile) => {
          this.displayName =
            profile.displayName || profile.username || profile.email;
          this.signedIn = true;
          return from(this.fireStore.getUserThreads(profile.id));
        })
      )
      .subscribe({
        next: (threads: Threads[]) => {
          this.store.dispatch(storeUserThreads({ threads }))
        },
        error: (error) => {
          console.error('Error fetching user threads:', error);
        }
      });
  }

  async signIn() {
    const modal = await this.modalController.create({
      component: SignUpComponent,
      cssClass: ['signUp'],
    });
    return await modal.present();
  }
}
