import { Injectable } from '@angular/core';

import { GameState } from '../models/game-state';
import { SaveSlot } from '../models/save-slot';

// Handles persistence:
// - Saves to and loads from `localStorage`
// - Slot-based saving with autosave support

@Injectable({ providedIn: 'root' })
export class GameSaveService {
  private readonly prefix = 'rpg-save-slot:';

  save(id: string, label: string, state: GameState): void {
    const payload: SaveSlot = {
      id,
      label,
      savedAt: new Date().toISOString(),
      sizeKB: 0, // filled after stringify
      state,
    };

    const json = JSON.stringify(payload);
    payload.sizeKB = new Blob([json]).size / 1024; // size in KB

    localStorage.setItem(this.prefix + id, JSON.stringify(payload));
  }

  load(slotName: string): SaveSlot | undefined {
    const raw = localStorage.getItem(this.prefix + slotName);
    if (!raw) return undefined;

    try {
      return JSON.parse(raw) as SaveSlot;
    } catch {
      return undefined;
    }
  }

  listSaves(): SaveSlot[] {
    return Object.entries(localStorage)
      .filter(([key]) => key.startsWith(this.prefix))
      .map(([, value]) => {
        try {
          if (typeof value !== 'string') return undefined;
          return JSON.parse(value) as SaveSlot;
        } catch {
          return undefined; // skip invalid entries
        }
      })
      .filter((v): v is SaveSlot => v !== undefined)
      .sort((a, b) => b.savedAt.localeCompare(a.savedAt)); // latest first
  }

  delete(slotName: string): void {
    localStorage.removeItem(this.prefix + slotName);
  }

  saveAuto(state: GameState): void {
    this.save('autosave', 'AutoSave', state);
  }

  loadAuto(): SaveSlot | undefined {
    return this.load('autosave');
  }

  /**
   * Returns all save slots, sorted by label (A-Z), then by savedAt (latest first).
   */
  // getAllSaves(): SaveSlot[] {
  //   return this.listSaves()
  //     .map((slot) => ({
  //       id: slot.name,
  //       label: slot.label,
  //       player: slot.state?.characters?.[0] || {},
  //       level: slot.state?.characters?.[0]?.level ?? 1,
  //       location: slot.state?.currentLocation ?? 'Unknown',
  //       size: slot.sizeKB,
  //       lastPlayed: slot.savedAt,
  //       raw: slot,
  //     }))
  //     .sort((a, b) => {
  //       const labelCmp = a.label.localeCompare(b.label);
  //       if (labelCmp !== 0) return labelCmp;
  //       return b.lastPlayed.localeCompare(a.lastPlayed);
  //     });
  // }

  /**
   * Returns the id (slot name) of the currently loaded save slot.
   * If you track this elsewhere, update this method accordingly.
   */
  getCurrentSaveId(): string {
    // Example: always return 'autosave' if that's your convention
    return 'autosave';
  }

  /**
   * Removes a save slot by id (slot name).
   */
  deleteSlot(id: string): void {
    this.delete(id);
  }
}
