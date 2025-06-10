import { Attribute } from '../models/attribute';

export const ATTRIBUTES_SEED: Attribute[] = [
  {
    id: 'str',
    name: 'Strength',
    type: 'stat',
    description: 'Physical power and carrying capacity.',
    valueType: 'number',
    defaultValue: 5,
    tags: [],
  },
  {
    id: 'agi',
    name: 'Agility',
    type: 'stat',
    description: 'Speed and dexterity.',
    valueType: 'number',
    defaultValue: 5,
    tags: [],
  },
  {
    id: 'int',
    name: 'Intelligence',
    type: 'stat',
    description: 'Reasoning and memory.',
    valueType: 'number',
    defaultValue: 5,
    tags: [],
  },
  {
    id: 'end',
    name: 'Endurance',
    type: 'stat',
    description: 'Stamina and health.',
    valueType: 'number',
    defaultValue: 5,
    tags: [],
  },
];
