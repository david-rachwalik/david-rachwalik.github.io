import { createSelector } from '@ngrx/store';

import { selectCurrentLocationId } from '../app.selectors';
import { adapter, locationFeature } from './location.reducer';

export const { selectLocationState } = locationFeature;

export const {
  selectAll: selectAllLocations, // Array of all locations
  selectEntities: selectLocationEntities, // Dictionary of all locations
  selectIds: selectLocationIds, // Array of all location IDs
  selectTotal: selectLocationTotal, // Total number of locations
} = adapter.getSelectors(selectLocationState);

// --- Properties ---

// Feature-provided are already root-state selectors
export const {
  selectLoading: selectLocationLoading,
  selectLoaded: selectLocationLoaded,
  selectError: selectLocationError,
} = locationFeature;

// --- Logical Selectors ---

// Selector to get a location by id
export const selectLocationById = (id: string | undefined) =>
  createSelector(selectLocationEntities, (entities) =>
    id ? entities[id] : undefined,
  );

export const selectCurrentLocation = createSelector(
  selectCurrentLocationId,
  (locationId) => selectLocationById(locationId),
);
