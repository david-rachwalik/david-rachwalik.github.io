import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { filter, map, mergeMap, switchMap, take } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { AdventureEvent } from '../../models/adventure';
import { GameSaveDexieService } from '../../services/game-save-dexie.service';
import { UserService } from '../../services/user.service';
import { toId } from '../../utils';
import {
  buildAdventureEntityCompositeId,
  GUEST_ACCOUNT_ID,
} from '../../utils-composite-id';
import { AppActions } from '../app.actions';
import { selectCurrentSlotId } from '../app.selectors';
import { AdventureEventActions } from './adventure-event.actions';
import { AdventureActions } from './adventure.actions';

// #region 🔸 Database Effects 🔸

export const addAdventureEvent$ = createEffect(
  (actions$ = inject(Actions), db = inject(GameSaveDexieService)) =>
    actions$.pipe(
      ofType(AdventureEventActions.addAdventureEvent),
      mergeMap(async ({ event }) => {
        try {
          await db.saveAdventureEvent(event);
          return AdventureEventActions.addAdventureEventSuccess({ event });
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          return AdventureEventActions.addAdventureEventFailure({
            error: errorMessage,
          });
        }
      }),
    ),
  { functional: true },
);

export const loadAllAdventureEvents$ = createEffect(
  (
    actions$ = inject(Actions),
    db = inject(GameSaveDexieService),
    store = inject(Store),
  ) =>
    actions$.pipe(
      ofType(AppActions.play, AdventureEventActions.loadAllAdventureEvents),
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
          // Extract optional overrides safely without strict "any"
          const payloadSlotId =
            'adventureId' in action ? action.adventureId : undefined;
          const fetchAll = 'fetchAll' in action ? action.fetchAll : false;

          // If Admin requests ALL events from database, bypass the ID check
          if (fetchAll) {
            const events = await db.loadAllAdventureEvents();
            return AdventureEventActions.loadAllAdventureEventsSuccess({
              events,
            });
          }

          // Prefer explicit action ID, fallback to Store's active session ID
          const slotId = payloadSlotId || storeSlotId;

          // Fail fiercely if lacks context
          if (!slotId) {
            throw new Error(
              '[loadAllAdventureEvents] Failed: No adventureId context provided or active in Store.',
            );
          }

          // Fetch specific active playthrough events
          const events = await db.loadAllAdventureEvents(slotId);
          return AdventureEventActions.loadAllAdventureEventsSuccess({
            events,
          });
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          return AdventureEventActions.loadAllAdventureEventsFailure({
            error: errorMessage,
          });
        }
      }),
    ),
  { functional: true },
);

export const saveAdventureEvent$ = createEffect(
  (actions$ = inject(Actions), db = inject(GameSaveDexieService)) =>
    actions$.pipe(
      ofType(AdventureEventActions.saveAdventureEvent),
      mergeMap(async ({ event }) => {
        try {
          await db.saveAdventureEvent(event);
          return AdventureEventActions.saveAdventureEventSuccess({ event });
        } catch (error) {
          return AdventureEventActions.saveAdventureEventFailure({
            error: String(error),
          });
        }
      }),
    ),
  { functional: true },
);

export const removeAdventureEvents$ = createEffect(
  (actions$ = inject(Actions), db = inject(GameSaveDexieService)) =>
    actions$.pipe(
      ofType(AdventureEventActions.removeAllAdventureEvents),
      mergeMap(async ({ id }) => {
        try {
          await db.deleteAllAdventureEvents(id);
          return AdventureEventActions.removeAllAdventureEventsSuccess({ id });
        } catch (error) {
          return AdventureEventActions.removeAllAdventureEventsFailure({
            error: String(error),
          });
        }
      }),
    ),
  { functional: true },
);

export const removeAllAdventureEvents$ = createEffect(
  (actions$ = inject(Actions), db = inject(GameSaveDexieService)) =>
    actions$.pipe(
      ofType(AdventureEventActions.removeAllAdventureEvents),
      mergeMap(async ({ id }) => {
        try {
          await db.deleteAllAdventureEvents(id);
          return AdventureEventActions.removeAllAdventureEventsSuccess({ id });
        } catch (error) {
          return AdventureEventActions.removeAllAdventureEventsFailure({
            error: String(error),
          });
        }
      }),
    ),
  { functional: true },
);
// #endregion

// #region 🔸 Chain Effects (sync metadata with Adventure) 🔸

export const addAdventureEventOnAdventureAdd$ = createEffect(
  (
    actions$ = inject(Actions),
    userService = inject(UserService, { optional: true }),
  ) =>
    actions$.pipe(
      ofType(AdventureActions.addAdventureSuccess),
      map(({ adventure }) => {
        const timestamp = new Date().toISOString();
        const entityId = toId(timestamp);
        // const userService = inject(UserService, { optional: true });
        const accountId = userService?.accountId || GUEST_ACCOUNT_ID;
        // const id = buildAdventureTemplateId(timestamp, adventure.id) ?? '';
        const id =
          buildAdventureEntityCompositeId(
            entityId,
            adventure.currentDimensionId,
            adventure.currentPlaneId,
            adventure.id,
            accountId,
          ) ?? '';
        const initialEvent: AdventureEvent = {
          id,
          entityId,
          adventureId: adventure.id,
          dimensionId: adventure.currentDimensionId,
          planeId: adventure.currentPlaneId,
          accountId,
          timestamp,
          // type: 'adventure-start',
          type: 'adventure',
          action: 'complete',
          payload: { message: 'A new adventure begins!' },
        };
        console.log('built initialEvent:', initialEvent);
        return AdventureEventActions.addAdventureEvent({ event: initialEvent });
      }),
    ),
  { functional: true },
);

export const removeAdventureEventOnAdventureRemove$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(AdventureActions.removeAdventureSuccess),
      map(({ id }) => AdventureEventActions.removeAllAdventureEvents({ id })),
    ),
  { functional: true },
);
// #endregion
