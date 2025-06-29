import { createFeatureSelector, createSelector } from '@ngrx/store';

import { selectAdventureEntities } from './adventure/adventure.selectors';
import { appFeature, AppState } from './app.reducer';

export const { selectSeeded, selectCurrentSlotId } = appFeature;

export const selectAppState = createFeatureSelector<AppState>('app');

// Current Adventure ID (alias for currentSlotId)
export const selectCurrentAdventureId = selectCurrentSlotId;

// Current Adventure entity (from adventure feature)
export const selectCurrentAdventure = createSelector(
  selectAdventureEntities,
  selectCurrentSlotId,
  (entities, slotId) => (slotId ? entities[slotId] : undefined),
);

// Current Character ID (from current adventure)
export const selectCurrentCharacterId = createSelector(
  selectCurrentAdventure,
  (adventure) => adventure?.currentCharacterId,
);

// Current Character entity (from character feature)
export const selectCurrentCharacter = createSelector(
  selectCurrentAdventure,
  (adventure) =>
    adventure?.characters?.find((c) => c.id === adventure.currentCharacterId),
);

// Current Moment ID (from current adventure)
export const selectCurrentMomentId = createSelector(
  selectCurrentAdventure,
  (adventure) => adventure?.currentMomentId,
);

// Current Moment entity (from moment feature)
// export const selectCurrentMoment = createSelector(
//   selectMomentEntities,
//   selectCurrentMomentId,
//   (entities, id) => (id ? entities[id] : undefined),
// );
export const selectCurrentMoment = createSelector(
  selectCurrentAdventure,
  (adventure) =>
    adventure?.moments?.find((m) => m.id === adventure.currentMomentId),
);

// Current Log Entries (for current adventure)
export const selectCurrentLogEntries = createSelector(
  selectCurrentAdventure,
  (adventure) => adventure?.eventLog ?? [],
);
