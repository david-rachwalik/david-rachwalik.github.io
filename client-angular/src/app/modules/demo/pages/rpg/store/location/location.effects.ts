import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap } from 'rxjs';

import { Location } from '../../models/location';
import { GameDataService } from '../../services/game-data.service';
import { GameSaveDexieService } from '../../services/game-save-dexie.service';
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
          // console.log('seedAllLocations$ found locations: ', locations);
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

// #region 🔸 Database Effects 🔸

export const addLocation$ = createEffect(
  (actions$ = inject(Actions), db = inject(GameSaveDexieService)) =>
    actions$.pipe(
      ofType(LocationActions.addLocation),
      mergeMap(async ({ location }) => {
        try {
          await db.saveLocation(location);
          return LocationActions.addLocationSuccess({ location });
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          return LocationActions.addLocationFailure({ error: errorMessage });
        }
      }),
    ),
  { functional: true },
);

export const loadAllLocations$ = createEffect(
  (actions$ = inject(Actions), db = inject(GameSaveDexieService)) =>
    actions$.pipe(
      ofType(AppActions.init, LocationActions.loadAllLocations),
      mergeMap(async () => {
        try {
          const locations = await db.loadAllLocations();
          return LocationActions.loadAllLocationsSuccess({ locations });
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          return LocationActions.loadAllLocationsFailure({
            error: errorMessage,
          });
        }
      }),
    ),
  { functional: true },
);

export const loadLocation$ = createEffect(
  (actions$ = inject(Actions), db = inject(GameSaveDexieService)) =>
    actions$.pipe(
      ofType(LocationActions.loadLocation),
      mergeMap(async ({ id }) => {
        try {
          const location = await db.loadLocation(id);
          if (!location) throw new Error(`Location not found: ${id}`);
          return LocationActions.loadLocationSuccess({ location });
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          return LocationActions.loadLocationFailure({
            error: errorMessage,
          });
        }
      }),
    ),
  { functional: true },
);

export const saveLocation$ = createEffect(
  (actions$ = inject(Actions), db = inject(GameSaveDexieService)) =>
    actions$.pipe(
      ofType(LocationActions.saveLocation),
      mergeMap(async ({ id, changes }) => {
        try {
          // Fetch the existing model and merge with partial changes
          const current = await db.loadLocation(id);
          if (!current) throw new Error(`Location not found: ${id}`);

          // Safely map partial updates and cast to strict Model
          const updated = { ...current, ...changes } as Location;
          await db.saveLocation(updated);

          return LocationActions.saveLocationSuccess({ location: updated });
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          return LocationActions.saveLocationFailure({ error: errorMessage });
        }
      }),
    ),
  { functional: true },
);

export const removeLocation$ = createEffect(
  (actions$ = inject(Actions), db = inject(GameSaveDexieService)) =>
    actions$.pipe(
      ofType(LocationActions.removeLocation),
      mergeMap(async ({ id }) => {
        try {
          await db.deleteLocation(id);
          return LocationActions.removeLocationSuccess({ id });
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          return LocationActions.removeLocationFailure({ error: errorMessage });
        }
      }),
    ),
  { functional: true },
);
// #endregion
