import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs';

import { ALL_EFFECTS } from '../../data/game-catalogs';
import { AppActions } from '../app.actions';
import { EffectActions } from './effect.actions';

// Seed loader
export const seedAllEffects$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(AppActions.loadAllSeeds),
      // Directly pass static catalog
      map(() => EffectActions.seedAllEffectsSuccess({ effects: ALL_EFFECTS })),
    ),
  { functional: true },
);

// Main entry point - API loader (stub for now)
export const loadAllEffects$ = createEffect(
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
