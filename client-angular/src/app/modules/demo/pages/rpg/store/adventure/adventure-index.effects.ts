import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap } from 'rxjs/operators';

import { AdventureFacade } from '../../services/facades/adventure-facade';
import { GameSaveDexieService } from '../../services/game-save-dexie.service';
import { GameSaveLocalService } from '../../services/game-save-local.service';
import { AppActions } from '../app.actions';
import { AdventureIndexActions } from './adventure-index.actions';
import { AdventureActions } from './adventure.actions';

// #region 🔸 LocalStorage Effects (synchronous) 🔸

export const addAdventureIndexLocal$ = createEffect(
  (actions$ = inject(Actions), saveService = inject(GameSaveLocalService)) =>
    actions$.pipe(
      ofType(AdventureIndexActions.addAdventureIndex),
      map(({ index }) => {
        try {
          saveService.saveAdventureIndex(index);
          return AdventureIndexActions.addAdventureIndexSuccess({ index });
        } catch (error) {
          return AdventureIndexActions.addAdventureIndexFailure({
            error: String(error),
          });
        }
      }),
    ),
  { functional: true },
);

export const loadAllAdventureIndexesLocal$ = createEffect(
  (actions$ = inject(Actions), saveService = inject(GameSaveLocalService)) =>
    actions$.pipe(
      // ofType(AdventureIndexActions.loadAdventureIndexesLocal),
      // ofType(AdventureIndexActions.loadAdventureIndexes),
      ofType(AppActions.init, AdventureIndexActions.loadAllAdventureIndexes),
      map(() => {
        try {
          const slots = saveService.listAdventureIndexes();
          return AdventureIndexActions.loadAllAdventureIndexesSuccess({
            slots,
          });
        } catch (error) {
          return AdventureIndexActions.loadAllAdventureIndexesFailure({
            error: String(error),
          });
        }
      }),
    ),
  { functional: true },
);

export const saveAdventureIndexLocal$ = createEffect(
  (actions$ = inject(Actions), saveService = inject(GameSaveLocalService)) =>
    actions$.pipe(
      ofType(AdventureIndexActions.saveAdventureIndex),
      map(({ index }) => {
        try {
          saveService.saveAdventureIndex(index);
          return AdventureIndexActions.saveAdventureIndexSuccess({ index });
        } catch (error) {
          return AdventureIndexActions.saveAdventureIndexFailure({
            error: String(error),
          });
        }
      }),
    ),
  { functional: true },
);

export const removeAdventureIndexLocal$ = createEffect(
  (actions$ = inject(Actions), saveService = inject(GameSaveLocalService)) =>
    actions$.pipe(
      ofType(AdventureIndexActions.removeAdventureIndex),
      map(({ id }) => {
        try {
          saveService.deleteAdventureIndex(id);
          return AdventureIndexActions.removeAdventureIndexSuccess({ id });
        } catch (error) {
          return AdventureIndexActions.removeAdventureIndexFailure({
            error: String(error),
          });
        }
      }),
    ),
  { functional: true },
);
// #endregion

// #region 🔸 Dexie Effects (IndexedDb, asynchronous) 🔸

export const addAdventureIndexDexie$ = createEffect(
  (actions$ = inject(Actions), saveService = inject(GameSaveDexieService)) =>
    actions$.pipe(
      ofType(AdventureIndexActions.addAdventureIndex),
      mergeMap(async ({ index }) => {
        try {
          await saveService.saveAdventureIndex(index);
          return AdventureIndexActions.addAdventureIndexSuccess({ index });
        } catch (error) {
          return AdventureIndexActions.addAdventureIndexFailure({
            error: String(error),
          });
        }
      }),
    ),
  { functional: true },
);

export const loadAllAdventureIndexesDexie$ = createEffect(
  (actions$ = inject(Actions), saveService = inject(GameSaveDexieService)) =>
    actions$.pipe(
      // ofType(AdventureIndexActions.loadAllAdventureIndexes),
      ofType(AppActions.init, AdventureIndexActions.loadAllAdventureIndexes),
      mergeMap(async () => {
        try {
          const slots = await saveService.loadAllAdventureIndexes();
          return AdventureIndexActions.loadAllAdventureIndexesSuccess({
            slots,
          });
        } catch (error) {
          return AdventureIndexActions.loadAllAdventureIndexesFailure({
            error: String(error),
          });
        }
      }),
    ),
  { functional: true },
);

export const saveAdventureIndexDexie$ = createEffect(
  (actions$ = inject(Actions), saveService = inject(GameSaveDexieService)) =>
    actions$.pipe(
      ofType(AdventureIndexActions.saveAdventureIndex),
      mergeMap(async ({ index }) => {
        try {
          await saveService.saveAdventureIndex(index);
          return AdventureIndexActions.saveAdventureIndexSuccess({ index });
        } catch (error) {
          return AdventureIndexActions.saveAdventureIndexFailure({
            error: String(error),
          });
        }
      }),
    ),
  { functional: true },
);

export const removeAdventureIndexDexie$ = createEffect(
  (actions$ = inject(Actions), saveService = inject(GameSaveDexieService)) =>
    actions$.pipe(
      ofType(AdventureIndexActions.removeAdventureIndex),
      mergeMap(async ({ id }) => {
        try {
          await saveService.deleteAdventureIndex(id);
          return AdventureIndexActions.removeAdventureIndexSuccess({ id });
        } catch (error) {
          return AdventureIndexActions.removeAdventureIndexFailure({
            error: String(error),
          });
        }
      }),
    ),
  { functional: true },
);
// #endregion

// #region 🔸 Chain Effects (sync metadata with Adventure) 🔸

export const addAdventureIndexOnAdventureAdd$ = createEffect(
  (actions$ = inject(Actions), facade = inject(AdventureFacade)) =>
    actions$.pipe(
      ofType(AdventureActions.addAdventureSuccess),
      mergeMap(async ({ adventure }) => {
        console.log('[addAdventureIndexOnAdventureAdd$] adventure:', adventure);
        try {
          const index =
            await facade.buildAdventureIndexFromAdventure(adventure);
          console.log('[addAdventureIndexOnAdventureAdd$] index:', index);

          if (!index) {
            const indexFailMsg =
              '[addAdventureIndexOnAdventureAdd$] Failed to build AdventureIndex';
            console.error(indexFailMsg);
            throw new Error(indexFailMsg);
          }
          return AdventureIndexActions.addAdventureIndex({ index });
        } catch (error) {
          console.error('[addAdventureIndexOnAdventureAdd$] Error:', error);
          throw error;
        }
      }),
    ),
  { functional: true },
);

export const saveAdventureIndexOnAdventureSave$ = createEffect(
  (actions$ = inject(Actions), facade = inject(AdventureFacade)) =>
    actions$.pipe(
      ofType(AdventureActions.saveAdventureSuccess),
      // map(({ adventure }) => {
      //   const index = facade.buildAdventureIndexFromAdventure(adventure);
      //   return AdventureIndexActions.saveAdventureIndex({ index });
      // }),
      mergeMap(async ({ adventure }) => {
        const index = await facade.buildAdventureIndexFromAdventure(adventure);
        if (!index)
          throw new Error(
            '[saveAdventureIndexOnAdventureSave$] Failed to build AdventureIndex',
          );
        return AdventureIndexActions.saveAdventureIndex({ index });
      }),
    ),
  { functional: true },
);

export const removeAdventureIndexOnAdventureRemove$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(AdventureActions.removeAdventureSuccess),
      map(({ id }) => AdventureIndexActions.removeAdventureIndex({ id })),
    ),
  { functional: true },
);
// #endregion
