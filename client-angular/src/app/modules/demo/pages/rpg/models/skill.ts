import { RuntimeMeta } from '../utils';
import { GameDimensionEntity } from '../utils-composite-id';
import { Condition, EffectElement, EffectInstance } from './effect';

export interface Skill extends GameDimensionEntity {
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

// Optional overrides & runtime metadata
export type SkillInstance = Partial<Skill> & RuntimeMeta;
