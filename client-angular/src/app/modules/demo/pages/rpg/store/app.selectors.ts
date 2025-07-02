import { createSelector } from '@ngrx/store';

import { selectAdventureEntities } from './adventure/adventure.selectors';
import { appFeature } from './app.reducer';

export const { selectAppState } = appFeature;

// --- Properties ---

// Feature-provided are already root-state selectors
export const { selectSeeded: selectAppSeeded, selectCurrentSlotId } =
  appFeature;

// --- Logical Selectors ---

// Current Adventure ID (alias for currentSlotId)
export const selectCurrentAdventureId = selectCurrentSlotId;
// Current Adventure entity
export const selectCurrentAdventure = createSelector(
  selectAdventureEntities,
  selectCurrentAdventureId,
  (entities, slotId) => (slotId ? entities[slotId] : undefined),
);

// Current Character ID
export const selectCurrentCharacterId = createSelector(
  selectCurrentAdventure,
  (adventure) => adventure?.currentCharacterId,
);
// Current Character entity
export const selectCurrentCharacter = createSelector(
  selectCurrentAdventure,
  (adventure) =>
    // adventure?.characters?.find((c) => c.id === adventure.currentCharacterId),
    adventure?.characters[adventure.currentCharacterId],
);

// Current Location ID
export const selectCurrentLocationId = createSelector(
  selectCurrentAdventure,
  (adventure) => adventure?.currentLocationId,
);

// Current Moment ID
export const selectCurrentMomentId = createSelector(
  selectCurrentAdventure,
  (adventure) => adventure?.currentMomentId,
);
// Current Moment entity
export const selectCurrentMoment = createSelector(
  selectCurrentAdventure,
  (adventure) => adventure?.moments[adventure.currentMomentId],
);

// Current Log Entries
export const selectCurrentLogEntries = createSelector(
  selectCurrentAdventure,
  (adventure) => adventure?.eventLog ?? [],
);
