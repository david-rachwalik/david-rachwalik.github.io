import { RuntimeMeta } from '../utils';
import { GameDimensionEntity } from '../utils-composite-id';

// Kind / Group / Category
export type TagGroupType =
  | 'dimension'
  | 'attribute'
  | 'effect'
  | 'mastery'
  | 'character'
  | 'species'
  | 'statusEffect'
  | 'location'
  | 'moment'
  | 'item'
  | 'skill'
  | 'discipline'
  | 'element'
  | 'system';

export interface Tag extends GameDimensionEntity {
  name: string;
  kind: TagGroupType;
  description?: string;
}

// Optional overrides & runtime metadata
export type TagInstance = Partial<Tag> & RuntimeMeta;
