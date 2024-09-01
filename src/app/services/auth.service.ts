import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth;
  private token: string | null = null;
  private userId: string | null = null;

  constructor() {
    const app = initializeApp(environment.firebaseConfig);
    this.auth = getAuth(app);
  }

  async emailSignUp(email: string, password: string): Promise<User> {
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
    this.token = await userCredential.user.getIdToken();
    this.userId = userCredential.user.uid;
    return userCredential.user;
  }

  async emailSignIn(email: string, password: string): Promise<User> {
    const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
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
