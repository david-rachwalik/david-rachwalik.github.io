import { GameState } from './game-state';

export interface SaveSlot {
  id: string; // Unique identifier ("slot1", "autosave", "manual-foo")
  label: string; // User-friendly name
  savedAt: string; // ISO timestamp
  sizeKB: number; // Calculated from JSON size
  state: GameState; // Actual game state
}
