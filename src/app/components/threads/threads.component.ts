import { Component, OnInit } from '@angular/core';

interface ThreadHistory {
  id: string;
  title: string;
  avatar: string;
}

@Component({
  selector: 'app-threads',
  templateUrl: './threads.component.html',
  styleUrls: ['./threads.component.scss'],
})
export class ThreadsComponent implements OnInit {
  threads: ThreadHistory[] = [
    { id: '1', title: 'Wikipedia Thread 1', avatar: 'assets/Wikipedia.svg' },
    { id: '2', title: 'YouTube Thread 1', avatar: 'assets/YouTube.svg' },
    { id: '3', title: 'Wikipedia Thread 2', avatar: 'assets/Wikipedia.svg' },
    { id: '4', title: 'YouTube Thread 2', avatar: 'assets/YouTube.svg' },
  ];

  filteredThreads: ThreadHistory[] = [];
  selectedThread: ThreadHistory | null = null;

  constructor() {}

  ngOnInit() {
    this.filteredThreads = this.threads;
    if (this.threads.length > 0) {
      this.selectedThread = this.threads[0];
    }
  }

  selectThread(thread: ThreadHistory) {
    this.selectedThread = thread;
  }

  searchThreads(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredThreads = this.threads.filter(thread =>
      thread.title.toLowerCase().includes(query)
    );
  }

  createNewThread() {
    // Implement the logic to create a new thread here
    console.log('Creating a new thread');
  }
}
