import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap } from 'rxjs';

import { Item } from '../../models/item';
import { GameDataService } from '../../services/game-data.service';
import { GameSaveDexieService } from '../../services/game-save-dexie.service';
import { AppActions } from '../app.actions';
import { ItemActions } from './item.actions';

// Seed loader
export const seedAllItems$ = createEffect(
  (actions$ = inject(Actions), data = inject(GameDataService)) =>
    actions$.pipe(
      ofType(AppActions.loadAllSeeds),
      map(() => {
        try {
          const items = data.getAllItems();
          // console.log('seedAllItems$ found items: ', items);
          return ItemActions.seedAllItemsSuccess({ items });
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          return ItemActions.seedAllItemsFailure({ error: errorMessage });
        }
      }),
    ),
  { functional: true },
);

// #region 🔸 Database Effects 🔸

export const addItem$ = createEffect(
  (actions$ = inject(Actions), db = inject(GameSaveDexieService)) =>
    actions$.pipe(
      ofType(ItemActions.addItem),
      mergeMap(async ({ item }) => {
        try {
          await db.saveItem(item);
          return ItemActions.addItemSuccess({ item });
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          return ItemActions.addItemFailure({ error: errorMessage });
        }
      }),
    ),
  { functional: true },
);

export const loadAllItems$ = createEffect(
  (actions$ = inject(Actions), db = inject(GameSaveDexieService)) =>
    actions$.pipe(
      ofType(AppActions.init, ItemActions.loadAllItems),
      mergeMap(async () => {
        try {
          const items = await db.loadAllItems();
          return ItemActions.loadAllItemsSuccess({ items });
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          return ItemActions.loadAllItemsFailure({ error: errorMessage });
        }
      }),
    ),
  { functional: true },
);

export const loadItem$ = createEffect(
  (actions$ = inject(Actions), db = inject(GameSaveDexieService)) =>
    actions$.pipe(
      ofType(ItemActions.loadItem),
      mergeMap(async ({ id }) => {
        try {
          const item = await db.loadItem(id);
          if (!item) throw new Error(`Item not found: ${id}`);
          return ItemActions.loadItemSuccess({ item });
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          return ItemActions.loadItemFailure({ error: errorMessage });
        }
      }),
    ),
  { functional: true },
);

export const saveItem$ = createEffect(
  (actions$ = inject(Actions), db = inject(GameSaveDexieService)) =>
    actions$.pipe(
      ofType(ItemActions.saveItem),
      mergeMap(async ({ id, changes }) => {
        try {
          // Fetch the existing model and merge with partial changes
          const current = await db.loadItem(id);
          if (!current) throw new Error(`Item not found: ${id}`);

          // Safely map partial updates and cast to strict Model
          const updated = { ...current, ...changes } as Item;
          await db.saveItem(updated);

          return ItemActions.saveItemSuccess({ item: updated });
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          return ItemActions.saveItemFailure({ error: errorMessage });
        }
      }),
    ),
  { functional: true },
);

export const removeItem$ = createEffect(
  (actions$ = inject(Actions), db = inject(GameSaveDexieService)) =>
    actions$.pipe(
      ofType(ItemActions.removeItem),
      mergeMap(async ({ id }) => {
        try {
          await db.deleteItem(id);
          return ItemActions.removeItemSuccess({ id });
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          return ItemActions.removeItemFailure({ error: errorMessage });
        }
      }),
    ),
  { functional: true },
);
// #endregion
