import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { initializeApp } from 'firebase/app';
import { environment } from '../../environments/environment';
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
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
      const userRef = doc(this.db, 'users', userId);
      await setDoc(userRef, userData, { merge: true });
      console.log('User data added/updated successfully');
    } catch (error) {
      console.error('Error adding/updating user data:', error);
    }
  }

  async addThreadToUser(userId: string, thread: any): Promise<void> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('User is not authenticated');
    }
    try {
      const threadsCollectionRef = collection(
        this.db,
        `users/${userId}/threads`,
      );
      const docRef = await addDoc(threadsCollectionRef, thread);
      console.log('Thread added with ID:', docRef.id);
    } catch (error) {
      console.error("Error adding thread to user's subcollection:", error);
    }
  }

  async getThreadById(userId: string, threadId: string): Promise<any> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('User is not authenticated');
    }
    try {
      const threadRef = doc(this.db, `users/${userId}/threads`, threadId);
      const threadDoc = await getDoc(threadRef);
      if (threadDoc.exists()) {
        return { id: threadDoc.id, ...threadDoc.data() };
      } else {
        console.log('No such thread!');
        return null;
      }
    } catch (error) {
      console.error('Error getting thread:', error);
      throw error;
    }
  }

  async getUserThreads(userId: string): Promise<any[]> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('User is not authenticated');
    }
    try {
      const threadsCollectionRef = collection(
        this.db,
        `users/${userId}/threads`,
      );
      const querySnapshot = await getDocs(threadsCollectionRef);
      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data['title'],
          avatar: data['avatar'],
          timeStamp: data['timeStamp'],
        };
      });
    } catch (error) {
      console.error('Error getting user threads:', error);
      throw error;
    }
  }

  async getThreadContent(userId: string, threadId: string): Promise<any[]> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('User is not authenticated');
    }
    try {
      const threadRef = doc(this.db, `users/${userId}/threads`, threadId);
      const threadDoc = await getDoc(threadRef);
      if (threadDoc.exists()) {
        const data = threadDoc.data();
        return data['content'] || [];
      } else {
        console.log('No such thread!');
        return [];
      }
    } catch (error) {
      console.error('Error getting thread content:', error);
      throw error;
    }
  }

  async addNewThreadToUser(
    userId: string,
    threadData: Omit<Threads, 'id' | 'content'> & {
      url: string;
      documents: any[];
      timeStamp: string;
      content: ChatHistory[];
    },
  ): Promise<string> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('User is not authenticated');
    }
    try {
      const threadsCollectionRef = collection(
        this.db,
        `users/${userId}/threads`,
      );
      const newThreadRef = await addDoc(threadsCollectionRef, {
        title: threadData.title,
        avatar: threadData.avatar,
        content: threadData.content ?? [],
        url: threadData.url,
        documents: threadData.documents,
        timeStamp: threadData.timeStamp,
      });
      console.log('New thread added with ID:', newThreadRef.id);
      return newThreadRef.id;
    } catch (error) {
      console.error('Error adding new thread to user:', error);
      throw error;
    }
  }

  async addContentToThread(
    userId: string,
    threadId: string,
    newContent: ChatHistory,
  ): Promise<void> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('User is not authenticated');
    }
    try {
      const threadRef = doc(this.db, `users/${userId}/threads`, threadId);
      await updateDoc(threadRef, {
        content: arrayUnion(newContent),
      });
      console.log('Content added to thread successfully');
    } catch (error) {
      console.error('Error adding content to thread:', error);
      throw error;
    }
  }
}

interface Threads {
  id: string;
  title: string;
  avatar: string;
  content: ChatHistory[];
}

export interface ChatHistory {
  human: string;
  ai: string;
}
