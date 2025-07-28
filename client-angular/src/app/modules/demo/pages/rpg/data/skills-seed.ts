import { Skill } from '../models/skill';
import { toId } from '../utils';
import {
  buildDimensionEntityCompositeId,
  DEFAULT_DIMENSION_ID,
  DEFAULT_PLANE_ID,
} from '../utils-composite-id';

// #region 🔸 DATA SEED RAW 🔸

const SKILLS_SEED_RAW: SkillSeedInput[] = [
  {
    name: 'Punch',
    description: 'A basic physical attack.',
    effects: [
      {
        effectId: 'damage',
        params: {
          path: 'attributes.health',
          value: 5,
        },
      },
    ],
    cost: 0,
    tags: ['attack', 'combat'],
  },
  {
    name: 'Heal',
    description: 'Restores health to a target.',
    effects: [
      {
        effectId: 'restore',
        params: {
          path: 'attributes.health',
          value: 10,
        },
      },
    ],
    cost: 5,
    tags: ['heal', 'support'],
  },
  {
    name: 'Regeneration',
    description: 'Restores health to target each turn.',
    effects: [
      {
        effectId: 'restore',
        params: {
          path: 'attributes.health',
          value: 10,
          duration: 3,
        },
      },
    ],
    cost: 5,
    tags: ['heal', 'support'],
  },
  {
    name: 'Fireball',
    description: 'A fiery explosion that damages all enemies in an area.',
    effects: [
      {
        effectId: 'damage',
        params: {
          path: 'attributes.health',
          value: 20,
          elements: ['fire'],
        },
      },
      {
        effectId: 'damage',
        params: {
          value: 3,
          elements: ['fire'],
          duration: 5,
        },
      },
    ],
    cost: 20,
    range: 30,
    area: 3,
    tags: ['spell', 'fire', 'aoe'],
  },
  {
    name: 'Fortify Strength',
    description: 'Temporarily increases Strength.',
    effects: [
      {
        effectId: 'enhance',
        params: {
          path: 'attributes.strength',
          value: 5,
          duration: 3,
        },
      },
    ],
    cost: 6,
    tags: ['buff', 'strength'],
  },
  {
    name: 'Suppress Agility',
    description: 'Temporarily lowers Agility.',
    effects: [
      {
        effectId: 'suppress',
        params: {
          path: 'attributes.agility',
          value: 5,
          duration: 3,
        },
      },
    ],
    cost: 6,
    tags: ['debuff', 'agility'],
  },
  {
    name: 'Restore Endurance',
    description: 'Restore lost Endurance.',
    effects: [
      {
        effectId: 'restore',
        params: {
          path: 'attributes.endurance',
          value: 8,
        },
      },
    ],
    cost: 5,
    tags: ['heal', 'endurance'],
  },
  {
    name: 'Enhance Intelligence',
    description: 'Temporarily increases Intelligence.',
    effects: [
      {
        effectId: 'enhance',
        params: {
          path: 'attributes.intelligence',
          value: 5,
          duration: 3,
        },
      },
    ],
    cost: 6,
    tags: ['buff', 'intelligence'],
  },
  {
    name: 'Suppress Strength',
    description: 'Temporarily lowers Strength.',
    effects: [
      {
        effectId: 'suppress',
        params: {
          path: 'attributes.strength',
          value: 5,
          duration: 3,
        },
      },
    ],
    cost: 6,
    tags: ['debuff', 'strength'],
  },
  {
    name: 'Shield',
    description: 'Absorbs incoming damage.',
    effects: [
      {
        effectId: 'shield',
        params: {
          value: 5,
          duration: 8,
        },
      },
    ],
    cost: 2,
    tags: ['defense'],
  },
  {
    name: 'Drain Lightning',
    description: "Saps the target's health to revitalize you.",
    effects: [
      {
        effectId: 'damage',
        params: {
          path: 'attributes.health',
          value: 3,
          elements: ['energy'],
        },
      },
      {
        effectId: 'restore',
        params: {
          path: 'attributes.health',
          value: 3,
        },
      },
    ],
    cost: 6,
    tags: ['debuff', 'strength'],
  },

  {
    name: 'Power Attack',
    description: 'A strong attack that damages a chosen attribute.',
    tags: ['attack', 'physical'],
    effects: [
      {
        effectId: 'damage',
        params: {
          path: 'attributes.health',
          value: 10,
        },
      },
    ],
    cost: 5,
    cooldown: 1,
  },
  {
    name: 'Absorb Strength',
    description: 'Steal strength from your foe.',
    tags: ['absorb', 'magic'],
    effects: [
      {
        effectId: 'suppress',
        params: {
          path: 'attributes.str',
          value: 5,
          duration: 3,
        },
      },
      {
        effectId: 'enhance',
        params: {
          path: 'attributes.str',
          value: 5,
          duration: 3,
          self: true,
        },
      },
    ],
    cost: 8,
    cooldown: 2,
  },
  {
    name: 'Fortify Endurance',
    description: 'Temporarily increase your endurance.',
    tags: ['buff'],
    effects: [
      {
        effectId: 'enhance',
        params: {
          path: 'attributes.end',
          value: 5,
          duration: 3,
        },
      },
    ],
    cost: 6,
    cooldown: 2,
  },
  {
    name: 'Cure Poison',
    description: 'Removes poison from the target.',
    tags: ['heal', 'cure'],
    effects: [
      {
        effectId: 'cure',
        params: {
          path: 'status.poisoned',
        },
      },
    ],
    cost: 4,
    cooldown: 1,
  },
  {
    name: 'Summon Wolf',
    description: 'Summon a wolf to fight for you.',
    tags: ['summon'],
    effects: [
      {
        effectId: 'summon',
        params: {
          path: 'wolf', // creatureId
        },
      },
    ],
    cost: 12,
    cooldown: 3,
  },
];
// #endregion

// #region 🔸 UTILITY TO FINALIZE SEED 🔸

type SkillTemplateOmittedKeys =
  | 'id'
  | 'entityId' // skillId
  | 'dimensionId'
  | 'planeId';

type SkillSeedInput = Omit<Skill, SkillTemplateOmittedKeys>;

function createTemplateSkill(seed: SkillSeedInput): Skill | undefined {
  const entityId = toId(seed.name);
  const id = buildDimensionEntityCompositeId(
    entityId,
    DEFAULT_DIMENSION_ID,
    DEFAULT_PLANE_ID,
  );
  if (!id) return undefined;
  return {
    ...seed,
    id,
    entityId,
    dimensionId: DEFAULT_DIMENSION_ID,
    planeId: DEFAULT_PLANE_ID,
  };
}

// Map to final Skill[]
export const SKILLS_SEED: Skill[] = SKILLS_SEED_RAW.map(
  createTemplateSkill,
).filter((e): e is Skill => e !== undefined);

// TEST: Validate for duplicate IDs
const ids = new Set<string>();
SKILLS_SEED.forEach((e) => {
  if (ids.has(e.id)) {
    throw new Error(`Duplicate skill id: ${e.id}`);
  }
  ids.add(e.id);
});
// #endregion
