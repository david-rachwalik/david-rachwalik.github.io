import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, map, tap, withLatestFrom } from 'rxjs/operators';

import { GameSaveService } from '../services/game-save.service';
import { AdventureActions } from './adventure/adventure.actions';
import { AppActions } from './app.actions';
import { selectAppSeeded } from './app.selectors';

export const initLoadSeeds$ = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) =>
    actions$.pipe(
      // ofType(AppActions.loadSeeds),
      ofType(AppActions.init),
      tap(() =>
        console.log('[Effect] AppActions.init received (initLoadSeeds$)'),
      ),
      withLatestFrom(store.select(selectAppSeeded)),
      filter(([, seeded]) => !seeded),
      // map(() => AppActions.loadSeedsRequested()),
      map(() => AppActions.loadSeeds()),
    ),
  { functional: true },
);

// When app starts, load current adventure slot id
export const initLoadCurrentSlotId$ = createEffect(
  (actions$ = inject(Actions), saveService = inject(GameSaveService)) =>
    actions$.pipe(
      // ofType(AppActions.loadCurrentSlotId),
      ofType(AppActions.init),
      tap(() =>
        console.log('[Effect] AppActions.init received (loadCurrentSlotId$)'),
      ),
      map(() => saveService.loadCurrentSlotId()),
      tap((slotId) => console.log('[Effect] Loaded slotId:', slotId)),
      filter((slotId): slotId is string => !!slotId),
      map((slotId) => AppActions.setCurrentSlotId({ slotId })),
      tap((action) =>
        console.log('[Effect] Dispatching setCurrentSlotId:', action),
      ),
    ),
  { functional: true },
);

export const setCurrentSlotId$ = createEffect(
  (actions$ = inject(Actions), saveService = inject(GameSaveService)) =>
    actions$.pipe(
      ofType(AppActions.setCurrentSlotId),
      tap(() => console.log('[Effect] AppActions.setCurrentSlotId received')),
      tap(({ slotId }) => saveService.saveCurrentSlotId(slotId)),
    ),
  { functional: true, dispatch: false },
);

// --- Auto-Load Effects ---

// Centralizes side effects: Keeps business logic and side effects in one place,
// not scattered across components or services.
// Automatic: Whenever the `setCurrentSlotId` action is dispatched (from anywhere in
// the app), the effect will react and dispatch `loadAdventure` for that slot.
// Decouples UI: Components don’t need to subscribe and manually dispatch; the effect
// handles it globally.

export const playLoadAdventure$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(AppActions.play),
      map(({ slotId }) => AdventureActions.loadAdventure({ id: slotId })),
    ),
  { functional: true },
);

// export const autoLoadAdventure$ = createEffect(
//   (actions$ = inject(Actions)) =>
//     actions$.pipe(
//       ofType(AppActions.setCurrentSlotId),
//       filter(({ slotId }) => !!slotId),
//       map(({ slotId }) => AdventureActions.loadAdventure({ id: slotId })),
//     ),
//   { functional: true },
// );
