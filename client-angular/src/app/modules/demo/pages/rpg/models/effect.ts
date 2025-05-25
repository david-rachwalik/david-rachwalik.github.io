export interface Effect {
  id: string;
  name: string;
  duration: number; // in turns
  tags: string[];
  applyEffect(characterId: string): void;
}
