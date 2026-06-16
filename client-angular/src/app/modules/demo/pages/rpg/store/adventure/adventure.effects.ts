import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { filter, map, mergeMap, switchMap, take } from 'rxjs';

import { Store } from '@ngrx/store';
import { Adventure } from '../../models/adventure';
import { GameSaveDexieService } from '../../services/game-save-dexie.service';
import { AppActions } from '../app.actions';
import { selectCurrentSlotId } from '../app.selectors';
import { AdventureActions } from './adventure.actions';

// #region 🔸 Database Effects 🔸

export const addAdventure$ = createEffect(
  (actions$ = inject(Actions), db = inject(GameSaveDexieService)) =>
    actions$.pipe(
      ofType(AdventureActions.addAdventure),
      mergeMap(async ({ adventure }) => {
        try {
          await db.saveAdventure(adventure);
          return AdventureActions.addAdventureSuccess({ adventure });
        } catch (error) {
          return AdventureActions.addAdventureFailure({ error: String(error) });
        }
      }),
    ),
  { functional: true },
);

export const loadAllAdventures$ = createEffect(
  (actions$ = inject(Actions), db = inject(GameSaveDexieService)) =>
    actions$.pipe(
      ofType(AdventureActions.loadAllAdventures),
      mergeMap(async () => {
        try {
          const adventures = await db.loadAllAdventures();
          return AdventureActions.loadAllAdventuresSuccess({ adventures });
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          return AdventureActions.loadAllAdventuresFailure({
            error: errorMessage,
          });
        }
      }),
    ),
  { functional: true },
);

export const loadAdventure$ = createEffect(
  (
    actions$ = inject(Actions),
    db = inject(GameSaveDexieService),
    store = inject(Store),
  ) =>
    actions$.pipe(
      ofType(AppActions.play, AdventureActions.loadAdventure),
      // This asynchronous waiter safeguards page refreshes (use with AppActions.play)
      switchMap((action) =>
        store.select(selectCurrentSlotId).pipe(
          filter((id): id is string => !!id),
          take(1), // waits for first truthy value
          map((storeSlotId) => ({ action, storeSlotId })),
        ),
      ),
      mergeMap(async ({ action, storeSlotId }) => {
        try {
          // Use ID if action specifically requested or use Store's active save slot
          const slotId = 'id' in action ? action.id : storeSlotId;

          if (!slotId) {
            throw new Error(
              '[loadAdventure] Failed: No ID provided or active in Store.',
            );
          }

          const adventure = await db.loadAdventure(slotId);
          if (!adventure) throw new Error(`Adventure not found: ${slotId}`);

          return AdventureActions.loadAdventureSuccess({ adventure });
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          return AdventureActions.loadAdventureFailure({
            error: errorMessage,
          });
        }
      }),
    ),
  { functional: true },
);

export const saveAdventure$ = createEffect(
  (actions$ = inject(Actions), db = inject(GameSaveDexieService)) =>
    actions$.pipe(
      ofType(AdventureActions.saveAdventure),
      mergeMap(async ({ id, changes }) => {
        try {
          const current = await db.loadAdventure(id);
          if (!current) throw new Error(`Adventure not found: ${id}`);
          // Safely cast the merged object to strict model
          const updated = { ...current, ...changes } as Adventure;
          await db.saveAdventure(updated);
          return AdventureActions.saveAdventureSuccess({ adventure: updated });
        } catch (error) {
          return AdventureActions.saveAdventureFailure({
            error: String(error),
          });
        }
      }),
    ),
  { functional: true },
);

export const removeAdventure$ = createEffect(
  (actions$ = inject(Actions), db = inject(GameSaveDexieService)) =>
    actions$.pipe(
      ofType(AdventureActions.removeAdventure),
      mergeMap(async ({ id }) => {
        try {
          await db.deleteAdventure(id);
          return AdventureActions.removeAdventureSuccess({ id });
        } catch (error) {
          return AdventureActions.removeAdventureFailure({
            error: String(error),
          });
        }
      }),
    ),
  { functional: true },
);
// #endregion
