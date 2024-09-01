import { createAction, props } from '@ngrx/store';
import { UserProfile } from '../components/sign-up/sign-up.component';

export const setActiveTool = createAction(
    '[Chat] Set Current active tool',
    props<{tool: string}>(),
);

export const signUserIn = createAction(
    '[Chat] Set user properties',
    props<{user: UserProfile}>(),
);