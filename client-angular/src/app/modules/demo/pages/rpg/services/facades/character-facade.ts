import { Injectable } from '@angular/core';

import { Character } from '../../models/character';
import { GameState } from '../../models/game-state';
import { Item } from '../../models/item';
import { GameDataService } from '../game-data.service';
import { GameStateService } from '../game-state.service';

// :: Focused on business logic and orchestration, not storage details ::
// Provides higher-level, feature-focused methods for the UI or other services
// to interact with characters, orchestrating calls to `GameDataService` and
// adding any business logic (like generating IDs, filtering, sorting, etc.)

@Injectable({ providedIn: 'root' })
export class CharacterFacade {
  constructor(
    private gameState: GameStateService,
    private dataService: GameDataService,
  ) {}

  // Get the full game state
  get state(): GameState | undefined {
    return this.gameState.current;
  }

  // Get a character by ID
  getCharacter(id: string): Character | undefined {
    return this.state?.characters.find((c) => c.id === id);
  }

  // Get the currently active character
  get currentCharacter(): Character | undefined {
    const id = this.state?.currentCharacterId;
    return id ? this.getCharacter(id) : undefined;
  }

  // Get the currently active character
  get player(): Character | undefined {
    const id = this.state?.currentCharacterId;
    return id ? this.getCharacter(id) : undefined;
  }

  // Update part of a character (immutable update)
  updateCharacter(id: string, changes: Partial<Character>): void {
    if (!this.state) return;
    const updated = this.state.characters.map((c) =>
      c.id === id ? { ...c, ...changes } : c,
    );
    this.gameState.save({ ...this.state, characters: updated });
  }

  // Attribute value logic (for character's attribute values)
  updateCharacterAttributeValue(
    id: string,
    attributeId: string,
    value: string | number,
  ): void {
    const char = this.getCharacter(id);
    if (!char) return;
    const attributes = { ...(char.attributes ?? {}), [attributeId]: value };
    this.updateCharacter(id, { attributes });
  }

  // Inventory logic
  addItemToInventory(itemId: string): void {
    const char = this.currentCharacter;
    if (!char) return;
    const updatedInventory = [...(char.inventory ?? []), itemId];
    this.updateCharacter(char.id, { inventory: updatedInventory });
  }

  get inventory(): Item[] {
    const char = this.currentCharacter;
    if (!char || !Array.isArray(char.inventory)) return [];
    return char.inventory
      .map((id: string) => this.dataService.getItem(id))
      .filter((item): item is Item => Boolean(item));
  }
}
