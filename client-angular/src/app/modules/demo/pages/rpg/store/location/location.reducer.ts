import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';

import { Location } from '../../models/location';
import { LocationActions } from './location.actions';

export interface LocationState extends EntityState<Location> {
  seeded: boolean; // for initial load
  loading: boolean; // for any async operation
  loaded: boolean; // for initial load
  error: string | null; // for any async operation
}

export const adapter = createEntityAdapter<Location>();

export const initialState: LocationState = adapter.getInitialState({
  seeded: false,
  loading: false,
  loaded: false,
  error: null,
});

// auto-generates selectors and reducer registration
export const locationFeature = createFeature({
  name: 'location',
  reducer: createReducer(
    initialState,
    // Seed load
    on(LocationActions.seedAllLocationsSuccess, (state, { locations }) =>
      adapter.setAll(locations, { ...state, seeded: true }),
    ),
    // Create
    on(LocationActions.addLocation, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(LocationActions.addLocationSuccess, (state, { location }) =>
      // `addOne` will only add the entity if it does not already exist (by id)
      adapter.addOne(location, { ...state, loading: false }),
    ),
    on(LocationActions.addLocationFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),
    // Read All
    on(LocationActions.loadAllLocations, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(LocationActions.loadAllLocationsSuccess, (state, { locations }) =>
      adapter.upsertMany(locations, { ...state, loading: false, loaded: true }),
    ),
    on(LocationActions.loadAllLocationsFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),
    // Read
    on(LocationActions.loadLocation, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(LocationActions.loadLocationSuccess, (state, { location }) =>
      adapter.upsertOne(location, { ...state, loading: false }),
    ),
    on(LocationActions.loadLocationFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),
    // Update
    on(LocationActions.saveLocation, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(LocationActions.saveLocationSuccess, (state, { location }) =>
      adapter.upsertOne(location, { ...state, loading: false }),
    ),
    on(LocationActions.saveLocationFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),
    // Delete
    on(LocationActions.removeLocation, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(LocationActions.removeLocationSuccess, (state, { id }) =>
      adapter.removeOne(id, { ...state, loading: false }),
    ),
    on(LocationActions.removeLocationFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),
  ),
});
