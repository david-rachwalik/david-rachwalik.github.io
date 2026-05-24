import { GameDimensionEntity } from './base/game-entity';
import { RuntimeMeta } from './base/runtime-meta';

export type AttributeValue = boolean | number | string;

export type AttributeType = 'core' | 'stat' | 'skill' | 'trait';
export type AttributeValueType = 'boolean' | 'number' | 'string';

export interface Attribute extends GameDimensionEntity {
  // id: string;
  // entityId: string;
  name: string;
  // type: AttributeType;
  // tags: string[];
  kind: AttributeType;
  abbreviation: string;
  description: string;
  // ---
  valueType: AttributeValueType;
  default: AttributeValue;
  base: AttributeValue; // revert to if temporary effects expire
  value: AttributeValue; // current mutable value
  min?: number;
  max?: number;
}

export interface AttributeViewModel {
  id: string;
  name: string;
  value: number;
  max?: number;
  description?: string;
}

// export interface AttributeInstance {
//   attributeId: string;
//   params: Partial<Attribute>;
// }

// export type AttributeInstance = Record<string, Partial<Attribute>>;

// Delta: the difference between two values - represents the change/variation in a variable over time or between different states
// // Restricted Partial of Attribute (only optional runtime fields & metadata)
// export type AttributeDelta = RuntimeMeta &
//   Partial<Pick<Attribute, 'value' | 'base' | 'min' | 'max'>>;

// Optional overrides & runtime metadata
export type AttributeInstance = Partial<Attribute> & RuntimeMeta;
