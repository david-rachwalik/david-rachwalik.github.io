import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { firstValueFrom } from 'rxjs';

import { mergeEffectInstanceWithCatalog } from '../data/effects-seed';
import { Adventure } from '../models/adventure';
import { Character } from '../models/character';
import { Effect, EffectInstance, EffectSourceType } from '../models/effect';
import { MomentChoice } from '../models/moment';
import { Skill } from '../models/skill';
import { selectAllAdventureIndexes } from '../store/adventure/adventure-index.selectors';
import { AdventureActions } from '../store/adventure/adventure.actions';
import { AppActions } from '../store/app.actions';
import {
  selectCurrentAdventure,
  selectCurrentLocation,
  selectCurrentMoment,
  selectCurrentSlotId,
} from '../store/app.selectors';
import {
  selectAllAttributes,
  selectAttributeEntities,
} from '../store/attribute/attribute.selectors';
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
// import { RpgFacades } from './rpg-facades';
import { buildDimensionEntityTemplateId } from '../utils-composite-id';
import { AdventureFacade } from './facades/adventure-facade';
import { CharacterFacade } from './facades/character-facade';
import { ItemFacade } from './facades/item-facade';
import { LocationFacade } from './facades/location-facade';
import { LogFacade } from './facades/log-facade';
import { MomentFacade } from './facades/moment-facade';
import { SkillFacade } from './facades/skill-facade';
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
    // public utils: RpgFacades,
  ) {}

  public utils = {
    adventure: inject(AdventureFacade),
    character: inject(CharacterFacade),
    location: inject(LocationFacade),
    moment: inject(MomentFacade),
    skill: inject(SkillFacade),
    item: inject(ItemFacade),
    log: inject(LogFacade),
  };

  // #region 🔸 NgRx Selectors 🔸

  // --- Template Data (Dict for lookup / Array for UI) ---

  attributeEntities$ = this.store.select(selectAttributeEntities);
  attributes$ = this.store.select(selectAllAttributes);

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
  playerId$ = this.utils.character.playerId$;
  player$ = this.utils.character.player$;

  currentMoment$ = this.store.select(selectCurrentMoment);
  currentLocation$ = this.store.select(selectCurrentLocation); // realm

  logEntries$ = this.logService.entries$;
  // #endregion

  // #region 🔸 Adventure/Slot/Save Logic 🔸

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

  // #region 🔸 Effect Logic 🔸

  // Handles attribute effects (e.g. health, strength)
  private async applyAttributeEffect(
    entityType: EffectSourceType,
    entityId: string,
    effect: Effect,
  ): Promise<boolean> {
    if (effect.path.startsWith('attributes.')) {
      if (entityType !== 'character') {
        console.warn(
          `[GameFacade] Attribute effect not supported for ${entityType}`,
        );
        return false;
      }
      const char = await firstValueFrom(this.utils.character.byId$(entityId));
      if (!char) {
        console.warn(`[GameFacade] Character not found: ${entityId}`);
        return false;
      }
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
          console.warn(
            `[GameFacade] Unsupported operation: ${effect.operation}`,
          );
          return false;
      }
      // TODO: Clamp to min/max if attribute definition exists
      // TODO: Add triggers (e.g. on attribute change)
      // TODO: Log effect application (for history/event log)
      const changes: Partial<Character> = {
        attributes: { ...char.attributes, [attributeId]: newValue },
      };
      this.utils.character.updateCharacter(entityId, changes);
      return true;
    }
    // TODO: Handle other attribute paths (e.g. resistances, stats)
    console.warn(`[GameFacade] Attribute path not handled: ${effect.path}`);
    return false;
  }

  // Handles tag effects (e.g. adding/removing tags)
  private async applyTagEffect(
    entityType: EffectSourceType,
    entityId: string,
    effect: Effect,
  ): Promise<boolean> {
    // TODO: Implement tag logic (add/remove tags on entity)
    console.log(
      `[GameFacade] [TODO] Tag effect logic for ${entityType} (${entityId}):`,
      effect,
    );
    return false;
  }

  // Handles state effects (e.g. status, toggles)
  private async applyStateEffect(
    entityType: EffectSourceType,
    entityId: string,
    effect: Effect,
  ): Promise<boolean> {
    // TODO: Implement state logic (set/toggle status, etc.)
    console.log(
      `[GameFacade] [TODO] State effect logic for ${entityType} (${entityId}):`,
      effect,
    );
    return false;
  }

  // Returns true if the effect was applied, false if resisted
  async applyEffectToEntity(
    entityType: EffectSourceType,
    entityId: string,
    effect: Effect,
  ): Promise<boolean> {
    // TODO: Add global effect triggers/logs here
    console.log(
      `[GameFacade] Applying effect to ${entityType} (${entityId}):`,
      effect,
    );

    // TODO: Add resist logic here (e.g. check for resistances, immunities, etc.)
    // e.g. if (await this.checkResist(entityType, entityId, effect)) { ... }

    switch (effect.kind) {
      case 'attribute':
        return this.applyAttributeEffect(entityType, entityId, effect);
      case 'tag':
        return this.applyTagEffect(entityType, entityId, effect);
      case 'state':
        return this.applyStateEffect(entityType, entityId, effect);
      // Add more kinds as needed
      default:
        console.warn(
          `[GameFacade] Effect kind not yet implemented: ${effect.kind}`,
        );
        return false;
    }
  }

  // Applies an EffectInstance to a character by id
  async applyEffectInstance(
    targetId: string,
    instance: EffectInstance,
  ): Promise<boolean> {
    const effect = mergeEffectInstanceWithCatalog(instance);
    if (!effect) return false;
    // await this.utils.character.applyEffectToCharacter(targetId, effect);
    return this.applyEffectToEntity('character', targetId, effect);
  }

  // Applies a skill from source character to target character
  async applySkillToTarget(targetId: string, sourceId: string, skill: Skill) {
    const timestamp = new Date().toISOString();
    for (const effectRef of skill.effects) {
      // Complete the effect instance with full provenance tracking
      const effectInstance: EffectInstance = {
        ...effectRef,
        sourceType: 'skill',
        sourceId: skill.id,
        appliedById: sourceId,
        appliedAt: timestamp,
        duration: effectRef.params?.duration ?? undefined,
      };
      await this.applyEffectInstance(targetId, effectInstance);
    }
  }
  // #endregion

  // #region 🔸 Moment Logic 🔸

  // Sets the current moment ID for the current adventure
  async setCurrentMomentId(momentId: string) {
    const adventureId = await firstValueFrom(this.currentSlotId$);
    if (!adventureId) {
      console.warn('[GameFacade] No current adventure slot ID found!');
      return;
    }
    this.utils.adventure.save(adventureId, {
      currentMomentId: momentId,
    });
  }

  // Fetch choices available for the current moment
  async getCurrentMomentChoices(): Promise<MomentChoice[]> {
    const moment = await firstValueFrom(this.currentMoment$);
    return moment?.choices ?? [];
  }

  // // Handles a choice: applies effects, skills, and advances the moment
  // async chooseMomentChoice(choice: MomentChoice) {
  //   // 1. Apply direct effects (if any)
  //   if (choice.effects) {
  //     for (const effect of choice.effects) {
  //       // Default to player if no target specified
  //       await this.applyEffectInstance(effect, effect['target'] || 'player');
  //     }
  //     await Promise.all(
  //       choice.effects.map((effect: EffectInstance & { target?: string }) =>
  //         this.applyEffectInstance(effect, effect.target ?? 'player'),
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

  // Advances to a new moment by id
  async gotoMoment(momentId: string) {
    // This should update the currentMomentId in the adventure state
    // this.utils.adventure.setCurrentMomentId(momentId);
    await this.setCurrentMomentId(momentId);
  }
  // #endregion

  // #region 🔸 Utility/Log/Testing 🔸

  async log(message: string): Promise<void> {
    await this.logService.add(message);
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
      effectId: 'enhance',
      params: {
        kind: 'attribute',
        path: 'attributes.strength',
        value: 1,
      },
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
      effectId: 'restore',
      params: {
        kind: 'attribute',
        path: 'attributes.health',
        value: 5,
      },
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
      await this.applySkillToTarget(dummyId, playerId, punchSkill);
    }

    // 2. Roar: Player uses "Roar" skill (buffs self)
    const roarSkillId = buildDimensionEntityTemplateId('roar');
    if (!roarSkillId) return;
    const roarSkill = await firstValueFrom(this.utils.skill.byId$(roarSkillId));
    if (roarSkill) {
      await this.applySkillToTarget(playerId, playerId, roarSkill);
    }

    // 3. Drink Potion: Player uses "Drink Potion" skill (heals self)
    const drinkPotionSkillId = buildDimensionEntityTemplateId('drink-potion');
    if (!drinkPotionSkillId) return;
    const drinkPotionSkill = await firstValueFrom(
      this.utils.skill.byId$(drinkPotionSkillId),
    );
    if (drinkPotionSkill) {
      await this.applySkillToTarget(playerId, playerId, drinkPotionSkill);
    }
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
  // #endregion
}
