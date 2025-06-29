import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { GameSaveService } from '../../services/game-save.service';
import { AppActions } from '../app.actions';
import { AdventureIndexActions } from './adventure-index.actions';

// --- CREATE ADVENTURE INDEX (metadata only, after Adventure is saved) ---
export const addAdventureIndex$ = createEffect(
  (actions$ = inject(Actions), saveService = inject(GameSaveService)) =>
    actions$.pipe(
      ofType(AdventureIndexActions.addAdventureIndex),
      tap(({ index }) => saveService.saveAdventureIndex(index)),
      map(({ index }) =>
        AdventureIndexActions.addAdventureIndexSuccess({ index }),
      ),
      catchError((error) =>
        of(
          AdventureIndexActions.addAdventureIndexFailure({
            error: String(error),
          }),
        ),
      ),
    ),
  { functional: true },
);

// --- READ ALL ADVENTURE INDEXES ---
export const loadAdventureIndexesLocal$ = createEffect(
  (actions$ = inject(Actions), saveService = inject(GameSaveService)) =>
    actions$.pipe(
      // ofType(AdventureIndexActions.loadAdventureIndexesLocal),
      // ofType(AdventureIndexActions.loadAdventureIndexes),
      ofType(AppActions.init, AdventureIndexActions.loadAdventureIndexes),
      map(() => saveService.listAdventureIndexes()),
      map((slots) =>
        AdventureIndexActions.loadAdventureIndexesSuccess({ slots }),
      ),
      catchError((error) =>
        of(
          AdventureIndexActions.loadAdventureIndexesFailure({
            error: String(error),
          }),
        ),
      ),
    ),
  { functional: true },
);

// export const updateAdventureIndex$ = createEffect(
//   (actions$ = inject(Actions), saveService = inject(GameSaveService)) =>
//     actions$.pipe(
//       ofType(AdventureIndexActions.updateAdventureIndex),
//       tap(({ slot }) => saveService.saveAdventureIndex(slot)),
//       map(({ slot }) =>
//         AdventureIndexActions.updateAdventureIndexSuccess({ slot }),
//       ),
//       catchError((error) =>
//         of(
//           AdventureIndexActions.updateAdventureIndexFailure({
//             error: String(error),
//           }),
//         ),
//       ),
//     ),
//   { functional: true },
// );

// --- UPDATE ADVENTURE INDEX (partial update) ---
export const saveAdventureIndex$ = createEffect(
  (actions$ = inject(Actions), saveService = inject(GameSaveService)) =>
    actions$.pipe(
      ofType(AdventureIndexActions.saveAdventureIndex),
      mergeMap(({ id, changes }) => {
        try {
          const current = saveService.loadAdventureIndex(id);
          if (!current) throw new Error('AdventureIndex not found');
          const updated = { ...current, ...changes };
          saveService.saveAdventureIndex(updated);
          return of(
            AdventureIndexActions.saveAdventureIndexSuccess({ index: updated }),
          );
        } catch (error) {
          return of(
            AdventureIndexActions.saveAdventureIndexFailure({
              error: String(error),
            }),
          );
        }
      }),
    ),
  { functional: true },
);

// --- DELETE ADVENTURE INDEX ---
export const removeAdventureIndex$ = createEffect(
  (actions$ = inject(Actions), saveService = inject(GameSaveService)) =>
    actions$.pipe(
      ofType(AdventureIndexActions.removeAdventureIndex),
      tap(({ id }) => saveService.deleteAdventureIndex(id)),
      map(({ id }) =>
        AdventureIndexActions.removeAdventureIndexSuccess({ id }),
      ),
      catchError((error) =>
        of(
          AdventureIndexActions.removeAdventureIndexFailure({
            error: String(error),
          }),
        ),
      ),
    ),
  { functional: true },
);
