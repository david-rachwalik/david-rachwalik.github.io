import { createSelector } from '@ngrx/store';

import { adapter, characterFeature } from './character.reducer';

export const { selectCharacterState } = characterFeature;

export const {
  selectAll: selectAllCharacters, // Array of all characters
  selectEntities: selectCharacterEntities, // Dictionary of all characters
  selectIds: selectCharacterIds, // Array of all character IDs
  selectTotal: selectCharacterTotal, // Total number of characters
} = adapter.getSelectors(selectCharacterState);

// --- Properties ---

// Feature-generated are already root-state selectors
export const {
  selectSeeded: selectCharacterSeeded,
  selectLoading: selectCharacterLoading,
  selectLoaded: selectCharacterLoaded,
  selectError: selectCharacterError,
} = characterFeature;

// --- Selector Factories (do NOT use in other selectors) ---

export const selectCharacterById = (id: string | undefined) =>
  createSelector(selectCharacterEntities, (entities) =>
    id ? entities[id] : undefined,
  );
