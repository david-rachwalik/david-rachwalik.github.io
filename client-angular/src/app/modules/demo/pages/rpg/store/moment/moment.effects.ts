import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs';

import { GameDataService } from '../../services/game-data.service';
import { AppActions } from '../app.actions';
import { MomentActions } from './moment.actions';

// Seed loader
export const seedAllMoments$ = createEffect(
  (actions$ = inject(Actions), data = inject(GameDataService)) =>
    actions$.pipe(
      // ofType(MomentActions.loadMoments),
      // ofType(MomentActions.loadMomentsSeed),
      ofType(AppActions.loadAllSeeds),
      map(() => {
        try {
          const moments = data.getAllMoments();
          console.log('loadMomentsSeed found moments: ', moments);
          return MomentActions.seedAllMomentsSuccess({ moments });
        } catch (error) {
          return MomentActions.seedAllMomentsFailure({ error: String(error) });
        }
      }),
    ),
  { functional: true },
);

// export const loadMomentsSeed$ = createEffect(
//   (actions$ = inject(Actions)) =>
//     actions$.pipe(
//       ofType(AppActions.loadAllSeeds),
//       map(() => MomentActions.loadMomentsSuccess({ moments: MOMENTS_SEED })),
//     ),
//   { functional: true },
// );

// Main entry point - API loader (stub for now)
export const loadAllMomentsApi$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      // ofType(MomentActions.loadMomentsSeed),
      ofType(AppActions.loadAllSeeds),
      // Replace with real API call later
      // Will just use `loadMomentsSuccess`, not `loadMomentsAPISuccess`
      map(() =>
        MomentActions.loadAllMomentsFailure({ error: 'API not implemented' }),
      ),
    ),
  { functional: true },
);

// // #region 🔸 Dexie Effects (IndexedDb, asynchronous) 🔸

// export const addMomentDexie$ = createEffect(
//   (actions$ = inject(Actions), saveService = inject(GameSaveDexieService)) =>
//     actions$.pipe(
//       ofType(MomentActions.addMoment),
//       mergeMap(async ({ moment }) => {
//         try {
//           await saveService.saveMoment(moment);
//           return MomentActions.addMomentSuccess({ moment });
//         } catch (error) {
//           return MomentActions.addMomentFailure({ error: String(error) });
//         }
//       }),
//     ),
//   { functional: true },
// );

// export const loadAllMomentsDexie$ = createEffect(
//   (actions$ = inject(Actions), saveService = inject(GameSaveDexieService)) =>
//     actions$.pipe(
//       ofType(AppActions.init, MomentActions.loadAllMoments),
//       mergeMap(async () => {
//         try {
//           const moments = await saveService.loadAllMoments();
//           return MomentActions.loadAllMomentsSuccess({ moments });
//         } catch (error) {
//           return MomentActions.loadAllMomentsFailure({ error: String(error) });
//         }
//       }),
//     ),
//   { functional: true },
// );

// export const loadMomentDexie$ = createEffect(
//   (actions$ = inject(Actions), saveService = inject(GameSaveDexieService)) =>
//     actions$.pipe(
//       ofType(MomentActions.loadMoment),
//       mergeMap(async ({ id }) => {
//         try {
//           const moment = await saveService.loadMoment(id);
//           if (!moment) throw new Error(`Moment not found: ${id}`);
//           return MomentActions.loadMomentSuccess({ moment });
//         } catch (error) {
//           return MomentActions.loadMomentFailure({ error: String(error) });
//         }
//       }),
//     ),
//   { functional: true },
// );

// export const saveMomentDexie$ = createEffect(
//   (actions$ = inject(Actions), saveService = inject(GameSaveDexieService)) =>
//     actions$.pipe(
//       ofType(MomentActions.saveMoment),
//       mergeMap(async ({ moment }) => {
//         try {
//           // Directly save the full moment (no merge with existing)
//           await saveService.saveMoment(moment);
//           return MomentActions.saveMomentSuccess({ moment });
//         } catch (error) {
//           return MomentActions.saveMomentFailure({ error: String(error) });
//         }
//       }),
//     ),
//   { functional: true },
// );

// export const removeMomentDexie$ = createEffect(
//   (actions$ = inject(Actions), saveService = inject(GameSaveDexieService)) =>
//     actions$.pipe(
//       ofType(MomentActions.removeMoment),
//       mergeMap(async ({ id }) => {
//         try {
//           await saveService.deleteMoment(id);
//           return MomentActions.removeMomentSuccess({ id });
//         } catch (error) {
//           return MomentActions.removeMomentFailure({ error: String(error) });
//         }
//       }),
//     ),
//   { functional: true },
// );
// // #endregion
