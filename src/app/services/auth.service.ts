import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import { environment } from '../../environments/environment';
import { Store } from '@ngrx/store';
import { signUserIn } from '../events/chat.actions';
import { doc, getDoc, getFirestore } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth;
  private token: string | null = null;
  private userId: string | null = null;
  private db;

  constructor(private store: Store) {
    const app = initializeApp(environment.firebaseConfig);
    this.auth = getAuth(app);
    this.db = getFirestore(app);
    setPersistence(this.auth, browserLocalPersistence); // Ensure persistence is set to local storage

    // Listen for auth state changes
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        this.token = await user.getIdToken();
        this.userId = user.uid;
        console.log('Found User');
        await this.dispatchUserToStore(user);
      } else {
        this.token = null;
        this.userId = null;
      }
    });
  }

  private async dispatchUserToStore(user: User) {
    try {
      const userProfile = await this.getUserProfile(user.uid);
      const users = {
        id: user.uid,
        displayName: userProfile.displayName || '',
        email: userProfile.email || '',
        emailVerified: userProfile.emailVerified || false,
        phoneNumber: userProfile.phoneNumber || null,
        refreshToken: userProfile.refreshToken || '',
        username: userProfile.username || '',
      };
      console.log('Dispatching user to store:', userProfile);
      this.store.dispatch(signUserIn({ user: users }));
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }

  async getUserProfile(userId: string): Promise<any> {
    try {
      const userRef = doc(this.db, 'users', userId);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        return userDoc.data();
      } else {
        console.log('No such document!');
        return null;
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  async emailSignUp(email: string, password: string): Promise<User> {
    const userCredential = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password,
    );
    this.token = await userCredential.user.getIdToken();
    this.userId = userCredential.user.uid;
    return userCredential.user;
  }

  async emailSignIn(email: string, password: string): Promise<User> {
    const userCredential = await signInWithEmailAndPassword(
      this.auth,
      email,
      password,
    );
    this.token = await userCredential.user.getIdToken();
    this.userId = userCredential.user.uid;
    return userCredential.user;
  }

  async googleSignIn(): Promise<User> {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(this.auth, provider);
    this.token = await userCredential.user.getIdToken();
    this.userId = userCredential.user.uid;
    return userCredential.user;
  }

  async signOut() {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error('Sign-out error:', error);
      throw error;
    }
  }

  getToken(): string | null {
    return this.token;
  }

  getUserId(): string | null {
    return this.userId;
  }
}
