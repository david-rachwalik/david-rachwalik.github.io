// Effects cause changes to occur in the game world.  They are the consequences
// of actions taken and choices made.  Used for live gameplay, calculations,
// and temporary state changes

import { AttributeValue } from './attribute';

// Data-driven: effects are mostly defined in a catalog and applied dynamically
// Modular: should be able to alter attributes, tags, states, cooldowns, body parts, etc
// Flexible: effects like healing, damage, buffs, debuffs, transformations
// Generic & reusable: minimal hardcoded assumptions, using ids and tags

// Boon: A beneficial gift or advantage
// Curse: A negative pronouncement or state of misfortune
export type EffectType =
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

// Used for live gameplay, calculations, and temporary state changes
export interface Effect {
  id: string;
  // label: string;
  dimensionId: string;
  type: EffectType;

  // Semantic info for UI or log narration
  name: string; // "heal" (aka `action`)
  gerund?: string; // "healing" (aka `process`)
  pastTense?: string; // "healed" (aka `result`)
  // type: EffectType;
  description: string;

  // What the effect does and to what
  kind: 'attribute' | 'tag' | 'character' | 'bodyPart' | 'state' | 'custom';
  path: string; // path to value being affected (e.g., "stats.hp", "body.legs.count")
  operation: 'add' | 'subtract' | 'multiply' | 'set' | 'remove' | 'toggle';

  defaultValue: AttributeValue;
  value?: AttributeValue;
  min?: number;
  max?: number;

  // General effect behavior
  self?: boolean;
  // (default range/magnitude is 5)
  duration?: number; // in turns (default is 1)
  cooldown?: number; // how often it can be applied
  elements?: EffectElement[]; // e.g. fire, shadow, psychic
  tags?: string[]; // extra metadata or categorization
  conditions?: Condition[]; // optional logic (e.g., only apply if target has tag)
}

export interface EffectViewModel {
  label: string;
  description: string;
}

export type EffectSourceType = 'character' | 'skill' | 'item' | 'location';

export interface EffectInstance {
  effectId: string;
  params: Partial<Effect>; // e.g. { value: 10, elements: ['fire'], duration: 3 }
  // Optionally, can add a 'script' property for custom JS or engine code
  // --- Provenance & runtime tracking ---
  sourceType?: EffectSourceType;
  sourceId?: string; // id of skill, item, location..
  appliedById?: string; // character/entity who applied it
  appliedAt?: string; // timestamp (or optionally turn number)
  duration?: number; // how many turns left (if temporary)
}

// const effectInstance: EffectInstance = {
//   effectId: 'enhance',
//   params: { value: 2, duration: 3 },
//   sourceType: 'skill',
//   sourceId: 'roar',
//   appliedById: playerId,
//   appliedAt: timestamp,
//   duration: 3,
// };
