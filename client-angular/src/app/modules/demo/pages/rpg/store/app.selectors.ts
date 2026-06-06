import { createSelector } from '@ngrx/store';

import { Character } from '../models/character';
import { buildAdventureEntityTemplateId } from '../utils-composite-id';
import {
  selectAdventureEventLoading,
  selectAllAdventureEvents,
} from './adventure/adventure-event.selectors';
import {
  selectAdventureEntities,
  selectAdventureLoading,
} from './adventure/adventure.selectors';
import { appFeature } from './app.reducer';
import {
  selectCharacterEntities,
  selectCharacterLoading,
} from './character/character.selectors';
import { selectLocationEntities } from './location/location.selectors';
import { selectMomentEntities } from './moment/moment.selectors';

export const { selectAppState } = appFeature;

// --- Properties ---

// Feature-provided are already root-state selectors
export const {
  selectSeeded: selectAppSeeded,
  selectError: selectAppError,
  selectAccountId,
  selectCurrentSlotId,
} = appFeature;

// --- Logical Selectors ---

export const selectIsGameLoading = createSelector(
  selectAdventureLoading,
  selectAdventureEventLoading,
  selectCharacterLoading,
  (advLoading, eventsLoading, charsLoading) =>
    advLoading || eventsLoading || charsLoading,
);

// Current Adventure ID (alias for currentSlotId)
export const selectCurrentAdventureId = selectCurrentSlotId;
// Current Adventure entity
export const selectCurrentAdventure = createSelector(
  selectAdventureEntities,
  selectCurrentAdventureId,
  (entities, adventureId) => (adventureId ? entities[adventureId] : undefined),
);

export const selectCurrentAdventureLog = createSelector(
  selectCurrentAdventure,
  (adventure) => adventure?.log ?? [],
);

export const selectCurrentAdventureEvents = createSelector(
  selectAllAdventureEvents,
  selectCurrentAdventureId,
  (events, adventureId) => events.filter((e) => e.adventureId === adventureId),
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

export const selectCurrentMomentChoices = createSelector(
  selectCurrentMoment,
  (moment) => moment?.choices ?? [],
);

// Translates the Moment's static seed IDs into the Active Adventure IDs for the UI
export const selectActiveMomentCharacters = createSelector(
  selectCurrentMoment,
  selectCurrentAdventureId,
  selectAccountId,
  selectCharacterEntities,
  (moment, adventureId, accountId, entities) => {
    if (!moment || !moment.characters) return [];
    const safeAccountId = accountId || 'guest';
    const safeAdventureId = adventureId || 'template';

    return moment.characters
      .map((charRef) => {
        // Safe base extraction (turns "target-dummy:template:system" into "target-dummy")
        const baseId = charRef.split(':')[0];

        // Rebuild specifically targeting the running save slot!
        const activeId = buildAdventureEntityTemplateId(
          baseId,
          safeAdventureId,
          safeAccountId,
        );

        return activeId ? entities[activeId] : undefined;
      })
      .filter((c): c is Character => !!c); // Only return fully spawned characters
  },
);
