import { GameAdventureEntity } from '../utils-composite-id';
import { Character } from './character';
import { Item } from './item';
import { Moment } from './moment';

export interface AdventurePreferences {
  enableNSFW: boolean;
  blockedTags: string[];
  pronouns: 'they' | 'she' | 'he';
  difficulty: 'easy' | 'normal' | 'hard';
  unlockedBonuses: string[]; // e.g., permanent boosts
}

// Contains the actual game state (Play page)
export interface Adventure {
  id: string; // unique game slot id
  label: string; // user-friendly name of slot
  accountId: string;
  preferences: AdventurePreferences;
  primeDimension: string; // dimensional origin of birth
  currentDimensionId: string; // possibly already covered by currentMomentId
  currentPlaneId: string;
  currentCharacterId: string;
  currentLocationId: string;
  currentMomentId: string;
  // Optionally, for fast queries:
  completedMomentIds?: string[];
  visitedLocationIds?: string[];
  // Optionally, for UI:
  recentEventIds?: string[]; // recent adventure events
}

// Contains the game slot metadata (Data page)
export interface AdventureIndex {
  id: string; // unique game slot id
  label: string; // user-friendly name of slot
  // Only use Date in view logic, not in data models
  savedAt: string; // ISO timestamp
  sizeKB: number; // for display (calculated from JSON size)
  storageType: 'local' | 'file' | 'database';
  storageLocation?: string;
  // Player details for Data page
  playerName?: string;
  playerLevel?: number;
  playerLocation?: string;
}

type FeatureEventType =
  | 'adventure'
  | 'tag'
  | 'attribute'
  | 'character'
  | 'location'
  | 'moment'
  | 'item';
type FeatureEventAction =
  | 'gain'
  | 'lose'
  | 'unlock'
  | 'complete'
  | 'fail'
  | 'transform';

// Used for persistent history, analytics, and replaying major events
export interface AdventureEvent extends GameAdventureEntity {
  timestamp: string; // ISO
  type: FeatureEventType;
  action: FeatureEventAction;
  payload: Record<string, unknown>;
}

// const exampleEvent: AdventureEvent = {
//   id: '...', // composite id
//   timestamp: new Date().toISOString(),
//   type: 'character',
//   action: 'defeat',
//   payload: {
//     defeatedId: player.id, // The character who was defeated
//     defeatedType: 'player', // Could be 'player', 'boss', 'enemy', etc.
//     defeatedName: player.name,
//     by: boss.id, // Who defeated them (optional)
//     byType: 'boss',
//     byName: boss.name,
//     locationId: currentLocationId, // Optional: where it happened
//     momentId: currentMomentId, // Optional: when it happened
//   },
// };

// Persist only major events:
// - Moment completions
// - Unlocks (content, locations, items, achievements)
// - Progression milestones (level up, quest complete, boss defeated)
// - Account milestones (first login, new save, etc.)
// Do not persist every in-combat action:
// - Effects like "take 4 damage" should be handled live in the combat system,
// not logged persistently unless it's a milestone (e.g., "defeated by monster",
// "critical hit", "first time using skill")

// ----------------------------------------------------------------
// ----------------------------------------------------------------

// Contains the actual game state (Play page)
export interface AdventureViewModel {
  id: string; // unique game slot id
  label: string; // user-friendly name of slot
  preferences: AdventurePreferences;
  primeDimension: string; // dimensional origin of birth
  currentCharacterId: string;
  currentLocationId: string;
  currentMomentId: string;
  eventLog: string[]; // choices made / actions taken
  history: string[]; // Moment log
  // --- Template Data ---
  // tags: Record<string, Tag>;
  characters: Record<string, Character>;
  locations: Record<string, Location>;
  moments: Record<string, Moment>;
  items: Record<string, Item>;
  // reputationMap: Record<string, number>;
}
