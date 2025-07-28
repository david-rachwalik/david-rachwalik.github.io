import { createSelector } from '@ngrx/store';

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
  selectSeeded: selectLocationSeeded,
  selectLoading: selectLocationLoading,
  selectLoaded: selectLocationLoaded,
  selectError: selectLocationError,
} = locationFeature;

// --- Selector Factories (do NOT use in other selectors) ---

export const selectLocationById = (id: string | undefined) =>
  createSelector(selectLocationEntities, (entities) =>
    id ? entities[id] : undefined,
  );
