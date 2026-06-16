import { Item } from '../../../models/item';
import { buildTemplateEntity, SeedInput } from '../../utils-seed';

// #region 🔸 DATA SEED RAW 🔸

const RPG_DEMO_ITEMS_RAW: SeedInput<Item>[] = [
  {
    name: 'Healing Potion',
    description: 'Restores 20 HP when used.',
    attributes: [],
    effects: [
      {
        entityId: 'restore',
        path: 'attributes.health',
        value: 20,
      },
    ],
    tags: ['consumable', 'potion'],
  },
  {
    name: 'Iron Sword',
    description: 'A basic sword for melee combat.',
    attributes: [
      {
        entityId: 'damage',
        value: 5,
      },
      {
        entityId: 'durability',
        value: 40,
      },
    ],
    effects: [
      {
        entityId: 'damage',
        path: 'attributes.health',
        value: 20,
      },
    ],
    tags: ['weapon', 'physical'],
  },
  {
    name: 'Magic Staff',
    description: 'A staff that enhances intelligence.',
    tags: ['weapon', 'magic'],
    attributes: [
      {
        entityId: 'int',
        value: 2,
      },
      {
        entityId: 'durability',
        value: 30,
      },
    ],
    effects: [
      {
        entityId: 'enhance',
        path: 'attributes.intelligence',
        value: 2,
      },
    ],
  },
  {
    name: 'Antidote',
    description: 'Cures poison when used.',
    attributes: [],
    effects: [
      {
        entityId: 'cure',
        path: 'afflictions.poisoned',
      },
    ],
    tags: ['consumable', 'potion'],
  },
  {
    name: 'Wolf Summoning Scroll',
    description: 'Summons a wolf to fight for you.',
    attributes: [],
    effects: [
      {
        entityId: 'summon',
        path: 'wolf', // creatureId
      },
    ],
    tags: ['consumable', 'scroll', 'summon'],
  },
];
// #endregion

// #region 🔸 BUILD SEED DATA 🔸

export const RPG_DEMO_ITEMS: Item[] = RPG_DEMO_ITEMS_RAW.map((seed) =>
  buildTemplateEntity<Item>(seed, seed.name),
).filter((e): e is Item => e !== undefined);
// #endregion
