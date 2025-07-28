import { Adventure } from '../models/adventure';
import {
  DEFAULT_ACCOUNT_ID,
  DEFAULT_ADVENTURE_ID,
  DEFAULT_DIMENSION_ID,
  DEFAULT_PLANE_ID,
} from '../utils-composite-id';

export const ADVENTURES_SEED: Adventure[] = [
  {
    id: DEFAULT_ADVENTURE_ID,
    label: 'Template',
    accountId: DEFAULT_ACCOUNT_ID,
    preferences: {
      enableNSFW: false,
      blockedTags: [],
      pronouns: 'they',
      difficulty: 'normal',
      unlockedBonuses: [],
    },
    primeDimension: DEFAULT_DIMENSION_ID,
    currentDimensionId: DEFAULT_DIMENSION_ID,
    currentPlaneId: DEFAULT_PLANE_ID,
    currentCharacterId: '',
    currentLocationId: '',
    currentMomentId: '',
    // // --- Metadata ---
    // eventLog: [],
    // history: [],
    // tags: {},
    // characters: {},
    // moments: {},
    // locations: {},
    // reputationMap: {},
    // items: {},
  },
];
