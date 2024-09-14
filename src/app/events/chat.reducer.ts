import { createReducer, on } from '@ngrx/store';
import {
  addNewThread,
  loadChatHistory,
  processingState,
  searchDocuments,
  searchDocumentsSuccess,
  selectedThread,
  setActiveTool,
  signUserIn,
  storeUserThreads,
  getYoutubeInfoSuccess,
} from './chat.actions';
import { UserProfile } from '../components/sign-up/sign-up.component';
import * as moment from 'moment';
import { ChatHistory } from '../services/firestore.service';

export const chatFeatureKey = 'chat-key';

export interface ChatState {
  currentSelectedTool: string;
  threads: Threads[];
  userProfile: UserProfile;
  currentSelectedThread: Threads;
  currentChatHistory: ChatHistory[];
  currentlyProcessing: boolean;
  currentVideoInfo: YoutubeInfo | null;
}

export interface YoutubeInfo {
  title: string;
  description: string;
  viewCount: number;
  summary: any[];
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
    avatar: '',
    timeStamp: '',
    url: ''
  },
  currentChatHistory: [],
  currentlyProcessing: false,
  currentVideoInfo: null,
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
    const sortedThreads = [...threads].sort(
      (a, b) => moment(b.timeStamp).valueOf() - moment(a.timeStamp).valueOf(),
    );
    return {
      ...state,
      threads: sortedThreads,
      currentSelectedThread: sortedThreads[0] || state.currentSelectedThread,
    };
  }),
  on(selectedThread, (state: ChatState, { thread }) => {
    return {
      ...state,
      currentSelectedThread: thread,
    };
  }),
  on(addNewThread, (state: ChatState, { thread }) => {
    const threads = [thread, ...state.threads];
    return {
      ...state,
      threads,
    };
  }),
  on(loadChatHistory, (state: ChatState, { chatHistory }) => {
    return {
      ...state,
      currentChatHistory: chatHistory,
    };
  }),
  on(searchDocuments, (state: ChatState, { query }) => {
    const newChatHistoryEntry = {
      human: query,
      ai: '',
    };

    return {
      ...state,
      currentChatHistory: [...state.currentChatHistory, newChatHistoryEntry],
    };
  }),
  on(searchDocumentsSuccess, (state: ChatState, { aiResponse }) => {
    const updatedChatHistory = [...state.currentChatHistory];
    if (updatedChatHistory.length > 0) {
      const lastMessageIndex = updatedChatHistory.length - 1;
      const lastMessage = { ...updatedChatHistory[lastMessageIndex] };
      if (lastMessage.human) {
        lastMessage.ai += aiResponse;
        updatedChatHistory[lastMessageIndex] = lastMessage;
      }
    }
    return {
      ...state,
      currentChatHistory: updatedChatHistory,
    };
  }),
  on(processingState, (state: ChatState, { processing }) => {
    return {
      ...state,
      currentlyProcessing: processing,
    };
  }),
  on(getYoutubeInfoSuccess, (state: ChatState, { response }) => {
    const updatedChatHistory = [...state.currentChatHistory];
    if (updatedChatHistory.length > 0) {
      const lastMessageIndex = updatedChatHistory.length - 1;
      const lastMessage = { ...updatedChatHistory[lastMessageIndex] };
      if (lastMessage.ai) {
        lastMessage.ai += `\n\nVideo Information:\nTitle: ${response.title}\nDescription: ${response.description}\nView Count: ${response.viewCount}`;
        updatedChatHistory[lastMessageIndex] = lastMessage;
      }
    }
    return {
      ...state,
      currentChatHistory: updatedChatHistory,
      currentVideoInfo: {
        title: response.title,
        description: response.description,
        viewCount: response.viewCount,
        summary: response.summary,
      },
    };
  }),
);

export interface Threads {
  id: string;
  title: string;
  avatar: string;
  timeStamp: string;
  newThread?: boolean;
  url: string
}
