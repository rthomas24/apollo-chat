import { createReducer, on } from "@ngrx/store";
import { setActiveTool } from "./chat.actions";


export const chatFeatureKey = 'chat-key';

export interface ChatState {
    currentSelectedTool: string,
    threadHistory: ThreadHistory[]
}

const initialState: ChatState = {
    currentSelectedTool: 'wikipedia',
    threadHistory: []
};

export const chatReducer = createReducer(
    initialState,
    on(setActiveTool, (state: ChatState, { tool }) => {
        return {
            ...state,
            currentSelectedTool: tool,
        };
    }),
)


export interface ThreadHistory {
    id: string
    title: string
    avatar: string
}