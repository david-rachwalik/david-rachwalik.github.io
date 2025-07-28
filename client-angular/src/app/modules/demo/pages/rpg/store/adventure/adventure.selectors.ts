import { createSelector } from '@ngrx/store';

import { adapter, adventureFeature } from './adventure.reducer';

export const { selectAdventureState } = adventureFeature;

export const {
  selectAll: selectAllAdventures, // Array of all adventures
  selectEntities: selectAdventureEntities, // Dictionary of all adventures
  selectIds: selectAdventureIds, // Array of all adventure IDs
  selectTotal: selectAdventureTotal, // Total number of adventures
} = adapter.getSelectors(selectAdventureState);

// --- Properties ---

// Feature-provided are already root-state selectors
export const {
  selectSeeded: selectAdventureSeeded,
  selectLoading: selectAdventureLoading,
  selectLoaded: selectAdventureLoaded,
  selectError: selectAdventureError,
} = adventureFeature;

// --- Selector Factories (do NOT use in other selectors) ---

export const selectAdventureById = (id: string | undefined) =>
  createSelector(selectAdventureEntities, (entities) =>
    id ? entities[id] : undefined,
  );
