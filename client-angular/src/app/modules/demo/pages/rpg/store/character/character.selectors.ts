import { createFeatureSelector, createSelector } from '@ngrx/store';

import { CharacterState, adapter } from './character.reducer';

export const selectCharacterState =
  createFeatureSelector<CharacterState>('character');

const { selectAll, selectEntities, selectIds, selectTotal } =
  adapter.getSelectors();

// Array of all characters
export const selectAllCharacters = createSelector(
  selectCharacterState,
  selectAll,
);

// Dictionary of all characters
export const selectCharacterEntities = createSelector(
  selectCharacterState,
  selectEntities,
);

// Array of all character IDs
export const selectCharacterIds = createSelector(
  selectCharacterState,
  selectIds,
);

// Total number of characters
export const selectCharacterTotal = createSelector(
  selectCharacterState,
  selectTotal,
);

// Loading flag
export const selectCharacterLoading = createSelector(
  selectCharacterState,
  (state) => state.loading,
);

// Loaded flag
export const selectCharacterLoaded = createSelector(
  selectCharacterState,
  (state) => state.loaded,
);

// Error (if any)
export const selectCharacterError = createSelector(
  selectCharacterState,
  (state) => state.error,
);
