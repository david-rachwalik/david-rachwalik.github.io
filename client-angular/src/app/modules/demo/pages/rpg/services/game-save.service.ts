import { Injectable } from '@angular/core';

import { GameState } from '../models/game-state';
import { SaveSlot } from '../models/save-slot';
import { toId } from '../utils';
import { GameStateService } from './game-state.service';

// Handles persistence:
// - Saves to and loads from `localStorage`
// - Slot-based saving

@Injectable({ providedIn: 'root' })
export class GameSaveService {
  private readonly CURRENT_SLOT_KEY = 'rpg-demo-current-slot';
  private readonly prefix = 'rpg-demo-slot';
  // In-memory cache used to reduce amount of localStorage pulls
  private currentSlot?: SaveSlot;

  constructor(private gameState: GameStateService) {}

  get currentSlotId(): string | undefined {
    return localStorage.getItem(this.CURRENT_SLOT_KEY) || undefined;
  }
  setCurrentSlotId(id: string): void {
    localStorage.setItem(this.CURRENT_SLOT_KEY, id);
  }

  setCurrentSlot(slot: SaveSlot): void {
    const json = JSON.stringify(slot);
    localStorage.setItem(slot.id, json);
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

  // Formats user chosen label into a SaveSlot ID
  toSlotId(label: string) {
    if (!label) return '';
    const id = toId(label);
    const slotId = `${this.prefix}:${id}`;
    console.log(
      `[GameSaveService] label '${label}' formatted to slot-id '${slotId}'`,
    );
    return slotId;
  }

  // Determines the size of slot provided
  sizeInKB(slot: SaveSlot) {
    const json = JSON.stringify(slot);
    const sizeKB = new Blob([json]).size / 1024; // size in KB
    return sizeKB;
  }

  load(): SaveSlot | undefined {
    console.log(`currentSlotId: ${this.currentSlotId}`);
    if (!this.currentSlotId) return undefined;
    // const state = raw ? (JSON.parse(raw) as GameState) : undefined;
    const raw = localStorage.getItem(this.currentSlotId);
    console.log('raw:', raw);
    if (!raw) return undefined;
    // Load the actual game state
    const slot = JSON.parse(raw) as SaveSlot;
    // Update the in-memory slot
    this.currentSlot = slot;
    this.gameState.set(slot.state);
    console.log(
      '[GameSaveService] Loaded new game state into memory:',
      slot.state,
    );
    return slot;
  }

  // Always provide label for new game
  save(state: GameState, label = ''): void {
    const slotId = label ? this.toSlotId(label) : this.currentSlotId;
    if (!slotId) {
      console.warn('[GameSaveService] No current slot ID set!');
      return;
    }

    // --- Slot ID is good ---

    let slot: SaveSlot | undefined;
    if (label) {
      // New Game: label provided, create new slot
      slot = {
        id: slotId,
        label,
        savedAt: new Date().toISOString(),
        sizeKB: 0, // handled in later step
        state,
      } as SaveSlot;
      console.log('[GameSaveService] Creating new SaveSlot:', slot);

      // Update which slot ID the game save goes toward
      this.setCurrentSlotId(slotId); // (only for NewGame or Data page)
      console.log(
        '[GameSaveService] Updated slot ID currently in use:',
        slotId,
      );
    } else {
      // Always try to load the slot from in-memory cache first
      slot = this.currentSlot;
      if (!slot) {
        // Try to load the slot from storage
        const raw = localStorage.getItem(slotId);
        if (raw) {
          slot = JSON.parse(raw) as SaveSlot;
        }
      }
      if (!slot) {
        console.error(
          `[GameSaveService] The slot '${slotId}' could not be found!  Unable to save`,
        );
        return;
      }

      // Update the current slot details
      slot.state = state;
      slot.savedAt = new Date().toISOString();
    }

    // Record the current slot size
    slot.sizeKB = this.sizeInKB(slot);

    // --- Slot is good ---

    // Save game slot to client storage
    this.setCurrentSlot(slot);
    // Update the in-memory slot
    this.currentSlot = slot;
    // TODO: decide whether to make this a getter like this.currentSlotId
    console.log('[GameSaveService] Saved slot:', slotId, slot);
  }

  // delete(label: string): void {
  delete(slotId: string): void {
    // const slotId = this.toSlotId(label);
    console.log(`[GameSaveService] Delete requested for slot: ${slotId}`);

    const existed = localStorage.getItem(slotId) !== null;
    localStorage.removeItem(slotId);

    if (existed) {
      console.log(`[GameSaveService] Slot deleted: ${slotId}`);
      // If the deleted slot was the current in-memory slot, clear it
      if (this.currentSlot && this.currentSlot.id === slotId) {
        this.currentSlot = undefined;
        console.log('[GameSaveService] Cleared in-memory currentSlot.');
      }
      // If the deleted slot was the current slot ID, pick the next most recent
      if (this.currentSlotId === slotId) {
        // Get all remaining saves, sorted by savedAt (latest first)
        const saves = this.listSaves();
        if (saves.length > 0) {
          // Pick the most recently played
          const nextSlot = saves[0];
          this.setCurrentSlotId(nextSlot.id);
          console.log(
            `[GameSaveService] Auto-selected next most recent slot: ${nextSlot.id}`,
          );
        } else {
          // No saves left, clear currentSlotId
          localStorage.removeItem(this.CURRENT_SLOT_KEY);
          console.log(
            '[GameSaveService] Cleared currentSlotId (no saves left).',
          );
        }
      }
    } else {
      console.warn(`[GameSaveService] Slot not found for deletion: ${slotId}`);
    }
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
}
