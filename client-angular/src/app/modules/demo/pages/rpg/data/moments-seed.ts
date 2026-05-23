import { Moment } from '../models/moment';
import { toId } from '../utils';
import {
  buildAdventureEntityTemplateId,
  buildDimensionEntityCompositeId,
  DEFAULT_DIMENSION_ID,
  DEFAULT_PLANE_ID,
} from '../utils-composite-id';

// #region 🔸 DATA SEED RAW 🔸

const MOMENTS_SEED_RAW: MomentSeedInput[] = [
  {
    title: 'Training Room',
    description: 'Practice your skills on the Target Dummy.',
    content: 'You stand before a sturdy target dummy.',
    locationId: 'practice-zone',
    // characters: ['player', 'target-dummy'],
    // characters: ['target-dummy:rpg-demo:prime:template:system'],
    characters: [String(buildAdventureEntityTemplateId('target-dummy'))],
    choices: [
      {
        label: 'Punch the Dummy',
        skills: [
          {
            entityId: 'punch',
            targetId: 'target-dummy',
            // targetId: buildAdventureEntityTemplateId('target-dummy'),
          },
        ],
      },
      {
        label: 'Heal Yourself',
        skills: [
          {
            entityId: 'heal',
            targetId: 'player',
          },
        ],
      },
    ],
    tags: ['training'],
    winCondition: { type: 'custom' },
    effects: {
      onEnter: [
        {
          entityId: 'restore',
          path: 'attributes.health',
          value: 10,
        },
      ],
      onComplete: [
        {
          entityId: 'restore',
          path: 'attributes.stamina',
          value: 5,
        },
      ],
    },
    rewards: {
      exp: 10,
      items: ['healing-potion'],
    },
    timeAdvance: 10,
  },
  {
    // title: 'Your First Steps',
    title: 'Start',
    description: 'You take your first steps into the unknown.',
    content: 'You wake up in a strange place...',
    locationId: 'village-square',
    characters: ['player'],
    choices: [
      { label: 'Go North', nextMomentId: 'training-room' },
      { label: 'Stay Put' },
    ],
    tags: ['intro'],
    effects: {
      onEnter: [
        {
          entityId: 'restore',
          path: 'attributes.health',
          value: 5,
        },
      ],
    },
    timeAdvance: 5,
  },
  {
    title: 'First Battle',
    description: 'A wild slime appears!',
    content: 'A slime oozes toward you, ready to attack.',
    locationId: 'dark-cave',
    characters: ['player', 'slime'],
    choices: [
      {
        label: 'Attack the slime',
        effects: [
          {
            entityId: 'damage',
            path: 'attributes.health',
            value: 5,
            targetId: 'slime',
          },
        ],
        nextMomentId: 'slime-defeated',
      },
      {
        label: 'Try to run away',
        effects: [
          {
            entityId: 'suppress',
            path: 'attributes.stamina',
            value: 3,
            duration: 1,
          },
        ],
        nextMomentId: 'escape',
      },
    ],
    tags: ['combat'],
    winCondition: { type: 'combat' },
    effects: {
      onEnter: [{ entityId: 'buff', path: 'attributes.end', value: 2 }],
      onComplete: [
        {
          entityId: 'restore',
          path: 'attributes.health',
          value: 5,
        },
      ],
    },
    rewards: {
      exp: 20,
      items: ['slime-gel'],
    },
    timeAdvance: 15,
  },
  {
    title: 'Slime Defeated',
    description: 'Victory!',
    content: 'You defeat the slime and find a healing potion.',
    locationId: 'dark-cave',
    characters: ['player'],
    choices: [
      {
        label: 'Take the potion',
        effects: [
          {
            entityId: 'restore',
            path: 'attributes.health',
            value: 10,
          },
        ],
        nextMomentId: 'continue-journey',
      },
    ],
    tags: ['reward'],
    rewards: {
      items: ['healing-potion'],
      exp: 5,
    },
    timeAdvance: 5,
  },
  {
    title: 'Escape',
    description: 'You manage to escape.',
    content: 'You run away from the slime, but you feel a bit exhausted.',
    locationId: 'dark-cave',
    characters: ['player'],
    choices: [
      {
        label: 'Rest for a moment',
        effects: [
          {
            entityId: 'restore',
            path: 'attributes.stamina',
            value: 2,
          },
        ],
        nextMomentId: 'continue-journey',
      },
    ],
    tags: ['escape'],
    effects: {
      onComplete: [
        {
          entityId: 'restore',
          path: 'attributes.stamina',
          value: 2,
        },
      ],
    },
    timeAdvance: 10,
  },
  {
    title: 'Continue Journey',
    description: 'The adventure continues.',
    content: 'You press onward, ready for whatever comes next.',
    locationId: 'forest',
    characters: ['player'],
    choices: [
      { label: 'Explore the forest' },
      { label: 'Head to the village' },
    ],
    tags: ['exploration'],
    timeAdvance: 20,
  },
  {
    title: 'Mysterious Stranger',
    description: 'A stranger offers you a gift.',
    content: 'A hooded figure approaches and hands you a shimmering potion.',
    locationId: 'village-square',
    characters: ['player', 'stranger'],
    choices: [
      {
        label: 'Drink the potion',
        effects: [
          {
            entityId: 'enhance',
            path: 'attributes.intelligence',
            value: 3,
            duration: 3,
          },
        ],
        nextMomentId: 'feel-smarter',
      },
      {
        label: 'Politely decline',
        nextMomentId: 'continue-journey',
      },
    ],
    tags: ['event', 'npc'],
    rewards: {
      items: ['mystery-potion'],
    },
    timeAdvance: 5,
  },
  {
    title: 'Feel Smarter',
    description: 'Your mind feels sharper.',
    content: 'You feel a surge of insight and clarity.',
    locationId: 'village-square',
    characters: ['player'],
    choices: [
      {
        label: 'Continue your journey',
        nextMomentId: 'continue-journey',
      },
    ],
    tags: ['buff'],
    effects: {
      onEnter: [
        {
          entityId: 'enhance',
          path: 'attributes.intelligence',
          value: 3,
        },
      ],
    },
    timeAdvance: 5,
  },
];
// #endregion

// #region 🔸 UTILITY TO FINALIZE SEED 🔸

type MomentTemplateOmittedKeys =
  | 'id'
  | 'entityId' // momentId
  | 'dimensionId'
  | 'planeId';

type MomentSeedInput = Omit<Moment, MomentTemplateOmittedKeys>;

function createTemplateMoment(seed: MomentSeedInput): Moment | undefined {
  const entityId = toId(seed.title);
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

// Map to final Moment[]
export const MOMENTS_SEED: Moment[] = MOMENTS_SEED_RAW.map(
  createTemplateMoment,
).filter((e): e is Moment => e !== undefined);

// TEST: Validate for duplicate IDs
const ids = new Set<string>();
MOMENTS_SEED.forEach((e) => {
  if (ids.has(e.id)) {
    throw new Error(`Duplicate moment id: ${e.id}`);
  }
  ids.add(e.id);
});
// #endregion
