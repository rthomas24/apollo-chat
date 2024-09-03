import { createAction, props } from '@ngrx/store';
import { UserProfile } from '../components/sign-up/sign-up.component';
import { Threads } from './chat.reducer';
import { WikipediaResults } from '../services/api.service';

export const setActiveTool = createAction(
  '[Chat] Set Current active tool',
  props<{ tool: string }>(),
);

export const signUserIn = createAction(
  '[Chat] Set user properties',
  props<{ user: UserProfile }>(),
);

export const storeUserThreads = createAction(
  '[Chat] Store user threads',
  props<{ threads: Threads[] }>(),
);

export const selectedThread = createAction(
  '[Chat] Set user threads',
  props<{ thread: Threads }>(),
);

export const addNewThread = createAction(
  '[Chat] Add new user thread',
  props<{ thread: Threads }>(),
);

export const getWikipediaInfo = createAction(
  '[Chat] Get Wikipedia info',
  props<{ topic: string }>(),
);

export const getWikipediaInfoSuccess = createAction(
  '[Chat] Get Wikipedia Info Success',
  props<{ response: WikipediaResults; threadId: string }>(),
);

export const getWikipediaInfoError = createAction(
  '[Chat] Get Wikipedia info Error',
  props<{ error: Error }>(),
);