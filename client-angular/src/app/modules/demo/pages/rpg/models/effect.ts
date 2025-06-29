export interface Effect {
  id: string;
  // label: string;
  name: string;
  description: string;
  duration: number; // in turns
  tags: string[];
  // applyEffect(characterId: string): void;
}

export interface EffectViewModel {
  label: string;
  description: string;
}
