import { GameDimensionEntity } from './base/game-entity';
import { RuntimeMeta } from './base/runtime-meta';

export type AttributeValue = boolean | number | string;

export type AttributeType = 'core' | 'stat' | 'skill' | 'trait';
export type AttributeValueType = 'boolean' | 'number' | 'string';

/**
 * 🔸 Domain Model (Data in Motion)
 * Represents the fully hydrated, active entity used during gameplay.
 * Holds all required system properties, merged catalog defaults,
 * and active session metadata (RuntimeMeta).
 * -> Used by: NgRx State, Selectors, and UI Renderers.
 */
export interface Attribute extends GameDimensionEntity, Partial<RuntimeMeta> {
  name: string;
  abbreviation: string;
  description: string;
  // tags: string[];
  // ---
  kind: AttributeType;
  valueType: AttributeValueType;
  default: AttributeValue;
  base: AttributeValue; // revert to if temporary effects expire
  value: AttributeValue; // current mutable value
  min?: number;
  max?: number;
}
/**
 * 🔸 Data Transfer Object (Data at Rest)
 * A lightweight, partial blueprint of the entity. Used for scaffolding new
 * objects or holding incomplete dataset edits before they are hydrated.
 * -> Used by: NgRx Actions/Payloads, Editor Form Inputs, and Raw Storage (Dexie).
 */
export type AttributeInstance = Partial<Attribute>;

export interface AttributeViewModel {
  id: string;
  name: string;
  value: number;
  max?: number;
  description?: string;
}
