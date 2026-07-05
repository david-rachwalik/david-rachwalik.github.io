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

/**
 * 🔸 Domain Model (Data in Motion)
 * Represents the fully hydrated, active entity used during gameplay.
 * Holds all required system properties, merged catalog defaults,
 * and active session metadata (RuntimeMeta).
 * -> Used by: NgRx State, Selectors, and UI Renderers.
 */
export interface Character extends GameAdventureEntity, Partial<RuntimeMeta> {
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
/**
 * 🔸 Data Transfer Object (Data at Rest)
 * A lightweight, partial blueprint of the entity. Used for scaffolding new
 * objects or holding incomplete dataset edits before they are hydrated.
 * -> Used by: NgRx Actions/Payloads, Editor Form Inputs, and Raw Storage (Dexie).
 */
export type CharacterInstance = Partial<Character>;

export interface EnemyViewModel extends Character {
  currentHealth: number;
  maxHealth: number;
  healthPercent: number;
  isLowHealth: boolean;
}
