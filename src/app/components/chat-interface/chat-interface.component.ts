import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, switchMap, filter, combineLatest } from 'rxjs';
import { Threads } from 'src/app/events/chat.reducer';
import {
  selectCurrentThread,
  selectCurrentSelectedTool,
  selectChatHistory,
  processingStatus,
} from 'src/app/events/chat.selectors';
import {
  ChatHistory,
  FirestoreService,
} from 'src/app/services/firestore.service';
import { AuthService } from 'src/app/services/auth.service';
import {
  getWikipediaInfo,
  getYoutubeInfo,
  loadChatHistory,
  processingState,
  searchDocuments,
} from 'src/app/events/chat.actions';

@Component({
  selector: 'app-chat-interface',
  templateUrl: './chat-interface.component.html',
  styleUrls: ['./chat-interface.component.scss'],
})
export class ChatInterfaceComponent implements OnInit {
  public getActiveThread$: Observable<Threads>;
  public currentTool$: Observable<string>;
  public chatHistory$: Observable<ChatHistory[]>;
  public processingState$: Observable<boolean>;
  public isNewThread: boolean = false;
  public currentTool: string = '';
  public newThreadInput: string = '';
  public userInput: string = '';

  constructor(
    private store: Store,
    private firestoreService: FirestoreService,
    private authService: AuthService,
  ) {
    this.getActiveThread$ = this.store.select(selectCurrentThread);
    this.currentTool$ = this.store.select(selectCurrentSelectedTool);
    this.chatHistory$ = this.store.select(selectChatHistory);
    this.processingState$ = this.store.select(processingStatus);
  }

  ngOnInit() {
    combineLatest([this.getActiveThread$, this.currentTool$])
      .pipe(
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
        }),
      )
      .subscribe({
        next: (content: ChatHistory[]) => {
          this.store.dispatch(loadChatHistory({ chatHistory: content }));
        },
        error: (error) => {
          console.error('Error fetching thread content:', error);
        },
      });
  }

  startNewThread() {
    if (this.currentTool === 'Wikipedia') {
      this.store.dispatch(getWikipediaInfo({ topic: this.newThreadInput }));
    } else if (this.currentTool === 'YouTube') {
      this.store.dispatch(getYoutubeInfo({ url: this.newThreadInput }));
    } else {
      console.warn(`Unsupported tool: ${this.currentTool}`);
    }
    this.store.dispatch(processingState({ processing: true }))
    this.newThreadInput = '';
  }

  sendMessage() {
    if (this.userInput.trim()) {
      this.store.dispatch(searchDocuments({ query: this.userInput }));
      this.userInput = '';
    }
  }
}
