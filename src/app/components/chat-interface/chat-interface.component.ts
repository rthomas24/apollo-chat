import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, switchMap, filter } from 'rxjs';
import { Threads } from 'src/app/events/chat.reducer';
import { selectCurrentThread } from 'src/app/events/chat.selectors';
import { FirestoreService } from 'src/app/services/firestore.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-chat-interface',
  templateUrl: './chat-interface.component.html',
  styleUrls: ['./chat-interface.component.scss'],
})
export class ChatInterfaceComponent implements OnInit {
  public getActiveThread$: Observable<Threads>;
  public chatHistory: ChatHistory[] = [];

  constructor(
    private store: Store,
    private firestoreService: FirestoreService,
    private authService: AuthService
  ) {
    this.getActiveThread$ = this.store.select(selectCurrentThread);
  }

  ngOnInit() {
    this.getActiveThread$.pipe(
      filter((thread): thread is Threads => !!thread?.id),
      switchMap((thread) => {
        const userId = this.authService.getUserId();
        if (!userId) {
          throw new Error('User is not authenticated');
        }
        return this.firestoreService.getThreadContent(userId, thread.id);
      })
    ).subscribe({
      next: (content) => {
        this.chatHistory = content;
      },
      error: (error) => {
        console.error('Error fetching thread content:', error);
        this.chatHistory = [];
      }
    });
  }
}

export interface ChatHistory {
  human: string;
  ai: string;
}