import { Component, OnInit } from '@angular/core';
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
export class SignUpComponent implements OnInit {
  email: string = '';
  password: string = '';
  isSignUp: boolean = true;
  showPassword: boolean = false;
  isLoading: boolean = false;
  username = '';

  constructor(
    private authService: AuthService,
    private modalCtrl: ModalController,
    private store: Store,
    private firebaseDbService: FirestoreService,
  ) {}

  ngOnInit() {
    // Check if user is already logged in
    const userId = this.authService.getUserId();
    if (userId) {
      // Fetch user profile and dispatch to store
      this.authService.getUserProfile(userId).then((userProfile) => {
        this.store.dispatch(signUserIn({ user: userProfile }));
      });
    }
  }

  async onSubmit() {
    this.isLoading = true;
    try {
      const authMethod = this.isSignUp
        ? this.authService.emailSignUp.bind(this.authService)
        : this.authService.emailSignIn.bind(this.authService);
      const user = await authMethod(this.email, this.password);
      const userProfile = {
        id: user.uid,
        displayName: user.displayName,
        email: user.email,
        emailVerified: user.emailVerified,
        phoneNumber: user.phoneNumber ?? null,
        refreshToken: user.refreshToken,
        username: this.username,
      } as UserProfile;

      this.store.dispatch(signUserIn({ user: userProfile }));
      console.log(
        this.isSignUp ? 'Sign up successful' : 'Sign in successful',
        user,
      );
      this.modalCtrl.dismiss();

      const userId = this.authService.getUserId();
      if (userId) {
        await this.firebaseDbService.addOrUpdateUser(userId, {
          email: user.email,
          displayName: user.displayName,
          username: this.username,
        });

        const newThread = {
          title: 'Sample Thread Title',
          avatar: 'Wikipedia',
          content: [
            { human: 'hey', ai: 'Hey there' },
            { human: 'how are you', ai: 'im good' },
          ],
        };
        const newThread2 = {
          title: 'Sample Thread Title2',
          avatar: 'YouTube',
          content: [
            { human: 'this is a test message for number 2', ai: 'Hey there nice on number 3' },
            { human: 'how are you 2', ai: 'im good how are you 2' },
          ],
        };

        await this.firebaseDbService.addThreadToUser(userId, newThread);
        await this.firebaseDbService.addThreadToUser(userId, newThread2);
      }
    } catch (error) {
      console.error(
        this.isSignUp ? 'Error signing up:' : 'Error signing in:',
        error,
      );
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
        await this.firebaseDbService.addOrUpdateUser(userId, {
          email: user.email,
          displayName: user.displayName,
        });

        const newThread = {
          title: 'Sample Thread Title',
          avatar: 'YouTube',
          content: [
            { human: 'hey', ai: 'Hey there' },
            { human: 'how are you', ai: 'im good' },
          ],
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
  id: string;
  displayName: string;
  email: string;
  emailVerified: boolean;
  phoneNumber: string | null;
  refreshToken: string;
  username: string;
}
