import { GameDimensionEntity } from './base/game-entity';
import { RuntimeMeta } from './base/runtime-meta';
import { Condition, EffectElement, EffectInstance } from './effect';

/**
 * 🔸 Domain Model (Data in Motion)
 * Represents the fully hydrated, active entity used during gameplay.
 * Holds all required system properties, merged catalog defaults,
 * and active session metadata (RuntimeMeta).
 * -> Used by: NgRx State, Selectors, and UI Renderers.
 */
export interface Skill extends GameDimensionEntity, Partial<RuntimeMeta> {
  name: string;
  description: string;

  tags: string[];
  effects: EffectInstance[];

  // General skill behavior
  self?: boolean;
  cost?: number;
  range?: number; // (default range/magnitude is 5)
  area?: number;
  duration?: number; // in turns (default is 1)
  cooldown?: number; // how often it can be applied
  elements?: EffectElement[]; // e.g. fire, shadow, psychic
  // requirements?: string[];
  conditions?: Condition[]; // optional logic (e.g., only apply if target has tag)
}
/**
 * 🔸 Data Transfer Object (Data at Rest)
 * A lightweight, partial blueprint of the entity. Used for scaffolding new
 * objects or holding incomplete dataset edits before they are hydrated.
 * -> Used by: NgRx Actions/Payloads, Editor Form Inputs, and Raw Storage (Dexie).
 */
export type SkillInstance = Partial<Skill>;
