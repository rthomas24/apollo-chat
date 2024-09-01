import { createAction, props } from '@ngrx/store';

export const setActiveTool = createAction(
  '[Chat] Set Current active tool',
  props<{tool: string}>(),
);