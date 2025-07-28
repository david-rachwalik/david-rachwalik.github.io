import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs';

import { GameDataService } from '../../services/game-data.service';
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
          console.log('loadItemsSeed found items: ', items);
          return ItemActions.seedAllItemsSuccess({ items });
        } catch (error) {
          return ItemActions.seedAllItemsFailure({ error: String(error) });
        }
      }),
    ),
  { functional: true },
);

// Main entry point - API loader (stub for now)
export const loadAllItemsApi$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(ItemActions.loadAllItems),
      // Replace with real API call later
      // Will just use `loadItemsSuccess`, not `loadItemsAPISuccess`
      map(() =>
        ItemActions.loadAllItemsFailure({ error: 'API not implemented' }),
      ),
    ),
  { functional: true },
);

// // #region 🔸 Dexie Effects (IndexedDb, asynchronous) 🔸

// export const addItemDexie$ = createEffect(
//   (actions$ = inject(Actions), saveService = inject(GameSaveDexieService)) =>
//     actions$.pipe(
//       ofType(ItemActions.addItem),
//       mergeMap(async ({ item }) => {
//         try {
//           await saveService.saveItem(item);
//           return ItemActions.addItemSuccess({ item });
//         } catch (error) {
//           return ItemActions.addItemFailure({ error: String(error) });
//         }
//       }),
//     ),
//   { functional: true },
// );

// export const loadAllItemsDexie$ = createEffect(
//   (actions$ = inject(Actions), saveService = inject(GameSaveDexieService)) =>
//     actions$.pipe(
//       ofType(AppActions.init, ItemActions.loadAllItems),
//       mergeMap(async () => {
//         try {
//           const items = await saveService.loadAllItems();
//           return ItemActions.loadAllItemsSuccess({ items });
//         } catch (error) {
//           return ItemActions.loadAllItemsFailure({ error: String(error) });
//         }
//       }),
//     ),
//   { functional: true },
// );

// export const loadItemDexie$ = createEffect(
//   (actions$ = inject(Actions), saveService = inject(GameSaveDexieService)) =>
//     actions$.pipe(
//       ofType(ItemActions.loadItem),
//       mergeMap(async ({ id }) => {
//         try {
//           const item = await saveService.loadItem(id);
//           if (!item) throw new Error(`Item not found: ${id}`);
//           return ItemActions.loadItemSuccess({ item });
//         } catch (error) {
//           return ItemActions.loadItemFailure({ error: String(error) });
//         }
//       }),
//     ),
//   { functional: true },
// );

// export const saveItemDexie$ = createEffect(
//   (actions$ = inject(Actions), saveService = inject(GameSaveDexieService)) =>
//     actions$.pipe(
//       ofType(ItemActions.saveItem),
//       mergeMap(async ({ item }) => {
//         try {
//           // Directly save the full item (no merge with existing)
//           await saveService.saveItem(item);
//           return ItemActions.saveItemSuccess({ item });
//         } catch (error) {
//           return ItemActions.saveItemFailure({ error: String(error) });
//         }
//       }),
//     ),
//   { functional: true },
// );

// export const removeItemDexie$ = createEffect(
//   (actions$ = inject(Actions), saveService = inject(GameSaveDexieService)) =>
//     actions$.pipe(
//       ofType(ItemActions.removeItem),
//       mergeMap(async ({ id }) => {
//         try {
//           await saveService.deleteItem(id);
//           return ItemActions.removeItemSuccess({ id });
//         } catch (error) {
//           return ItemActions.removeItemFailure({ error: String(error) });
//         }
//       }),
//     ),
//   { functional: true },
// );
// // #endregion
