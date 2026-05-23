import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, firstValueFrom } from 'rxjs';

import { mergeEffectInstanceWithCatalog } from '../data/effects-seed';
import { Adventure, AdventureEventPayload } from '../models/adventure';
import { EffectInstance } from '../models/effect';
import { Moment } from '../models/moment';
import { SkillInstance } from '../models/skill';
import { selectAllAdventureIndexes } from '../store/adventure/adventure-index.selectors';
import { AdventureActions } from '../store/adventure/adventure.actions';
import { AppActions } from '../store/app.actions';
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
} from '../store/app.selectors';
import {
  selectAllAttributes,
  selectAttributeEntities,
} from '../store/attribute/attribute.selectors';
import { CharacterActions } from '../store/character/character.actions';
import {
  buildAdventureEntityTemplateId,
  buildDimensionEntityTemplateId,
} from '../utils-composite-id';
import { AdventureFacade } from './facades/adventure-facade';
import { CharacterFacade } from './facades/character-facade';
import { ItemFacade } from './facades/item-facade';
import { LocationFacade } from './facades/location-facade';
import { MomentFacade } from './facades/moment-facade';
import { SkillFacade } from './facades/skill-facade';

// :: Business Logic Layer ::
// Focused on business logic and orchestration, not storage details

@Injectable({ providedIn: 'root' })
export class GameFacade {
  constructor(private store: Store) {}

  // Could have been `facades` but chose `utils` for reasons (shrug)
  public utils = {
    adventure: inject(AdventureFacade),
    character: inject(CharacterFacade),
    location: inject(LocationFacade),
    moment: inject(MomentFacade),
    skill: inject(SkillFacade),
    item: inject(ItemFacade),
  };

  // #region 🔸 NgRx Selectors 🔸

  accountId$ = this.store.select(selectAccountId);

  // Translates the Moment's static seed IDs into the Active Adventure IDs for the UI
  activeMomentCharacters$ = this.store.select(selectActiveMomentCharacters);

  // --- Template Data (Dict for lookup / Array for UI) ---

  attributeEntities$ = this.store.select(selectAttributeEntities);
  attributes$ = this.store.select(selectAllAttributes);

  // locationEntities$ = this.store.select(selectLocationEntities);
  // locations$ = this.store.select(selectAllLocations);

  // momentEntities$ = this.store.select(selectMomentEntities);
  // moments$ = this.store.select(selectAllMoments);

  // itemEntities$ = this.store.select(selectItemEntities);
  // items$ = this.store.select(selectAllItems);

  // --- Current Adventure ---

  currentSlotId$ = this.store.select(selectCurrentSlotId);
  allSaves$ = this.store.select(selectAllAdventureIndexes);

  currentAdventureId$ = this.store.select(selectCurrentAdventureId);
  currentAdventure$ = this.store.select(selectCurrentAdventure);
  log$ = this.utils.adventure.log$;
  events$ = this.utils.adventure.events$;

  playerId$ = this.utils.character.playerId$;
  player$ = this.utils.character.player$;
  // player$ = this.utils.character.player$.pipe(
  //   filter((player): player is Character => !!player),
  // );

  currentMomentId$ = this.store.select(selectCurrentMomentId);
  currentMoment$ = this.store.select(selectCurrentMoment);
  currentMomentChoices$ = this.store.select(selectCurrentMomentChoices);

  currentLocationId$ = this.store.select(selectCurrentLocationId);
  currentLocation$ = this.store.select(selectCurrentLocation); // realm
  // #endregion

  // #region 🔸 Save/Load (Adventure Slot) Logic 🔸

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

  // Save game slot to client storage
  saveGame(id: string, changes: Partial<Adventure>) {
    console.log('[GameFacade] Saving game slot:', id, changes);
    // this.store.dispatch(AdventureActions.saveAdventure({ id, changes }));
    // // AdventureIndex will be updated by effect after Adventure is persisted
    this.utils.adventure.save(id, changes);
  }

  // Delete a game slot from client storage
  async deleteGame(slotId: string): Promise<void> {
    console.log('[GameFacade] Deleting adventure slot:', slotId);

    this.utils.adventure.remove(slotId);

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

  // Change the active adventure slot
  setCurrentSlotId(slotId: string) {
    this.store.dispatch(AppActions.setCurrentSlotId({ slotId }));
  }

  // Sets the current moment ID in the adventure state
  // setCurrentMomentId(momentId: string) {
  //   this.store.dispatch(AppActions.setCurrentMomentId({ momentId }));
  // }

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
  // #endregion

  // #region 🔸 Moment Logic 🔸

  // // Handles a choice: applies effects, skills, and advances the moment
  // async chooseMomentChoice(choice: MomentChoice) {
  //   // 1. Apply direct effects (if any)
  //   if (choice.effects) {
  //     for (const effect of choice.effects) {
  //       // Default to player if no target specified
  //       await this.utils.character.applyEffectInstance(effect, effect['target'] || 'player');
  //     }
  //     await Promise.all(
  //       choice.effects.map((effect: EffectInstance & { target?: string }) =>
  //         this.utils.character.applyEffectInstance(effect, effect.target ?? 'player'),
  //       ),
  //     );
  //   }
  //   // 2. Apply skills (if any)
  //   if (choice.skills) {
  //     for (const skillUse of choice.skills) {
  //       await this.applySkillUse(skillUse);
  //     }
  //   }
  //   // 3. Advance to next moment if specified
  //   if (choice.nextMomentId) {
  //     this.gotoMoment(choice.nextMomentId);
  //   }
  // }

  async spawnMomentCharacters(moment: Moment): Promise<void> {
    if (!moment.characters || moment.characters.length === 0) return;

    const accountId = (await firstValueFrom(this.accountId$)) || 'guest';
    const adventureId = await firstValueFrom(this.currentAdventureId$);

    if (!adventureId) return;

    for (const charRef of moment.characters) {
      // 1. TEST EXACT TARGET AS ID FIRST
      const templateOrExisting = await firstValueFrom(
        this.utils.character.byId$(charRef),
      );

      // If it exists and is ALREADY in the active adventure, we're fully done
      if (
        templateOrExisting &&
        templateOrExisting.adventureId === adventureId
      ) {
        continue;
      }

      // 2. Extract entityId cleanly: from the loaded model if found, or assume charRef IS the entityId
      const entityId = templateOrExisting
        ? templateOrExisting.entityId
        : charRef;

      // 3. Build Active ID and check if we already spawned it
      const activeId = buildAdventureEntityTemplateId(
        entityId,
        adventureId,
        accountId,
      );
      if (!activeId) continue;

      const existingActive = await firstValueFrom(
        this.utils.character.byId$(activeId),
      );
      if (existingActive) continue;

      // 4. If we haven't loaded the template yet, build its expected system ID and fetch it
      const templateId = templateOrExisting
        ? templateOrExisting.id
        : buildAdventureEntityTemplateId(entityId, 'template', 'system');
      if (!templateId) continue;

      const template =
        templateOrExisting ??
        (await firstValueFrom(this.utils.character.byId$(templateId)));
      if (!template) {
        console.warn(
          `[GameFacade] Cannot spawn: Template character not found "${templateId}"`,
        );
        continue;
      }

      // 5. Clone and spawn into active session
      const spawnedCharacter: typeof template = {
        ...template,
        id: activeId,
        adventureId,
        accountId,
      };

      console.log(
        `[GameFacade] Spawning template "${template.id}" into active adventure as "${activeId}"`,
      );
      this.store.dispatch(
        CharacterActions.addCharacter({ character: spawnedCharacter }),
      );
    }
  }

  // Ensures the currentMomentId points to a valid moment
  async isMomentIdValid(): Promise<void> {
    // const adventure = await firstValueFrom(this.currentAdventure$);

    // 🔸 explicitly wait for the async load to finish and truthy data to exist
    const adventure = await firstValueFrom(
      this.currentAdventure$.pipe(filter((a) => !!a)),
    );

    console.log('[isMomentIdValid] adventure:', adventure);
    if (!adventure) return;
    const momentId = adventure.currentMomentId;
    console.log('[isMomentIdValid] adventure.currentMomentId:', momentId);
    let moment = await firstValueFrom(this.utils.moment.byId$(momentId));
    if (!moment) {
      // Fallback to hardcoded default
      const fallbackId = 'training-room:rpg-demo:prime';
      moment = await firstValueFrom(this.utils.moment.byId$(fallbackId));
      if (moment) {
        await this.utils.adventure.setMoment(fallbackId);
        console.warn(
          `[GameFacade] Moment not found for "${momentId}", fallback to "${fallbackId}"`,
        );
      } else {
        console.error(
          `[GameFacade] Fallback moment "${fallbackId}" not found in catalog!`,
        );
      }
    }
    // Spawn any necessary actors for the loaded moment
    if (moment) {
      await this.spawnMomentCharacters(moment);
    }
    // return moment;
  }

  // Advances to a new moment by id
  async gotoMoment(momentId: string) {
    // This should update the currentMomentId in the adventure state
    // this.utils.adventure.setCurrentMomentId(momentId);
    await this.utils.adventure.setMoment(momentId);

    // Spawn any necessary actors for the new moment
    const moment = await firstValueFrom(this.utils.moment.byId$(momentId));
    if (moment) {
      await this.spawnMomentCharacters(moment);
    }
  }

  private async expandAdventureTargetId(
    playerId: string,
    rawTarget?: string,
  ): Promise<string | undefined> {
    // 1. Fail gracefully if undefined
    if (!rawTarget) {
      console.warn('[GameFacade.expandTarget] No target specified.');
      return undefined;
    }

    // 2. Explicitly handle 'player' or 'self' shorthands
    if (rawTarget === 'player' || rawTarget === 'self') {
      console.log(
        `[GameFacade.expandTarget] raw: "${rawTarget}" → expanded: "${playerId}"`,
      );
      return playerId;
    }

    // 3. TEST EXACT TARGET AS ID FIRST
    const targetCharacter = await firstValueFrom(
      this.utils.character.byId$(rawTarget),
    );

    // 4. Extract entityId cleanly: from the loaded model if found, or assume the raw string IS the entityId
    const entityId = targetCharacter ? targetCharacter.entityId : rawTarget;

    const accountId = (await firstValueFrom(this.accountId$)) || 'guest';
    const adventureId =
      (await firstValueFrom(this.currentAdventureId$)) || 'template';

    // 5. Build the strict active ID for the current play session
    const finalTargetId = buildAdventureEntityTemplateId(
      entityId,
      adventureId,
      accountId,
    );

    if (finalTargetId) {
      // 6. Verify the active version legitimately exists
      const activeCharacter = await firstValueFrom(
        this.utils.character.byId$(finalTargetId),
      );
      if (activeCharacter) {
        console.log(
          `[GameFacade.expandTarget] raw: "${rawTarget}" → mapped to active: "${finalTargetId}"`,
        );
        return finalTargetId;
      }
    }

    // 7. STRICT ENFORCEMENT FAILURE
    console.error(
      `[GameFacade.expandTarget] Strict Check Failed: "${rawTarget}" could not be resolved in active adventure!`,
    );
    return undefined;
  }

  // Handle a choice selection (applies all effects/skills, logs, advances moment, etc.)
  async chooseMomentChoice(choiceLabel: string): Promise<void> {
    const timestamp = new Date().toISOString();
    console.group('[GameFacade.chooseMomentChoice]', choiceLabel, timestamp);

    // --- 1. Validate Core Context ---
    const playerId = await firstValueFrom(this.playerId$);
    if (!playerId) {
      console.error('[GameFacade] No player ID found - cannot proceed');
      console.groupEnd();
      return;
    }
    console.log('[GameFacade] ✓ Player ID:', playerId);

    const moment = await firstValueFrom(this.currentMoment$);
    if (!moment) {
      console.error('[GameFacade] No current moment found - cannot proceed');
      console.groupEnd();
      return;
    }
    console.log('[GameFacade] Current moment:', moment);

    const choice = moment.choices?.find((c) => c.label === choiceLabel);
    if (!choice) {
      console.error(
        `[GameFacade] Choice "${choiceLabel}" not found in moment choices:`,
        moment.choices,
      );
      console.groupEnd();
      return;
    }
    console.log('[GameFacade] ✓ Resolved choice:', choice);

    const adventureId = await firstValueFrom(this.currentAdventureId$);
    if (!adventureId) {
      console.error('[GameFacade] No adventure ID - cannot persist changes');
      console.groupEnd();
      return;
    }
    console.log('[GameFacade] ✓ Adventure ID:', adventureId);

    // --- 2. Apply Direct Effects ---
    if (choice.effects && Object.keys(choice.effects).length > 0) {
      const effects: EffectInstance[] = Object.values(choice.effects);
      console.group(
        `[GameFacade] Applying ${effects.length} direct effects for choice: ${choiceLabel}`,
      );
      console.log('[GameFacade] Effect instances to apply:', effects);

      // for (const inst of effects) {
      for (let i = 0; i < effects.length; i += 1) {
        const inst = effects[i];
        console.group(`[GameFacade] Effect ${i + 1}/${effects.length}`, inst);

        try {
          const rawTarget = inst.targetId;
          const targetId = await this.expandAdventureTargetId(
            playerId,
            inst.targetId,
          );

          // Gracefully skip applying this effect if the target failed to resolve
          if (!targetId) {
            console.warn(
              '[GameFacade] Skipping effect: No valid target resolved.',
              inst,
            );
            console.groupEnd();
            continue;
          }

          console.log(
            '[GameFacade] Effect instance raw target:',
            rawTarget,
            '→ resolved:',
            targetId,
          );

          const effectInstance: EffectInstance = {
            ...inst,
            targetId,
            sourceType: inst.sourceType ?? 'moment',
            sourceId: inst.sourceId ?? moment.id,
            appliedBy: playerId,
            appliedAt: timestamp,
          };

          console.log('[GameFacade] Complete effect instance:', effectInstance);

          // merge defaults from catalog if needed (existing helper)
          const merged =
            mergeEffectInstanceWithCatalog(effectInstance) ?? effectInstance;
          console.log('[GameFacade] Merged effect (with catalog):', merged);

          // apply to character; continue on error (don't abort whole flow)
          const applied =
            await this.utils.character.applyEffectInstance(merged);
          console.log('[GameFacade] Effect applied:', applied);
        } catch (err) {
          console.error('[GameFacade] Error applying effect', inst, err);
        }
      }
      console.groupEnd();
    }

    // 2. Apply skills (if any)
    if (choice.skills && Object.keys(choice.skills).length > 0) {
      console.group('[GameFacade] Applying skills for choice:', choiceLabel);
      const skills: EffectInstance[] = Object.values(choice.skills);
      console.log('[GameFacade] Skill uses to apply:', skills);

      for (const instance of skills) {
        try {
          console.log('[GameFacade] Processing skill use:', instance);

          // Test explicit ID first, fallback to expanding .entityId
          let skillId = instance.id;
          let skill = skillId
            ? await firstValueFrom(this.utils.skill.byId$(skillId))
            : undefined;

          if (!skill && instance.entityId) {
            skillId = buildDimensionEntityTemplateId(instance.entityId);
            skill = skillId
              ? await firstValueFrom(this.utils.skill.byId$(skillId))
              : undefined;
          }

          if (!skill) {
            console.warn(
              '[GameFacade] Skill not found by .id or .entityId fallback:',
              instance,
            );
            continue;
          }

          console.log('[GameFacade] Found skill by id:', skill);
          // if (!skill) continue;

          // Resolve target: support 'player' shorthand and explicit ids
          const rawTarget = instance.targetId;
          const targetId = await this.expandAdventureTargetId(
            playerId,
            instance.targetId,
          );

          // Gracefully skip applying this skill if the target failed to resolve
          if (!targetId) {
            console.warn(
              '[GameFacade] Skipping skill: No valid target resolved.',
              instance,
            );
            console.groupEnd();
            continue;
          }

          if (!targetId) {
            console.warn('[GameFacade] No valid target for skill use');
            continue;
          }

          console.log(
            '[GameFacade] Skill target resolved:',
            rawTarget,
            '→',
            targetId,
          );

          if (!targetId) {
            console.warn(
              '[GameFacade] No valid target for skill use',
              instance,
            );
            continue;
          }

          const skillInstance: SkillInstance = {
            ...instance,
            id: skillId,
            targetId,
            sourceId: moment.id,
            sourceType: instance.sourceType ?? 'moment',
            appliedAt: timestamp,
            appliedBy: playerId,
            // appliedTo: entityId,
          };
          console.log('[GameFacade] Complete skill instance:', skillInstance);

          const applied =
            await this.utils.character.applySkillInstance(skillInstance);
          console.log('[GameFacade] Skill applied:', applied);

          // await this.utils.character.applySkillToTarget(
          //   entityId,
          //   playerId,
          //   skill,
          //   appliedBy: playerId,
          //   appliedAt: timestamp,
          // );
        } catch (err) {
          console.error('[GameFacade] Error applying skill', instance, err);
        }
      }
      console.groupEnd();
    }

    // 3. Note which action chosen (short-term game log)
    await this.log(`You chose: ${choice.label}`);

    // 4. Save AdventureEvent (long-term game history)
    const payload: AdventureEventPayload = {
      momentId: moment.id,
      choiceId: choice.label,
    };
    await this.utils.adventure.addMomentCompleteEvent(moment.id, payload);

    // 5. Advance to next moment if specified
    if (choice.nextMomentId) {
      // TODO: also check for moment completion
      await this.gotoMoment(choice.nextMomentId);
    }
    console.groupEnd();
  }
  // #endregion

  // #region 🔸 Utility/Log/Testing 🔸

  async log(message: string): Promise<void> {
    await this.utils.adventure.addLogEntry(message);
  }

  async testStatChangeOld() {
    const player = await firstValueFrom(this.player$);
    console.log('[GameFacade] testStatChange() - currentCharacter:', player);
    if (!player) {
      console.warn('[GameFacade] No current character found!');
      return;
    }

    // STR: +1
    const strEffect: EffectInstance = {
      id: buildDimensionEntityTemplateId('enhance'),
      kind: 'attribute',
      path: 'attributes.strength',
      value: 1,
    };
    const mergedStrEffect = mergeEffectInstanceWithCatalog(strEffect);
    const currentStr = Number(player.attributes['str'] ?? 0);
    const newStr =
      currentStr +
      Number(mergedStrEffect?.value ?? mergedStrEffect?.defaultValue);
    console.log(`[GameFacade] STR: ${currentStr} -> ${newStr}`);
    await this.utils.character.updateCharacterAttributeValue(
      player.id,
      'str',
      newStr,
    );

    // HEALTH: +5, capped at max
    const healEffect: EffectInstance = {
      id: buildDimensionEntityTemplateId('restore'),
      kind: 'attribute',
      path: 'attributes.health',
      value: 5,
    };
    const mergedHealEffect = mergeEffectInstanceWithCatalog(healEffect);
    const attributeEntities = await firstValueFrom(this.attributeEntities$);
    const healthAttr = attributeEntities['health'];
    const currentHealth = Number(player.attributes['health'] ?? 0);
    const maxHealth = Number(healthAttr?.max ?? 100);
    // const newHealth = Math.min(currentHealth + 5, maxHealth);
    const newHealth = Math.min(
      currentHealth +
        Number(mergedHealEffect?.value ?? mergedHealEffect?.defaultValue),
      maxHealth,
    );
    console.log(
      `[GameFacade] HEALTH: ${currentHealth} -> ${newHealth} (max: ${maxHealth})`,
    );
    await this.utils.character.updateCharacterAttributeValue(
      player.id,
      'health',
      newHealth,
    );
  }

  async testStatChange() {
    // Hardcoded character IDs for test
    const dummyId = 'target-dummy'; // Replace with actual dummy id in your seed
    const playerId = await firstValueFrom(this.playerId$);
    if (!playerId) {
      console.warn('[GameFacade] No player character found!');
      return;
    }

    // 1. Punch: Player uses "Punch" skill on Target Dummy
    const punchSkillId = buildDimensionEntityTemplateId('punch');
    if (!punchSkillId) return;
    const punchSkill = await firstValueFrom(
      this.utils.skill.byId$(punchSkillId),
    );
    if (punchSkill) {
      await this.utils.character.applySkillToTarget(
        dummyId,
        playerId,
        punchSkill,
      );
    }

    // 2. Roar: Player uses "Roar" skill (buffs self)
    const roarSkillId = buildDimensionEntityTemplateId('roar');
    if (!roarSkillId) return;
    const roarSkill = await firstValueFrom(this.utils.skill.byId$(roarSkillId));
    if (roarSkill) {
      await this.utils.character.applySkillToTarget(
        playerId,
        playerId,
        roarSkill,
      );
    }

    // 3. Drink Potion: Player uses "Drink Potion" skill (heals self)
    const drinkPotionSkillId = buildDimensionEntityTemplateId('drink-potion');
    if (!drinkPotionSkillId) return;
    const drinkPotionSkill = await firstValueFrom(
      this.utils.skill.byId$(drinkPotionSkillId),
    );
    if (drinkPotionSkill) {
      await this.utils.character.applySkillToTarget(
        playerId,
        playerId,
        drinkPotionSkill,
      );
    }
  }
  // #endregion
}
