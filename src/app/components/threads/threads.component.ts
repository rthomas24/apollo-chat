import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, Observable, take } from 'rxjs';
import { Threads } from 'src/app/events/chat.reducer';
import { selectUserThreads } from 'src/app/events/chat.selectors';
import { selectedThread } from 'src/app/events/chat.actions';

@Component({
  selector: 'app-threads',
  templateUrl: './threads.component.html',
  styleUrls: ['./threads.component.scss'],
})
export class ThreadsComponent implements OnInit {
  public getThreads$: Observable<Threads[]>;

  filteredThreads: Threads[] = [];
  selectedThread: Threads | null = null;

  constructor(private store: Store) {
    this.getThreads$ = this.store.select(selectUserThreads);
  }

  ngOnInit() {
    this.getThreads$.pipe(
      filter(threads => threads.length > 0),
      take(1)
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
    // Implement the logic to create a new thread here
    console.log('Creating a new thread');
  }
}
