import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { signUserIn } from 'src/app/events/chat.actions';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
  email: string = '';
  password: string = '';
  isSignUp: boolean = true;
  showPassword: boolean = false;
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private modalCtrl: ModalController,
    private store: Store,
    private firebaseDbService: FirestoreService
  ) {}

  async onSubmit() {
    this.isLoading = true;
    try {
      const authMethod = this.isSignUp ? this.authService.emailSignUp.bind(this.authService) : this.authService.emailSignIn.bind(this.authService);
      const user = await authMethod(this.email, this.password);
      const userProfile = {
        displayName: user.displayName,
        email: user.email,
        emailVerified: user.emailVerified,
        phoneNumber: user.phoneNumber ?? null,
        refreshToken: user.refreshToken
      } as UserProfile

      this.store.dispatch(signUserIn({ user: userProfile }));
      console.log(this.isSignUp ? 'Sign up successful' : 'Sign in successful', user);
      this.modalCtrl.dismiss();

      const userId = this.authService.getUserId();
      if (userId) {
        await this.firebaseDbService.addOrUpdateUser(userId, { email: user.email, displayName: user.displayName });

        // const newThread = {
        //   id: "thread1",
        //   title: "Sample Thread Title",
        //   avatar: "https://example.com/avatar.png",
        //   content: [
        //     { human: 'hey', ai: 'Hey there' },
        //     { human: 'how are you', ai: 'im good' }
        //   ]
        // };

        // await this.firebaseDbService.addThreadToUser(userId, newThread);
      }
    } catch (error) {
      console.error(this.isSignUp ? 'Error signing up:' : 'Error signing in:', error);
    } finally {
      this.isLoading = false;
    }
  }

  toggleSignUp() {
    this.isSignUp = !this.isSignUp;
  }

  async signInWithGoogle() {
    this.isLoading = true;
    try {
      const user = await this.authService.googleSignIn();
      console.log('Google sign in successful', user);
      this.modalCtrl.dismiss();

      const userId = this.authService.getUserId();
      if (userId) {
        await this.firebaseDbService.addOrUpdateUser(userId, { email: user.email, displayName: user.displayName });

        const newThread = {
          id: "thread1",
          title: "Sample Thread Title",
          avatar: "https://example.com/avatar.png",
          content: [
            { human: 'hey', ai: 'Hey there' },
            { human: 'how are you', ai: 'im good' }
          ]
        };

        await this.firebaseDbService.addThreadToUser(userId, newThread);
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
    } finally {
      this.isLoading = false;
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}

export interface UserProfile {
  displayName: string,
  email: string,
  emailVerified: boolean,
  phoneNumber: string | null,
  refreshToken: string
}