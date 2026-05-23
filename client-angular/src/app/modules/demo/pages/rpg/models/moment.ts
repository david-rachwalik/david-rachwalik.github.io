import { GameDimensionEntity } from '../utils-composite-id';
import { EffectInstance } from './effect';
import { SkillInstance } from './skill';

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
  effects?: EffectInstance[];
  skills?: SkillInstance[];
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
  prerequisites?: string[]; // flags, story IDs, etc.
  description: string; // tooltip
  content: string;
  choices: MomentChoice[];
  locationId: string;
  characters: string[]; // player is always assumed
  tags: string[];
  isCombat?: boolean;
  effects?: {
    onEnter?: EffectInstance[];
    onExit?: EffectInstance[];
    onComplete?: EffectInstance[];
  };
  rewards?: {
    items?: string[];
    exp?: number;
    gold?: number;
  };
  winCondition?: {
    type: 'combat' | 'custom';
    // e.g. { type: 'combat', allEnemiesDefeated: true }
    // or custom script/logic
  };
  timeAdvance?: number; // minutes/hours to advance on completion

  // --- Content Curation ---
  authorId?: string;
  moderators?: string[];
  // active: boolean;

  // --- Selection Logic ---
  weightBase?: number; // Optional: base weight for selection
  repeatable?: boolean; // Optional: can be seen multiple times
  seenCount?: number;
  rarity?: number; // Optional: for rare events (higher = rarer)
}
