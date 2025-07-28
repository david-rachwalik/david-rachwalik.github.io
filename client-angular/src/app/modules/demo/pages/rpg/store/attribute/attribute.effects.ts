import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs';

import { GameDataService } from '../../services/game-data.service';
import { AppActions } from '../app.actions';
import { AttributeActions } from './attribute.actions';

// Seed loader
export const seedAllAttributes$ = createEffect(
  (actions$ = inject(Actions), data = inject(GameDataService)) =>
    actions$.pipe(
      // ofType(AttributeActions.loadAttributesSeed),
      ofType(AppActions.loadAllSeeds),
      map(() => {
        try {
          const attributes = data.getAllAttributes();
          console.log('loadAttributesSeed found attributes: ', attributes);
          return AttributeActions.seedAllAttributesSuccess({ attributes });
        } catch (error) {
          return AttributeActions.seedAllAttributesFailure({
            error: String(error),
          });
        }
      }),
    ),
  { functional: true },
);

// Main entry point - API loader (stub for now)
export const loadAllAttributes$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(AttributeActions.loadAllAttributes),
      // Replace with real API call later
      // Will just use `loadAttributesSuccess`, not `loadAttributesAPISuccess`
      map(() =>
        AttributeActions.loadAllAttributesFailure({
          error: 'API not implemented',
        }),
      ),
    ),
  { functional: true },
);
