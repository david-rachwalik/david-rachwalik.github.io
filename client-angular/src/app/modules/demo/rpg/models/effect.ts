// Effects cause changes to occur in the game world.  They are the consequences
// of actions taken and choices made.  Used for live gameplay, calculations,
// and temporary state changes

import { AttributeValue } from './attribute';
import { GameDimensionEntity } from './base/game-entity';
import { RuntimeMeta } from './base/runtime-meta';

// Data-driven: effects are mostly defined in a catalog and applied dynamically
// Modular: should be able to alter attributes, tags, states, cooldowns, body parts, etc
// Flexible: effects like healing, damage, buffs, debuffs, transformations
// Generic & reusable: minimal hardcoded assumptions, using ids and tags

// Boon: A beneficial gift or advantage
// Curse: A negative pronouncement or state of misfortune
// TODO: might phase out entirely for effect seed/catalog
export type EffectType =
  | 'status'
  // ---
  | 'damage'
  | 'heal'
  | 'charm'
  | 'curse'
  | 'buff'
  | 'debuff'
  | 'absorb'
  | 'dispel'
  | 'summon'
  | 'conjure'
  | 'transform'
  | 'boon';
export type EffectElement =
  | 'physical'
  | 'water'
  | 'air'
  | 'energy'
  | 'void'
  | 'fire'
  | 'ice';

export interface Condition {
  path: string; // e.g., "tags", "stats.hp"
  comparison: 'equals' | 'gt' | 'lt' | 'contains';
  value: AttributeValue;
  not?: boolean; // invert the condition
}

// export type EffectTarget =
//   | {
//       kind: 'attribute';
//       path: string;
//       operation: 'add' | 'subtract' | 'set' | 'multiply';
//       value: number;
//       min?: number;
//       max?: number;
//     }
//   | {
//       kind: 'tag';
//       path: string;
//       operation: 'append' | 'remove';
//       value: string;
//       conditions: Condition[]; // optional logic (e.g., only apply if target has tag)
//     }
//   | {
//       kind: 'state';
//       path: string;
//       operation: 'set' | 'toggle';
//       value: boolean;
//     };

/**
 * 🔸 Domain Model (Data in Motion)
 * Represents the fully hydrated, active entity used during gameplay.
 * Holds all required system properties, merged catalog defaults,
 * and active session metadata (RuntimeMeta).
 * -> Used by: NgRx State, Selectors, and UI Renderers.
 */
// Used for live gameplay, calculations, and temporary state changes
export interface Effect extends GameDimensionEntity, Partial<RuntimeMeta> {
  // Semantic info for UI or log narration
  name: string; // "heal" (aka `action`)
  gerund?: string; // "healing" (aka `process`)
  pastTense?: string; // "healed" (aka `result`)
  // type: EffectType;
  description: string;

  elements?: EffectElement[]; // e.g. fire, shadow, psychic
  tags?: string[]; // extra metadata or categorization
  type: EffectType;

  // What the effect does and to what
  kind: 'attribute' | 'tag' | 'character' | 'bodyPart' | 'state' | 'custom';
  path: string; // path to value being affected (e.g., "stats.hp", "body.legs.count")
  operation:
    | 'add'
    | 'subtract'
    | 'multiply'
    | 'set'
    | 'remove'
    | 'clear'
    | 'toggle';

  defaultValue: AttributeValue;
  value?: AttributeValue;
  min?: number;
  max?: number;

  // General effect behavior
  self?: boolean;
  duration?: number; // in turns (default is 0)
  cooldown?: number; // how often it can be applied
  conditions?: Condition[]; // optional logic (e.g., only apply if target has tag)
}
/**
 * 🔸 Data Transfer Object (Data at Rest)
 * A lightweight, partial blueprint of the entity. Used for scaffolding new
 * objects or holding incomplete dataset edits before they are hydrated.
 * -> Used by: NgRx Actions/Payloads, Editor Form Inputs, and Raw Storage (Dexie).
 */
export type EffectInstance = Partial<Effect>;

export interface EffectViewModel {
  label: string;
  description: string;
}

// #region 🔸 Effect Option Lists 🔸

export const EFFECT_TYPE_OPTIONS: readonly EffectType[] = [
  'status',
  'damage',
  'heal',
  'charm',
  'curse',
  'buff',
  'debuff',
  'absorb',
  'dispel',
  'summon',
  'conjure',
  'transform',
  'boon',
] as const;

export const EFFECT_ELEMENT_OPTIONS: readonly EffectElement[] = [
  'physical',
  'water',
  'air',
  'energy',
  'void',
  'fire',
  'ice',
] as const;

export const EFFECT_KIND_OPTIONS: readonly Effect['kind'][] = [
  'attribute',
  'tag',
  'character',
  'bodyPart',
  'state',
  'custom',
] as const;

export const EFFECT_OPERATION_OPTIONS: readonly Effect['operation'][] = [
  'add',
  'subtract',
  'multiply',
  'set',
  'remove',
  'clear',
  'toggle',
] as const;

export const CONDITION_COMPARISON_OPTIONS: readonly Condition['comparison'][] =
  ['equals', 'gt', 'lt', 'contains'] as const;
// #endregion
