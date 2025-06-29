import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs';

import { GameDataService } from '../../services/game-data.service';
import { AppActions } from '../app.actions';
import { ItemActions } from './item.actions';

// Seed loader
export const loadItemsSeed$ = createEffect(
  (actions$ = inject(Actions), data = inject(GameDataService)) =>
    actions$.pipe(
      // ofType(ItemActions.loadItemsSeed),
      ofType(AppActions.loadSeeds),
      map(() => {
        const items = data.getAllItems();
        console.log('loadItemsSeed found items: ', items);
        return ItemActions.loadItemsSeedSuccess({ items });
      }),
    ),
  { functional: true },
);

// Main entry point - API loader (stub for now)
export const loadItems$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(ItemActions.loadItems),
      // Replace with real API call later
      // Will just use `loadItemsSuccess`, not `loadItemsAPISuccess`
      map(() =>
        ItemActions.loadItemsFailure({
          error: 'API not implemented',
        }),
      ),
    ),
  { functional: true },
);
