import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import {
  switchMap,
  catchError,
  map,
  delay,
  mergeMap,
  tap,
} from 'rxjs/operators';

@Injectable()
export class ApolloEffects {
  constructor(
    private actions$: Actions,
  ) {}

//   sendNewMessageMongo$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType(sendNewGPTMessageMongo),
//       switchMap(({ prompt, sessionId, chatHistory, tts }) =>
//         this.teacherService
//           .mongoVectorStore(prompt, sessionId, chatHistory, tts)
//           .pipe(
//             mergeMap((message: string) => [
//               sendNewGPTMessageMongoSuccess({ response: message }),
//               sendNewBanner(),
//             ]),
//             catchError((error) => of(sendNewGPTMessageMongoError({ error }))),
//           ),
//       ),
//     ),
//   );

//   newBanner$ = createEffect(
//     () =>
//       this.actions$.pipe(
//         ofType(sendNewBanner),
//         tap(() =>
//           this.messageService.add({
//             severity: 'success',
//             summary: 'Success',
//             detail: 'Request Succeeded',
//             life: 5000,
//           }),
//         ),
//       ),
//     { dispatch: false },
//   );
}
