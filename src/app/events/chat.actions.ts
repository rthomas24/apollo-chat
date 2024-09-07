import { createAction, props } from '@ngrx/store';
import { UserProfile } from '../components/sign-up/sign-up.component';
import { Threads } from './chat.reducer';
import { WikipediaResults } from '../services/api.service';
import { ChatHistory } from '../services/firestore.service';

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

export const searchDocuments = createAction(
  '[Chat] Search Documents',
  props<{ query: string }>(),
);

export const searchDocumentsSuccess = createAction(
  '[Chat] Search Documents Success',
  props<{ aiResponse: string }>(),
);

export const searchDocumentsError = createAction(
  '[Chat] Search Documents Error',
  props<{ error: any }>(),
);

export const getThreadDocuments = createAction(
  '[Chat] Get Thread Documents',
  props<{ userId: string; threadId: string }>(),
);

export const getThreadDocumentsSuccess = createAction(
  '[Chat] Get Thread Documents Success',
  props<{ message: string }>(),
);

export const getThreadDocumentsError = createAction(
  '[Chat] Get Thread Documents Error',
  props<{ error: any }>(),
);

export const loadChatHistory = createAction(
  '[Chat] Load Chat History',
  props<{ chatHistory: ChatHistory[] }>(),
);

export const getYoutubeInfo = createAction(
  '[Chat] Get Youtube Info',
  props<{ url: string }>(),
);
export const getYoutubeInfoSuccess = createAction(
  '[Chat] Get Youtube Info Success',
  props<{ response: any, threadId: string }>(),
);
export const getYoutubeInfoError = createAction(
  '[Chat] Get Youtube Info Error',
  props<{ error: Error }>(),
);
