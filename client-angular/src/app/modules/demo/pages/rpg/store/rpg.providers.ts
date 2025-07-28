import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';

import {
  addAdventureEventDexie$,
  addAdventureEventOnAdventureAdd$,
  loadAllAdventureEventsDexie$,
  removeAdventureEventsDexie$,
  removeAllAdventureEventsDexie$,
  saveAdventureEventDexie$,
} from './adventure/adventure-event.effects';
import { adventureEventFeature } from './adventure/adventure-event.reducer';
import {
  addAdventureIndexDexie$,
  addAdventureIndexOnAdventureAdd$,
  loadAllAdventureIndexesDexie$,
  removeAdventureIndexDexie$,
  removeAdventureIndexOnAdventureRemove$,
  saveAdventureIndexDexie$,
  saveAdventureIndexOnAdventureSave$,
} from './adventure/adventure-index.effects';
import { adventureIndexFeature } from './adventure/adventure-index.reducer';
import {
  addAdventureDexie$,
  loadAdventureDexie$,
  removeAdventureDexie$,
  saveAdventureDexie$,
  seedAllAdventures$,
} from './adventure/adventure.effects';
import { adventureFeature } from './adventure/adventure.reducer';
import {
  appSeedSuccess$,
  downloadSave$,
  initLoadAccountId$,
  initLoadAllSeeds$,
  initLoadCurrentSlotId$,
  playLoadAdventure$,
  saveCurrentSlotIdLocal$,
  setCurrentSlotIdOnAdventureAdd$,
  uploadSave$,
} from './app.effects';
import { appFeature } from './app.reducer';
import { seedAllAttributes$ } from './attribute/attribute.effects';
import { attributeFeature } from './attribute/attribute.reducer';
import {
  addCharacterDexie$,
  loadAllCharactersDexie$,
  loadCharacterDexie$,
  removeAllCharactersDexie$,
  removeCharacterDexie$,
  saveAllCharactersDexie$,
  saveAllCharactersOnAdventureSave$,
  saveCharacterDexie$,
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

// Add other features as you create them!
export const RPG_STORE_PROVIDERS = [
  // Feature states included in store
  provideState(appFeature),
  provideState(adventureFeature),
  provideState(adventureIndexFeature),
  provideState(adventureEventFeature),
  provideState(tagFeature),
  provideState(attributeFeature),
  provideState(effectFeature),
  provideState(characterFeature),
  provideState(locationFeature),
  provideState(momentFeature),
  provideState(itemFeature),
  provideState(skillFeature),
  // group functionals in an object & list classes directly
  provideEffects([
    {
      // --- Initialize App ---
      // Auto-Load Effects
      initLoadAccountId$,
      initLoadCurrentSlotId$,
      initLoadAllSeeds$,
      playLoadAdventure$,

      // Loading static data seeds
      seedAllAdventures$,
      seedAllTags$,
      seedAllAttributes$,
      seedAllEffects$,
      seedAllCharacters$,
      seedAllLocations$,
      seedAllMoments$,
      seedAllItems$,
      seedAllSkills$,
      appSeedSuccess$,

      // // --- Init (localStorage) ---
      // // Adventure (full game state)
      // addAdventureLocal$,
      // loadAdventureLocal$,
      // saveAdventureLocal$,
      // removeAdventureLocal$,
      // // AdventureIndex (game metadata)
      // addAdventureIndex$: addAdventureIndexLocal$,
      // loadAdventureIndexesLocal$: loadAllAdventureIndexesLocal$,
      // saveAdventureIndex$: saveAdventureIndexLocal$,
      // removeAdventureIndex$: removeAdventureIndexLocal$,

      // --- Init (IndexedDB / Dexie) ---
      // Adventure (full game state)
      addAdventureDexie$,
      loadAdventureDexie$,
      saveAdventureDexie$,
      removeAdventureDexie$,
      // AdventureIndex (game metadata)
      addAdventureIndexDexie$,
      loadAllAdventureIndexesDexie$,
      saveAdventureIndexDexie$,
      removeAdventureIndexDexie$,
      // AdventureEvent (game history)
      addAdventureEventDexie$,
      loadAllAdventureEventsDexie$,
      saveAdventureEventDexie$,
      removeAdventureEventsDexie$,
      removeAllAdventureEventsDexie$,
      // Character
      addCharacterDexie$,
      loadAllCharactersDexie$,
      loadCharacterDexie$,
      saveCharacterDexie$,
      saveAllCharactersDexie$,
      removeCharacterDexie$,
      removeAllCharactersDexie$,

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
