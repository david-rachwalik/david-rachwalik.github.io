import { Moment } from '../models/moment';
import { toId } from '../utils';
import {
  buildDimensionEntityCompositeId,
  DEFAULT_DIMENSION_ID,
  DEFAULT_PLANE_ID,
} from '../utils-composite-id';

// #region 🔸 DATA SEED RAW 🔸

const MOMENTS_SEED_RAW: MomentSeedInput[] = [
  {
    title: 'Your First Steps',
    description: 'You take your first steps into the unknown.',
    content: 'You wake up in a strange place...',
    choices: [{ label: 'Go North' }, { label: 'Stay Put' }],
    tags: ['intro'],
  },
  {
    title: 'Training Room',
    description: 'Practice your skills on the Target Dummy.',
    content: 'You stand before a sturdy target dummy.',
    characters: ['player', 'target-dummy'],
    choices: [
      {
        label: 'Punch the Dummy',
        skills: [
          {
            skillId: 'punch',
            target: 'target-dummy',
          },
        ],
      },
      {
        label: 'Heal Yourself',
        skills: [
          {
            skillId: 'heal',
            target: 'player',
          },
        ],
      },
    ],
    tags: ['training'],
  },
  {
    title: 'First Battle',
    description: 'A wild slime appears!',
    content: 'A slime oozes toward you, ready to attack.',
    choices: [
      {
        label: 'Attack the slime',
        effects: [
          {
            effectId: 'damage',
            params: { path: 'attributes.health', value: 5 },
          },
        ],
        nextMomentId: 'slime-defeated',
      },
      {
        label: 'Try to run away',
        effects: [
          {
            effectId: 'suppress',
            params: { path: 'attributes.stamina', value: 3, duration: 1 },
          },
        ],
        nextMomentId: 'escape',
      },
    ],
    tags: ['combat'],
  },
  {
    title: 'Slime Defeated',
    description: 'Victory!',
    content: 'You defeat the slime and find a healing potion.',
    choices: [
      {
        label: 'Take the potion',
        effects: [
          {
            effectId: 'restore',
            params: { path: 'attributes.health', value: 10 },
          },
        ],
        nextMomentId: 'continue-journey',
      },
    ],
    tags: ['reward'],
  },
  {
    title: 'Escape',
    description: 'You manage to escape.',
    content: 'You run away from the slime, but you feel a bit exhausted.',
    choices: [
      {
        label: 'Rest for a moment',
        effects: [
          {
            effectId: 'restore',
            params: { path: 'attributes.stamina', value: 2 },
          },
        ],
        nextMomentId: 'continue-journey',
      },
    ],
    tags: ['escape'],
  },
  {
    title: 'Continue Journey',
    description: 'The adventure continues.',
    content: 'You press onward, ready for whatever comes next.',
    choices: [
      { label: 'Explore the forest' },
      { label: 'Head to the village' },
    ],
    tags: ['exploration'],
  },
  {
    title: 'Mysterious Stranger',
    description: 'A stranger offers you a gift.',
    content: 'A hooded figure approaches and hands you a shimmering potion.',
    choices: [
      {
        label: 'Drink the potion',
        effects: [
          {
            effectId: 'enhance',
            params: { path: 'attributes.intelligence', value: 3, duration: 3 },
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
  },
  {
    title: 'Feel Smarter',
    description: 'Your mind feels sharper.',
    content: 'You feel a surge of insight and clarity.',
    choices: [
      {
        label: 'Continue your journey',
        nextMomentId: 'continue-journey',
      },
    ],
    tags: ['buff'],
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
