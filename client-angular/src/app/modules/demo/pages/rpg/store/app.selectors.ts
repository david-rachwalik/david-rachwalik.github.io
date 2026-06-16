import { createSelector } from '@ngrx/store';

import { Character } from '../models/character';
import {
  buildAdventureEntityCompositeId,
  DEFAULT_DIMENSION_ID,
  DEFAULT_PLANE_ID,
  GUEST_ACCOUNT_ID,
  parseCompositeId,
} from '../utils-composite-id';
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
  // Fallback to native origin if current is missing
  (adventure) => adventure?.currentDimensionId || adventure?.primeDimension,
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

export const selectCurrentCharacter = createSelector(
  selectCharacterEntities,
  selectCurrentCharacterId,
  (entities, characterId) => {
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
    // Fast fail: if no active adventure, there are no active characters
    if (!moment || !moment.characters || !adventureId) return [];

    // Active players default to 'guest' if not signed in, never 'system' (templates)
    const safeAccountId = accountId || GUEST_ACCOUNT_ID;

    return moment.characters
      .map((charRef) => {
        // Safely parse the character request string into discrete parts
        const parsed = parseCompositeId(charRef);
        if (!parsed.entityId) return undefined;

        // Infer dimensional context coordinates dynamically
        const dimId =
          parsed.dimensionId || moment.dimensionId || DEFAULT_DIMENSION_ID;
        const planeId = parsed.planeId || moment.planeId || DEFAULT_PLANE_ID;

        // Specifically target the running save slot
        const activeId = buildAdventureEntityCompositeId(
          parsed.entityId,
          dimId,
          planeId,
          adventureId,
          safeAccountId,
        );

        return activeId ? entities[activeId] : undefined;
      })
      .filter((c): c is Character => !!c); // Only return fully spawned characters
  },
);
