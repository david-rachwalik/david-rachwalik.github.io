import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';

import { Location } from '../../models/location';
import { LocationActions } from './location.actions';

export interface LocationState extends EntityState<Location> {
  loaded: boolean;
  loading: boolean;
  error: string | null;
}

export const adapter = createEntityAdapter<Location>();

export const initialState: LocationState = adapter.getInitialState({
  loaded: false,
  loading: false,
  error: null,
});

// auto-generates selectors and reducer registration
export const locationFeature = createFeature({
  name: 'location',
  reducer: createReducer(
    initialState,
    on(LocationActions.loadLocations, (state) => ({
      ...state,
      loading: true,
    })),
    on(LocationActions.loadLocationsSuccess, (state, { locations }) =>
      adapter.setAll(locations, { ...state, loading: false, loaded: true }),
    ),
    on(LocationActions.loadLocationsSeedSuccess, (state, { locations }) =>
      adapter.setAll(locations, {
        ...state,
        loading: false,
        loaded: true,
      }),
    ),
    on(LocationActions.loadLocationsFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),
    on(LocationActions.addLocationSuccess, (state, { location }) =>
      adapter.addOne(location, state),
    ),
    on(LocationActions.updateLocationSuccess, (state, { location }) =>
      adapter.upsertOne(location, state),
    ),
    on(LocationActions.deleteLocationSuccess, (state, { id }) =>
      adapter.removeOne(id, state),
    ),
  ),
});
