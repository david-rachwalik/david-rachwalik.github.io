import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AdventureState, adapter } from './adventure.reducer';

export const selectAdventureState =
  createFeatureSelector<AdventureState>('adventure');

const { selectAll, selectEntities, selectIds, selectTotal } =
  adapter.getSelectors();

// Array of all adventures
export const selectAllAdventures = createSelector(
  selectAdventureState,
  selectAll,
);

// Dictionary of all adventures
export const selectAdventureEntities = createSelector(
  selectAdventureState,
  selectEntities,
);

// Array of all adventure IDs
export const selectAdventureIds = createSelector(
  selectAdventureState,
  selectIds,
);

// Total number of adventures
export const selectAdventureTotal = createSelector(
  selectAdventureState,
  selectTotal,
);

// Loading flag
export const selectAdventureLoading = createSelector(
  selectAdventureState,
  (state) => state.loading,
);

// Loaded flag
export const selectAdventureLoaded = createSelector(
  selectAdventureState,
  (state) => state.loaded,
);

// Error (if any)
export const selectAdventureError = createSelector(
  selectAdventureState,
  (state) => state.error,
);
