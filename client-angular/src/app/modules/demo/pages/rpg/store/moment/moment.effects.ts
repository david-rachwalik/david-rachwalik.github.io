import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs';

import { GameDataService } from '../../services/game-data.service';
import { AppActions } from '../app.actions';
import { MomentActions } from './moment.actions';

// Seed loader
export const loadMomentsSeed$ = createEffect(
  (actions$ = inject(Actions), data = inject(GameDataService)) =>
    actions$.pipe(
      ofType(MomentActions.loadMoments),
      map(() => {
        const moments = data.getAllMoments();
        console.log('loadMomentsSeed found moments: ', moments);
        return MomentActions.loadMomentsSeedSuccess({ moments });
      }),
    ),
  { functional: true },
);

// Main entry point - API loader (stub for now)
export const loadMoments$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      // ofType(MomentActions.loadMomentsSeed),
      ofType(AppActions.loadSeeds),
      // Replace with real API call later
      // Will just use `loadMomentsSuccess`, not `loadMomentsAPISuccess`
      map(() =>
        MomentActions.loadMomentsFailure({
          error: 'API not implemented',
        }),
      ),
    ),
  { functional: true },
);
