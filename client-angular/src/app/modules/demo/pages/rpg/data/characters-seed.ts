import { Character } from '../models/character';
import { toId } from '../utils';
import {
  buildAdventureEntityTemplateId,
  DEFAULT_ACCOUNT_ID,
  DEFAULT_ADVENTURE_ID,
  DEFAULT_DIMENSION_ID,
  DEFAULT_PLANE_ID,
} from '../utils-composite-id';

// #region 🔸 DATA SEED RAW 🔸

// export const CHARACTERS_SEED: Character[] = [
const CHARACTERS_SEED_RAW: CharacterSeedInput[] = [
  // --- Player Template ---
  {
    // id: 'player-default',
    name: 'Adventurer',
    description: 'A brave soul ready to embark on a new journey.',
    tags: ['player', 'hero'],
    attributes: {
      level: 1,
      health: 20,
      str: 5,
      agi: 5,
      int: 5,
      end: 5,
    },
    inventory: [],
    skills: [],
    effects: {
      regen: 0,
      shield: 0,
    },
    location: 'start',
    body: {
      parts: ['head', 'torso', 'arms', 'legs'],
    },
    mind: {
      thoughts: [],
      emotionalState: 'neutral',
    },
  },

  // --- Example NPC ---
  {
    // id: 'npc-innkeeper',
    name: 'Mira the Innkeeper',
    description: 'A friendly innkeeper who welcomes travelers.',
    tags: ['npc', 'innkeeper', 'friendly'],
    attributes: {
      level: 2,
      health: 15,
      str: 3,
      agi: 3,
      int: 6,
      end: 4,
    },
    inventory: ['bread', 'water'],
    skills: [],
    effects: {
      hospitality: 1,
    },
    location: 'inn',
    body: {
      parts: ['head', 'torso', 'arms', 'legs'],
    },
    mind: {
      thoughts: ['Hope business is good today.'],
      emotionalState: 'cheerful',
    },
  },

  // --- Example Enemy ---
  {
    // id: 'enemy-goblin',
    name: 'Goblin',
    description: 'A sneaky goblin lurking in the shadows.',
    tags: ['enemy', 'goblin'],
    attributes: {
      level: 1,
      health: 8,
      str: 4,
      agi: 6,
      int: 2,
      end: 3,
    },
    inventory: ['dagger'],
    skills: [],
    effects: {
      poison: 1,
      stealth: 2,
    },
    location: 'forest',
    body: {
      parts: ['head', 'torso', 'arms', 'legs'],
    },
    mind: {
      thoughts: ['Shiny things!'],
      emotionalState: 'greedy',
    },
  },

  // --- Example Companion ---
  {
    // id: 'companion-fox',
    name: 'Fenn the Fox',
    description: 'A clever fox who follows you loyally.',
    tags: ['companion', 'animal'],
    attributes: {
      level: 1,
      health: 10,
      str: 3,
      agi: 8,
      int: 4,
      end: 4,
    },
    inventory: [],
    skills: [],
    effects: {
      keenSenses: 1,
    },
    location: 'with-player',
    body: {
      parts: ['head', 'torso', 'legs', 'tail'],
    },
    mind: {
      thoughts: ['Stay close to my friend.'],
      emotionalState: 'alert',
    },
  },
];
// #endregion

// #region 🔸 UTILITY TO FINALIZE SEED 🔸

type CharacterTemplateOmittedKeys =
  | 'id'
  | 'entityId' // characterId
  | 'dimensionId'
  | 'planeId'
  | 'adventureId'
  | 'accountId';

type CharacterSeedInput = Omit<Character, CharacterTemplateOmittedKeys>;

function createTemplateCharacter(
  seed: CharacterSeedInput,
): Character | undefined {
  const entityId = toId(seed.name);
  // const userService = inject(UserService, { optional: true });
  // const accountId = userService?.accountId || 'guest';
  const accountId = DEFAULT_ACCOUNT_ID;
  // const id = buildCompositeAdventureEntityId(
  //   entityId,
  //   DIMENSION_RPGDEMO_ID,
  //   PLANE_PRIME_ID,
  //   ADVENTURE_TEMPLATE_ID,
  //   accountId,
  // );
  const id = buildAdventureEntityTemplateId(entityId);
  if (!id) return undefined;
  return {
    ...seed,
    id,
    entityId,
    adventureId: DEFAULT_ADVENTURE_ID,
    dimensionId: DEFAULT_DIMENSION_ID,
    planeId: DEFAULT_PLANE_ID,
    accountId,
  };
}

// Map to final Character[]
export const CHARACTERS_SEED: Character[] = CHARACTERS_SEED_RAW.map(
  createTemplateCharacter,
).filter((char): char is Character => char !== undefined);

// Validate for duplicate IDs
const ids = new Set<string>();
CHARACTERS_SEED.forEach((char) => {
  if (ids.has(char.id)) {
    throw new Error(`Duplicate character id: ${char.id}`);
  }
  ids.add(char.id);
});
// #endregion
