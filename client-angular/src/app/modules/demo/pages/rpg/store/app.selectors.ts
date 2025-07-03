import { createSelector } from '@ngrx/store';

import { selectAdventureEntities } from './adventure/adventure.selectors';
import { appFeature } from './app.reducer';
import { selectLocationEntities } from './location/location.selectors';
import { selectMomentEntities } from './moment/moment.selectors';

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
  (entities, adventureId) => (adventureId ? entities[adventureId] : undefined),
);

// Current Character ID
export const selectCurrentCharacterId = createSelector(
  selectCurrentAdventure,
  (adventure) => adventure?.currentCharacterId,
);
// export const selectCurrentCharacter = createSelector(
//   selectCurrentCharacterId,
//   selectCharacterEntities,
//   (characterId, entities) => (characterId ? entities[characterId] : undefined),
// );
export const selectCurrentCharacter = createSelector(
  selectCurrentAdventure,
  (adventure) =>
    adventure && adventure.currentCharacterId
      ? adventure.characters?.[adventure.currentCharacterId]
      : undefined,
);

// Current Location ID
export const selectCurrentLocationId = createSelector(
  selectCurrentAdventure,
  (adventure) => adventure?.currentLocationId,
);
export const selectCurrentLocation = createSelector(
  selectCurrentLocationId,
  selectLocationEntities,
  (locationId, entities) => (locationId ? entities[locationId] : undefined),
);

// Current Moment ID
export const selectCurrentMomentId = createSelector(
  selectCurrentAdventure,
  (adventure) => adventure?.currentMomentId,
);
export const selectCurrentMoment = createSelector(
  selectCurrentMomentId,
  selectMomentEntities,
  (momentId, momentEntities) =>
    momentId ? momentEntities[momentId] : undefined,
);

// Current Log Entries
export const selectCurrentLogEntries = createSelector(
  selectCurrentAdventure,
  (adventure) => adventure?.eventLog ?? [],
);
