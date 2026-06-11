import { GameDimensionEntity } from './base/game-entity';
import { RuntimeMeta } from './base/runtime-meta';

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

/**
 * 🔸 Domain Model (Data in Motion)
 * Represents the fully hydrated, active entity used during gameplay.
 * Holds all required system properties, merged catalog defaults,
 * and active session metadata (RuntimeMeta).
 * -> Used by: NgRx State, Selectors, and UI Renderers.
 */
export interface Tag extends GameDimensionEntity, Partial<RuntimeMeta> {
  name: string;
  description?: string;
  kind: TagGroupType;
}
/**
 * 🔸 Data Transfer Object (Data at Rest)
 * A lightweight, partial blueprint of the entity. Used for scaffolding new
 * objects or holding incomplete dataset edits before they are hydrated.
 * -> Used by: NgRx Actions/Payloads, Editor Form Inputs, and Raw Storage (Dexie).
 */
export type TagInstance = Partial<Tag>;
