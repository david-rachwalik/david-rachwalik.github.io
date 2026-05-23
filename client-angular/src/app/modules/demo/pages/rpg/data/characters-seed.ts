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
      // level: { value: 1, base: 1, min: 1 },
      // health: { value: 20, base: 20, min: 0, max: 20 },
      // str: { value: 5, base: 5 },
      // agi: { value: 5, base: 5 },
      // int: { value: 5, base: 5 },
      // end: { value: 5, base: 5 },
      level: { value: 1 },
      health: { value: 20 },
      strength: { value: 5 },
      agility: { value: 5 },
      intelligence: { value: 5 },
      endurance: { value: 5 },
    },
    inventory: [],
    skills: [],
    effects: {
      regen: { value: 0 },
      shield: { value: 0 },
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

  // --- Target Dummy (Training Area) ---
  {
    name: 'Target Dummy',
    description: 'A sturdy wooden dummy for practicing attacks.',
    tags: ['enemy', 'dummy', 'training'],
    attributes: {
      // level: { value: 1, base: 1 },
      // health: { value: 50, base: 50, min: 0, max: 50 },
      // str: { value: 0, base: 0 },
      // agi: { value: 0, base: 0 },
      // int: { value: 0, base: 0 },
      // end: { value: 10, base: 10 },
      level: { value: 1 },
      health: { value: 50, base: 50, max: 50 },
      strength: { value: 2 },
      agility: { value: 0 },
      intelligence: { value: 0 },
      endurance: { value: 10 },
    },
    inventory: [],
    skills: [],
    effects: {},
    location: 'practice-zone',
    body: {
      parts: ['head', 'torso'],
      appearance: {
        height: '5ft',
        build: 'wooden',
        scars: ['dented', 'splintered'],
      },
    },
    mind: {
      thoughts: [],
      emotionalState: 'none',
    },
  },

  // --- Example NPC ---
  {
    // id: 'npc-innkeeper',
    name: 'Mira the Innkeeper',
    description: 'A friendly innkeeper who welcomes travelers.',
    tags: ['npc', 'innkeeper', 'friendly'],
    attributes: {
      // level: { value: 2, base: 2, min: 1 },
      // health: { value: 15, base: 15, min: 0, max: 15 },
      // str: { value: 3, base: 3 },
      // agi: { value: 3, base: 3 },
      // int: { value: 6, base: 6 },
      // end: { value: 4, base: 4 },
      level: { value: 2 },
      health: { value: 15, base: 15, max: 15 },
      strength: { value: 3, base: 3 },
      agility: { value: 3, base: 3 },
      intelligence: { value: 6, base: 6 },
      endurance: { value: 4, base: 4 },
    },
    inventory: ['bread', 'water'],
    skills: [],
    effects: {
      hospitality: { value: 1 },
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
      // level: { value: 1, base: 1 },
      // health: { value: 8, base: 8, min: 0, max: 8 },
      // str: { value: 4, base: 4 },
      // agi: { value: 6, base: 6 },
      // int: { value: 2, base: 2 },
      // end: { value: 3, base: 3 },
      level: { value: 1 },
      health: { value: 8, base: 8, max: 8 },
      strength: { value: 4, base: 4 },
      agility: { value: 6, base: 6 },
      intelligence: { value: 2, base: 2 },
      endurance: { value: 3, base: 3 },
    },
    inventory: ['dagger'],
    skills: [],
    effects: {
      poison: { value: 1 },
      stealth: { value: 2 },
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
      // level: { value: 1, base: 1 },
      // health: { value: 10, base: 10, min: 0, max: 10 },
      // str: { value: 3, base: 3 },
      // agi: { value: 8, base: 8 },
      // int: { value: 4, base: 4 },
      // end: { value: 4, base: 4 },
      level: { value: 1 },
      health: { value: 10, base: 10, max: 10 },
      strength: { value: 3, base: 3 },
      agility: { value: 8, base: 8 },
      intelligence: { value: 4, base: 4 },
      endurance: { value: 4, base: 4 },
    },
    inventory: [],
    skills: [],
    effects: { keenSenses: { value: 1 } },
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
