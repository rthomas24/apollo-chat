import { createFeatureSelector, createSelector } from '@ngrx/store';
import { chatFeatureKey, ChatState } from './chat.reducer';

const chatDataState = createFeatureSelector<ChatState>(chatFeatureKey);

export const selectCurrentSelectedTool = createSelector(
  chatDataState,
  (state: ChatState) => state.currentSelectedTool,
);

export const selectUserProfile = createSelector(
  chatDataState,
  (state: ChatState) => state.userProfile,
);

export const selectUserThreads = createSelector(
  chatDataState,
  (state: ChatState) => state.threads,
);

export const selectCurrentThread = createSelector(
  chatDataState,
  (state: ChatState) => state.currentSelectedThread,
);

export const selectChatHistory = createSelector(
  chatDataState,
  (state: ChatState) => state.currentChatHistory,
);

export const processingStatus = createSelector(
  chatDataState,
  (state: ChatState) => state.currentlyProcessing,
);

export const selectCurrentVideoInfo = createSelector(
  chatDataState,
  (state: ChatState) => state.currentVideoInfo
);
