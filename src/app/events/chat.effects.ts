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
  constructor(private actions$: Actions) {}

}
