import { Attribute } from './attribute';
import { Character } from './character';
import { Effect } from './effect';
import { Item } from './item';
import { Location } from './location';
import { Moment } from './moment';
import { Skill } from './skill';
import { Tag } from './tag';

export interface ExpansionPack {
  dimensionId: string;
  attributes?: Attribute[];
  tags?: Tag[];
  effects?: Effect[];
  characters?: Character[];
  locations?: Location[];
  moments?: Moment[];
  items?: Item[];
  skills?: Skill[];
}
