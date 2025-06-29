import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
// import { Store } from '@ngrx/store';
import { catchError, filter, map, mergeMap, of, tap } from 'rxjs';

import { Adventure } from '../../models/adventure';
import { GameDataService } from '../../services/game-data.service';
import { GameSaveService } from '../../services/game-save.service';
import { AppActions } from '../app.actions';
import { AdventureIndexActions } from './adventure-index.actions';
import { AdventureActions } from './adventure.actions';
// import { adventureFeature } from './adventure.reducer';

// const STORAGE_KEY = 'rpg-demo-game-states';

// Seed loader
export const loadAdventuresSeed$ = createEffect(
  (actions$ = inject(Actions), data = inject(GameDataService)) =>
    actions$.pipe(
      // ofType(AdventureActions.loadAdventuresSeed),
      ofType(AppActions.loadSeeds),
      map(() => {
        const adventures = data.getAllAdventures();
        return AdventureActions.loadAdventuresSeedSuccess({ adventures });
      }),
    ),
  { functional: true },
);

// --- Local Storage ---

// export const addAdventureLocal$ = createEffect(
//   (actions$ = inject(Actions), saveService = inject(GameSaveService)) =>
//     actions$.pipe(
//       ofType(AdventureActions.addAdventure),
//       tap(({ adventure }) => saveService.saveAdventure(adventure)),
//       map(({ adventure }) =>
//         AdventureActions.addAdventureSuccess({ adventure }),
//       ),
//       catchError((error) =>
//         of(AdventureActions.addAdventureFailure({ error: String(error) })),
//       ),
//     ),
//   { functional: true },
// );

// --- CREATE ADVENTURE (with AdventureIndex, rollback on index failure) ---
export const addAdventureLocal$ = createEffect(
  (actions$ = inject(Actions), saveService = inject(GameSaveService)) =>
    actions$.pipe(
      ofType(AdventureActions.addAdventure),
      mergeMap(({ adventure }) => {
        try {
          saveService.saveAdventure(adventure);
          // Build AdventureIndex from Adventure (helper should exist)
          const index = saveService.buildAdventureIndexFromAdventure(adventure);
          try {
            saveService.saveAdventureIndex(index);
            return of(
              AdventureActions.addAdventureSuccess({ adventure }),
              AdventureIndexActions.addAdventureIndex({ index }),
            );
          } catch (indexError) {
            // Rollback: remove Adventure if AdventureIndex fails
            saveService.deleteAdventure(adventure.id);
            return of(
              AdventureActions.addAdventureFailure({
                error: String(indexError),
              }),
            );
          }
        } catch (error) {
          return of(
            AdventureActions.addAdventureFailure({ error: String(error) }),
          );
        }
      }),
    ),
  { functional: true },
);

// --- READ ADVENTURE ---
export const loadAdventureLocal$ = createEffect(
  (actions$ = inject(Actions), saveService = inject(GameSaveService)) =>
    actions$.pipe(
      // ofType(AdventureActions.loadAdventureLocal),
      ofType(AdventureActions.loadAdventure),
      tap(({ id }) => console.log('[Effect] Loading Adventure:', id)),
      map(({ id }) => saveService.loadAdventure(id)),
      filter((adventure): adventure is Adventure => !!adventure),
      tap((adventure) => console.log('[Effect] Loaded Adventure:', adventure)),
      map((adventure) => AdventureActions.loadAdventureSuccess({ adventure })),
      catchError((error) =>
        of(AdventureActions.loadAdventureFailure({ error: String(error) })),
      ),
    ),
  { functional: true },
);
// * Add similar effects for file/db loads as needed

// export const saveAdventureLocal$ = createEffect(
//   (actions$ = inject(Actions), saveService = inject(GameSaveService)) =>
//     actions$.pipe(
//       // ofType(AdventureActions.saveAdventureLocal),
//       ofType(AdventureActions.saveAdventure),
//       tap(({ adventure }) => saveService.saveAdventure(adventure)),
//       map(({ adventure }) =>
//         AdventureActions.saveAdventureSuccess({ adventure }),
//       ),
//       catchError((error) =>
//         of(AdventureActions.saveAdventureFailure({ error: String(error) })),
//       ),
//     ),
//   { functional: true },
// );

// --- UPDATE ADVENTURE (partial update, also updates AdventureIndex) ---
export const saveAdventureLocal$ = createEffect(
  (actions$ = inject(Actions), saveService = inject(GameSaveService)) =>
    actions$.pipe(
      ofType(AdventureActions.saveAdventure),
      mergeMap(({ id, changes }) => {
        try {
          // Load, apply changes, and save
          const current = saveService.loadAdventure(id);
          if (!current) throw new Error('Adventure not found');
          const updated = { ...current, ...changes };
          saveService.saveAdventure(updated);

          // Update AdventureIndex metadata as well
          const index = saveService.buildAdventureIndexFromAdventure(updated);
          saveService.saveAdventureIndex(index);

          return of(
            AdventureActions.saveAdventureSuccess({ adventure: updated }),
            AdventureIndexActions.saveAdventureIndex({
              id: index.id,
              changes: index,
            }),
          );
        } catch (error) {
          return of(
            AdventureActions.saveAdventureFailure({ error: String(error) }),
          );
        }
      }),
    ),
  { functional: true },
);

// --- DELETE ADVENTURE ---
export const removeAdventureLocal$ = createEffect(
  (actions$ = inject(Actions), saveService = inject(GameSaveService)) =>
    actions$.pipe(
      // ofType(AdventureActions.deleteAdventureLocal),
      ofType(AdventureActions.removeAdventure),
      tap(({ id }) => saveService.deleteAdventure(id)),
      map(({ id }) => AdventureActions.removeAdventureSuccess({ id })),
      catchError((error) =>
        of(AdventureActions.removeAdventureFailure({ error: String(error) })),
      ),
    ),
  { functional: true },
);

// // --- Web API ---

// // Main entry point - API loader (stub for now)
// export const loadAdventure$ = createEffect(
//   (actions$ = inject(Actions), saveService = inject(GameSaveService)) =>
//     actions$.pipe(
//       ofType(AdventureActions.loadAdventure),
//       map(({ slotId }) => saveService.loadGameSlot(slotId)),
//       filter((slot): slot is AdventureIndex => !!slot),
//       map((slot) =>
//         AdventureActions.loadAdventureSuccess({ adventure: slot.state }),
//       ),
//     ),
//   { functional: true },
// );

// // Persist adventures to localStorage on add/update/delete success
// export const persistAdventures$ = createEffect(
//   (actions$ = inject(Actions), store = inject(Store)) =>
//     actions$.pipe(
//       ofType(
//         AdventureActions.addAdventureSuccess,
//         AdventureActions.updateAdventureSuccess,
//         AdventureActions.deleteAdventureSuccess,
//       ),
//       withLatestFrom(store.select(adventureFeature.selectEntities)),
//       // tap((action, state) => {
//       tap(([, adventures]) => {
//         localStorage.setItem(STORAGE_KEY, JSON.stringify(adventures));
//       }),
//     ),
//   { functional: true, dispatch: false },
// );
