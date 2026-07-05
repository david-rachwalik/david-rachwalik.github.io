import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap } from 'rxjs/operators';

import { AdventureFacade } from '../../services/facades/adventure-facade';
import { GameSaveDexieService } from '../../services/game-save-dexie.service';
import { AppActions } from '../app.actions';
import { AdventureIndexActions } from './adventure-index.actions';
import { AdventureActions } from './adventure.actions';

// #region 🔸 Database Effects 🔸

export const addAdventureIndex$ = createEffect(
  (actions$ = inject(Actions), db = inject(GameSaveDexieService)) =>
    actions$.pipe(
      ofType(AdventureIndexActions.addAdventureIndex),
      mergeMap(async ({ index }) => {
        try {
          await db.saveAdventureIndex(index);
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

export const loadAllAdventureIndexes$ = createEffect(
  (actions$ = inject(Actions), db = inject(GameSaveDexieService)) =>
    actions$.pipe(
      ofType(AppActions.init, AdventureIndexActions.loadAllAdventureIndexes),
      mergeMap(async () => {
        try {
          const slots = await db.loadAllAdventureIndexes();
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

export const saveAdventureIndex$ = createEffect(
  (actions$ = inject(Actions), db = inject(GameSaveDexieService)) =>
    actions$.pipe(
      ofType(AdventureIndexActions.saveAdventureIndex),
      mergeMap(async ({ index }) => {
        try {
          await db.saveAdventureIndex(index);
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

export const removeAdventureIndex$ = createEffect(
  (actions$ = inject(Actions), db = inject(GameSaveDexieService)) =>
    actions$.pipe(
      ofType(AdventureIndexActions.removeAdventureIndex),
      mergeMap(async ({ id }) => {
        try {
          await db.deleteAdventureIndex(id);
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
