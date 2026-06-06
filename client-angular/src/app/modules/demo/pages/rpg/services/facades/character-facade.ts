import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  combineLatest,
  firstValueFrom,
  map,
  Observable,
  of,
  shareReplay,
  switchMap,
} from 'rxjs';

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
import { selectItemEntities } from '../../store/item/item.selectors';
import { toId } from '../../utils';
import {
  buildAdventureEntityCompositeId,
  buildAdventureEntityTemplateId,
  buildDimensionEntityCompositeId,
  DEFAULT_DIMENSION_ID,
  DEFAULT_PLANE_ID,
} from '../../utils-composite-id';
import { AttributeFacade } from './attribute-facade';
import { EffectFacade } from './effect-facade';
import { SkillFacade } from './skill-facade';

// :: Focused on business logic and orchestration, not storage details ::

@Injectable({ providedIn: 'root' })
export class CharacterFacade {
  constructor(private store: Store) {}

  public utils = {
    attribute: inject(AttributeFacade),
    effect: inject(EffectFacade),
    skill: inject(SkillFacade),
  };

  // #region 🔸 NgRx Selectors 🔸

  all$ = this.store.select(selectAllCharacters);
  entities$ = this.store.select(selectCharacterEntities);

  // Player of current adventure
  playerId$ = this.store.select(selectCurrentCharacterId);
  player$ = this.store.select(selectCurrentCharacter);
  // player$ = this.store.select<Character | undefined>(selectCurrentCharacter);

  // --- Other Catalog selectors
  // attributeEntities$ = this.store.select(selectAttributeEntities);
  // attributes$ = this.store.select(selectAllAttributes);
  // effectEntities$ = this.store.select(selectEffectEntities);
  // effects$ = this.store.select(selectAllEffects);
  itemEntities$ = this.store.select(selectItemEntities);
  // #endregion

  // #region 🔸 Queries (generic) 🔸

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

  // #region 🔸 Player / Target Convenience (wrap generic) 🔸

  // playerAttributes$: Observable<Attribute[]> = this.playerId$.pipe(
  //   switchMap((id) => (id ? this.getAllAttributesFor$(id) : of([]))),
  // );

  playerAttributes$: Observable<Record<string, Attribute>> =
    this.playerId$.pipe(
      switchMap((id) => (id ? this.getAllAttributesFor$(id) : of({}))),
    );

  playerHealth$: Observable<number | undefined> = this.playerId$.pipe(
    switchMap((id) =>
      id ? this.getAttributeFor$(id, 'health') : of(undefined),
    ),
    map((a) => (typeof a?.value === 'number' ? a.value : undefined)),
  );

  playerLevel$: Observable<number | undefined> = this.playerId$.pipe(
    switchMap((id) =>
      id ? this.getAttributeFor$(id, 'level') : of(undefined),
    ),
    map((a) => (typeof a?.value === 'number' ? a.value : undefined)),
  );

  // getPlayerAttribute$(id: string): Observable<Attribute | undefined> {
  //   return this.playerAttributes$.pipe(
  //     map((attrs) => attrs.find((a) => a.id === id)),
  //   );
  // }

  // // Convenience: filtered player attributes excluding provided ids
  // playerAttributesExcluding$ = (exclude: string[]): Observable<Attribute[]> =>
  //   this.playerAttributes$.pipe(
  //     map((attrs) => attrs.filter((a) => !exclude.includes(a.id))),
  //   );

  getPlayerAttribute$(id: string): Observable<Attribute | undefined> {
    return this.playerAttributes$.pipe(map((attrs) => attrs[id]));
  }

  // Convenience: filtered player attributes excluding provided ids
  playerAttributesExcluding$ = (exclude: string[]): Observable<Attribute[]> =>
    this.playerAttributes$.pipe(
      map((attrs) =>
        Object.values(attrs).filter((a) => !exclude.includes(a.id)),
      ),
    );
  // #endregion

  // #region 🔸 Derived View Models 🔸

  // // Player stats view model
  // playerStats$: Observable<AttributeViewModel[]> = this.playerAttributes$.pipe(
  //   map((attrs) =>
  //     attrs
  //       .filter((a) => a.kind === 'stat')
  //       .map(
  //         (a) =>
  //           ({
  //             id: a.id,
  //             name: a.name,
  //             value: Number(a.value ?? 0),
  //             min: typeof a.min === 'number' ? a.min : undefined,
  //             max: typeof a.max === 'number' ? a.max : undefined,
  //             description: a.description,
  //           }) as AttributeViewModel,
  //       ),
  //   ),
  // );

  // Returns all player stats as a Record keyed by stat id
  playerStats$: Observable<Record<string, Attribute>> = this.playerId$.pipe(
    switchMap((id) => (id ? this.getAllAttributesFor$(id) : of({}))),
  );

  // // Player active effects
  // playerActiveEffects$: Observable<EffectViewModel[]> = this.player$.pipe(
  //   map((player) => {
  //     if (!player?.effects) return [];
  //     return Object.entries(player.effects)
  //       .filter(([, value]) => value > 0)
  //       .map(
  //         ([key, value]) =>
  //           ({
  //             label: key,
  //             description: `Effect ${key} (${value})`,
  //           }) as EffectViewModel,
  //       );
  //   }),
  // );

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
      adventureId: 'template',
      accountId: 'system',
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
  // #endregion

  // #region 🔸 Attribute Logic 🔸

  // Get a single attribute instance for a character
  getAttributeInstanceFor$(
    characterId: string,
    entityId: string,
  ): Observable<AttributeInstance | undefined> {
    return this.byId$(characterId).pipe(
      map((char) => {
        const instance = char?.attributes?.[entityId];
        const dimensionId = char?.dimensionId;
        const planeId = char?.planeId;
        const compositeId = buildDimensionEntityCompositeId(
          entityId,
          dimensionId,
          planeId,
        );
        // console.group(
        //   `[getAttributeInstanceFor$] characterId=${characterId}, entityId=${entityId}`,
        // );
        // console.log('Character:', char);
        // console.log('Attribute instance:', instance);
        if (!instance) {
          // console.warn('No attribute instance found');
          // console.groupEnd();
          return undefined;
        }
        // console.log('Attribute ID:', compositeId);
        // console.groupEnd();
        // Ensure entityId is present for downstream merging
        // return { entityId, ...instance };
        // Ensure dimensional metadata is present for downstream merging
        return {
          id: compositeId,
          // entityId,
          // dimensionId,
          // planeId,
          ...instance,
        };
      }),
    );
  }

  // Get all attribute instances for a character
  getAllAttributeInstancesFor$(
    characterId: string,
  ): Observable<Record<string, AttributeInstance>> {
    return this.byId$(characterId).pipe(
      map((char) => {
        const out: Record<string, AttributeInstance> = {};
        const attrs = char?.attributes ?? {};
        const dimensionId = char?.dimensionId;
        const planeId = char?.planeId;
        // Ensure each instance has entityId set to its key
        for (const entityId of Object.keys(attrs)) {
          const instance = attrs[entityId];
          // out[key] = { entityId: key, ...instance };
          const compositeId = buildDimensionEntityCompositeId(
            entityId,
            dimensionId,
            planeId,
          );
          out[entityId] = {
            id: compositeId,
            // entityId: key,
            // dimensionId,
            // planeId,
            ...instance,
          };
        }
        // console.group(
        //   `[getAllAttributeInstancesFor$] characterId=${characterId}`,
        // );
        // console.log('Character:', char);
        // console.log('Attributes:', out);
        // console.groupEnd();
        return out;
      }),
    );
  }

  // Get a full attribute (instance merged with catalog) for a character
  getAttributeFor$(
    characterId: string,
    entityId: string,
  ): Observable<Attribute | undefined> {
    return this.getAttributeInstanceFor$(characterId, entityId).pipe(
      switchMap((instance) => {
        // console.group(
        //   `[getAttributeFor$] characterId=${characterId}, entityId=${entityId}`,
        // );
        // console.log('Attribute instance:', instance);
        if (!instance || !instance.id) {
          // console.warn('No attribute instance (with proper ID) found');
          // console.groupEnd();
          return of(undefined);
        }
        // console.groupEnd();
        return this.utils.attribute.convertInstanceToAttribute$(
          instance,
          instance.id,
        );
      }),
      // cache the last merged attribute per character+attribute consumer
      shareReplay({ bufferSize: 1, refCount: true }),
    );
  }

  // Get all full attributes (merged with catalog) for a character
  getAllAttributesFor$(
    characterId: string,
  ): Observable<Record<string, Attribute>> {
    return this.getAllAttributeInstancesFor$(characterId).pipe(
      switchMap((instances) => {
        const keys = Object.keys(instances);
        if (!keys.length) {
          // console.group(`[getAllAttributesFor$] characterId=${characterId}`);
          // console.warn('No attribute instances found');
          // console.groupEnd();
          return of({});
        }
        // Map each instance to its full attribute and build a record
        return combineLatest(
          keys.map((key) => {
            const instance = instances[key];
            // console.group(
            //   `[getAllAttributesFor$] characterId=${characterId}, entityId=${key}`,
            // );
            // console.log('Attribute instance:', instance);
            if (!instance || !instance.id) {
              // console.warn('No attribute instance (with proper ID) found');
              // console.groupEnd();
              return of([key, undefined] as [string, Attribute | undefined]);
            }
            // console.groupEnd();
            return this.utils.attribute
              .convertInstanceToAttribute$(instance, instance.id)
              .pipe(
                map((attr) => [key, attr] as [string, Attribute | undefined]),
              );
          }),
        ).pipe(
          map((entries) => {
            const out: Record<string, Attribute> = {};
            for (const [key, attr] of entries) {
              if (attr) out[key] = attr;
            }
            // console.group(
            //   `[getAllAttributesFor$] characterId=${characterId} (final)`,
            // );
            // console.log('Attributes:', out);
            // console.groupEnd();
            return out;
          }),
        );
      }),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
  }
  // #endregion

  // #region 🔸 Attribute Logic (setters) 🔸

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
    console.log(
      `[CharacterFacade] updateCharacterAttributeValue(${id}, ${attributeId}, ${value}) - found character:`,
      char,
    );

    // // Build the new attributes object (Partial<Character>)
    // const attributes = { ...(char.attributes ?? {}), [attributeId]: value };
    // console.log('[CharacterFacade] New attributes:', attributes);
    // this.updateCharacter(id, { attributes });

    const existing = char.attributes?.[attributeId] as
      | AttributeInstance
      | undefined;

    const nextInstance: AttributeInstance = existing
      ? {
          ...existing,
          value,
        }
      : {
          id: attributeId,
          value,
        };

    this.updateCharacter(id, {
      attributes: {
        ...(char.attributes ?? {}),
        [attributeId]: nextInstance,
      },
    });
  }
  // #endregion

  // #region 🔸 Effect Logic 🔸

  // TODO: shouldn't handling instances of Effect be similar to Attribute?
  getAllEffectInstancesFor$(
    characterId: string,
  ): Observable<Record<string, EffectInstance>> {
    return this.byId$(characterId).pipe(
      map((c) => {
        // Effects can be undefined, an array, or a record
        const fx: unknown = c && typeof c === 'object' ? c.effects : undefined;
        if (!fx) return {};
        if (Array.isArray(fx)) {
          return fx.reduce<Record<string, EffectInstance>>((acc, e) => {
            if (e && typeof e === 'object') {
              const effect = e as EffectInstance;
              if (typeof effect.id === 'string') {
                acc[effect.id] = effect;
              } else if (
                'entityId' in effect &&
                typeof (effect as { entityId?: string }).entityId === 'string'
              ) {
                acc[(effect as { entityId: string }).entityId] = effect;
              }
            }
            return acc;
          }, {});
        }
        if (typeof fx === 'object') {
          // Only return if it's a record of EffectInstance
          return fx as Record<string, EffectInstance>;
        }
        return {};
      }),
    );
  }

  // Wrapper: get all character Effects (merged full objects)
  getAllEffectsFor$(characterId: string): Observable<Effect[]> {
    return combineLatest([
      this.byId$(characterId),
      this.getAllEffectInstancesFor$(characterId),
      // this.effectEntities$,
      this.utils.effect.entities$,
    ]).pipe(
      map(([char, instMap, effectDefs]) => {
        if (!char) return [];
        const instances = Object.values(instMap ?? {});
        return instances
          .map((inst) => {
            // Prefer match by instance.id; fallback to entityId + character dimension/plane
            const byId = inst.id ? effectDefs[inst.id] : undefined;
            let base: Effect | undefined;
            if (byId) {
              base = byId;
            } else {
              // by composite id (no .id, so trying .entityId)
              base = inst.entityId
                ? (effectDefs[
                    buildDimensionEntityCompositeId(
                      inst.entityId,
                      char.dimensionId,
                      char.planeId,
                    ) ?? ''
                  ] ?? undefined)
                : undefined;
            }

            // const byCompositeId =
            //   !byId && inst.entityId
            //     ? (effectDefs[
            //         buildDimensionEntityCompositeId(
            //           inst.entityId,
            //           char.dimensionId,
            //           char.planeId,
            //         ) ?? ''
            //       ] ?? undefined)
            //     : undefined;

            // const base = byId ?? byCompositeId;
            if (!base) return undefined;
            // Simple overwrite merge as requested
            return { ...base, ...inst } as Effect;

            // // Merge with omit of meta keys from instance
            // const merged: Effect = CharacterFacade.mergeInstanceOverBase<
            //   Effect,
            //   EffectInstance
            // >(base, inst, [
            //   'id',
            //   'entityId',
            //   'dimensionId',
            //   'planeId',
            // ] as const);
            // return merged;
          })
          .filter((e): e is Effect => !!e);
      }),
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
      attributes: { ...(char.attributes ?? {}), [attributeId]: nextInstance },
    };

    this.updateCharacter(targetId, changes);
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
          this.updateCharacter(targetId, { tags: next });
          return true;
        }
        return false; // nothing to remove
      case 'toggle': {
        if (currentTags.includes(entityId)) {
          const next = currentTags.filter((t) => t !== entityId);
          this.updateCharacter(targetId, { tags: next });
          return true;
        }
        currentTags.push(entityId);
        break;
      }
      case 'clear': {
        if (currentTags.length === 0) return false;
        this.updateCharacter(targetId, { tags: [] });
        return true;
      }
      default:
        console.warn(
          `[CharacterFacade] Unsupported tag operation: ${effect.operation}`,
        );
        return false;
    }

    this.updateCharacter(targetId, { tags: currentTags });
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

  // 🔸 Explicit Helper: Orchestrates the template data and merges only valid catalog overrides
  // (fully replaces mergeEffectInstanceWithCatalog in effects-seed.ts)
  private async resolveAndMergeEffect(
    instance: EffectInstance,
  ): Promise<Effect | undefined> {
    let base: Effect | undefined;

    // 1. Try explicit ID
    if (instance.id) {
      base = await firstValueFrom(this.utils.effect.byId$(instance.id));
    }

    // 2. Fallback: Build dimension ID from the target's native plane
    if (!base && instance.entityId && instance.targetId) {
      const target = await firstValueFrom(this.byId$(instance.targetId));
      if (target) {
        const compositeId = buildDimensionEntityCompositeId(
          instance.entityId,
          target.dimensionId,
          target.planeId,
        );
        if (compositeId) {
          base = await firstValueFrom(this.utils.effect.byId$(compositeId));
        }
      }
    }

    if (!base) return undefined;

    // 3. Explicit Merge: Override base rules with the valid values provided by instance
    return { ...base, ...instance } as Effect;
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

    // Explicit base computation
    const effect = await this.resolveAndMergeEffect(instance);

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
}
