import { createSelector } from '@ngrx/store';

import { selectAdventureEntities } from './adventure/adventure.selectors';
import { appFeature } from './app.reducer';
import { selectCharacterEntities } from './character/character.selectors';
import { selectLocationEntities } from './location/location.selectors';
import { selectMomentEntities } from './moment/moment.selectors';

export const { selectAppState } = appFeature;

// --- Properties ---

// Feature-provided are already root-state selectors
export const {
  // selectAdventuresSeeded,
  // selectTagsSeeded,
  // selectAttributesSeeded,
  // selectCharactersSeeded,
  // selectLocationsSeeded,
  // selectMomentsSeeded,
  // selectItemsSeeded,
  // selectSkillsSeeded,
  selectSeeded: selectAppSeeded,
  selectError: selectAppError,
  selectAccountId,
  selectCurrentSlotId,
} = appFeature;

// --- Logical Selectors ---

// Current Adventure ID (alias for currentSlotId)
export const selectCurrentAdventureId = selectCurrentSlotId;
// Current Adventure entity
export const selectCurrentAdventure = createSelector(
  selectAdventureEntities,
  selectCurrentAdventureId,
  (entities, adventureId) => (adventureId ? entities[adventureId] : undefined),
);

export const selectCurrentDimensionId = createSelector(
  selectCurrentAdventure,
  (adventure) => adventure?.primeDimension,
);

export const selectCurrentPlaneId = createSelector(
  selectCurrentAdventure,
  (adventure) => adventure?.currentPlaneId,
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

// export const selectCurrentCharacter = createSelector(
//   selectCurrentAdventure,
//   (adventure) =>
//     adventure && adventure.currentCharacterId
//       ? adventure.characters?.[adventure.currentCharacterId]
//       : undefined,
// );

// Composite ID approach, but ended up passing full characterId, not just entityId
// export const selectCurrentCharacter = createSelector(
//   selectCharacterEntities,
//   selectCurrentCharacterId,
//   selectCurrentDimensionId,
//   selectCurrentPlaneId,
//   selectCurrentAdventureId,
//   selectAccountId,
//   (entities, entityId, dimensionId, planeId, adventureId, accountId) => {
//     console.log('selectCurrentCharacter', {
//       entities,
//       entityId,
//       dimensionId,
//       planeId,
//       adventureId,
//       accountId,
//     });
//     const id = buildAdventureEntityCompositeId(
//       entityId,
//       dimensionId,
//       planeId,
//       adventureId,
//       accountId,
//     );
//     return id ? entities[id] : undefined;
//   },
// );

export const selectCurrentCharacter = createSelector(
  selectCharacterEntities,
  selectCurrentCharacterId,
  (entities, characterId) => {
    // console.log('selectCurrentCharacter', { entities, characterId });
    return characterId ? entities[characterId] : undefined;
  },
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

// TODO: DELETE `selectCurrentLogEntries` once `AdventureEvent` is implemented
// // Current Log Entries
// export const selectCurrentLogEntries = createSelector(
//   selectCurrentAdventure,
//   (adventure) => adventure?.eventLog ?? [],
// );
export const selectCurrentLogEntries = selectCurrentMoment;
