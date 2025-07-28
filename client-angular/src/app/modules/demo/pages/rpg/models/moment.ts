import { GameDimensionEntity } from '../utils-composite-id';
import { EffectInstance } from './effect';

export interface SkillUse {
  skillId: string;
  target: string;
}

export interface MomentChoice {
  // id: string;
  label: string;
  /** Text shown on the button (e.g. "Attack", "Flee", "Talk") */
  action?: string;
  /** Optional tooltip for the button (e.g. "Try to escape the fight") */
  tooltip?: string;
  /** If false, disables the button (e.g. for unmet requirements) */
  enabled?: boolean;
  /** Optional requirements for this choice to be enabled/shown */
  requirements?: Requirement[]; // see below
  effects?: EffectInstance[]; // Each is an Effect + per-use params
  skills?: SkillUse[];
  /** Optional value for scripting or branching (e.g. "north", "acceptQuest") */
  value?: string;
  /** Optional: Next moment to jump to after this choice */
  nextMomentId?: string;
  /** Optional: Tags for filtering, analytics, or scripting */
  tags?: string[];
  /** Optional: Arbitrary data for engine extensions or scripting */
  data?: Record<string, unknown>;
}

export interface Requirement {
  type: 'attribute' | 'item' | 'flag' | 'custom';
  key: string; // e.g. 'str', 'hasKey', 'questAccepted'
  operator?: 'eq' | 'neq' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'notin';
  value?: string | number;
  message?: string; // shown if requirement not met
}

export interface Moment extends GameDimensionEntity {
  title: string;
  description: string; // tooltips
  content: string;
  characters?: string[];
  choices: MomentChoice[];
  tags: string[];
  authorId?: string;
  authors?: string[];
}

// Example Usage
// {
//   "action": "Open the Chest",
//   "tooltip": "Requires a key",
//   "requirements": [
//     { "type": "item", "key": "key", "operator": "gte", "value": 1, "message": "You need a key!" }
//   ],
//   "effects": [
//     { "type": "addItem", "params": { "itemId": "gold", "amount": 100 } },
//     { "type": "setFlag", "params": { "flag": "openedChest", "value": true } }
//   ],
//   "nextMomentId": "after-chest",
//   "tags": ["loot", "exploration"]
// }
