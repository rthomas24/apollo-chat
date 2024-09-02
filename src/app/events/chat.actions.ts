import { createAction, props } from '@ngrx/store';
import { UserProfile } from '../components/sign-up/sign-up.component';
import { Threads } from './chat.reducer';

export const setActiveTool = createAction(
  '[Chat] Set Current active tool',
  props<{ tool: string }>(),
);

export const signUserIn = createAction(
  '[Chat] Set user properties',
  props<{ user: UserProfile }>(),
);

export const storeUserThreads = createAction(
  '[Chat] Set user threads',
  props<{ threads: Threads[] }>(),
);

export const selectedThread = createAction(
  '[Chat] Set user threads',
  props<{ thread: Threads }>(),
);

