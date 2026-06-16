import { ExpansionPack } from '../../../models/game-pack';
import { RPG_DEMO_ATTRIBUTES } from './attributes';
import { RPG_DEMO_CHARACTERS } from './characters';
import { RPG_DEMO_EFFECTS } from './effects';
import { RPG_DEMO_ITEMS } from './items';
import { RPG_DEMO_LOCATIONS } from './locations';
import { RPG_DEMO_MOMENTS } from './moments';
import { RPG_DEMO_SKILLS } from './skills';
import { RPG_DEMO_TAGS } from './tags';

export const RPG_DEMO_DIMENSION_ID = 'rpg-demo';

export const rpgDemoDimension: ExpansionPack = {
  dimensionId: RPG_DEMO_DIMENSION_ID,
  attributes: RPG_DEMO_ATTRIBUTES,
  tags: RPG_DEMO_TAGS,
  effects: RPG_DEMO_EFFECTS,
  characters: RPG_DEMO_CHARACTERS,
  locations: RPG_DEMO_LOCATIONS,
  moments: RPG_DEMO_MOMENTS,
  items: RPG_DEMO_ITEMS,
  skills: RPG_DEMO_SKILLS,
};
