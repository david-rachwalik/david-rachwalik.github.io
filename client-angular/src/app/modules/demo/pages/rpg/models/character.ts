import { AttributeInstance } from './attribute';
import { GameAdventureEntity } from './base/game-entity';
import { RuntimeMeta } from './base/runtime-meta';
import { EffectInstance } from './effect';

export interface CharacterBody {
  parts: string[];
  wounds?: { part: string; severity: number; description?: string }[];
  status?: string[]; // e.g. ["poisoned", "bleeding"]
  appearance?: {
    height?: string;
    build?: string;
    scars?: string[];
    tattoos?: string[];
  };
  fatigue?: number; // for exhaustion mechanics
  diseases?: string[];
  armor?: { part: string; value: number }[];
}

export interface CharacterMind {
  thoughts: string[];
  emotionalState: string;
  sanity?: number; // for horror or magic systems
  fears?: string[];
  motivations?: string[];
  memories?: string[];
  status?: string[];
  focus?: number; // for concentration mechanics
  dreams?: string[];
}

export interface Character extends GameAdventureEntity {
  name: string;
  description: string;
  tags: string[];
  attributes: Record<string, AttributeInstance>;
  effects: Record<string, EffectInstance>;
  // ---
  body?: CharacterBody;
  mind?: CharacterMind;
  // ---
  location?: string;
  inventory: string[];
  skills: string[];
  // personaId: string; // class/build
  // habits: string[];
  // reputations: string[];
}

// Optional overrides & runtime metadata
export type CharacterInstance = Partial<Character> & RuntimeMeta;

export interface EnemyViewModel extends Character {
  currentHealth: number;
  maxHealth: number;
  healthPercent: number;
  isLowHealth: boolean;
}
