import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, withLatestFrom } from 'rxjs';

import { GameDataService } from '../../services/game-data.service';
import { AttributeActions } from './attribute.actions';
import { attributeFeature } from './attribute.reducer';

// This file's whole approach works but is different than what I went with

// --- Approach Flow ---
// 1. App dispatches `AttributeActions.loadAttributes` (e.g. from layout component)
// 2. `loadAttributes$` effect checks if the state is seeded
//   - if not seeded, it dispatches `AttributeActions.loadAttributesSeed`
//   - if seeded, it dispatches `AttributeActions.loadAttributesApi`
// 3. loadAttributesSeed$ effect listens for `AttributeActions.loadAttributesSeed` and
//    loads the seed data, then dispatches `AttributeActions.loadAttributesSuccess({ attributes })`
// 4. `loadAttributesSeedSuccess$` effect listens for `AttributeActions.loadAttributesSuccess`
//    (dispatched by previous effect) and then dispatches `AttributeActions.loadAttributesApi()`

// --- What I Went With ---
// 1. App dispatches `AppActions.loadSeeds` (e.g. from layout component)
// 2. `loadSeeds$` effect checks if the state is seeded
//   - if not seeded, it dispatches each feature's respective seed
//     (e.g. `AttributeActions.loadAttributesSeed`...)

@Injectable()
export class AttributeEffects {
  // Main entry point
  loadAttributes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AttributeActions.loadAttributes),
      withLatestFrom(this.store.select(attributeFeature.selectAttributeState)),
      map(([, state]) => {
        if (!state.seeded) {
          return AttributeActions.loadAttributesSeed();
        }
        return AttributeActions.loadAttributesAPI();
      }),
    ),
  );

  // Seed loader
  loadAttributesSeed$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AttributeActions.loadAttributesSeed),
      map(() => {
        const attributes = this.gameData.getAllAttributes();
        return AttributeActions.loadAttributesSeedSuccess({ attributes });
      }),
    ),
  );

  // Chain: On seed success, trigger API load
  loadAttributesSeedSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AttributeActions.loadAttributesSeedSuccess),
      map(() => AttributeActions.loadAttributesAPI()),
    ),
  );

  // API loader (stub for now)
  loadAttributesApi$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AttributeActions.loadAttributesAPI),
      // Replace with real API call later
      // Will just use `loadAttributesSuccess` instead of `loadAttributesAPISuccess`
      map(() =>
        AttributeActions.loadAttributesFailure({
          error: 'API not implemented',
        }),
      ),
    ),
  );

  constructor(
    private actions$: Actions,
    private store: Store,
    private gameData: GameDataService,
  ) {}
}
