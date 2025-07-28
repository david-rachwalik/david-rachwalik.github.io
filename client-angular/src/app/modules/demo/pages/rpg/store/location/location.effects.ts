import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs';

import { GameDataService } from '../../services/game-data.service';
import { AppActions } from '../app.actions';
import { LocationActions } from './location.actions';

// Seed loader
export const seedAllLocations$ = createEffect(
  (actions$ = inject(Actions), data = inject(GameDataService)) =>
    actions$.pipe(
      // ofType(LocationActions.loadLocationsSeed),
      ofType(AppActions.loadAllSeeds),
      map(() => {
        try {
          const locations = data.getAllLocations();
          console.log('loadLocationsSeed found locations: ', locations);
          return LocationActions.seedAllLocationsSuccess({ locations });
        } catch (error) {
          return LocationActions.seedAllLocationsFailure({
            error: String(error),
          });
        }
      }),
    ),
  { functional: true },
);

// Main entry point - API loader (stub for now)
export const loadAllLocationsApi$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(LocationActions.loadAllLocations),
      // Replace with real API call later
      // Will just use `loadLocationsSuccess`, not `loadLocationsAPISuccess`
      map(() =>
        LocationActions.loadAllLocationsFailure({
          error: 'API not implemented',
        }),
      ),
    ),
  { functional: true },
);

// // #region 🔸 Dexie Effects (IndexedDb, asynchronous) 🔸

// export const addLocationDexie$ = createEffect(
//   (actions$ = inject(Actions), saveService = inject(GameSaveDexieService)) =>
//     actions$.pipe(
//       ofType(LocationActions.addLocation),
//       mergeMap(async ({ location }) => {
//         try {
//           await saveService.saveLocation(location);
//           return LocationActions.addLocationSuccess({ location });
//         } catch (error) {
//           return LocationActions.addLocationFailure({ error: String(error) });
//         }
//       }),
//     ),
//   { functional: true },
// );

// export const loadAllLocationsDexie$ = createEffect(
//   (actions$ = inject(Actions), saveService = inject(GameSaveDexieService)) =>
//     actions$.pipe(
//       ofType(AppActions.init, LocationActions.loadAllLocations),
//       mergeMap(async () => {
//         try {
//           const locations = await saveService.loadAllLocations();
//           return LocationActions.loadAllLocationsSuccess({ locations });
//         } catch (error) {
//           return LocationActions.loadAllLocationsFailure({
//             error: String(error),
//           });
//         }
//       }),
//     ),
//   { functional: true },
// );

// export const loadLocationDexie$ = createEffect(
//   (actions$ = inject(Actions), saveService = inject(GameSaveDexieService)) =>
//     actions$.pipe(
//       ofType(LocationActions.loadLocation),
//       mergeMap(async ({ id }) => {
//         try {
//           const location = await saveService.loadLocation(id);
//           if (!location) throw new Error(`Location not found: ${id}`);
//           return LocationActions.loadLocationSuccess({ location });
//         } catch (error) {
//           return LocationActions.loadLocationFailure({
//             error: String(error),
//           });
//         }
//       }),
//     ),
//   { functional: true },
// );

// export const saveLocationDexie$ = createEffect(
//   (actions$ = inject(Actions), saveService = inject(GameSaveDexieService)) =>
//     actions$.pipe(
//       ofType(LocationActions.saveLocation),
//       mergeMap(async ({ location }) => {
//         try {
//           // Directly save the full location (no merge with existing)
//           await saveService.saveLocation(location);
//           return LocationActions.saveLocationSuccess({ location });
//         } catch (error) {
//           return LocationActions.saveLocationFailure({ error: String(error) });
//         }
//       }),
//     ),
//   { functional: true },
// );

// export const removeLocationDexie$ = createEffect(
//   (actions$ = inject(Actions), saveService = inject(GameSaveDexieService)) =>
//     actions$.pipe(
//       ofType(LocationActions.removeLocation),
//       mergeMap(async ({ id }) => {
//         try {
//           await saveService.deleteLocation(id);
//           return LocationActions.removeLocationSuccess({ id });
//         } catch (error) {
//           return LocationActions.removeLocationFailure({
//             error: String(error),
//           });
//         }
//       }),
//     ),
//   { functional: true },
// );
// // #endregion
