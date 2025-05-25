export interface CharacterBody {
  hp: number; // Expand later with structured types
  parts: string[]; // Expand later with structured types
}

export interface CharacterMind {
  thoughts: string[];
  emotionalState: string;
}

export interface Character {
  id: string;
  name: string;
  location?: string;
  tags: string[];
  attributes: Record<string, string | number>;
  inventory: string[];
  skills: string[];
  effects: Record<string, number>;
  // ---
  body: CharacterBody;
  mind: CharacterMind;
  // ---
  // personaId: string; // class/build
  // habits: string[];
  // reputations: string[];
}
