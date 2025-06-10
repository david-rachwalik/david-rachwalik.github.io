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

export interface Character {
  id: string;
  name: string;
  description: string;
  tags: string[];
  attributes: Record<string, string | number>;
  inventory: string[];
  skills: string[];
  effects: Record<string, number>;
  location?: string;
  // ---
  body?: CharacterBody;
  mind?: CharacterMind;
  // ---
  // personaId: string; // class/build
  // habits: string[];
  // reputations: string[];
}
