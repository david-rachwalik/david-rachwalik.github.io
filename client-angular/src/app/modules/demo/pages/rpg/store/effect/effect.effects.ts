import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs';

import { GameDataService } from '../../services/game-data.service';
import { AppActions } from '../app.actions';
import { EffectActions } from './effect.actions';

// Seed loader
export const seedAllEffects$ = createEffect(
  (actions$ = inject(Actions), data = inject(GameDataService)) =>
    actions$.pipe(
      ofType(AppActions.loadAllSeeds),
      map(() => {
        try {
          const effects = data.getAllEffects();
          console.log('loadEffectsSeed found effects: ', effects);
          return EffectActions.seedAllEffectsSuccess({ effects });
        } catch (error) {
          return EffectActions.seedAllEffectsFailure({ error: String(error) });
        }
      }),
    ),
  { functional: true },
);

// Main entry point - API loader (stub for now)
export const loadAllEffectsApi$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(EffectActions.loadAllEffects),
      // Replace with real API call later
      // Will just use `loadEffectsSuccess`, not `loadEffectsAPISuccess`
      map(() =>
        EffectActions.loadAllEffectsFailure({ error: 'API not implemented' }),
      ),
    ),
  { functional: true },
);
