import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs';

import { GameDataService } from '../../services/game-data.service';
import { AppActions } from '../app.actions';
import { LocationActions } from './location.actions';

// Seed loader
export const loadLocationsSeed$ = createEffect(
  (actions$ = inject(Actions), data = inject(GameDataService)) =>
    actions$.pipe(
      // ofType(LocationActions.loadLocationsSeed),
      ofType(AppActions.loadSeeds),
      map(() => {
        const locations = data.getAllLocations();
        console.log('loadLocationsSeed found locations: ', locations);
        return LocationActions.loadLocationsSeedSuccess({ locations });
      }),
    ),
  { functional: true },
);

// Main entry point - API loader (stub for now)
export const loadLocations$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(LocationActions.loadLocations),
      // Replace with real API call later
      // Will just use `loadLocationsSuccess`, not `loadLocationsAPISuccess`
      map(() =>
        LocationActions.loadLocationsFailure({
          error: 'API not implemented',
        }),
      ),
    ),
  { functional: true },
);
