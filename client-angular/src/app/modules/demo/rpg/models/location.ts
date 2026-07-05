import { GameDimensionEntity } from './base/game-entity';
import { RuntimeMeta } from './base/runtime-meta';
import { EffectInstance } from './effect';

// http://www.marvunapp.com/ohotmu/appendixes/omnapp.htm
// http://www.marvunapp.com/ohotmu/appendixes/mdapp.htm

/**
 * 🔸 Domain Model (Data in Motion)
 * Represents the fully hydrated, active entity used during gameplay.
 * Holds all required system properties, merged catalog defaults,
 * and active session metadata (RuntimeMeta).
 * -> Used by: NgRx State, Selectors, and UI Renderers.
 */
export interface Location extends GameDimensionEntity, Partial<RuntimeMeta> {
  name: string;
  description: string;
  tags: string[];
  effects: EffectInstance[];
}
/**
 * 🔸 Data Transfer Object (Data at Rest)
 * A lightweight, partial blueprint of the entity. Used for scaffolding new
 * objects or holding incomplete dataset edits before they are hydrated.
 * -> Used by: NgRx Actions/Payloads, Editor Form Inputs, and Raw Storage (Dexie).
 */
export type LocationInstance = Partial<Location>;
