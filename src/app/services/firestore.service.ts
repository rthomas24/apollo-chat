import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { initializeApp } from 'firebase/app';
import { environment } from '../../environments/environment';
import { getFirestore, doc, setDoc, collection, addDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private db;

  constructor(private authService: AuthService) {
    const app = initializeApp(environment.firebaseConfig);
    this.db = getFirestore(app);
  }

  async addOrUpdateUser(userId: string, userData: any): Promise<void> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('User is not authenticated');
    }
    try {
      const userRef = doc(this.db, "users", userId);
      await setDoc(userRef, userData, { merge: true });
      console.log("User data added/updated successfully");
    } catch (error) {
      console.error("Error adding/updating user data:", error);
    }
  }

  async addThreadToUser(userId: string, thread: any): Promise<void> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('User is not authenticated');
    }
    try {
      const threadsCollectionRef = collection(this.db, `users/${userId}/threads`);
      const docRef = await addDoc(threadsCollectionRef, thread);
      console.log("Thread added with ID:", docRef.id);
    } catch (error) {
      console.error("Error adding thread to user's subcollection:", error);
    }
  }
}