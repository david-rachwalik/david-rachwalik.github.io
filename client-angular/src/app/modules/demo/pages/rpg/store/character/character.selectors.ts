import { createSelector } from '@ngrx/store';

import { selectCurrentCharacterId } from '../app.selectors';
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
  selectLoading: selectCharacterLoading,
  selectLoaded: selectCharacterLoaded,
  selectError: selectCharacterError,
} = characterFeature;

// --- Logical Selectors ---

// Selector to get a character by id
export const selectCharacterById = (id: string | undefined) =>
  createSelector(selectCharacterEntities, (entities) =>
    id ? entities[id] : undefined,
  );

export const selectCurrentCharacter = createSelector(
  selectCurrentCharacterId,
  // selectCharacterEntities,
  // (characterId, entities) => (characterId ? entities[characterId] : undefined),
  (characterId) => selectCharacterById(characterId),
);
