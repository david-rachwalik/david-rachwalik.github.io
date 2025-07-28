import { GameAdventureEntity } from '../utils-composite-id';
import { AttributeValue } from './attribute';

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
  // Composite key: .id is the primary key [adventureId+dimensionId+characterId]
  name: string;
  description: string;
  tags: string[];
  attributes: Record<string, AttributeValue>;
  effects: Record<string, number>;
  // ---
  body?: CharacterBody;
  mind?: CharacterMind;
  // ---
  inventory: string[];
  skills: string[];
  location?: string;
  // personaId: string; // class/build
  // habits: string[];
  // reputations: string[];
}
