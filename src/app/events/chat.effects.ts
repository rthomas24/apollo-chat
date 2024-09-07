import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';
import {
  switchMap,
  catchError,
  map,
  mergeMap,
  withLatestFrom,
} from 'rxjs/operators';
import {
  getWikipediaInfo,
  getWikipediaInfoError,
  getWikipediaInfoSuccess,
  searchDocuments,
  searchDocumentsError,
  searchDocumentsSuccess,
  storeUserThreads,
  getThreadDocuments,
  getThreadDocumentsSuccess,
  getThreadDocumentsError,
} from './chat.actions';
import { ApiService, WikipediaResults } from '../services/api.service';
import { FirestoreService } from '../services/firestore.service';
import { AuthService } from '../services/auth.service';
import * as moment from 'moment';
import { Store } from '@ngrx/store';
import { ChatState } from './chat.reducer';
import { selectCurrentThread, selectUserProfile } from './chat.selectors';

@Injectable()
export class ApolloEffects {
  constructor(
    private actions$: Actions,
    private apiService: ApiService,
    private firestoreService: FirestoreService,
    private authService: AuthService,
    private store: Store<{ chat: ChatState }>,
  ) {}

  getWikipediaInfo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getWikipediaInfo),
      switchMap(({ topic }) =>
        this.apiService.getWikipediaSummary(topic).pipe(
          mergeMap((response: WikipediaResults) => {
            const userId = this.authService.getUserId();
            if (!userId) {
              throw new Error('User is not authenticated');
            }
            const summary = response.summary;
            return from(
              this.firestoreService.addNewThreadToUser(userId, {
                title: response.title,
                avatar: 'Wikipedia',
                url: response.url,
                content: [{ ai: summary, human: topic }],
                documents: response.content,
                timeStamp: moment().toISOString(),
              }),
            ).pipe(
              map((threadId) =>
                getWikipediaInfoSuccess({ response, threadId }),
              ),
            );
          }),
          catchError((error) => {
            console.log(error);
            return of(getWikipediaInfoError({ error: error.toString() }));
          }),
        ),
      ),
    ),
  );

  updateUserThreads$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getWikipediaInfoSuccess),
      switchMap(() => {
        const userId = this.authService.getUserId();
        if (!userId) {
          throw new Error('User is not authenticated');
        }
        return from(this.firestoreService.getUserThreads(userId)).pipe(
          map((threads) => storeUserThreads({ threads })),
          catchError((error) => of()),
        );
      }),
    ),
  );

  searchDocuments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(searchDocuments),
      withLatestFrom(
        this.store.select(selectCurrentThread),
        this.store.select(selectUserProfile),
      ),
      switchMap(([action, currentThread, userProfile]) => {
        const userId = userProfile.id;
        const threadId = currentThread.id;
        return this.apiService
          .searchDocuments(userId, threadId, action.query)
          .pipe(
            map((aiResponse: string) => searchDocumentsSuccess({ aiResponse })),
            catchError((error) =>
              of(searchDocumentsError({ error: error.toString() })),
            ),
          );
      }),
    ),
  );

  getThreadDocuments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getThreadDocuments),
      switchMap(({ userId, threadId }) =>
        this.apiService.getThreadDocuments(userId, threadId).pipe(
          map((message) => getThreadDocumentsSuccess({ message })),
          catchError((error) => of(getThreadDocumentsError({ error }))),
        ),
      ),
    ),
  );
}
