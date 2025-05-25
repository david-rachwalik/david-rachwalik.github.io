import { Character } from './character';
import { Item } from './item';
import { Moment } from './moment';
import { Relationship } from './relationship';
import { Tag } from './tag';

export interface GamePreferences {
  enableNSFW: boolean;
  blockedTags: string[];
  pronouns: string;
  difficulty: 'easy' | 'normal' | 'hard';
  unlockedBonuses: string[]; // e.g., permanent boosts
}

export interface GameState {
  preferences: GamePreferences;
  currentCharacterId: string;
  currentLocationId: string;
  currentMomentId: string;
  eventLog: string[]; // choices made / actions taken
  history: string[]; // Moment log
  // --- Template Data ---
  tags: Tag[];
  characters: Character[];
  relationships: Relationship[];
  moments: Moment[];
  locations: Location[];
  reputationMap: Record<string, number>;
  items: Item[];
}
