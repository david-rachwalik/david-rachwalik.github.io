import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { Character } from '../../models/character';
import { GameState } from '../../models/game-state';
import { Item } from '../../models/item';
import { toId } from '../../utils';
import { GameDataService } from '../game-data.service';
import { GameSaveService } from '../game-save.service';
import { GameStateService } from '../game-state.service';

// :: Focused on business logic and orchestration, not storage details ::
// Provides higher-level, feature-focused methods for the UI or other services
// to interact with characters, orchestrating calls to `GameDataService` and
// adding any business logic (like generating IDs, filtering, sorting, etc.)

export interface InventorySlot {
  item: Item;
  qty: number;
}

@Injectable({ providedIn: 'root' })
export class CharacterFacade {
  constructor(
    private gameState: GameStateService,
    private gameSave: GameSaveService,
    private dataService: GameDataService,
  ) {}

  // --- Observables ---

  // Observable of all characters
  characters$: Observable<Character[]> = this.gameState.state$.pipe(
    map((state) => state?.characters ?? []),
  );

  // Observable of the current character
  currentCharacter$: Observable<Character | undefined> =
    this.gameState.state$.pipe(
      map((state) => {
        if (!state) return undefined;
        return state.characters.find((c) => c.id === state.currentCharacterId);
      }),
    );

  // // Observable of the current character (with full item data)
  // currentCharacter$ = this.gameState.state$.pipe(
  //   map((state) => {
  //     if (!state) return undefined;
  //     const char = state.characters.find(
  //       (c) => c.id === state.currentCharacterId,
  //     );
  //     if (!char) return undefined;
  //     return {
  //       ...char,
  //       inventory: char.inventory.map((itemId) =>
  //         this.dataService.getItem(itemId),
  //       ),
  //     };
  //   }),
  // );

  // --- Getters ---

  // Get the full game state
  get state(): GameState | undefined {
    return this.gameState.current;
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

  // --- Character Utilities ---

  // Get a character by ID
  getCharacter(id: string): Character | undefined {
    return this.state?.characters.find((c) => c.id === id);
  }

  // Update part of a character (immutable update)
  updateCharacter(id: string, changes: Partial<Character>): void {
    if (!this.state) {
      console.warn('[CharacterFacade] No game state!');
      return;
    }
    const updated = this.state.characters.map((c) =>
      c.id === id ? { ...c, ...changes } : c,
    );
    console.log(`[CharacterFacade] updateCharacter(${id}) - changes:`, changes);
    this.gameSave.save({ ...this.state, characters: updated });
  }

  // --- Attribute Logic ---

  listDisplayAttributeKeys(character?: Character): string[] {
    if (!character) return [];
    return Object.keys(character.attributes).filter(
      (k) => !['level', 'health'].includes(k),
    );
  }

  updateCharacterAttributeValue(
    id: string,
    attributeId: string,
    value: string | number,
  ): void {
    const char = this.getCharacter(id);
    console.log(
      `[CharacterFacade] updateCharacterAttributeValue(${id}, ${attributeId}, ${value}) - found character:`,
      char,
    );
    if (!char) {
      console.warn(`[CharacterFacade] Character not found: ${id}`);
      return;
    }
    const attributes = { ...(char.attributes ?? {}), [attributeId]: value };
    console.log('[CharacterFacade] New attributes:', attributes);
    this.updateCharacter(id, { attributes });
  }

  /**
   * Creates a new Character from a template in CHARACTERS_SEED.
   * @param templateId The id of the template character to clone.
   * @param name The name for the new character.
   * @returns Character
   */
  createNewCharacterFromTemplate(templateId: string, name: string): Character {
    const template = this.dataService.getCharacter(templateId);
    if (!template) throw new Error('Template character not found');
    const id = toId(name);
    // Deep clone and override name/id
    return {
      ...JSON.parse(JSON.stringify(template)),
      id,
      name,
    } as Character;
  }

  // --- Inventory Logic ---

  /** Utility: Get inventory slots for any character */
  getInventorySlots(character: Character): InventorySlot[] {
    const itemMap = new Map<string, InventorySlot>();
    character.inventory.forEach((id) => {
      const item = this.dataService.getItem(id);
      if (!item) return;
      if (!itemMap.has(id)) {
        itemMap.set(id, { item, qty: 1 });
      } else {
        itemMap.get(id)!.qty += 1;
      }
    });
    return Array.from(itemMap.values());
  }

  /** Observable: Inventory slots for the current character */
  readonly inventorySlots$: Observable<InventorySlot[]> =
    this.currentCharacter$.pipe(
      map((char) => (char ? this.getInventorySlots(char) : [])),
    );

  /** Synchronous getter for current character's inventory slots */
  get inventorySlots(): InventorySlot[] {
    return this.currentCharacter
      ? this.getInventorySlots(this.currentCharacter)
      : [];
  }

  addItemToInventory(itemId: string, character: Character): void {
    const updatedInventory = [...(character.inventory ?? []), itemId];
    this.updateCharacter(character.id, { inventory: updatedInventory });
  }

  get inventory(): Item[] {
    const char = this.currentCharacter;
    if (!char || !Array.isArray(char.inventory)) return [];
    return char.inventory
      .map((id: string) => this.dataService.getItem(id))
      .filter((item): item is Item => Boolean(item))
      .sort((a, b) => a.name.localeCompare(b.name));
  }
}
