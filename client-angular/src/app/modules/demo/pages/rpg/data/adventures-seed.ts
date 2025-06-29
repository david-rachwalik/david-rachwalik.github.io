import { Adventure } from '../models/adventure';

export const ADVENTURES_SEED: Adventure[] = [
  {
    id: 'default',
    label: 'Default',
    preferences: {
      enableNSFW: false,
      blockedTags: [],
      pronouns: 'they',
      difficulty: 'normal',
      unlockedBonuses: [],
    },
    currentCharacterId: 'Default Player',
    currentLocationId: '',
    currentMomentId: '',
    eventLog: [],
    history: [],
    tags: [],
    characters: [],
    relationships: [],
    moments: [],
    locations: [],
    reputationMap: {},
    items: [],
  },
];
