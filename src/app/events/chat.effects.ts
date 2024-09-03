import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';
import {
  switchMap,
  catchError,
  map,
  delay,
  mergeMap,
  tap,
} from 'rxjs/operators';
import { getWikipediaInfo, getWikipediaInfoError, getWikipediaInfoSuccess, storeUserThreads } from './chat.actions';
import { ApiService, WikipediaResults } from '../services/api.service';
import { FirestoreService } from '../services/firestore.service';
import { AuthService } from '../services/auth.service';
import * as moment from 'moment';

@Injectable()
export class ApolloEffects {
  constructor(
    private actions$: Actions,
    private apiService: ApiService,
    private firestoreService: FirestoreService,
    private authService: AuthService
  ) {}

  getWikipediaInfo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getWikipediaInfo),
      switchMap(({ topic }) =>
        this.apiService
          .getWikipediaSummary(topic)
          .pipe(
            mergeMap((response: WikipediaResults) => {
              const userId = this.authService.getUserId();
              if (!userId) {
                throw new Error('User is not authenticated');
              }
              const summary = response.summary
              return from(this.firestoreService.addNewThreadToUser(userId, {
                title: response.title,
                avatar: 'Wikipedia',
                url: response.url,
                content: [{ai: summary, human: ''}],
                documents: response.content,
                timeStamp: moment().toISOString()
              })).pipe(
                map(threadId => getWikipediaInfoSuccess({ response, threadId }))
              );
            }),
            catchError((error) => {
              return of(getWikipediaInfoError({ error: error.toString() }))
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
          map(threads => storeUserThreads({ threads })),
          catchError(error => of())
        );
      })
    )
  );
}
