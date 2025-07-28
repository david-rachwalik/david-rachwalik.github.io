import { GameDimensionEntity } from '../utils-composite-id';
import { EffectInstance } from './effect';

// http://www.marvunapp.com/ohotmu/appendixes/omnapp.htm
// http://www.marvunapp.com/ohotmu/appendixes/mdapp.htm

export interface Location extends GameDimensionEntity {
  name: string;
  description: string;
  tags: string[];
  effects?: EffectInstance[]; // Each is an Effect + per-use params
  plane?: string; // alternate planes of existence
}
