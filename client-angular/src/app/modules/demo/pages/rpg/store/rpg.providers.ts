import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';

import {
  addAdventureIndex$,
  loadAdventureIndexesLocal$,
  removeAdventureIndex$,
  saveAdventureIndex$,
} from './adventure/adventure-index.effects';
import { adventureIndexFeature } from './adventure/adventure-index.reducer';
import {
  addAdventureLocal$,
  loadAdventureLocal$,
  loadAdventuresSeed$,
  removeAdventureLocal$,
  saveAdventureLocal$,
} from './adventure/adventure.effects';
import { adventureFeature } from './adventure/adventure.reducer';
import {
  initLoadCurrentSlotId$,
  initLoadSeeds$,
  playLoadAdventure$,
  setCurrentSlotId$,
} from './app.effects';
import { appFeature } from './app.reducer';
import { loadAttributesSeed$ } from './attribute/attribute.effects';
import { attributeFeature } from './attribute/attribute.reducer';
import { loadCharactersSeed$ } from './character/character.effects';
import { characterFeature } from './character/character.reducer';
import { loadItemsSeed$ } from './item/item.effects';
import { itemFeature } from './item/item.reducer';
import { loadLocationsSeed$ } from './location/location.effects';
import { locationFeature } from './location/location.reducer';
import { loadMomentsSeed$ } from './moment/moment.effects';
import { momentFeature } from './moment/moment.reducer';
import { loadTagsSeed$ } from './tag/tag.effects';
import { tagFeature } from './tag/tag.reducer';

// Add other features as you create them!
export const RPG_STORE_PROVIDERS = [
  provideState(appFeature),
  provideState(adventureFeature),
  provideState(adventureIndexFeature),
  provideState(attributeFeature),
  provideState(tagFeature),
  provideState(characterFeature),
  provideState(locationFeature),
  provideState(momentFeature),
  provideState(itemFeature),
  // group functionals in an object & list classes directly
  provideEffects([
    // AdventureEffects,
    // AttributeEffects,
    // TagEffects,
    // CharacterEffects,
    // LocationEffects,
    // MomentEffects,
    // ItemEffects,
    {
      setCurrentSlotId$,
      // Auto-Load Effects
      initLoadCurrentSlotId$,
      initLoadSeeds$,
      playLoadAdventure$,
      // Loading static data seeds
      loadAdventuresSeed$,
      loadAttributesSeed$,
      loadTagsSeed$,
      loadCharactersSeed$,
      loadLocationsSeed$,
      loadMomentsSeed$,
      loadItemsSeed$,
      // Adventure (full game state)
      addAdventureLocal$,
      loadAdventureLocal$,
      saveAdventureLocal$,
      removeAdventureLocal$,
      // AdventureIndex (game metadata)
      addAdventureIndex$,
      loadAdventureIndexesLocal$,
      saveAdventureIndex$,
      removeAdventureIndex$,
    },
  ]),
];
