import { Item } from '../models/item';

export const ITEMS_SEED: Item[] = [
  {
    id: 'healing-potion',
    name: 'Healing Potion',
    description: 'Restores 20 HP when used.',
    effects: { heal: 20 },
    tags: ['potion', 'consumable'],
  },
  {
    id: 'sword',
    name: 'Iron Sword',
    description: '',
    effects: { damage: 20 },
    tags: ['potion', 'consumable'],
  },
];
