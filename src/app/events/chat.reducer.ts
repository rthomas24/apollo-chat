import { createReducer, on } from '@ngrx/store';
import { addNewThread, selectedThread, setActiveTool, signUserIn, storeUserThreads } from './chat.actions';
import { UserProfile } from '../components/sign-up/sign-up.component';

export const chatFeatureKey = 'chat-key';

export interface ChatState {
  currentSelectedTool: string;
  threads: Threads[];
  userProfile: UserProfile;
  currentSelectedThread: Threads
}

const initialState: ChatState = {
  currentSelectedTool: 'Wikipedia',
  threads: [],
  userProfile: {
    id: '',
    displayName: '',
    email: '',
    emailVerified: false,
    phoneNumber: null,
    refreshToken: '',
    username: '',
  },
  currentSelectedThread: {
      id: '',
      title: '',
      avatar: ''
  }
};

export const chatReducer = createReducer(
  initialState,
  on(setActiveTool, (state: ChatState, { tool }) => {
    return {
      ...state,
      currentSelectedTool: tool,
    };
  }),
  on(signUserIn, (state: ChatState, { user }) => {
    return {
      ...state,
      userProfile: user,
    };
  }),
  on(storeUserThreads, (state: ChatState, { threads }) => {
    return {
      ...state,
      threads,
    };
  }),
  on(selectedThread, (state: ChatState, { thread }) => {
    return {
      ...state,
      currentSelectedThread: thread,
    };
  }),
  on(addNewThread, (state: ChatState, { thread }) => {
    const threads = [thread, ...state.threads]
    return {
      ...state,
      threads,
    };
  }),
);

export interface Threads {
  id: string
  title: string
  avatar: string
  newThread?: boolean
}
