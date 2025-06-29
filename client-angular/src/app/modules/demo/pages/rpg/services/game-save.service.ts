import { Injectable } from '@angular/core';

import { Adventure, AdventureIndex } from '../models/adventure';
import { toId } from '../utils';

// Handles persistence:
// - Saves to and loads from `localStorage`
// - Slot-based saving

@Injectable({ providedIn: 'root' })
export class GameSaveService {
  private readonly CURRENT_SLOT_KEY = 'rpg-demo-current-slot';
  private readonly INDEX_PREFIX = 'rpg-demo-slot';
  private readonly ADVENTURE_PREFIX = 'rpg-demo-adventure';

  // --- Slot Management (Adventure ID) ---

  // Get current slot ID from client storage
  loadCurrentSlotId(): string | undefined {
    return localStorage.getItem(this.CURRENT_SLOT_KEY) || undefined;
  }

  // Set current slot ID in client storage
  saveCurrentSlotId(id: string): void {
    localStorage.setItem(this.CURRENT_SLOT_KEY, id);
  }
  // - should only be used by NewGame & Data pages

  // Remove current slot ID from client storage
  deleteCurrentSlotId(): void {
    localStorage.removeItem(this.CURRENT_SLOT_KEY);
  }

  // --- AdventureIndex (metadata) ---

  // Get game details from client storage
  loadAdventureIndex(id: string): AdventureIndex | undefined {
    const raw = localStorage.getItem(`${this.INDEX_PREFIX}:${id}`);
    return raw ? (JSON.parse(raw) as AdventureIndex) : undefined;
  }

  // Set game details in client storage
  saveAdventureIndex(index: AdventureIndex): void {
    localStorage.setItem(
      `${this.INDEX_PREFIX}:${index.id}`,
      JSON.stringify(index),
    );
  }

  // Remove game details from client storage
  deleteAdventureIndex(id: string): void {
    localStorage.removeItem(`${this.INDEX_PREFIX}:${id}`);
  }

  // List all details in client storage
  listAdventureIndexes(): AdventureIndex[] {
    return Object.entries(localStorage)
      .filter(([key]) => key.startsWith(this.INDEX_PREFIX))
      .map(([, value]) => {
        try {
          if (typeof value !== 'string') return undefined;
          return JSON.parse(value) as AdventureIndex;
        } catch {
          return undefined;
        }
      })
      .filter((v): v is AdventureIndex => v !== undefined)
      .sort((a, b) => b.savedAt.localeCompare(a.savedAt)); // latest first
  }

  // --- Adventure (full state) ---

  // Get game slot from client storage
  loadAdventure(id: string): Adventure | undefined {
    const raw = localStorage.getItem(`${this.ADVENTURE_PREFIX}:${id}`);
    return raw ? (JSON.parse(raw) as Adventure) : undefined;
  }

  // Set game slot in client storage
  saveAdventure(adventure: Adventure): void {
    localStorage.setItem(
      `${this.ADVENTURE_PREFIX}:${adventure.id}`,
      JSON.stringify(adventure),
    );
  }

  // Remove game slot from client storage
  deleteAdventure(id: string): void {
    localStorage.removeItem(`${this.ADVENTURE_PREFIX}:${id}`);
  }

  // --- Utility ---

  // Formats user-chosen label into slot ID
  toSlotId(label: string) {
    if (!label) return '';
    const id = toId(label);
    return `${this.INDEX_PREFIX}:${id}`;
  }

  // Calculate slot size in KB
  sizeInKB(slot: Adventure) {
    const json = JSON.stringify(slot);
    return new Blob([json]).size / 1024;
  }

  // Helper to build AdventureIndex from Adventure
  buildAdventureIndexFromAdventure(adventure: Adventure): AdventureIndex {
    const player = adventure.characters?.[0] ?? {};
    return {
      id: adventure.id,
      label: adventure.label ?? 'Unnamed Save',
      savedAt: new Date().toISOString(),
      sizeKB: this.sizeInKB(adventure),
      storageType: 'local',
      playerName: player.name || 'Unknown',
      level: Number(player.attributes?.['level']) || 1,
      location: player.location,
    };
  }
}
