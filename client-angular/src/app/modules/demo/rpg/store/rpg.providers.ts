import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';

import {
  addAdventureEvent$,
  addAdventureEventOnAdventureAdd$,
  loadAllAdventureEvents$,
  removeAdventureEvents$,
  removeAllAdventureEvents$,
  saveAdventureEvent$,
} from './adventure/adventure-event.effects';
import { adventureEventFeature } from './adventure/adventure-event.reducer';
import {
  addAdventureIndex$,
  addAdventureIndexOnAdventureAdd$,
  loadAllAdventureIndexes$,
  removeAdventureIndex$,
  removeAdventureIndexOnAdventureRemove$,
  saveAdventureIndex$,
  saveAdventureIndexOnAdventureSave$,
} from './adventure/adventure-index.effects';
import { adventureIndexFeature } from './adventure/adventure-index.reducer';
import {
  addAdventure$,
  loadAdventure$,
  removeAdventure$,
  saveAdventure$,
} from './adventure/adventure.effects';
import { adventureFeature } from './adventure/adventure.reducer';
import {
  appSeedSuccess$,
  downloadSave$,
  initLoadAccountId$,
  initLoadAllSeeds$,
  initLoadCurrentSlotId$,
  saveCurrentSlotIdLocal$,
  setCurrentSlotIdOnAdventureAdd$,
  uploadSave$,
} from './app.effects';
import { appFeature } from './app.reducer';
import { seedAllAttributes$ } from './attribute/attribute.effects';
import { attributeFeature } from './attribute/attribute.reducer';
import {
  addCharacter$,
  loadAllCharacters$,
  loadCharacter$,
  removeAllCharacters$,
  removeCharacter$,
  saveAllCharacters$,
  saveAllCharactersOnAdventureSave$,
  saveCharacter$,
  seedAllCharacters$,
} from './character/character.effects';
import { characterFeature } from './character/character.reducer';
import { seedAllEffects$ } from './effect/effect.effects';
import { effectFeature } from './effect/effect.reducer';
import { seedAllItems$ } from './item/item.effects';
import { itemFeature } from './item/item.reducer';
import { seedAllLocations$ } from './location/location.effects';
import { locationFeature } from './location/location.reducer';
import { seedAllMoments$ } from './moment/moment.effects';
import { momentFeature } from './moment/moment.reducer';
import { seedAllSkills$ } from './skill/skill.effects';
import { skillFeature } from './skill/skill.reducer';
import { seedAllTags$ } from './tag/tag.effects';
import { tagFeature } from './tag/tag.reducer';

export const RPG_STORE_PROVIDERS = [
  // Feature states included in store
  provideState(appFeature),
  provideState(attributeFeature),
  provideState(tagFeature),
  provideState(effectFeature),
  provideState(adventureFeature),
  provideState(adventureIndexFeature),
  provideState(adventureEventFeature),
  provideState(characterFeature),
  provideState(locationFeature),
  provideState(momentFeature),
  provideState(itemFeature),
  provideState(skillFeature),

  // Feature effects active & listening
  provideEffects([
    {
      // --- Initialize App ---
      // Auto-load at startup
      initLoadAccountId$,
      initLoadCurrentSlotId$,
      initLoadAllSeeds$,
      // playLoadActiveGame$,

      // Load static data seeds
      seedAllAttributes$,
      seedAllTags$,
      seedAllEffects$,
      seedAllCharacters$,
      seedAllLocations$,
      seedAllMoments$,
      seedAllItems$,
      seedAllSkills$,
      appSeedSuccess$,

      // --- Feature CRUD (IndexedDB via Dexie) ---
      // Adventure (full game state)
      addAdventure$,
      loadAdventure$,
      saveAdventure$,
      removeAdventure$,
      // AdventureIndex (game metadata)
      addAdventureIndex$,
      loadAllAdventureIndexes$,
      saveAdventureIndex$,
      removeAdventureIndex$,
      // AdventureEvent (game history)
      addAdventureEvent$,
      loadAllAdventureEvents$,
      saveAdventureEvent$,
      removeAdventureEvents$,
      removeAllAdventureEvents$,
      // Character
      addCharacter$,
      loadAllCharacters$,
      loadCharacter$,
      saveCharacter$,
      saveAllCharacters$,
      removeCharacter$,
      removeAllCharacters$,

      // --- App Method Effects (on demand) ---
      saveCurrentSlotIdLocal$,
      downloadSave$,
      uploadSave$,

      // --- App Chain Effects (automatic) ---
      setCurrentSlotIdOnAdventureAdd$,
      addAdventureIndexOnAdventureAdd$,
      addAdventureEventOnAdventureAdd$,
      saveAdventureIndexOnAdventureSave$,
      removeAdventureIndexOnAdventureRemove$,
      saveAllCharactersOnAdventureSave$,
    },
  ]),
];
