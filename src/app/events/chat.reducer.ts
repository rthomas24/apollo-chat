import { createReducer, on } from "@ngrx/store";
import { setActiveTool, signUserIn } from "./chat.actions";
import { UserProfile } from "../components/sign-up/sign-up.component";


export const chatFeatureKey = 'chat-key';

export interface ChatState {
    currentSelectedTool: string,
    threadHistory: ThreadHistory[],
    userProfile: UserProfile
}

const initialState: ChatState = {
    currentSelectedTool: 'wikipedia',
    threadHistory: [],
    userProfile: {
        displayName: "",
        email: "",
        emailVerified: false,
        phoneNumber: null,
        refreshToken: ""
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
)


export interface ThreadHistory {
    id: string
    title: string
    avatar: string
}