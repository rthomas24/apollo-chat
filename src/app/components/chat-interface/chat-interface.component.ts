import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, switchMap, filter, combineLatest } from 'rxjs';
import { Threads } from 'src/app/events/chat.reducer';
import { selectCurrentThread, selectCurrentSelectedTool } from 'src/app/events/chat.selectors';
import { FirestoreService } from 'src/app/services/firestore.service';
import { AuthService } from 'src/app/services/auth.service';
import { getWikipediaInfo } from 'src/app/events/chat.actions';

@Component({
  selector: 'app-chat-interface',
  templateUrl: './chat-interface.component.html',
  styleUrls: ['./chat-interface.component.scss'],
})
export class ChatInterfaceComponent implements OnInit {
  public getActiveThread$: Observable<Threads>;
  public currentTool$: Observable<string>;
  public chatHistory: ChatHistory[] = [];
  public isNewThread: boolean = false;
  public currentTool: string = '';
  public newThreadInput: string = '';

  constructor(
    private store: Store,
    private firestoreService: FirestoreService,
    private authService: AuthService
  ) {
    this.getActiveThread$ = this.store.select(selectCurrentThread);
    this.currentTool$ = this.store.select(selectCurrentSelectedTool);
  }

  ngOnInit() {
    combineLatest([this.getActiveThread$, this.currentTool$]).pipe(
      filter(([thread, tool]) => (!!thread.id || !!thread.title) && !!tool),
      switchMap(([thread, tool]) => {
        this.currentTool = tool;
        this.isNewThread = thread.newThread || false;
        if (this.isNewThread) {
          return [];
        } else {
          const userId = this.authService.getUserId();
          if (!userId) {
            throw new Error('User is not authenticated');
          }
          return this.firestoreService.getThreadContent(userId, thread.id);
        }
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

  startNewThread() {
    this.store.dispatch(getWikipediaInfo({ topic: this.newThreadInput }))
  }
}

export interface ChatHistory {
  human: string;
  ai: string;
}