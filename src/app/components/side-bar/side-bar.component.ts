import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { setActiveTool } from 'src/app/events/chat.actions';
import { selectCurrentSelectedTool } from 'src/app/events/chat.selectors';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
})
export class SideBarComponent {
  public activeIcon$: Observable<string>

  icons = [
    { name: 'wikipedia', src: 'assets/Wikipedia.svg' },
    { name: 'youtube', src: 'assets/YouTube.svg' },
  ];

  constructor(private store: Store) {
    this.activeIcon$ = this.store.select(selectCurrentSelectedTool)
  }


  setActiveIcon(iconName: string) {
    this.store.dispatch(setActiveTool({ tool: iconName}))
  }
}
