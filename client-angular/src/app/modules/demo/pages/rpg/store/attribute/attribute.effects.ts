import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs';

import { GameDataService } from '../../services/game-data.service';
import { AppActions } from '../app.actions';
import { AttributeActions } from './attribute.actions';

// Seed loader
export const loadAttributesSeed$ = createEffect(
  (actions$ = inject(Actions), data = inject(GameDataService)) =>
    actions$.pipe(
      // ofType(AttributeActions.loadAttributesSeed),
      ofType(AppActions.loadSeeds),
      map(() => {
        const attributes = data.getAllAttributes();
        console.log('loadAttributesSeed found attributes: ', attributes);
        return AttributeActions.loadAttributesSeedSuccess({ attributes });
      }),
    ),
  { functional: true },
);

// Main entry point - API loader (stub for now)
export const loadAttributes$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(AttributeActions.loadAttributes),
      // Replace with real API call later
      // Will just use `loadAttributesSuccess`, not `loadAttributesAPISuccess`
      map(() =>
        AttributeActions.loadAttributesFailure({
          error: 'API not implemented',
        }),
      ),
    ),
  { functional: true },
);
