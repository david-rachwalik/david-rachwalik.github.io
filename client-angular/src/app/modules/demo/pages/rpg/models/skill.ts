import { GameDimensionEntity } from '../utils-composite-id';
import { Condition, EffectElement, EffectInstance } from './effect';

export interface Skill extends GameDimensionEntity {
  name: string;
  description: string;

  // effects: Record<string, EffectInstance>;
  effects: EffectInstance[]; // Each is an Effect + per-use params

  // General skill behavior
  self?: boolean;
  cost?: number;
  range?: number; // (default range/magnitude is 5)
  area?: number;
  duration?: number; // in turns (default is 1)
  cooldown?: number; // how often it can be applied
  elements?: EffectElement[]; // e.g. fire, shadow, psychic
  tags?: string[]; // extra metadata or categorization
  // requirements?: string[];
  conditions?: Condition[]; // optional logic (e.g., only apply if target has tag)
}
