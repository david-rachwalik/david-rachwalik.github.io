import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap } from 'rxjs/operators';

import { AdventureEvent } from '../../models/adventure';
import { GameSaveDexieService } from '../../services/game-save-dexie.service';
import { UserService } from '../../services/user.service';
import { toId } from '../../utils';
import { buildAdventureEntityCompositeId } from '../../utils-composite-id';
import { AppActions } from '../app.actions';
import { AdventureEventActions } from './adventure-event.actions';
import { AdventureActions } from './adventure.actions';

// #region 🔸 Dexie Effects (EventedDb, asynchronous) 🔸

export const addAdventureEventDexie$ = createEffect(
  (actions$ = inject(Actions), saveService = inject(GameSaveDexieService)) =>
    actions$.pipe(
      ofType(AdventureEventActions.addAdventureEvent),
      mergeMap(async ({ event }) => {
        try {
          await saveService.saveAdventureEvent(event);
          return AdventureEventActions.addAdventureEventSuccess({ event });
        } catch (error) {
          return AdventureEventActions.addAdventureEventFailure({
            error: String(error),
          });
        }
      }),
    ),
  { functional: true },
);

export const loadAllAdventureEventsDexie$ = createEffect(
  (actions$ = inject(Actions), saveService = inject(GameSaveDexieService)) =>
    actions$.pipe(
      // ofType(AdventureEventActions.loadAllAdventureEvents),
      ofType(AppActions.init, AdventureEventActions.loadAllAdventureEvents),
      mergeMap(async () => {
        try {
          const events = await saveService.loadAllAdventureEvents();
          return AdventureEventActions.loadAllAdventureEventsSuccess({
            events,
          });
        } catch (error) {
          return AdventureEventActions.loadAllAdventureEventsFailure({
            error: String(error),
          });
        }
      }),
    ),
  { functional: true },
);

export const saveAdventureEventDexie$ = createEffect(
  (actions$ = inject(Actions), saveService = inject(GameSaveDexieService)) =>
    actions$.pipe(
      ofType(AdventureEventActions.saveAdventureEvent),
      mergeMap(async ({ event }) => {
        try {
          await saveService.saveAdventureEvent(event);
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

export const removeAdventureEventsDexie$ = createEffect(
  (actions$ = inject(Actions), saveService = inject(GameSaveDexieService)) =>
    actions$.pipe(
      ofType(AdventureEventActions.removeAllAdventureEvents),
      mergeMap(async ({ id }) => {
        try {
          await saveService.deleteAllAdventureEvents(id);
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

export const removeAllAdventureEventsDexie$ = createEffect(
  (actions$ = inject(Actions), saveService = inject(GameSaveDexieService)) =>
    actions$.pipe(
      ofType(AdventureEventActions.removeAllAdventureEvents),
      mergeMap(async ({ id }) => {
        try {
          await saveService.deleteAllAdventureEvents(id);
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
        const accountId = userService?.accountId || 'guest';
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
