import { AttributeInstance } from './attribute';
import { GameDimensionEntity } from './base/game-entity';
import { RuntimeMeta } from './base/runtime-meta';
import { EffectInstance } from './effect';

/**
 * 🔸 Domain Model (Data in Motion)
 * Represents the fully hydrated, active entity used during gameplay.
 * Holds all required system properties, merged catalog defaults,
 * and active session metadata (RuntimeMeta).
 * -> Used by: NgRx State, Selectors, and UI Renderers.
 */
export interface Item extends GameDimensionEntity, Partial<RuntimeMeta> {
  name: string;
  description: string;
  tags: string[];
  attributes: AttributeInstance[];
  effects: EffectInstance[];
}
/**
 * 🔸 Data Transfer Object (Data at Rest)
 * A lightweight, partial blueprint of the entity. Used for scaffolding new
 * objects or holding incomplete dataset edits before they are hydrated.
 * -> Used by: NgRx Actions/Payloads, Editor Form Inputs, and Raw Storage (Dexie).
 */
export type ItemInstance = Partial<Item>;

export interface InventorySlot {
  item: Item;
  qty: number;
}

export interface InventorySlotViewModel {
  id: string;
  name: string;
  description: string;
  qty: number;
  item?: Item;
}
