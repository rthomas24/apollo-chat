import { createFeatureSelector, createSelector } from '@ngrx/store';
import { chatFeatureKey, ChatState } from './chat.reducer';

const chatDataState = createFeatureSelector<ChatState>(
  chatFeatureKey,
);

export const selectCurrentSelectedTool = createSelector(
    chatDataState,
    (state: ChatState) => state.currentSelectedTool,
);