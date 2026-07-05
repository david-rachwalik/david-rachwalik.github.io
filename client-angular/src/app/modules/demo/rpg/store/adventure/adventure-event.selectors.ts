import { adapter, adventureEventFeature } from './adventure-event.reducer';

export const { selectAdventureEventState } = adventureEventFeature;

export const {
  selectAll: selectAllAdventureEvents, // Array of all adventure eventes
  selectEntities: selectAdventureEventEntities, // Dictionary of all adventure eventes
  selectIds: selectAdventureEventIds, // Array of all adventureEvent IDs
  selectTotal: selectAdventureEventTotal, // Total number of adventure eventes
} = adapter.getSelectors(selectAdventureEventState);

// --- Properties ---

// Feature-provided are already root-state selectors
export const {
  selectLoading: selectAdventureEventLoading,
  selectLoaded: selectAdventureEventLoaded,
  selectError: selectAdventureEventError,
} = adventureEventFeature;
