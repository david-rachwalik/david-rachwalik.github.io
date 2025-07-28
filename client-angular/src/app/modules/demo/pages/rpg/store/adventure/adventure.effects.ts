import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap } from 'rxjs';

import { GameDataService } from '../../services/game-data.service';
import { GameSaveDexieService } from '../../services/game-save-dexie.service';
import { GameSaveLocalService } from '../../services/game-save-local.service';
import { AppActions } from '../app.actions';
import { AdventureActions } from './adventure.actions';

// const STORAGE_KEY = 'rpg-demo-game-states';

// Seed loader
export const seedAllAdventures$ = createEffect(
  (actions$ = inject(Actions), data = inject(GameDataService)) =>
    actions$.pipe(
      ofType(AppActions.loadAllSeeds),
      map(() => {
        try {
          const adventures = data.getAllAdventures();
          return AdventureActions.seedAllAdventuresSuccess({ adventures });
        } catch (error) {
          return AdventureActions.seedAllAdventuresFailure({
            error: String(error),
          });
        }
      }),
    ),
  { functional: true },
);

// #region 🔸 LocalStorage Effects (synchronous) 🔸

export const addAdventureLocal$ = createEffect(
  (actions$ = inject(Actions), saveService = inject(GameSaveLocalService)) =>
    actions$.pipe(
      ofType(AdventureActions.addAdventure),
      map(({ adventure }) => {
        try {
          saveService.saveAdventure(adventure);
          return AdventureActions.addAdventureSuccess({ adventure });
        } catch (error) {
          return AdventureActions.addAdventureFailure({ error: String(error) });
        }
      }),
    ),
  { functional: true },
);

export const loadAdventureLocal$ = createEffect(
  (actions$ = inject(Actions), saveService = inject(GameSaveLocalService)) =>
    actions$.pipe(
      ofType(AdventureActions.loadAdventure),
      map(({ id }) => {
        try {
          const adventure = saveService.loadAdventure(id);
          if (!adventure) throw new Error(`Adventure not found: ${id}`);
          return AdventureActions.loadAdventureSuccess({ adventure });
        } catch (error) {
          return AdventureActions.loadAdventureFailure({
            error: String(error),
          });
        }
      }),
    ),
  { functional: true },
);

export const saveAdventureLocal$ = createEffect(
  (actions$ = inject(Actions), saveService = inject(GameSaveLocalService)) =>
    actions$.pipe(
      ofType(AdventureActions.saveAdventure),
      map(({ id, changes }) => {
        try {
          const current = saveService.loadAdventure(id);
          if (!current) throw new Error(`Adventure not found: ${id}`);
          const updated = { ...current, ...changes };
          saveService.saveAdventure(updated);
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

export const removeAdventureLocal$ = createEffect(
  (actions$ = inject(Actions), saveService = inject(GameSaveLocalService)) =>
    actions$.pipe(
      ofType(AdventureActions.removeAdventure),
      map(({ id }) => {
        try {
          saveService.deleteAdventure(id);
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
//         AdventureActions.saveAdventureSuccess,
//         AdventureActions.removeAdventureSuccess,
//       ),
//       withLatestFrom(store.select(selectAdventureEntities)),
//       // tap((action, state) => {
//       tap(([, adventures]) => {
//         localStorage.setItem(STORAGE_KEY, JSON.stringify(adventures));
//       }),
//     ),
//   { functional: true, dispatch: false },
// );

// #region 🔸 Dexie Effects (IndexedDb, asynchronous) 🔸

export const addAdventureDexie$ = createEffect(
  (actions$ = inject(Actions), saveService = inject(GameSaveDexieService)) =>
    actions$.pipe(
      ofType(AdventureActions.addAdventure),
      mergeMap(async ({ adventure }) => {
        try {
          await saveService.saveAdventure(adventure);
          return AdventureActions.addAdventureSuccess({ adventure });
        } catch (error) {
          return AdventureActions.addAdventureFailure({ error: String(error) });
        }
      }),
    ),
  { functional: true },
);

export const loadAllAdventuresDexie$ = createEffect(
  (actions$ = inject(Actions), saveService = inject(GameSaveDexieService)) =>
    actions$.pipe(
      ofType(AdventureActions.loadAllAdventures),
      mergeMap(async () => {
        try {
          const adventures = await saveService.loadAllAdventures();
          return AdventureActions.loadAllAdventuresSuccess({ adventures });
        } catch (error) {
          return AdventureActions.loadAllAdventuresFailure({
            error: String(error),
          });
        }
      }),
    ),
  { functional: true },
);

export const loadAdventureDexie$ = createEffect(
  (actions$ = inject(Actions), saveService = inject(GameSaveDexieService)) =>
    actions$.pipe(
      ofType(AdventureActions.loadAdventure),
      mergeMap(async ({ id }) => {
        try {
          const adventure = await saveService.loadAdventure(id);
          if (!adventure) throw new Error(`Adventure not found: ${id}`);
          return AdventureActions.loadAdventureSuccess({ adventure });
        } catch (error) {
          return AdventureActions.loadAdventureFailure({
            error: String(error),
          });
        }
      }),
    ),
  { functional: true },
);

export const saveAdventureDexie$ = createEffect(
  (actions$ = inject(Actions), saveService = inject(GameSaveDexieService)) =>
    actions$.pipe(
      ofType(AdventureActions.saveAdventure),
      mergeMap(async ({ id, changes }) => {
        try {
          const current = await saveService.loadAdventure(id);
          if (!current) throw new Error(`Adventure not found: ${id}`);
          const updated = { ...current, ...changes };
          await saveService.saveAdventure(updated);
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

export const removeAdventureDexie$ = createEffect(
  (actions$ = inject(Actions), saveService = inject(GameSaveDexieService)) =>
    actions$.pipe(
      ofType(AdventureActions.removeAdventure),
      mergeMap(async ({ id }) => {
        try {
          await saveService.deleteAdventure(id);
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
