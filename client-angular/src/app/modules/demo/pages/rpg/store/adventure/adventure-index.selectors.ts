import { adapter, adventureIndexFeature } from './adventure-index.reducer';

export const { selectAdventureIndexState } = adventureIndexFeature;

export const {
  selectAll: selectAllAdventureIndexes, // Array of all adventure indexes
  selectEntities: selectAdventureIndexEntities, // Dictionary of all adventure indexes
  selectIds: selectAdventureIndexIds, // Array of all adventureIndex IDs
  selectTotal: selectAdventureIndexTotal, // Total number of adventure indexes
} = adapter.getSelectors(selectAdventureIndexState);

// --- Properties ---

// Feature-provided are already root-state selectors
export const {
  selectLoading: selectAdventureIndexLoading,
  selectLoaded: selectAdventureIndexLoaded,
  selectError: selectAdventureIndexError,
} = adventureIndexFeature;
