import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';

import { Location } from '../../models/location';
import { LocationActions } from './location.actions';

export interface LocationState extends EntityState<Location> {
  seeded: boolean;
  loading: boolean;
  loaded: boolean;
  saving: boolean;
  error: string | null;
}

export const adapter = createEntityAdapter<Location>();

export const initialState: LocationState = adapter.getInitialState({
  seeded: false,
  loading: false,
  loaded: false,
  saving: false,
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
      saving: true,
      error: null,
    })),
    on(LocationActions.addLocationSuccess, (state, { location }) =>
      // `addOne` will only add the entity if it does not already exist (by id)
      adapter.addOne(location, { ...state, saving: false }),
    ),
    on(LocationActions.addLocationFailure, (state, { error }) => ({
      ...state,
      saving: false,
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

    // Update (optimistic, lets UI immediately reflect changes)
    on(LocationActions.saveLocation, (state, { id, changes }) =>
      adapter.updateOne(
        { id, changes },
        { ...state, saving: true, error: null },
      ),
    ),
    // Full update with actual saved data
    on(LocationActions.saveLocationSuccess, (state, { location }) =>
      adapter.upsertOne(location, { ...state, saving: false }),
    ),
    on(LocationActions.saveLocationFailure, (state, { error }) => ({
      ...state,
      saving: false,
      error,
    })),

    // Delete
    on(LocationActions.removeLocation, (state) => ({
      ...state,
      saving: true,
      error: null,
    })),
    on(LocationActions.removeLocationSuccess, (state, { id }) =>
      adapter.removeOne(id, { ...state, saving: false }),
    ),
    on(LocationActions.removeLocationFailure, (state, { error }) => ({
      ...state,
      saving: false,
      error,
    })),
  ),
});
