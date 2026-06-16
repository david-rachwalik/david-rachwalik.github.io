import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, firstValueFrom } from 'rxjs';

// --- Selector Imports ---
import { selectAllAdventureIndexes } from '../store/adventure/adventure-index.selectors';
import {
  selectAccountId,
  selectActiveMomentCharacters,
  selectCurrentAdventure,
  selectCurrentAdventureId,
  selectCurrentLocation,
  selectCurrentLocationId,
  selectCurrentMoment,
  selectCurrentMomentChoices,
  selectCurrentMomentId,
  selectCurrentSlotId,
  selectIsGameLoading,
} from '../store/app.selectors';

// --- Action Imports ---
import { AdventureActions } from '../store/adventure/adventure.actions';
import { AppActions } from '../store/app.actions';
import { CharacterActions } from '../store/character/character.actions';

// --- Model & Util Imports ---
import {
  Adventure,
  AdventureEventPayload,
  AdventureInstance,
} from '../models/adventure';
import { EffectInstance } from '../models/effect';
import { Moment } from '../models/moment';
import { SkillInstance } from '../models/skill';
import {
  buildAdventureEntityCompositeId,
  buildDimensionEntityCompositeId,
  buildDimensionEntityTemplateId,
  DEFAULT_ACCOUNT_ID,
  DEFAULT_ADVENTURE_ID,
  DEFAULT_DIMENSION_ID,
  DEFAULT_PLANE_ID,
  GUEST_ACCOUNT_ID,
  parseCompositeId,
} from '../utils-composite-id';

// --- Facade Imports ---
import { AdventureFacade } from './facades/adventure-facade';
import { AttributeFacade } from './facades/attribute-facade';
import { CharacterFacade } from './facades/character-facade';
import { EffectFacade } from './facades/effect-facade';
import { ItemFacade } from './facades/item-facade';
import { LocationFacade } from './facades/location-facade';
import { MomentFacade } from './facades/moment-facade';
import { SkillFacade } from './facades/skill-facade';
import { TagFacade } from './facades/tag-facade';

/**
 * 🎮 GAME FACADE 🎮
 *
 * Central business logic layer and orchestration engine.
 * Connects feature-specific facades and manages global state flow.
 */
@Injectable({ providedIn: 'root' })
export class GameFacade {
  constructor(private store: Store) {}

  // Consolidates sub-facades for easy centralized access across features
  public utils = {
    attribute: inject(AttributeFacade),
    tag: inject(TagFacade),
    effect: inject(EffectFacade),
    adventure: inject(AdventureFacade),
    character: inject(CharacterFacade),
    location: inject(LocationFacade),
    moment: inject(MomentFacade),
    skill: inject(SkillFacade),
    item: inject(ItemFacade),
  };

  // #region 🔸 NgRx Selectors 🔸

  isLoading$ = this.store.select(selectIsGameLoading);
  accountId$ = this.store.select(selectAccountId);

  // Translates the Moment's static seed IDs into active DB IDs for the UI
  activeMomentCharacters$ = this.store.select(selectActiveMomentCharacters);

  // Current Adventure & Play State
  currentSlotId$ = this.store.select(selectCurrentSlotId);
  allSaves$ = this.store.select(selectAllAdventureIndexes);
  currentAdventureId$ = this.store.select(selectCurrentAdventureId);
  currentAdventure$ = this.store.select(selectCurrentAdventure);

  log$ = this.utils.adventure.log$;
  events$ = this.utils.adventure.events$;

  playerId$ = this.utils.character.playerId$;
  player$ = this.utils.character.player$;

  currentMomentId$ = this.store.select(selectCurrentMomentId);
  currentMoment$ = this.store.select(selectCurrentMoment);
  currentMomentChoices$ = this.store.select(selectCurrentMomentChoices);

  currentLocationId$ = this.store.select(selectCurrentLocationId);
  currentLocation$ = this.store.select(selectCurrentLocation);
  // #endregion

  // #region 🔸 Save/Load (Adventure Slot) Logic 🔸

  /** Dispatches boot sequence to initialize storage and sync catalogs */
  init() {
    console.log('[GameFacade] Dispatching app boot sequence');
    // App initialization: ensure game state is prepared & ready
    this.store.dispatch(AppActions.init());
    // - Load currentSlotId from client storage
    // - Seed static data (attributes, tags, effects..)
    // - Load AdventureIndexes from client storage
  }

  /** Triggers hydration of the active save slot into memory */
  play() {
    this.store.dispatch(AppActions.play());
    // - Load the Adventure, AdventureEvents, & Characters
    // - Display the current Moment and its characters
  }

  /** Persists partial changes to the active Adventure slot */
  saveGame(changes: AdventureInstance) {
    console.log('[GameFacade] Saving game slot changes:', changes);
    this.utils.adventure.save(changes);
    // AdventureIndex is updated by NgRx effect after Adventure is persisted
  }

  /** Deletes save slot and auto-selects the next most recent */
  async deleteGame(slotId: string): Promise<void> {
    console.log('[GameFacade] Deleting adventure slot:', slotId);
    this.utils.adventure.remove(slotId);

    // Concurrently fetch the active slot & remaining saves to determine failover
    const [currentSlotId, allSaves] = await Promise.all([
      firstValueFrom(this.currentSlotId$),
      firstValueFrom(this.allSaves$),
    ]);

    // If deleting the active slot, then activate next most recent
    if (currentSlotId === slotId) {
      // Filter out the deleted slot and sort by savedAt (latest first)
      const remaining = allSaves
        .filter((s) => s.id !== slotId)
        .sort((a, b) => b.savedAt.localeCompare(a.savedAt));

      if (remaining.length > 0) {
        // Set most recently played as the new current slot
        this.store.dispatch(
          AppActions.setCurrentSlotId({ slotId: remaining[0].id }),
        );
        // this.setCurrentSlotId(remaining[0].id);
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

  /** Updates the active Adventure slot pointer in the app */
  setCurrentSlotId(slotId: string) {
    this.store.dispatch(AppActions.setCurrentSlotId({ slotId }));
  }

  // Sets the current moment ID in the adventure state
  // setCurrentMomentId(momentId: string) {
  //   this.store.dispatch(AppActions.setCurrentMomentId({ momentId }));
  // }

  /** Bootstraps a brand new Adventure and its index (metadata) */
  addAdventure(adventure: Adventure) {
    this.store.dispatch(AdventureActions.addAdventure({ adventure }));
    // AdventureIndex is added by NgRx effect after Adventure is persisted
  }

  /** Dispatches explicit command to load a specific Adventure slot */
  loadAdventure(id: string) {
    this.store.dispatch(AdventureActions.loadAdventure({ id }));
  }
  // #endregion

  // #region 🔸 Engine & Moment Logic 🔸

  /**
   * Translates relational character templates explicitly into the active session database.
   * @param forceRespawn Factory resets records even if they already exist in the database.
   */
  async spawnMomentCharacters(
    moment: Moment,
    forceRespawn = false,
  ): Promise<void> {
    if (!moment.characters || moment.characters.length === 0) return;

    // Fast-fail if not in an active session
    const ctx = await this.getPlayContext();
    if (!ctx) return;

    for (const charRef of moment.characters) {
      // Always safely skip player mapping as it's governed independently
      if (charRef === 'player') continue;

      // Safely parse character ID into discrete parts
      const parsed = parseCompositeId(charRef);
      if (!parsed.entityId) continue;

      // Infer missing context from current Moment
      const dimId = parsed.dimensionId || moment.dimensionId;
      const planeId = parsed.planeId || moment.planeId;

      // Ensure active slot ID targets the player's active playthrough
      const activeId = buildAdventureEntityCompositeId(
        parsed.entityId,
        dimId,
        planeId,
        ctx.adventureId,
        ctx.accountId,
      );
      if (!activeId) continue;

      // Check if instance is already alive and tracked in active database
      const existingActive = await firstValueFrom(
        this.utils.character.byId$(activeId),
      );
      // Done here if already spawned and not forcing respawn
      if (existingActive && !forceRespawn) continue;

      // Build pristine ID to query engine's static dictionaries safely
      const catalogId = buildDimensionEntityCompositeId(
        parsed.entityId,
        dimId,
        planeId,
      );
      let template = catalogId
        ? this.utils.character.getFromCatalog(catalogId)
        : undefined;

      // Fallback: If not in static memory, check templates in IndexedDB
      if (!template) {
        // Using full builder because `buildAdventureEntityTemplateId` hardcodes 'rpg-demo'/'prime'
        const customTemplateId = buildAdventureEntityCompositeId(
          parsed.entityId,
          dimId,
          planeId,
          DEFAULT_ADVENTURE_ID, // default for Custom templates
          DEFAULT_ACCOUNT_ID, // default for Custom templates
        );
        if (customTemplateId) {
          template = await firstValueFrom(
            this.utils.character.byId$(customTemplateId),
          );
        }
      }

      if (!template) {
        console.warn(
          `[GameFacade] Cannot spawn: Template character not found for "${charRef}"`,
        );
        continue;
      }

      // Deep clone and spawn into active session
      // (severs the memory reference to static Catalog so don't accidentally mutate the universe)
      const spawnedCharacter: typeof template = {
        ...structuredClone(template),
        id: activeId,
        adventureId: ctx.adventureId,
        accountId: ctx.accountId,
      };

      console.log(
        `[GameFacade] Spawning template "${template.id}" -> active "${activeId}"`,
      );

      if (existingActive) {
        // Overwrite existing character with template data
        this.store.dispatch(
          CharacterActions.saveCharacter({
            id: activeId,
            changes: spawnedCharacter,
          }),
        );
      } else {
        // Add ignores existing records
        this.store.dispatch(
          CharacterActions.addCharacter({ character: spawnedCharacter }),
        );
      }
    }
  }

  /**
   * Garbage Collector: Cleans up any ephemeral NPCs in the current slot.
   * @param sparedEntityIds Optional array of purely defined entityIds to spare from deletion.
   */
  async purgeEphemeralCharacters(
    sparedEntityIds: string[] = [],
  ): Promise<void> {
    const ctx = await this.getPlayContext();
    if (!ctx) return;

    // Collect entire character payload
    const allChars = await firstValueFrom(this.utils.character.all$);

    const ephemeralNPCs = allChars.filter((char) => {
      // Only purge characters in active Adventure (skip templates)
      if (char.adventureId !== ctx.adventureId) return false;
      // Never purge the player character
      if (char.id === ctx.playerId) return false;
      // Safely spare explicit entities (e.g., Moment characters)
      // (entities not spared: random summons, temporary minions, etc.)
      if (sparedEntityIds.includes(char.entityId)) return false;
      // Purge if explicitly tagged as ephemeral/temporary mobs
      return char.tags?.includes('ephemeral');
    });

    if (ephemeralNPCs.length > 0) {
      console.log(
        `[GameFacade] Purging ${ephemeralNPCs.length} ephemeral characters...`,
      );
      for (const npc of ephemeralNPCs) {
        this.store.dispatch(CharacterActions.removeCharacter({ id: npc.id }));
      }
    }
  }

  /** Bootstraps the current moment pointer upon load and safely spawns missing actors */
  async isMomentIdValid(): Promise<void> {
    // Explicitly wait for concurrent load resolutions
    const adventure = await firstValueFrom(
      this.currentAdventure$.pipe(filter((a) => !!a)),
    );
    if (!adventure) return;

    const momentId = adventure.currentMomentId;
    let moment = await firstValueFrom(this.utils.moment.byId$(momentId));

    if (!moment) {
      // Dev-Tool Fallback mapping if database points temporarily to invalid Moment
      const fallbackId = buildDimensionEntityTemplateId('training-room');
      moment = fallbackId
        ? await firstValueFrom(this.utils.moment.byId$(fallbackId))
        : undefined;

      if (moment && fallbackId) {
        await this.utils.adventure.setMoment(fallbackId);
      }
    }

    // Automatically ensure the world is always populated
    if (moment) await this.spawnMomentCharacters(moment);
  }

  /** Cleans up the previous Moment and handles transition to next */
  async gotoMoment(momentId: string) {
    // Garbage collect ephemeral mobs before leaving
    await this.purgeEphemeralCharacters();

    // Re-assign active Moment pointer
    await this.utils.adventure.setMoment(momentId);

    // Ensure all characters exist for this Moment
    const moment = await firstValueFrom(this.utils.moment.byId$(momentId));
    if (moment) await this.spawnMomentCharacters(moment);
  }

  /** FOR TESTING ONLY: Completely resets the current Moment to pristine condition (heals active characters, explicitly respawns characters) */
  async resetCurrentMoment(): Promise<void> {
    const ctx = await this.getPlayContext();
    if (!ctx) return;

    console.group('[GameFacade] Resetting Current Moment');

    // Extract the pure entityIds to match against Moment securely
    const momentEntityIds = (ctx.moment.characters ?? []).map(
      (ref) => parseCompositeId(ref).entityId,
    );

    // Selectively purge dynamically spawned minions
    // (spare Moment's characters to reset without race conditions)
    await this.purgeEphemeralCharacters(momentEntityIds);

    // Identify persistent local characters (e.g. self/allies) avoiding resets
    const allChars = await firstValueFrom(this.utils.character.all$);
    const persistentChars = allChars.filter(
      (c) =>
        c.adventureId === ctx.adventureId &&
        !c.tags?.includes('ephemeral') &&
        !momentEntityIds.includes(c.entityId),
    );

    // Heal persistent characters (Player, Allies, NPCs..)
    for (const char of persistentChars) {
      const healthAttr = await firstValueFrom(
        this.utils.character.getAttributeFor$(char.id, 'health'),
      );
      if (healthAttr) {
        const maxHealth = Number(healthAttr.max ?? 100);
        await this.utils.character.updateCharacterAttributeValue(
          char.id,
          'health',
          maxHealth,
        );
      }
    }

    // Factory respawn all characters with pristine templates
    await this.spawnMomentCharacters(ctx.moment, true);

    console.log('[GameFacade] Moment reset complete.');
    console.groupEnd();
  }

  /** Processes interactive Moment payload (applying targeted effects, logging output, advancing flow) */
  async chooseMomentChoice(choiceLabel: string): Promise<void> {
    const timestamp = new Date().toISOString();
    console.group('[GameFacade.chooseMomentChoice]', choiceLabel, timestamp);

    // --- Validate Core Context ---

    // Extract unified required game state natively
    const ctx = await this.getPlayContext();
    if (!ctx) {
      console.error('Incomplete context state - cannot proceed');
      console.groupEnd();
      return;
    }

    // Map structural explicit choice from interface mappings natively
    const choice = ctx.moment.choices?.find((c) => c.label === choiceLabel);
    if (!choice) {
      console.error(
        `Choice "${choiceLabel}" not found in moment choices:`,
        ctx.moment.choices,
      );
      console.groupEnd();
      return;
    }
    console.log('✓ Resolved choice:', choice);

    // --- Apply Effects ---

    // Dispatch explicitly bound direct-level effects
    if (choice.effects && Object.keys(choice.effects).length > 0) {
      const effects: EffectInstance[] = Object.values(choice.effects);
      console.group(`Applying ${effects.length} direct effects...`);

      for (let i = 0; i < effects.length; i += 1) {
        const inst = effects[i];
        try {
          // Identify explicitly via Moment context bindings
          const targetId = await this.resolveActiveTargetId(
            inst.targetId,
            ctx.moment.dimensionId,
            ctx.moment.planeId,
          );
          // Gracefully skip applying this effect if the target failed to resolve
          if (!targetId) continue;

          // Assemble provenance data natively
          const effectInstance: EffectInstance = {
            ...inst,
            targetId,
            sourceType: inst.sourceType ?? 'moment',
            sourceId: inst.sourceId ?? ctx.moment.id,
            appliedBy: ctx.playerId,
            appliedAt: timestamp,
          };

          // Combine with catalog defaults & apply to character
          const merged =
            this.utils.effect.mergeWithCatalog(effectInstance) ??
            effectInstance;
          const applied =
            await this.utils.character.applyEffectInstance(merged);
          console.log('Effect applied:', applied);
        } catch (err) {
          console.error('Error applying effect', inst, err);
        }
      }
      console.groupEnd();
    }

    // --- Apply Skills ---

    // Dispatch structurally decoupled dynamic skills
    if (choice.skills && Object.keys(choice.skills).length > 0) {
      console.group('Applying skills for choice:', choiceLabel);
      const skills: EffectInstance[] = Object.values(choice.skills);
      console.log('Skill uses to apply:', skills);

      for (const instance of skills) {
        try {
          console.log('Processing skill use:', instance);

          // Test as explicit full ID first
          let skillId = instance.id;
          let skill = skillId
            ? await firstValueFrom(this.utils.skill.byId$(skillId))
            : undefined;

          // Fallback to entityId with Moment context
          if (!skill && instance.entityId) {
            skillId = buildDimensionEntityCompositeId(
              instance.entityId,
              ctx.moment.dimensionId,
              ctx.moment.planeId,
            );
            skill = skillId
              ? await firstValueFrom(this.utils.skill.byId$(skillId))
              : undefined;
          }

          if (!skill || !skillId) {
            console.warn(
              'Skill map failed to resolve catalog via .id or .entityId:',
              instance,
            );
            continue;
          }
          console.log('Found skill:', skill);

          // Evaluate structural inputs into active targets
          const targetId = await this.resolveActiveTargetId(
            instance.targetId,
            ctx.moment.dimensionId,
            ctx.moment.planeId,
          );
          // Gracefully skip applying this skill if the target failed to resolve
          if (!targetId) continue;

          // Hydrate and execute completely isolated skill sequence
          const skillInstance: SkillInstance = {
            ...instance,
            id: skillId,
            targetId,
            sourceId: ctx.moment.id,
            sourceType: instance.sourceType ?? 'moment',
            appliedAt: timestamp,
            appliedBy: ctx.playerId,
          };
          console.log('Complete skill instance:', skillInstance);

          const applied =
            await this.utils.character.applySkillInstance(skillInstance);
          console.log('Skill applied:', applied);
        } catch (err) {
          console.error('Error applying skill', instance, err);
        }
      }
      console.groupEnd();
    }

    // Note which action chosen (in short-term game logs)
    await this.log(`You chose: ${choice.label}`);

    // Save AdventureEvent (in long-term game history)
    const payload: AdventureEventPayload = {
      momentId: ctx.moment.id,
      choiceId: choice.label,
    };
    await this.utils.adventure.addMomentCompleteEvent(ctx.moment.id, payload);

    // Advance to next moment if specified
    if (choice.nextMomentId) {
      // TODO: also check for moment completion
      await this.gotoMoment(choice.nextMomentId);
    }
    console.groupEnd();
  }
  // #endregion

  // #region 🔸 Utility/Internal 🔸

  /** Wraps common store dispatches to active Adventure slot log safely */
  async log(message: string): Promise<void> {
    await this.utils.adventure.addLogEntry(message);
  }

  /** FOR TESTING ONLY: Sandbox diagnostic helper */
  async testStatChange() {
    const ctx = await this.getPlayContext();
    if (!ctx) return;

    // Evaluate ID of test character
    const dummyId = await this.resolveActiveTargetId(
      'target-dummy',
      ctx.moment.dimensionId,
      ctx.moment.planeId,
    );
    const punchId = buildDimensionEntityTemplateId('punch');
    const roarId = buildDimensionEntityTemplateId('roar');
    const potionId = buildDimensionEntityTemplateId('drink-potion');

    if (dummyId && punchId) {
      // Punch: Player uses "Punch" skill on Target Dummy (deals damage)
      const punchSkill = await firstValueFrom(this.utils.skill.byId$(punchId));
      if (punchSkill)
        await this.utils.character.applySkillToTarget(
          dummyId,
          ctx.playerId,
          punchSkill,
        );
    }

    // Roar: Player uses "Roar" skill (buffs self)
    if (roarId) {
      const roarSkill = await firstValueFrom(this.utils.skill.byId$(roarId));
      if (roarSkill)
        await this.utils.character.applySkillToTarget(
          ctx.playerId,
          ctx.playerId,
          roarSkill,
        );
    }

    // Drink Potion: Player uses "Drink Potion" skill (heals self)
    if (potionId) {
      const potionSkill = await firstValueFrom(
        this.utils.skill.byId$(potionId),
      );
      if (potionSkill)
        await this.utils.character.applySkillToTarget(
          ctx.playerId,
          ctx.playerId,
          potionSkill,
        );
    }
  }

  // --- Internal Context State Builders ---

  /** Fetches fundamental active states collectively without blocking the thread repetitively */
  private async getPlayContext() {
    const [adventureId, accountId, playerId, moment] = await Promise.all([
      firstValueFrom(this.currentAdventureId$),
      firstValueFrom(this.accountId$),
      firstValueFrom(this.playerId$),
      firstValueFrom(this.currentMoment$),
    ]);

    if (!adventureId || !playerId || !moment) return null;

    return {
      adventureId,
      // Active players default to 'guest' if not signed in, never 'system' (templates)
      accountId: accountId ?? GUEST_ACCOUNT_ID,
      playerId,
      moment,
    };
  }

  /**
   * Smart resolver taking raw ID strings (shorthands, exact IDs, mappings)
   * and deriving the fully qualified character ID.
   */
  private async resolveActiveTargetId(
    rawTarget?: string,
    contextDim?: string,
    contextPlane?: string,
  ): Promise<string | undefined> {
    if (!rawTarget) return undefined;

    const ctx = await this.getPlayContext();
    if (!ctx) return undefined;

    // Instantly process any exact relational UI mappings natively
    if (rawTarget === 'player' || rawTarget === 'self') return ctx.playerId;

    // Optimistic match: See if raw string natively resolves immediately
    const targetCharacter = await firstValueFrom(
      this.utils.character.byId$(rawTarget),
    );

    // Fallback: grab ID parts available & infer the rest
    const parsed = parseCompositeId(rawTarget);

    const entityId = targetCharacter
      ? targetCharacter.entityId
      : parsed.entityId;
    const dimId =
      targetCharacter?.dimensionId ||
      parsed.dimensionId ||
      contextDim ||
      DEFAULT_DIMENSION_ID;
    const planeId =
      targetCharacter?.planeId ||
      parsed.planeId ||
      contextPlane ||
      DEFAULT_PLANE_ID;

    // Assemble full ID via inferred mapping sequence
    const finalTargetId = buildAdventureEntityCompositeId(
      entityId,
      dimId,
      planeId,
      ctx.adventureId,
      ctx.accountId,
    );

    // Verify database guarantees exactly matched instances
    if (finalTargetId) {
      const activeCharacter = await firstValueFrom(
        this.utils.character.byId$(finalTargetId),
      );
      if (activeCharacter) return finalTargetId;
    }

    console.error(`Strict Check Failed: "${rawTarget}" could not be resolved!`);
    return undefined;
  }
  // #endregion
}
