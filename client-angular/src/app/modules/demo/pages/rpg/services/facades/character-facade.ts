import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  firstValueFrom,
  map,
  Observable,
  of,
  shareReplay,
  switchMap,
} from 'rxjs';

import { CHARACTERS_CATALOG } from '../../data/game-catalogs';
import {
  extractSaveInstance,
  getEntityFromCatalog,
  mergeInstanceWithCatalog,
} from '../../data/utils-seed';
import {
  Attribute,
  AttributeInstance,
  AttributeValue,
} from '../../models/attribute';
import { Character, CharacterInstance } from '../../models/character';
import { Effect, EffectInstance } from '../../models/effect';
import { InventorySlot, InventorySlotViewModel } from '../../models/item';
import { Skill, SkillInstance } from '../../models/skill';
import {
  selectCurrentCharacter,
  selectCurrentCharacterId,
} from '../../store/app.selectors';
import { CharacterActions } from '../../store/character/character.actions';
import {
  selectAllCharacters,
  selectCharacterById,
  selectCharacterEntities,
} from '../../store/character/character.selectors';
import { toId } from '../../utils';
import {
  buildAdventureEntityCompositeId,
  buildAdventureEntityTemplateId,
  buildDimensionEntityCompositeId,
  DEFAULT_ACCOUNT_ID,
  DEFAULT_ADVENTURE_ID,
  DEFAULT_DIMENSION_ID,
  DEFAULT_PLANE_ID,
} from '../../utils-composite-id';
import { AttributeFacade } from './attribute-facade';
import { EffectFacade } from './effect-facade';
import { ItemFacade } from './item-facade';
import { SkillFacade } from './skill-facade';

// :: Focused on business logic and orchestration, not storage details ::

@Injectable({ providedIn: 'root' })
export class CharacterFacade {
  constructor(private store: Store) {}

  public utils = {
    attribute: inject(AttributeFacade),
    effect: inject(EffectFacade),
    skill: inject(SkillFacade),
    item: inject(ItemFacade),
  };

  // #region 🔸 NgRx Selectors 🔸

  all$ = this.store.select(selectAllCharacters); // for UI
  entities$ = this.store.select(selectCharacterEntities); // for lookup

  byId$(id: string): Observable<Character | undefined> {
    return this.store.select(selectCharacterById(id));
  }
  byTag$(tag: string): Observable<Character[]> {
    return this.all$.pipe(
      map((chars) => chars.filter((c) => c.tags?.includes(tag))),
    );
  }
  byTags$(
    tags: string[],
    mode: 'any' | 'all' = 'any',
  ): Observable<Character[]> {
    const check =
      mode === 'all'
        ? (c: Character) => tags.every((t) => c.tags?.includes(t))
        : (c: Character) => tags.some((t) => c.tags?.includes(t));
    return this.all$.pipe(map((chars) => chars.filter(check)));
  }
  // #endregion

  // #region 🔸 Player Convenience (wrap generic) 🔸

  playerId$ = this.store.select(selectCurrentCharacterId);
  player$ = this.store.select(selectCurrentCharacter);

  playerAttributes$: Observable<Record<string, Attribute>> =
    this.playerId$.pipe(
      switchMap((id) => (id ? this.getAllAttributesFor$(id) : of({}))),
      shareReplay({ bufferSize: 1, refCount: true }),
    );

  getPlayerAttribute$(attributeId: string): Observable<Attribute | undefined> {
    return this.playerAttributes$.pipe(map((attrs) => attrs[attributeId]));
  }

  playerHealth$: Observable<number | undefined> = this.getPlayerAttribute$(
    'health',
  ).pipe(map((a) => (typeof a?.value === 'number' ? a.value : undefined)));

  playerLevel$: Observable<number | undefined> = this.getPlayerAttribute$(
    'level',
  ).pipe(map((a) => (typeof a?.value === 'number' ? a.value : undefined)));

  // Convenience: filtered player attributes excluding provided ids
  playerAttributesExcluding$ = (exclude: string[]): Observable<Attribute[]> =>
    this.playerAttributes$.pipe(
      map((attrs) =>
        Object.values(attrs).filter((a) => !exclude.includes(a.id)),
      ),
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

  // inventory$ = this.getInventorySlots$(this.currentCharacter$);

  // playerHealth$ = this.playerAttributeValue$('health');
  // playerLevel$ = this.playerAttributeValue$('level');

  // #endregion

  // --- Methods ---

  // #region 🔸 CRUD Methods 🔸

  // Creates a temporary "blank canvas" for the UI (minimum valid model)
  addBlank(
    id: string,
    entityId: string,
    name: string,
    dimensionId: string,
    planeId: string,
  ) {
    const character: Character = {
      id,
      entityId,
      dimensionId,
      planeId,
      name,
      adventureId: DEFAULT_ADVENTURE_ID,
      accountId: DEFAULT_ACCOUNT_ID,
      description: '',
      tags: [],
      effects: {},
      attributes: {},
      inventory: [],
      // activeEffects: [],
      skills: [],
    };
    this.store.dispatch(CharacterActions.addCharacter({ character }));
  }
  add(character: Character) {
    this.store.dispatch(CharacterActions.addCharacter({ character }));
  }
  loadAll() {
    this.store.dispatch(CharacterActions.loadAllCharacters({}));
  }
  save(changes: CharacterInstance) {
    if (!changes.id) {
      console.warn(
        '[CharacterFacade] Save aborted: Instance is missing ID',
        changes,
      );
      return;
    }
    this.store.dispatch(
      CharacterActions.saveCharacter({ id: changes.id, changes }),
    );
  }
  remove(id: string) {
    this.store.dispatch(CharacterActions.removeCharacter({ id }));
  }
  // #endregion

  // #region 🔸 Catalog & Instance Domain Logic 🔸

  // Retrieves the pure default template from the active static registry
  getFromCatalog(id: string): Character | undefined {
    return getEntityFromCatalog(CHARACTERS_CATALOG, id);
  }

  // Hydrates a partial instance save file into a complete usable data model
  mergeWithCatalog(instance: CharacterInstance) {
    return mergeInstanceWithCatalog(CHARACTERS_CATALOG, instance);
  }

  // Strips full object down to its bare differences to be saved more efficiently
  toInstance(full: Character): CharacterInstance | undefined {
    const base = this.getFromCatalog(full.entityId);
    if (!base) {
      console.warn(
        `[CharacterFacade] Cannot create instance: template not found for entityId "${full.entityId}"`,
      );
      return undefined;
    }

    return extractSaveInstance<Character>(full, base);
  }
  // #endregion

  // #region 🔸 Character Logic 🔸

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
  // #endregion

  // #region 🔸 Attribute Logic 🔸

  // Get all full attributes (instances merged with catalog) for a character
  getAllAttributesFor$(
    characterId: string,
  ): Observable<Record<string, Attribute>> {
    return this.byId$(characterId).pipe(
      map((char) => {
        if (!char || !char.attributes) return {};
        const hydrated: Record<string, Attribute> = {};

        for (const [key, instance] of Object.entries(char.attributes)) {
          const entityId = instance.entityId || key;
          // Inherit dimension/plane from character to build the strict catalog ID
          const id = buildDimensionEntityCompositeId(
            entityId, // e.g. 'health' or 'level'
            char.dimensionId,
            char.planeId,
          );

          if (id) {
            // Safely cast instance with strictly constructed IDs
            const safeInstance = { ...instance, id, entityId: key };
            const merged = this.utils.attribute.mergeWithCatalog(safeInstance);
            if (merged) hydrated[key] = merged;
          }
        }
        return hydrated;
      }),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
  }

  // Get full attribute (instance merged with catalog) for a character
  getAttributeFor$(
    characterId: string,
    attributeId: string,
  ): Observable<Attribute | undefined> {
    return this.getAllAttributesFor$(characterId).pipe(
      map((attrs) => attrs[attributeId]),
    );
  }

  // Update a character's attribute value
  async updateCharacterAttributeValue(
    id: string,
    attributeId: string,
    value: AttributeValue,
  ): Promise<void> {
    const char = await firstValueFrom(this.byId$(id));
    if (!char) {
      console.warn(`[CharacterFacade] Character not found: ${id}`);
      return;
    }

    const existing = char.attributes?.[attributeId] as
      | AttributeInstance
      | undefined;

    const nextInstance: AttributeInstance = existing
      ? { ...existing, value }
      : { id: attributeId, value };

    const changes: CharacterInstance = {
      id,
      attributes: {
        ...(char.attributes ?? {}),
        [attributeId]: nextInstance,
      },
    };
    this.save(changes);
  }
  // #endregion

  // #region 🔸 Effect Logic 🔸

  // Wrapper: get all character Effects (merged full objects)
  getAllEffectsFor$(characterId: string): Observable<Record<string, Effect>> {
    return this.byId$(characterId).pipe(
      map((char) => {
        if (!char || !char.effects) return {};
        const hydrated: Record<string, Effect> = {};

        for (const [key, instance] of Object.entries(char.effects)) {
          const entityId = instance.entityId || key;
          // Inherit dimension/plane from character to build the strict catalog ID
          const id = buildDimensionEntityCompositeId(
            entityId,
            char.dimensionId,
            char.planeId,
          );

          if (id) {
            // Safely cast instance with strictly constructed IDs
            const safeInstance = { ...instance, id, entityId };
            const merged = this.utils.effect.mergeWithCatalog(safeInstance);
            if (merged) hydrated[key] = merged;
          }
        }
        return hydrated;
      }),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
  }

  private async applyAttributeEffect(
    effect: Effect,
    instance: EffectInstance,
  ): Promise<boolean> {
    const { targetId } = instance;
    if (!targetId) {
      console.warn(
        '[CharacterFacade] Attribute effect instance missing targetId',
      );
      return false;
    }

    if (!effect.path?.startsWith('attributes.')) {
      console.warn(
        `[CharacterFacade] Attribute path not handled: ${effect.path}`,
      );
      return false;
    }

    const char = await firstValueFrom(this.byId$(targetId));
    if (!char) {
      console.warn(`[CharacterFacade] Character not found: ${targetId}`);
      return false;
    }

    // Extract attributeId from path, e.g. "attributes.strength" -> "strength"
    const attributeId = effect.path.split('.').pop()!;
    // Safely navigate attributes in case it's completely undefined
    const inst: AttributeInstance | undefined = char.attributes?.[attributeId];

    // Delegate pure math to utility
    const nextInstance = this.utils.effect.calculateAttributeDelta(
      effect,
      inst,
      attributeId,
    );

    // Safely spread char.attributes
    const changes: Partial<Character> = {
      id: targetId,
      attributes: { ...(char.attributes ?? {}), [attributeId]: nextInstance },
    };

    this.save(changes);
    return true;

    // TODO: Handle other attribute paths (e.g. resistances, stats)
    // TODO: Add triggers (e.g. on attribute change)
    // TODO: Log effect application (for history/event log)
  }

  // Handles tag effects (e.g. adding/removing tags)
  private async applyTagEffect(
    effect: Effect,
    instance: EffectInstance,
  ): Promise<boolean> {
    const { targetId } = instance;
    if (!targetId) {
      console.warn('[CharacterFacade] Tag effect instance missing targetId');
      return false;
    }

    console.log(
      `[CharacterFacade] [TODO] Tag effect logic for ${instance.sourceType} (${targetId}):`,
    );

    const char = await firstValueFrom(this.byId$(targetId));
    if (!char) {
      console.warn(`[CharacterFacade] Character not found: ${targetId}`);
      return false;
    }

    const { entityId } = effect;
    if (!entityId) {
      console.warn('[CharacterFacade] Tag effect missing entityId');
      return false;
    }

    const currentTags = [...(char.tags ?? [])];

    switch (effect.operation) {
      case 'add':
        if (!currentTags.includes(entityId)) currentTags.push(entityId);
        break;
      case 'remove':
        if (currentTags.includes(entityId)) {
          const next = currentTags.filter((t) => t !== entityId);
          this.save({ id: targetId, tags: next });
          return true;
        }
        return false; // nothing to remove
      case 'toggle': {
        if (currentTags.includes(entityId)) {
          const next = currentTags.filter((t) => t !== entityId);
          this.save({ id: targetId, tags: next });
          return true;
        }
        currentTags.push(entityId);
        break;
      }
      case 'clear': {
        if (currentTags.length === 0) return false;
        this.save({ id: targetId, tags: [] });
        return true;
      }
      default:
        console.warn(
          `[CharacterFacade] Unsupported tag operation: ${effect.operation}`,
        );
        return false;
    }

    this.save({ id: targetId, tags: currentTags });
    return true;
  }

  // Handles state effects (e.g. status, toggles)
  private async applyStateEffect(
    effect: Effect,
    instance: EffectInstance,
  ): Promise<boolean> {
    const { targetId } = instance;
    if (!targetId) {
      console.warn('[CharacterFacade] State effect instance missing targetId');
      return false;
    }

    console.log(
      `[CharacterFacade] [TODO] State effect logic for ${instance.sourceType} (${targetId}):`,
    );
    // TODO: Implement state logic (set/toggle status, etc.)
    return false;
  }

  // Universal entry point (true=applied)
  async applyEffectInstance(instance: EffectInstance): Promise<boolean> {
    if (!instance.targetId) {
      console.warn(
        '[CharacterFacade] Effect instance missing targetId',
        instance,
      );
      return false;
    }

    // Fetch full effect from catalog
    let effect = this.utils.effect.mergeWithCatalog(instance);

    // Safe Fallback: If missing exact ID but have entityId, build it using target's dimension
    if (!effect && instance.entityId) {
      const target = await firstValueFrom(this.byId$(instance.targetId));
      if (target) {
        const compositeId = buildDimensionEntityCompositeId(
          instance.entityId,
          target.dimensionId,
          target.planeId,
        );
        if (compositeId) {
          effect = this.utils.effect.mergeWithCatalog({
            ...instance,
            id: compositeId,
          });
        }
      }
    }

    if (!effect) {
      console.warn(
        '[CharacterFacade] Base effect not found in catalog for instance:',
        instance,
      );
      return false;
    }

    // TODO: Add global effect triggers/logs here

    console.log(
      `[GameFacade] Applying effect to ${instance.sourceType} (${instance.targetId}):`,
      effect,
    );

    // Pass BOTH the computed rules (Effect) AND the runtime context (EffectInstance)
    switch (effect.kind) {
      case 'attribute':
        return this.applyAttributeEffect(effect, instance);
      case 'tag':
        return this.applyTagEffect(effect, instance);
      case 'state':
        return this.applyStateEffect(effect, instance);
      default:
        console.warn(
          `[GameFacade] Effect kind not implemented: ${effect.kind}`,
        );
        return false;
    }
  }

  /**
   * Apply a skill instance to a target character.
   * Resolves skill from catalog, validates target, and dispatches all effects.
   * All effects inherit the skill's targetId.
   * Returns true if any effect was successfully applied.
   */
  async applySkillInstance(instance: SkillInstance): Promise<boolean> {
    console.group('[CharacterFacade.applySkillInstance]');
    console.log('Skill instance:', instance);

    // Validate skill-level required fields
    if (!instance.targetId) {
      console.warn('[CharacterFacade] Skill instance missing targetId');
      console.groupEnd();
      return false;
    }

    // // Validate target character exists
    // const target = await firstValueFrom(this.byId$(instance.targetId));
    // if (!target) {
    //   console.warn(
    //     `[CharacterFacade] Target character not found: ${instance.targetId}`,
    //   );
    //   console.groupEnd();
    //   return false;
    // }

    // Resolve skill from catalog: try instance.id as full ID first, then build composite from entityId
    let skill: Skill | undefined;
    let resolvedSkillId: string | undefined;

    // Try instance.id as a full catalog ID
    if (instance.id && typeof instance.id === 'string' && instance.id.trim()) {
      skill = await firstValueFrom(this.utils.skill.byId$(instance.id));
      if (skill) {
        resolvedSkillId = instance.id;
        console.log('Resolved skill by full ID:', instance.id);
      }
    }

    // If not found and we have entityId, build composite ID using target's dimension/plane
    if (
      !skill &&
      instance.entityId &&
      typeof instance.entityId === 'string' &&
      instance.entityId.trim()
    ) {
      // We need target's dimensional context; get it once here
      const target = await firstValueFrom(this.byId$(instance.targetId));
      if (target) {
        const compositeId = buildDimensionEntityCompositeId(
          instance.entityId,
          target.dimensionId,
          target.planeId,
        );
        if (
          compositeId &&
          typeof compositeId === 'string' &&
          compositeId.trim()
        ) {
          skill = await firstValueFrom(this.utils.skill.byId$(compositeId));
          if (skill) {
            resolvedSkillId = compositeId;
            console.log(
              `Resolved skill by composite ID (entityId=${instance.entityId}):`,
              compositeId,
            );
          }
        }
      }
    }

    // Final check: do we have a valid skill?
    if (!skill || !resolvedSkillId) {
      console.warn('[CharacterFacade] Skill not found for instance:', instance);
      console.groupEnd();
      return false;
    }

    console.log('Resolved skill from catalog:', skill);

    // Validate target exists
    const target = await firstValueFrom(this.byId$(instance.targetId));
    if (!target) {
      console.warn(
        `[CharacterFacade] Target character not found: ${instance.targetId}`,
      );
      console.groupEnd();
      return false;
    }

    // Validate skill has effects to apply
    if (!skill.effects || Object.keys(skill.effects).length === 0) {
      console.warn('[CharacterFacade] Skill has no effects to apply');
      console.groupEnd();
      return false;
    }

    // Prepare provenance metadata once
    const timestamp = instance.appliedAt ?? new Date().toISOString();
    const appliedBy = instance.appliedBy ?? instance.targetId;
    const effects: EffectInstance[] = Object.values(skill.effects);

    // Apply all effects from the skill (delegate all validation to applyEffectInstance)
    let anyApplied = false;
    for (const effectRef of effects) {
      try {
        // Build complete effect instance with provenance tracking
        const effectInstance: EffectInstance = {
          ...effectRef,
          targetId: instance.targetId,
          sourceType: 'skill',
          sourceId: skill.id,
          appliedBy,
          appliedAt: timestamp,
          duration: effectRef.duration,
        };

        const applied = await this.applyEffectInstance(effectInstance);
        if (applied) anyApplied = true;
      } catch (err) {
        console.error(
          '[CharacterFacade] Error applying skill effect',
          effectRef,
          err,
        );
      }
    }

    console.log(
      `[CharacterFacade] Skill application complete. Any effects applied: ${anyApplied}`,
    );
    console.groupEnd();
    return anyApplied;
  }

  // Applies a skill from source character to target character
  async applySkillToTarget(targetId: string, appliedBy: string, skill: Skill) {
    const timestamp = new Date().toISOString();
    const effects: EffectInstance[] = Object.values(skill.effects);
    for (const effectRef of effects) {
      // Complete the effect instance with full provenance tracking
      const effectInstance: EffectInstance = {
        ...effectRef,
        targetId,
        sourceType: 'skill',
        sourceId: skill.id,
        appliedBy,
        appliedAt: timestamp,
        duration: effectRef.duration,
      };
      await this.applyEffectInstance(effectInstance);
    }
  }

  // #endregion

  // #region 🔸 Inventory Logic 🔸

  // Fetch inventory slots for any character
  getInventorySlots$(
    character$: Observable<Character | undefined>,
  ): Observable<InventorySlot[]> {
    return character$.pipe(
      map((character) => {
        if (!character || !Array.isArray(character.inventory)) return [];
        const itemMap = new Map<string, InventorySlot>();

        character.inventory.forEach((id) => {
          const item = this.utils.item.getFromCatalog(id);
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
    this.save({ id: characterId, inventory: updatedInventory });
  }
}
