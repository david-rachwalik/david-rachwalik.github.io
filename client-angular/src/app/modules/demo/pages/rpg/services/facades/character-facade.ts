import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, firstValueFrom, map, Observable, of } from 'rxjs';

import { AttributeViewModel } from '../../models/attribute';
import { Character } from '../../models/character';
import { EffectViewModel } from '../../models/effect';
import { InventorySlot } from '../../models/item';
import { selectCurrentCharacter } from '../../store/app.selectors';
import { selectAttributeEntities } from '../../store/attribute/attribute.selectors';
import { CharacterActions } from '../../store/character/character.actions';
import {
  selectAllCharacters,
  selectCharacterEntities,
} from '../../store/character/character.selectors';
import { selectItemEntities } from '../../store/item/item.reducer';
import { getIdValuePairs, IdValuePair, toId } from '../../utils';
import { GameDataService } from '../game-data.service';

// :: Focused on business logic and orchestration, not storage details ::
// Provides higher-level, feature-focused methods for the UI or other services
// to interact with characters, orchestrating calls to `GameDataService` and
// adding any business logic (like generating IDs, filtering, sorting, etc.)

@Injectable({ providedIn: 'root' })
export class CharacterFacade {
  constructor(
    private store: Store,
    private dataService: GameDataService,
  ) {}

  // --- NgRx Selectors ---

  // Dict for lookup
  characterEntities$ = this.store.select(selectCharacterEntities);
  // Array for UI
  characters$ = this.store.select(selectAllCharacters);

  // Player of current adventure
  currentCharacter$ = this.store.select(selectCurrentCharacter);
  player$ = this.currentCharacter$;

  // Attributes as a dictionary
  attributes$ = this.store.select(selectAttributeEntities);

  // HP (current/max)
  health$: Observable<{ value: number; max?: number } | null> = combineLatest([
    this.player$,
    this.attributes$,
  ]).pipe(
    map(([player, attrsDict]) => {
      if (!player) return null;
      const attrs = Object.values(attrsDict); // Convert to array
      const healthAttr = attrs.find((a) => a?.id === 'health');
      const value = Number(
        player.attributes['health'] ?? healthAttr?.defaultValue ?? 0,
      );
      const max =
        typeof healthAttr?.max === 'number' ? healthAttr.max : undefined;
      return { value, max };
    }),
  );

  // Sidebar stats (excluding health/level)
  stats$: Observable<AttributeViewModel[]> = combineLatest([
    this.player$,
    this.attributes$,
  ]).pipe(
    map(([player, attrsDict]) => {
      if (!player) return [];
      const attrs = Object.values(attrsDict);
      return attrs
        .filter(
          (attr) =>
            attr?.type === 'stat' &&
            attr.id !== 'health' &&
            attr.id !== 'level',
        )
        .map(
          (attr) =>
            ({
              id: attr?.id,
              name: attr?.name,
              value: Number(
                player.attributes[attr?.id ?? 0] ?? attr?.defaultValue ?? 0,
              ),
              max: typeof attr?.max === 'number' ? attr.max : undefined,
              description: attr?.description,
            }) as AttributeViewModel,
        );
    }),
  );

  // Active effects
  activeEffects$: Observable<EffectViewModel[]> = this.player$.pipe(
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

  // --- Methods ---

  // Helper: lookup by ID
  byId$(id$: Observable<string | undefined>) {
    return combineLatest([this.characterEntities$, id$]).pipe(
      map(([entities, id]) => (id ? entities[id] : undefined)),
    );
  }

  // Update part of a character (immutable update)
  async updateCharacter(
    id: string,
    changes: Partial<Character>,
  ): Promise<void> {
    const char = await firstValueFrom(this.byId$(of(id)));
    if (!char) {
      console.warn(`[CharacterFacade] Character not found: ${id}`);
      return;
    }
    const updated: Character = { ...char, ...changes };
    this.store.dispatch(
      CharacterActions.updateCharacter({ character: updated }),
    );
  }

  // Creates new Character from a CHARACTERS_SEED template
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

  // --- Attribute Logic ---

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

  async updateCharacterAttributeValue(
    id: string,
    attributeId: string,
    value: string | number,
  ): Promise<void> {
    const char = await firstValueFrom(this.byId$(of(id)));
    if (!char) {
      console.warn(`[CharacterFacade] Character not found: ${id}`);
      return;
    }
    console.log(
      `[CharacterFacade] updateCharacterAttributeValue(${id}, ${attributeId}, ${value}) - found character:`,
      char,
    );
    // Build the new attributes object (Partial<Character>)
    const attributes = { ...(char.attributes ?? {}), [attributeId]: value };
    console.log('[CharacterFacade] New attributes:', attributes);
    await this.updateCharacter(id, { attributes });
  }

  // --- Inventory Logic ---

  // Fetch inventory slots for any character
  getInventorySlots$(
    character$: Observable<Character | undefined>,
  ): Observable<InventorySlot[]> {
    return combineLatest([
      character$,
      this.store.select(selectItemEntities),
    ]).pipe(
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

  async addItemToInventory(itemId: string, characterId: string): Promise<void> {
    const char = await firstValueFrom(this.byId$(of(characterId)));
    if (!char) {
      console.warn(`[CharacterFacade] Character not found: ${characterId}`);
      return;
    }
    const updatedInventory = [...(char.inventory ?? []), itemId];
    await this.updateCharacter(characterId, { inventory: updatedInventory });
  }
}
