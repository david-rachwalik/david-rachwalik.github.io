import { Character } from './character';
import { Item } from './item';
import { Moment } from './moment';
import { Tag } from './tag';

export interface AdventurePreferences {
  enableNSFW: boolean;
  blockedTags: string[];
  pronouns: 'they' | 'she' | 'he';
  difficulty: 'easy' | 'normal' | 'hard';
  unlockedBonuses: string[]; // e.g., permanent boosts
}

// Contains the actual game state
export interface Adventure {
  id: string; // unique game slot id
  label: string; // user-friendly name of slot
  // metadata: AdventureIndex;
  preferences: AdventurePreferences;
  currentCharacterId: string;
  currentLocationId: string;
  currentMomentId: string;
  eventLog: string[]; // choices made / actions taken
  history: string[]; // Moment log
  // --- Template Data ---
  tags: Record<string, Tag>;
  characters: Record<string, Character>;
  moments: Record<string, Moment>;
  locations: Record<string, Location>;
  reputationMap: Record<string, number>;
  items: Record<string, Item>;
}

// Contains the game slot metadata
export interface AdventureIndex {
  id: string; // unique game slot id
  label: string; // user-friendly name of slot
  savedAt: string; // ISO timestamp
  sizeKB: number; // for display (calculated from JSON size)
  // state: Adventure; // the actual game state
  storageType: 'local' | 'file' | 'database';
  storageLocation?: string;
  // Extra for data page
  playerName?: string;
  level?: number;
  location?: string;
}
