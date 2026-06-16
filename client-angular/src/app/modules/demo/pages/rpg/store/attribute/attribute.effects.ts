import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs';

import { ALL_ATTRIBUTES } from '../../data/game-catalogs';
import { AppActions } from '../app.actions';
import { AttributeActions } from './attribute.actions';

// Seed loader
export const seedAllAttributes$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(AppActions.loadAllSeeds),
      // Directly pass static catalog
      map(() =>
        AttributeActions.seedAllAttributesSuccess({
          attributes: ALL_ATTRIBUTES,
        }),
      ),
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
