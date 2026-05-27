import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { firstValueFrom } from 'rxjs';

import { Adventure, AdventureEvent } from '../../models/adventure';
import { Character } from '../../models/character';
import { EffectInstance } from '../../models/effect';
import { Moment, MomentInstance } from '../../models/moment';
import {
  selectAccountId,
  selectCurrentAdventure,
  selectCurrentAdventureEvents,
  selectCurrentAdventureId,
  selectCurrentMoment,
} from '../../store/app.selectors';
import { MomentActions } from '../../store/moment/moment.actions';
import {
  selectAllMoments,
  selectMomentById,
  selectMomentEntities,
} from '../../store/moment/moment.selectors';
import { buildAdventureEntityCompositeId } from '../../utils-composite-id';
import { AdventureFacade } from './adventure-facade';
import { CharacterFacade } from './character-facade';

export interface WeightedMoment {
  id: string;
  weight: number;
}

@Injectable({ providedIn: 'root' })
export class MomentFacade {
  constructor(
    private store: Store,
    private adventureFacade: AdventureFacade,
    private characterFacade: CharacterFacade,
  ) {}

  // #region 🔸 NgRx Selectors 🔸

  all$ = this.store.select(selectAllMoments);
  entities$ = this.store.select(selectMomentEntities);

  current$ = this.store.select(selectCurrentMoment);

  accountId$ = this.store.select(selectAccountId);

  currentAdventureId$ = this.store.select(selectCurrentAdventureId);
  currentAdventure$ = this.store.select(selectCurrentAdventure);
  events$ = this.store.select(selectCurrentAdventureEvents);

  player$ = this.characterFacade.player$;
  // #endregion

  // #region 🔸 Feature CRUD Methods 🔸
  add(moment: Moment) {
    this.store.dispatch(MomentActions.addMoment({ moment }));
  }
  loadAll() {
    this.store.dispatch(MomentActions.loadAllMoments());
  }
  save(changes: MomentInstance) {
    if (!changes.id) {
      console.warn(
        '[MomentFacade] Save aborted: Instance is missing ID',
        changes,
      );
      return;
    }
    this.store.dispatch(MomentActions.saveMoment({ id: changes.id, changes }));
  }
  remove(id: string) {
    this.store.dispatch(MomentActions.removeMoment({ id }));
  }
  byId$(id: string) {
    return this.store.select(selectMomentById(id));
  }
  // #endregion

  async log(message: string): Promise<void> {
    await this.adventureFacade.addLogEntry(message);
  }

  // Load moment-specific characters (monsters/NPCs)
  async loadMomentCharacters(moment: Moment): Promise<void> {
    const adventure = await firstValueFrom(this.currentAdventure$);
    const accountId = await firstValueFrom(this.accountId$);
    if (!adventure || !accountId) return;
    for (const charRef of moment.characters ?? []) {
      if (charRef === 'player') continue; // skip player, already loaded
      // Lookup template
      const template = await firstValueFrom(
        this.characterFacade.byId$(charRef),
      );
      if (!template) continue;
      // Create unique encounter ID
      // const encounterId = `${charRef}:${moment.id}:${adventureId}`;
      const encounterId = buildAdventureEntityCompositeId(
        charRef,
        adventure.currentDimensionId,
        adventure.currentPlaneId,
        adventure.id,
        adventure.accountId,
      );
      if (!encounterId) continue;
      // Clone and add to store
      const mob: Character = {
        ...template,
        id: encounterId,
        adventureId: adventure.id,
        accountId,
      };
      // Optionally: reset HP, effects, etc.
      this.characterFacade.add(mob);
    }
  }

  // Filtering moments (repeatability, prerequisites, location, etc)
  private filterAvailableMoments(
    allMoments: Moment[],
    adventure: Adventure,
    events: AdventureEvent[],
    player: Character,
  ): Moment[] {
    const availableMoments: Moment[] = allMoments.filter((moment) => {
      // console.log('[filterAvailableMoments] moment:', moment);

      // // Location check
      // if (
      //   moment.locationId &&
      //   moment.locationId !== adventure.currentLocationId
      // ) {
      //   console.log('[filterAvailableMoments] not current location');
      //   return false;
      // }

      // Repeatability/history check
      const seenCount = events.filter(
        (e) => e.type === 'moment' && e.entityId === moment.id,
      ).length;
      if (!moment.repeatable && seenCount > 0) return false;

      // Prerequisites check (flags, attributes, etc.)
      if (moment.prerequisites) {
        for (const req of moment.prerequisites) {
          // Example: check flags or player state (expand as needed)
          if (!player.tags.includes(req)) return false;
        }
      }

      return true;
    });
    return availableMoments;
  }

  private calculateMomentWeight(
    moment: Moment,
    adventure: Adventure,
    events: AdventureEvent[],
    player: Character,
  ): WeightedMoment {
    // Assign weights
    let weight = moment.weightBase ?? 1;

    // Location affinity
    if (moment.locationId === adventure.currentLocationId) weight += 5;

    // Story priority (e.g., main quest moments)
    // Example: if moment.tags includes 'main-story'
    if (moment.tags.includes('main-story')) weight += 10;

    // Rarity/special moment
    const seenCount = events.filter(
      (e) => e.type === 'moment' && e.entityId === moment.id,
    ).length;
    if (seenCount > 0) weight -= 2 * seenCount;

    // Exploration variety
    if (moment.tags.includes('unlock')) weight += 5;

    // Difficulty pacing (example: scale by player level)
    // if (moment.tags.includes('challenge') && player.attributes['level'] < 5) weight -= 3;

    // Custom: low health, show healing moments
    if (
      Number(player.attributes['health']) < 20 &&
      moment.tags.includes('healing')
    )
      weight += 8;

    // Custom: flags
    if (player.tags.includes('knowsAboutCult') && moment.tags.includes('cult'))
      weight += 7;

    const weightedMoment: WeightedMoment = { id: moment.id, weight };
    return weightedMoment;
  }

  private pickWeightedMoment(weightedMoments: WeightedMoment[]) {
    const totalWeight = weightedMoments.reduce(
      (sum, m) => sum + Math.max(m.weight, 0),
      0,
    );
    if (totalWeight === 0) return undefined;
    let r = Math.random() * totalWeight;
    for (const m of weightedMoments) {
      r -= Math.max(m.weight, 0);
      if (r <= 0) return m.id;
    }
    return weightedMoments[0]?.id;
  }

  // Returns a weighted random moment ID based on current game state and history
  async getWeightedNextMomentId(): Promise<string | undefined> {
    const adventure = await firstValueFrom(this.currentAdventure$);
    // console.log('[getWeightedNextMomentId] adventure:', adventure);
    if (!adventure) return undefined;
    const player = await firstValueFrom(this.player$);
    // console.log('[getWeightedNextMomentId] player:', player);
    if (!player) return undefined;
    const allMoments = await firstValueFrom(this.all$);
    // console.log('[getWeightedNextMomentId] allMoments:', allMoments);
    if (!allMoments?.length) return undefined;
    const events = await firstValueFrom(this.events$);
    // console.log('[getWeightedNextMomentId] events:', events);

    const availableMoments = this.filterAvailableMoments(
      allMoments,
      adventure,
      events,
      player,
    );
    // console.log(
    //   '[getWeightedNextMomentId] availableMoments:',
    //   availableMoments,
    // );
    const weightedMoments = availableMoments.map((moment) =>
      this.calculateMomentWeight(moment, adventure, events, player),
    );
    // console.log('[getWeightedNextMomentId] weightedMoments:', weightedMoments);

    return this.pickWeightedMoment(weightedMoments);
  }

  async enterMoment(momentId: string) {
    const moment = await firstValueFrom(this.byId$(momentId));
    if (!moment || !moment.effects?.onEnter) return;
    const effects: EffectInstance[] = Object.values(moment.effects?.onEnter);
    const timestamp = new Date().toISOString();

    // Apply onEnter effects to all characters in the moment
    for (const effect of effects) {
      for (const charId of moment.characters ?? []) {
        const effectInstance: EffectInstance = {
          ...effect,
          targetId: charId,
          sourceType: 'moment',
          sourceId: moment.id,
          appliedBy: momentId,
          appliedAt: timestamp,
        };
        await this.characterFacade.applyEffectInstance(effectInstance);
      }
    }
    // Spawn characters
    await this.loadMomentCharacters(moment);
    // Set location
    if (moment.locationId) {
      await this.adventureFacade.setLocation(moment.locationId);
    }
    // Set current moment
    await this.adventureFacade.setMoment(momentId);
  }

  async completeMoment(momentId: string) {
    const moment = await firstValueFrom(this.byId$(momentId));
    if (!moment || !moment.effects?.onComplete) return;
    const effects: EffectInstance[] = Object.values(moment.effects?.onComplete);
    const timestamp = new Date().toISOString();

    // 1. Apply onComplete effects to all relevant characters
    for (const effect of effects) {
      for (const charId of moment.characters ?? []) {
        const effectInstance: EffectInstance = {
          ...effect,
          targetId: charId,
          sourceType: 'moment',
          sourceId: moment.id,
          appliedBy: charId,
          appliedAt: timestamp,
        };
        await this.characterFacade.applyEffectInstance(effectInstance);
      }
    }

    // // 2. Apply rewards (items, exp, gold, etc.) to player
    // const playerId = await firstValueFrom(this.playerId$);
    // if (moment.rewards && playerId) {
    //   if (moment.rewards.items) {
    //     await this.utils.character.addItemsToInventory(
    //       playerId,
    //       moment.rewards.items,
    //     );
    //   }
    //   if (typeof moment.rewards.exp === 'number') {
    //     await this.utils.character.addExp(playerId, moment.rewards.exp);
    //   }
    //   if (typeof moment.rewards.gold === 'number') {
    //     await this.utils.character.addGold(playerId, moment.rewards.gold);
    //   }
    // }

    // 3. Advance time
    // if (moment.timeAdvance) {
    //   await this.advanceGameClock(moment.timeAdvance);
    // }

    // 4. Log event
    await this.log(`Completed moment: ${moment.title}`);
    const adventureId = await firstValueFrom(this.currentAdventureId$);
    if (adventureId) {
      await this.adventureFacade.addMomentCompleteEvent(adventureId, {
        momentId,
        rewards: moment.rewards,
        timeAdvance: moment.timeAdvance,
      });
    }

    // 5. Advance to next moment if specified by win condition or design
    // ... (handled by choice or win condition)
    // (Handled elsewhere, e.g. after calling completeMoment, you may call gotoMoment)
  }
}
