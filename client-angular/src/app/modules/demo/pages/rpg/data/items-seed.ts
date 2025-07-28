import { Item } from '../models/item';
import { toId } from '../utils';
import {
  buildDimensionEntityCompositeId,
  DEFAULT_ADVENTURE_ID,
  DEFAULT_DIMENSION_ID,
  DEFAULT_PLANE_ID,
} from '../utils-composite-id';

// #region 🔸 DATA SEED RAW 🔸

const ITEMS_SEED_RAW: ItemSeedInput[] = [
  {
    name: 'Healing Potion',
    description: 'Restores 20 HP when used.',
    effects: [
      {
        effectId: 'restore',
        params: {
          path: 'attributes.health',
          value: 20,
        },
      },
    ],
    tags: ['consumable', 'potion'],
  },
  {
    name: 'Iron Sword',
    description: 'A basic sword for melee combat.',
    attributes: {
      damage: 5,
      durability: 40,
    },
    effects: [
      {
        effectId: 'damage',
        params: {
          path: 'attributes.health',
          value: 20,
        },
      },
    ],
    tags: ['weapon', 'physical'],
  },
  {
    name: 'Magic Staff',
    description: 'A staff that enhances intelligence.',
    tags: ['weapon', 'magic'],
    attributes: {
      int: 2,
      durability: 30,
    },
    effects: [
      {
        effectId: 'enhance',
        params: {
          path: 'attributes.intelligence',
          value: 2,
        },
      },
    ],
  },
  {
    name: 'Antidote',
    description: 'Cures poison when used.',
    effects: [
      {
        effectId: 'cure',
        params: {
          path: 'afflictions.poisoned',
        },
      },
    ],
    tags: ['consumable', 'potion'],
  },
  {
    name: 'Wolf Summoning Scroll',
    description: 'Summons a wolf to fight for you.',
    effects: [
      {
        effectId: 'summon',
        params: {
          path: 'wolf', // creatureId
        },
      },
    ],
    tags: ['consumable', 'scroll', 'summon'],
  },
];
// #endregion

// #region 🔸 UTILITY TO FINALIZE SEED 🔸

type ItemTemplateOmittedKeys =
  | 'id'
  | 'entityId' // itemId
  | 'dimensionId'
  | 'planeId';

type ItemSeedInput = Omit<Item, ItemTemplateOmittedKeys>;

function createTemplateItem(seed: ItemSeedInput): Item | undefined {
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
    planeId: DEFAULT_ADVENTURE_ID,
  };
}

// Map to final Item[]
export const ITEMS_SEED: Item[] = ITEMS_SEED_RAW.map(createTemplateItem).filter(
  (e): e is Item => e !== undefined,
);

// TEST: Validate for duplicate IDs
const ids = new Set<string>();
ITEMS_SEED.forEach((e) => {
  if (ids.has(e.id)) {
    throw new Error(`Duplicate item id: ${e.id}`);
  }
  ids.add(e.id);
});
// #endregion
