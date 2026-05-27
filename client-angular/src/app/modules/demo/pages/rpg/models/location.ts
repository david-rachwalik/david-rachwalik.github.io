import { GameDimensionEntity } from './base/game-entity';
import { RuntimeMeta } from './base/runtime-meta';
import { EffectInstance } from './effect';

// http://www.marvunapp.com/ohotmu/appendixes/omnapp.htm
// http://www.marvunapp.com/ohotmu/appendixes/mdapp.htm

export interface Location extends GameDimensionEntity {
  name: string;
  description: string;
  tags: string[];
  effects: EffectInstance[];
}

// Optional overrides & runtime metadata
export type LocationInstance = Partial<Location> & RuntimeMeta;
