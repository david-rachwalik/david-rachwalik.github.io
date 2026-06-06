import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap } from 'rxjs';

import { Moment } from '../../models/moment';
import { GameDataService } from '../../services/game-data.service';
import { GameSaveDexieService } from '../../services/game-save-dexie.service';
import { AppActions } from '../app.actions';
import { MomentActions } from './moment.actions';

// Seed loader
export const seedAllMoments$ = createEffect(
  (actions$ = inject(Actions), data = inject(GameDataService)) =>
    actions$.pipe(
      ofType(AppActions.loadAllSeeds),
      map(() => {
        try {
          const moments = data.getAllMoments();
          // console.log('seedAllMoments$ found moments: ', moments);
          return MomentActions.seedAllMomentsSuccess({ moments });
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          return MomentActions.seedAllMomentsFailure({ error: errorMessage });
        }
      }),
    ),
  { functional: true },
);

// #region 🔸 Database Effects 🔸

export const addMoment$ = createEffect(
  (actions$ = inject(Actions), db = inject(GameSaveDexieService)) =>
    actions$.pipe(
      ofType(MomentActions.addMoment),
      mergeMap(async ({ moment }) => {
        try {
          await db.saveMoment(moment);
          return MomentActions.addMomentSuccess({ moment });
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          return MomentActions.addMomentFailure({ error: errorMessage });
        }
      }),
    ),
  { functional: true },
);

export const loadAllMoments$ = createEffect(
  (actions$ = inject(Actions), db = inject(GameSaveDexieService)) =>
    actions$.pipe(
      ofType(AppActions.init, MomentActions.loadAllMoments),
      mergeMap(async () => {
        try {
          const moments = await db.loadAllMoments();
          return MomentActions.loadAllMomentsSuccess({ moments });
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          return MomentActions.loadAllMomentsFailure({ error: errorMessage });
        }
      }),
    ),
  { functional: true },
);

export const loadMoment$ = createEffect(
  (actions$ = inject(Actions), db = inject(GameSaveDexieService)) =>
    actions$.pipe(
      ofType(MomentActions.loadMoment),
      mergeMap(async ({ id }) => {
        try {
          const moment = await db.loadMoment(id);
          if (!moment) throw new Error(`Moment not found: ${id}`);
          return MomentActions.loadMomentSuccess({ moment });
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          return MomentActions.loadMomentFailure({ error: errorMessage });
        }
      }),
    ),
  { functional: true },
);

export const saveMoment$ = createEffect(
  (actions$ = inject(Actions), db = inject(GameSaveDexieService)) =>
    actions$.pipe(
      ofType(MomentActions.saveMoment),
      mergeMap(async ({ id, changes }) => {
        try {
          // Fetch the existing model and merge with partial changes
          const current = await db.loadMoment(id);
          if (!current) throw new Error(`Moment not found: ${id}`);

          // Safely map partial updates and cast to strict Model
          const updated = { ...current, ...changes } as Moment;
          await db.saveMoment(updated);

          return MomentActions.saveMomentSuccess({ moment: updated });
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          return MomentActions.saveMomentFailure({ error: errorMessage });
        }
      }),
    ),
  { functional: true },
);

export const removeMoment$ = createEffect(
  (actions$ = inject(Actions), db = inject(GameSaveDexieService)) =>
    actions$.pipe(
      ofType(MomentActions.removeMoment),
      mergeMap(async ({ id }) => {
        try {
          await db.deleteMoment(id);
          return MomentActions.removeMomentSuccess({ id });
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          return MomentActions.removeMomentFailure({ error: errorMessage });
        }
      }),
    ),
  { functional: true },
);
// #endregion
