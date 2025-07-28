import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, firstValueFrom, map, Observable } from 'rxjs';

import { Attribute, AttributeViewModel } from '../../models/attribute';
import { Character } from '../../models/character';
import { Effect, EffectViewModel } from '../../models/effect';
import { InventorySlot, InventorySlotViewModel } from '../../models/item';
import {
  selectCurrentCharacter,
  selectCurrentCharacterId,
} from '../../store/app.selectors';
import {
  selectAllAttributes,
  selectAttributeEntities,
} from '../../store/attribute/attribute.selectors';
import { CharacterActions } from '../../store/character/character.actions';
import {
  selectAllCharacters,
  selectCharacterById,
  selectCharacterEntities,
} from '../../store/character/character.selectors';
import { selectItemEntities } from '../../store/item/item.selectors';
import { getIdValuePairs, IdValuePair, toId } from '../../utils';
import {
  buildAdventureEntityCompositeId,
  buildAdventureEntityTemplateId,
  DEFAULT_DIMENSION_ID,
  DEFAULT_PLANE_ID,
} from '../../utils-composite-id';

// :: Focused on business logic and orchestration, not storage details ::

@Injectable({ providedIn: 'root' })
export class CharacterFacade {
  constructor(private store: Store) {}

  // #region 🔸 NgRx Selectors 🔸

  all$ = this.store.select(selectAllCharacters);
  entities$ = this.store.select(selectCharacterEntities);

  // Player of current adventure
  playerId$ = this.store.select(selectCurrentCharacterId);
  player$ = this.store.select(selectCurrentCharacter);
  // player$ = this.store.select<Character | undefined>(selectCurrentCharacter);

  attributeEntities$ = this.store.select(selectAttributeEntities);
  attributes$ = this.store.select(selectAllAttributes);
  itemEntities$ = this.store.select(selectItemEntities);

  playerAttributes$: Observable<Attribute[]> = combineLatest([
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
          return { ...def, value } as Attribute;
        })
        .filter((a): a is Attribute => !!a),
    ),
  );

  // Player stats (excluding health/level)
  playerStats$: Observable<AttributeViewModel[]> = combineLatest([
    this.player$,
    this.attributes$,
  ]).pipe(
    map(([player, attrs]) => {
      if (!player) return [];
      return attrs
        .filter(
          (attr) =>
            attr.type === 'stat' && attr.id !== 'health' && attr.id !== 'level',
        )
        .map(
          (attr) =>
            ({
              id: attr.id,
              name: attr.name,
              value: Number(
                player.attributes[attr.id ?? 0] ?? attr.defaultValue ?? 0,
              ),
              max: typeof attr.max === 'number' ? attr.max : undefined,
              description: attr.description,
            }) as AttributeViewModel,
        );
    }),
  );

  // Player health (current/max)
  playerHealth$: Observable<{ value: number; max?: number } | null> =
    // combineLatest([this.player$, this.attributeEntities$]).pipe(
    combineLatest([this.player$, this.attributes$]).pipe(
      // map(([player, attrsDict]) => {
      map(([player, attrs]) => {
        if (!player) return null;
        // const attrs = Object.values(attrsDict); // Convert to array
        const healthAttr = attrs.find((a) => a.id === 'health');
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

  // Player inventory in display format
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
  // #endregion

  // --- Methods ---

  // #region 🔸 Feature CRUD Methods 🔸
  add(character: Character) {
    this.store.dispatch(CharacterActions.addCharacter({ character }));
  }
  loadAll() {
    this.store.dispatch(CharacterActions.loadAllCharacters());
  }
  save(id: string, changes: Partial<Character>) {
    this.store.dispatch(CharacterActions.saveCharacter({ id, changes }));
  }
  remove(id: string) {
    this.store.dispatch(CharacterActions.removeCharacter({ id }));
  }
  byId$(id: string) {
    return this.store.select(selectCharacterById(id));
  }
  // #endregion

  // Create a new character from a template in the store
  async createNewCharacterFromTemplate(
    name: string,
    adventureId: string,
    accountId: string,
    lookupName = 'adventurer',
  ): Promise<Character | undefined> {
    const lookupId = buildAdventureEntityTemplateId(lookupName);
    console.log('character template id:', lookupId);
    const entityId = toId(name);
    // const slotId = await firstValueFrom(this.store.select(selectCurrentSlotId));
    // if (!slotId) {
    //   console.warn('No current slotId found');
    //   return undefined;
    // }
    // const id = buildAdventureEntityTemplateId(entityId, adventureId);
    const id = buildAdventureEntityCompositeId(
      entityId,
      DEFAULT_DIMENSION_ID,
      DEFAULT_PLANE_ID,
      adventureId,
      accountId,
    );
    console.log('new player id:', id);
    if (!id || !lookupId) return undefined;
    const template = await firstValueFrom(this.byId$(lookupId));
    console.log('template:', template);
    if (!template) throw new Error('Template character not found');
    return {
      // Deep clone (if planning to mutate nested fields)
      // ...JSON.parse(JSON.stringify(template)),
      ...template,
      id,
      name,
      entityId,
      adventureId,
      accountId,
    } as Character;
  }

  // Update part of a character (immutable update)
  // async updateCharacter(
  //   id: string,
  //   changes: Partial<Character>,
  // ): Promise<void> {
  //   const char = await firstValueFrom(this.byId(id));
  //   if (!char) {
  //     console.warn(`[CharacterFacade] Character not found: ${id}`);
  //     return;
  //   }
  //   const updated: Character = { ...char, ...changes };
  //   this.store.dispatch(CharacterActions.saveCharacter({ character: updated }));
  // }

  // Update part of a character (immutable update)
  updateCharacter(id: string, changes: Partial<Character>): void {
    this.store.dispatch(CharacterActions.saveCharacter({ id, changes }));
  }

  // --- Attribute Logic ---

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

  // Update a character's attribute value
  async updateCharacterAttributeValue(
    id: string,
    attributeId: string,
    value: string | number,
  ): Promise<void> {
    const char = await firstValueFrom(this.byId$(id));
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
    this.updateCharacter(id, { attributes });
  }

  // --- Inventory Logic ---

  // Fetch inventory slots for any character
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

  // Add an item to a character's inventory
  async addItemToInventory(itemId: string, characterId: string): Promise<void> {
    const char = await firstValueFrom(this.byId$(characterId));
    if (!char) {
      console.warn(`[CharacterFacade] Character not found: ${characterId}`);
      return;
    }
    const updatedInventory = [...(char.inventory ?? []), itemId];
    this.updateCharacter(characterId, { inventory: updatedInventory });
  }

  // #region 🔸 Effect Logic 🔸

  // Returns true if the effect was applied, false if resisted
  async applyEffectToCharacter(
    characterId: string,
    effect: Effect,
  ): Promise<boolean> {
    const char = await firstValueFrom(this.byId$(characterId));
    if (!char) {
      console.warn(`[CharacterFacade] Character not found: ${characterId}`);
      return false;
    }

    // Only handle attribute effects for now
    if (effect.kind !== 'attribute' || !effect.path.startsWith('attributes.')) {
      return false;
    }

    // Extract attributeId from path, e.g. "attributes.strength" -> "strength"
    const attributeId = effect.path.split('.').pop()!;
    const current = Number(char.attributes[attributeId] ?? 0);
    let delta: number; // amount to add, subtract, or multiply
    if (typeof effect.value === 'number') {
      delta = effect.value;
    } else if (typeof effect.defaultValue === 'number') {
      delta = effect.defaultValue;
    } else {
      delta = 0;
    }
    let newValue = current;
    switch (effect.operation) {
      case 'add':
        newValue = current + delta;
        break;
      case 'subtract':
        newValue = current - delta;
        break;
      case 'set':
        newValue = delta;
        break;
      case 'multiply':
        newValue = current * (typeof delta === 'number' ? delta : 1);
        break;
      default:
        return false; // Unsupported operation
    }

    // Optionally: add resist logic here (e.g. based on character stats, tags, etc.)

    // await this.updateCharacterAttributeValue(
    //   characterId,
    //   attributeId,
    //   newValue,
    // );

    const changes: Partial<Character> = {
      ...(char.attributes ?? {}),
      [attributeId]: newValue,
    };
    console.log('[CharacterFacade] New attributes:', changes);
    this.updateCharacter(characterId, changes);

    return true;
  }
  // #endregion
}
