import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, firstValueFrom, map, Observable } from 'rxjs';

import { Adventure, AdventureIndex } from '../models/adventure';
import { Attribute } from '../models/attribute';
import { Character } from '../models/character';
import { EffectViewModel } from '../models/effect';
import { InventorySlot, InventorySlotViewModel } from '../models/item';
import { AdventureIndexActions } from '../store/adventure/adventure-index.actions';
import { selectAllAdventureIndexes } from '../store/adventure/adventure-index.selectors';
import { AdventureActions } from '../store/adventure/adventure.actions';
import { AppActions } from '../store/app.actions';
import {
  selectCurrentAdventure,
  selectCurrentCharacter,
  selectCurrentLocation,
  selectCurrentMoment,
  selectCurrentSlotId,
} from '../store/app.selectors';
import {
  selectAllAttributes,
  selectAttributeEntities,
} from '../store/attribute/attribute.selectors';
import { CharacterActions } from '../store/character/character.actions';
import {
  selectAllCharacters,
  selectCharacterById,
  selectCharacterEntities,
} from '../store/character/character.selectors';
import {
  selectAllItems,
  selectItemEntities,
} from '../store/item/item.selectors';
import {
  selectAllLocations,
  selectLocationEntities,
} from '../store/location/location.selectors';
import {
  selectAllMoments,
  selectMomentEntities,
} from '../store/moment/moment.selectors';
import { getIdValuePairs, IdValuePair, toId } from '../utils';
import { RpgLogService } from './rpg-log.service';

// function arrayToEntityMap<T extends { id: string }>(
//   arr: T[],
// ): Record<string, T> {
//   return arr.reduce(
//     (acc, entity) => {
//       acc[entity.id] = entity;
//       return acc;
//     },
//     {} as Record<string, T>,
//   );
// }

// :: Business Logic Layer ::
// Focused on business logic and orchestration, not storage details

@Injectable({ providedIn: 'root' })
export class GameFacade {
  constructor(
    private store: Store,
    private logService: RpgLogService,
  ) {}

  // #region 🔸 NgRx Selectors 🔸

  // --- Template Data (Dict for lookup / Array for UI) ---

  attributeEntities$ = this.store.select(selectAttributeEntities);
  attributes$ = this.store.select(selectAllAttributes);

  characterEntities$ = this.store.select(selectCharacterEntities);
  characters$ = this.store.select(selectAllCharacters);

  locationEntities$ = this.store.select(selectLocationEntities);
  locations$ = this.store.select(selectAllLocations);

  momentEntities$ = this.store.select(selectMomentEntities);
  moments$ = this.store.select(selectAllMoments);

  itemEntities$ = this.store.select(selectItemEntities);
  items$ = this.store.select(selectAllItems);

  // --- Current Adventure ---

  currentSlotId$ = this.store.select(selectCurrentSlotId);
  allSaves$ = this.store.select(selectAllAdventureIndexes);

  currentAdventure$ = this.store.select(selectCurrentAdventure);
  player$ = this.store.select(selectCurrentCharacter);

  currentMoment$ = this.store.select(selectCurrentMoment);
  currentLocation$ = this.store.select(selectCurrentLocation);

  logEntries$ = this.logService.entries$;
  // #endregion

  // #region 🔸 Character/Attribute/Inventory Logic 🔸

  // List attribute key/value pairs for a character (excluding some keys)
  listAttributeKeys$(
    character$: Observable<Character | undefined>,
    exclude: string[] = ['level', 'health'],
  ): Observable<IdValuePair[]> {
    return character$.pipe(
      map((character) =>
        character ? getIdValuePairs(character.attributes, exclude) : [],
      ),
    );
  }

  playerAttributes$ = combineLatest([
    this.listAttributeKeys$(this.player$, ['level', 'health']),
    this.attributes$, // Attribute[]
  ]).pipe(
    map(([attrPairs, attrDefs]) =>
      attrPairs
        .map(({ id, value }: IdValuePair) => {
          // Find the full Attribute definition by id
          const def = Array.isArray(attrDefs)
            ? attrDefs.find((a) => a.id === id)
            : undefined;
          if (!def) return undefined;
          // Return a new Attribute with the value from the character
          return {
            ...def,
            value,
          } as Attribute;
        })
        .filter((a): a is Attribute => !!a),
    ),
  );

  // Player stats (excluding health/level)
  playerStats$ = combineLatest([this.player$, this.attributes$]).pipe(
    map(([player, attrs]) => {
      if (!player) return [];
      return attrs
        .filter(
          (attr) =>
            attr.type === 'stat' && attr.id !== 'health' && attr.id !== 'level',
        )
        .map((attr) => ({
          id: attr.id,
          name: attr.name,
          value: Number(player.attributes[attr.id] ?? attr.defaultValue ?? 0),
          max: typeof attr.max === 'number' ? attr.max : undefined,
          description: attr.description,
        }));
    }),
  );

  // Player health (current/max)
  playerHealth$: Observable<{ value: number; max?: number } | null> =
    combineLatest([this.player$, this.attributeEntities$]).pipe(
      map(([player, attrsDict]) => {
        if (!player) return null;
        const healthAttr = attrsDict['health'];
        const value = Number(
          player.attributes['health'] ?? healthAttr?.defaultValue ?? 0,
        );
        const max =
          typeof healthAttr?.max === 'number' ? healthAttr.max : undefined;
        return { value, max };
      }),
    );

  // Player active effects
  playerActiveEffects$: Observable<EffectViewModel[]> = this.player$.pipe(
    map((player) => {
      if (!player?.effects) return [];
      return Object.entries(player.effects)
        .filter(([, value]) => value > 0)
        .map(
          ([key, value]) =>
            ({
              label: key,
              description: `Effect ${key} (${value})`,
            }) as EffectViewModel,
        );
    }),
  );

  // Inventory slots for any character
  getInventorySlots$(
    character$: Observable<Character | undefined>,
  ): Observable<InventorySlot[]> {
    return combineLatest([character$, this.itemEntities$]).pipe(
      map(([character, itemEntities]) => {
        if (!character || !Array.isArray(character.inventory)) return [];
        const itemMap = new Map<string, InventorySlot>();
        character.inventory.forEach((id) => {
          const item = itemEntities[id];
          if (!item) return;
          if (!itemMap.has(id)) {
            itemMap.set(id, { item, qty: 1 });
          } else {
            itemMap.get(id)!.qty += 1;
          }
        });
        return Array.from(itemMap.values());
      }),
    );
  }

  // Player inventory as view models
  playerInventory$: Observable<InventorySlotViewModel[]> =
    this.getInventorySlots$(this.player$).pipe(
      map(
        (slots) =>
          slots.map((slot) => ({
            id: slot.item.id,
            name: slot.item.name,
            qty: slot.qty,
            item: slot.item,
          })) as InventorySlotViewModel[],
      ),
    );
  // inventory$ = this.utils.character.getInventorySlots$(this.currentCharacter$);

  // Helper: lookup character by ID as observable
  characterById$(id: string) {
    return this.store.select(selectCharacterById(id));
  }

  // Update part of a character (immutable update)
  async updateCharacter(
    id: string,
    changes: Partial<Character>,
  ): Promise<void> {
    const char = await firstValueFrom(this.characterById$(id));
    if (!char) {
      console.warn(`[GameFacade] Character not found: ${id}`);
      return;
    }
    const updated: Character = { ...char, ...changes };
    this.store.dispatch(
      CharacterActions.updateCharacter({ character: updated }),
    );
  }

  // Update a character's attribute value
  async updateCharacterAttributeValue(
    id: string,
    attributeId: string,
    value: string | number,
  ): Promise<void> {
    const char = await firstValueFrom(this.characterById$(id));
    if (!char) {
      console.warn(`[GameFacade] Character not found: ${id}`);
      return;
    }
    const attributes = { ...(char.attributes ?? {}), [attributeId]: value };
    await this.updateCharacter(id, { attributes });
  }

  // Add an item to a character's inventory
  async addItemToInventory(itemId: string, characterId: string): Promise<void> {
    const char = await firstValueFrom(this.characterById$(characterId));
    if (!char) {
      console.warn(`[GameFacade] Character not found: ${characterId}`);
      return;
    }
    const updatedInventory = [...(char.inventory ?? []), itemId];
    await this.updateCharacter(characterId, { inventory: updatedInventory });
  }

  // Create a new character from a template in the store
  createNewCharacterFromTemplate$(
    name: string,
    templateId: string,
  ): Observable<Character> {
    return this.store.select(selectCharacterById(templateId)).pipe(
      map((template) => {
        if (!template) throw new Error('Template character not found');
        const id = toId(name);
        // Deep clone and override name/id
        return {
          ...JSON.parse(JSON.stringify(template)),
          id,
          name,
        } as Character;
      }),
    );
  }

  // #endregion

  // #region 🔸 Adventure/Slot/Save Logic 🔸

  // Formats user-chosen label into slot ID
  toSlotId(label: string) {
    const INDEX_PREFIX = 'rpg-demo-slot';
    if (!label) return '';
    const id = toId(label);
    return `${INDEX_PREFIX}:${id}`;
    // TODO: remove duplication of INDEX_PREFIX eventually
  }

  // Calculate true byte size of string as it would be stored
  sizeInKB(slot: Adventure) {
    const json = JSON.stringify(slot);
    return new Blob([json]).size / 1024;
  }

  // Change the active slot id
  setCurrentSlotId(slotId: string) {
    this.store.dispatch(AppActions.setCurrentSlotId({ slotId }));
  }

  // Add a new adventure and its index (metadata)
  addAdventure(adventure: Adventure) {
    this.store.dispatch(AdventureActions.addAdventure({ adventure }));
    // AdventureIndex will be added by effect after Adventure is persisted
    // (effect will dispatch AdventureIndexActions.addAdventureIndex)
  }

  // Load adventure slot
  loadAdventure(id: string) {
    this.store.dispatch(AdventureActions.loadAdventure({ id }));
  }

  // Save adventure state (partial update)
  saveAdventure(id: string, changes: Partial<Adventure>) {
    this.store.dispatch(AdventureActions.saveAdventure({ id, changes }));
    // AdventureIndex will be updated by effect after Adventure is persisted
    // (effect will dispatch AdventureIndexActions.saveAdventureIndex)
  }

  // Save or update slot metadata (direct, if needed)
  saveSlotMetadata(id: string, changes: Partial<AdventureIndex>) {
    this.store.dispatch(
      AdventureIndexActions.saveAdventureIndex({ id, changes }),
    );
  }
  // #endregion

  // #region 🔸 Utility/Log/Testing 🔸

  async log(message: string): Promise<void> {
    await this.logService.add(message);
  }

  async testStatChange() {
    const player = await firstValueFrom(this.player$);
    console.log('[GameFacade] testStatChange() - currentCharacter:', player);
    if (!player) {
      console.warn('[GameFacade] No current character found!');
      return;
    }

    // STR: +1
    const currentStr = Number(player.attributes['str'] ?? 0);
    const newStr = currentStr + 1;
    console.log(`[GameFacade] STR: ${currentStr} -> ${newStr}`);
    await this.updateCharacterAttributeValue(player.id, 'str', newStr);

    // HEALTH: +5, capped at max
    const attributeEntities = await firstValueFrom(this.attributeEntities$);
    const healthAttr = attributeEntities['health'];
    const currentHealth = Number(player.attributes['health'] ?? 0);
    const maxHealth = Number(healthAttr?.max ?? 100);
    const newHealth = Math.min(currentHealth + 5, maxHealth);
    console.log(
      `[GameFacade] HEALTH: ${currentHealth} -> ${newHealth} (max: ${maxHealth})`,
    );
    await this.updateCharacterAttributeValue(player.id, 'health', newHealth);
  }
  // #endregion

  // #region 🔸 Save/Load Methods 🔸

  // App initialization: ensure the game state is prepared & ready
  init() {
    console.log('[GameFacade] Dispatching seed and load actions');
    this.store.dispatch(AppActions.init());
    // // Load currentSlotId from client storage
    // // Seed static data (attributes, items, etc.)
    // // Load AdventureIndexes from client storage
  }

  async play() {
    const slotId = await firstValueFrom(this.currentSlotId$);
    if (!slotId) return;
    this.store.dispatch(AppActions.play({ slotId }));
  }

  // Creates a new game state from a character template, saves & activates it
  async newGame(
    label: string,
    characterName: string,
    templateId = 'player-default',
  ) {
    console.log('[GameFacade] Creating new game with:', {
      label,
      characterName,
      templateId,
    });

    const slotId = this.toSlotId(label);
    const player = await firstValueFrom(
      this.createNewCharacterFromTemplate$(characterName, templateId),
    );
    console.log('[GameFacade] New character:', player);

    const adventure: Adventure = {
      id: slotId,
      label,
      preferences: {
        enableNSFW: false,
        blockedTags: [],
        pronouns: 'they',
        difficulty: 'normal',
        unlockedBonuses: [],
      },
      currentCharacterId: player.id,
      currentLocationId: 'start',
      currentMomentId: 'start',
      eventLog: ['A new adventure begins!'],
      history: [],
      tags: {}, // or arrayToEntityMap(tagsArray)
      characters: { [player.id]: player }, // or arrayToEntityMap([player])
      relationships: {},
      moments: {}, // or arrayToEntityMap(momentsArray)
      locations: {},
      reputationMap: {},
      items: {},
    };
    // const index = await this.buildAdventureIndex(adventure, label);

    this.addAdventure(adventure);
    this.setCurrentSlotId(slotId);
  }

  // Save game slot to client storage
  saveGame(id: string, changes: Partial<Adventure>) {
    console.log('[GameFacade] Saving game slot:', id, changes);
    // this.store.dispatch(AdventureActions.saveAdventure({ id, changes }));
    // // AdventureIndex will be updated by effect after Adventure is persisted
    this.saveAdventure(id, changes);
  }

  // Delete a game slot from client storage
  async deleteGame(slotId: string): Promise<void> {
    console.log('[GameFacade] Deleting adventure slot:', slotId);

    // Dispatch actions to delete Adventure and AdventureIndex
    this.store.dispatch(AdventureActions.removeAdventure({ id: slotId }));
    this.store.dispatch(
      AdventureIndexActions.removeAdventureIndex({ id: slotId }),
    );

    // Get the current slot id and all saves from the store
    const [currentSlotId, allSaves] = await Promise.all([
      firstValueFrom(this.currentSlotId$),
      firstValueFrom(this.allSaves$),
    ]);

    // If the deleted slot was the current slot, pick the next most recent
    if (currentSlotId === slotId) {
      // Filter out the deleted slot and sort by savedAt (latest first)
      const remaining = allSaves
        .filter((s) => s.id !== slotId)
        .sort((a, b) => b.savedAt.localeCompare(a.savedAt));
      if (remaining.length > 0) {
        // Set the most recently played as the new current slot
        this.store.dispatch(
          AppActions.setCurrentSlotId({ slotId: remaining[0].id }),
        );
        console.log(
          `[GameFacade] Auto-selected next most recent slot: ${remaining[0].id}`,
        );
      } else {
        // No saves remain, clear current slot
        this.store.dispatch(AppActions.clearCurrentSlotId());
        console.log('[GameFacade] Cleared currentSlotId (no saves remain)');
      }
    }
    console.log('[GameFacade] Deleted slot:', slotId);
  }
  // #endregion
}
