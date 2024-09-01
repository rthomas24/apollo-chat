import { createReducer, on } from "@ngrx/store";
import { setActiveTool } from "./chat.actions";


export const chatFeatureKey = 'chat-key';

export interface ChatState {
    currentSelectedTool: string
}

const initialState: ChatState = {
    currentSelectedTool: 'wikipedia'
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