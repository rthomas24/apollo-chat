import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, Observable, take, switchMap, of, delay } from 'rxjs';
import { Threads } from 'src/app/events/chat.reducer';
import {
  selectCurrentSelectedTool,
  selectUserThreads,
  selectUserProfile,
} from 'src/app/events/chat.selectors';
import {
  addNewThread,
  selectedThread,
  getThreadDocuments,
} from 'src/app/events/chat.actions';
import * as moment from 'moment';

@Component({
  selector: 'app-threads',
  templateUrl: './threads.component.html',
  styleUrls: ['./threads.component.scss'],
})
export class ThreadsComponent implements OnInit {
  public getThreads$: Observable<Threads[]>;
  public selectedTool$: Observable<string>;
  public userProfile$: Observable<any>; // Add this line

  filteredThreads: Threads[] = [];
  selectedThread: Threads | null = null;

  constructor(private store: Store) {
    this.getThreads$ = this.store.select(selectUserThreads);
    this.selectedTool$ = this.store.select(selectCurrentSelectedTool);
    this.userProfile$ = this.store.select(selectUserProfile); // Add this line
  }

  ngOnInit() {
    this.getThreads$
      .pipe(filter((threads) => threads.length > 0))
      .subscribe((threads) => {
        this.filteredThreads = threads;
        this.initThread(threads[0]);
      });
  }

  initThread(thread: Threads) {
    this.selectedThread = thread;
    this.store.dispatch(selectedThread({ thread }));
  }

  selectThread(thread: Threads) {
    this.selectedThread = thread;
    this.store.dispatch(selectedThread({ thread }));

    this.userProfile$
      .pipe(
        filter((profile) => !!profile && !!profile.id),
        take(1),
        delay(2500),
        switchMap((profile) => {
          if (profile && profile.id && thread.id) {
            this.store.dispatch(
              getThreadDocuments({ userId: profile.id, threadId: thread.id }),
            );
            return of(true);
          } else {
            console.error(
              'Unable to get thread documents: missing userId or threadId',
            );
            return of(false);
          }
        }),
      )
      .subscribe();
  }

  searchThreads(event: any) {
    const query = event.target.value.toLowerCase();
    this.getThreads$
      .pipe(
        filter((threads) => threads.length > 0),
        take(1),
      )
      .subscribe((threads) => {
        this.filteredThreads = threads.filter((thread) =>
          thread.title.toLowerCase().includes(query),
        );
      });
  }

  createNewThread() {
    this.selectedTool$.pipe(take(1)).subscribe((selectedTool) => {
      const thread = {
        title: 'New Thread',
        avatar: selectedTool,
        content: [],
        newThread: true,
        timeStamp: moment().toISOString(),
      } as unknown as Threads;
      this.store.dispatch(addNewThread({ thread }));
    });
  }
}
