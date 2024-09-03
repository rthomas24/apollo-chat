import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, Observable, take } from 'rxjs';
import { Threads } from 'src/app/events/chat.reducer';
import { selectCurrentSelectedTool, selectUserThreads } from 'src/app/events/chat.selectors';
import { addNewThread, selectedThread } from 'src/app/events/chat.actions';
import { FirestoreService } from 'src/app/services/firestore.service';
import { AuthService } from 'src/app/services/auth.service';
import * as moment from 'moment';

@Component({
  selector: 'app-threads',
  templateUrl: './threads.component.html',
  styleUrls: ['./threads.component.scss'],
})
export class ThreadsComponent implements OnInit {
  public getThreads$: Observable<Threads[]>;
  public selectedTool$: Observable<string>;

  filteredThreads: Threads[] = [];
  selectedThread: Threads | null = null;

  constructor(private store: Store, private firestoreService: FirestoreService, private authService: AuthService) {
    this.getThreads$ = this.store.select(selectUserThreads);
    this.selectedTool$ = this.store.select(selectCurrentSelectedTool);
  }

  ngOnInit() {
    this.getThreads$.pipe(
      filter(threads => threads.length > 0),
    ).subscribe(threads => {
      this.filteredThreads = threads;
      this.selectThread(threads[0]);
    });
  }

  selectThread(thread: Threads) {
    this.selectedThread = thread;
    this.store.dispatch(selectedThread({ thread }));
  }

  searchThreads(event: any) {
    const query = event.target.value.toLowerCase();
    this.getThreads$.pipe(
      filter(threads => threads.length > 0),
      take(1)
    ).subscribe(threads => {
      this.filteredThreads = threads.filter((thread) =>
        thread.title.toLowerCase().includes(query)
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
        timeStamp: moment().toISOString()
      } as unknown as Threads;
      this.store.dispatch(addNewThread({ thread }));
    });
  }
}
