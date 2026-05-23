import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
// import { map, of, switchMap } from 'rxjs';
import { firstValueFrom } from 'rxjs';

import {
  Adventure,
  AdventureEvent,
  AdventureEventPayload,
  AdventureIndex,
} from '../../models/adventure';
import { AdventureEventActions } from '../../store/adventure/adventure-event.actions';
import {
  selectAdventureIndexEntities,
  selectAllAdventureIndexes,
} from '../../store/adventure/adventure-index.selectors';
import { AdventureActions } from '../../store/adventure/adventure.actions';
import {
  selectAdventureById,
  selectAdventureEntities,
  selectAllAdventures,
} from '../../store/adventure/adventure.selectors';
import {
  selectAccountId,
  selectCurrentAdventure,
  selectCurrentAdventureEvents,
  selectCurrentAdventureLog,
  selectCurrentSlotId,
} from '../../store/app.selectors';
import { toId } from '../../utils';
import {
  buildAdventureEntityCompositeId,
  buildDimensionEntityCompositeId,
  DEFAULT_DIMENSION_ID,
  DEFAULT_PLANE_ID,
} from '../../utils-composite-id';
import { CharacterFacade } from './character-facade';

// :: Focused on business logic and orchestration, not storage details ::

type AdventureEventOmittedKeys = 'id' | 'timestamp' | 'accountId';
type AdventureEventInput = Omit<AdventureEvent, AdventureEventOmittedKeys>;

@Injectable({ providedIn: 'root' })
export class AdventureFacade {
  constructor(
    private store: Store,
    private characterFacade: CharacterFacade,
  ) {}

  // #region 🔸 NgRx Selectors 🔸

  all$ = this.store.select(selectAllAdventures);
  entities$ = this.store.select(selectAdventureEntities);
  currentSlotId$ = this.store.select(selectCurrentSlotId);
  current$ = this.store.select(selectCurrentAdventure);

  allIndexes$ = this.store.select(selectAllAdventureIndexes);
  indexEntities$ = this.store.select(selectAdventureIndexEntities);

  accountId$ = this.store.select(selectAccountId);
  log$ = this.store.select(selectCurrentAdventureLog);
  events$ = this.store.select(selectCurrentAdventureEvents);

  player$ = this.characterFacade.player$;
  // #endregion

  // #region 🔸 Feature CRUD Methods 🔸
  add(adventure: Adventure) {
    this.store.dispatch(AdventureActions.addAdventure({ adventure }));
  }
  load() {
    this.store.dispatch(AdventureActions.loadAllAdventures());
  }
  save(id: string, changes: Partial<Adventure>) {
    this.store.dispatch(AdventureActions.saveAdventure({ id, changes }));
  }
  remove(id: string) {
    this.store.dispatch(AdventureActions.removeAdventure({ id }));
  }
  byId$(id: string) {
    return this.store.select(selectAdventureById(id));
  }
  // #endregion

  async compositeId(momentId: string): Promise<string | undefined> {
    const adventure = await firstValueFrom(this.current$);
    if (!adventure) {
      console.warn('[GameFacade] No current adventure found!');
      return undefined;
    }
    // Build fully qualified moment ID
    return buildDimensionEntityCompositeId(
      momentId,
      adventure.currentDimensionId,
      adventure.currentPlaneId,
    );
  }

  // Calculate true byte size of string as it would be stored
  sizeInKB(slot: Adventure) {
    const json = JSON.stringify(slot);
    return new Blob([json]).size / 1024;
  }

  async createNewGame(label: string, characterName: string) {
    console.log('[AdventureFacade] Creating new game with:', {
      label,
      characterName,
    });

    // const { accountId } = this.userService;
    const accountId = await firstValueFrom(this.accountId$);
    if (!accountId) return;
    console.log('accountId:', accountId);

    const slotId = toId(label);
    if (!slotId) {
      throw new Error(
        'Adventure ID could not be built: missing required parts',
      );
    }

    const player = await this.characterFacade.createNewCharacterFromTemplate(
      characterName,
      slotId,
      accountId,
    );
    if (!player) {
      throw new Error(`[createNewGame] Player could not be: ${characterName}`);
    }
    console.log('[AdventureFacade] New character:', player);
    // Add the new character to the store and IndexedDB
    this.characterFacade.add(player);

    const adventure: Adventure = {
      id: slotId,
      label,
      accountId,
      preferences: {
        enableNSFW: false,
        blockedTags: [],
        pronouns: 'they',
        difficulty: 'normal',
        unlockedBonuses: [],
      },
      primeDimension: DEFAULT_DIMENSION_ID,
      currentDimensionId: DEFAULT_DIMENSION_ID,
      currentPlaneId: DEFAULT_PLANE_ID,
      currentCharacterId: player.id,
      currentLocationId: 'start',
      // currentMomentId: 'start',
      currentMomentId: 'training-room',
      log: [],
      // eventLog: ['A new adventure begins!'],
      // history: [],
      // tags: {}, // or arrayToEntityMap(tagsArray)
      // characters: { [player.id]: player }, // or arrayToEntityMap([player])
      // moments: {}, // or arrayToEntityMap(momentsArray)
      // locations: {},
      // reputationMap: {},
      // items: {},
    };
    console.log('[AdventureFacade] New adventure:', adventure);
    // const index = await this.buildAdventureIndex(adventure, label);

    this.add(adventure);

    // this.setCurrentSlotId(slotId);
    // Now handled by `setCurrentSlotIdOnAdventureAdd$` effect
  }

  // Helper utility to build AdventureIndex from Adventure
  async buildAdventureIndexFromAdventure(
    adventure: Adventure,
  ): Promise<AdventureIndex | undefined> {
    try {
      console.log('[buildAdventureIndexFromAdventure] adventure:', adventure);
      // const player = await firstValueFrom(this.player$);
      const player = await firstValueFrom(
        this.characterFacade.byId$(adventure.currentCharacterId),
      );
      console.log('[buildAdventureIndexFromAdventure] player:', player);

      if (!player) {
        console.error(
          '[buildAdventureIndexFromAdventure] No player found for adventure slot id:',
          adventure.id,
        );
        return undefined;
      }

      const level = Number(player.attributes?.['level']);
      console.log('[buildAdventureIndexFromAdventure] level:', level);

      const index: AdventureIndex = {
        id: adventure.id,
        label: adventure.label ?? 'Unnamed Save',
        savedAt: new Date().toISOString(),
        sizeKB: this.sizeInKB(adventure),
        storageType: 'local',
        playerName: player.name || 'Unknown',
        playerLevel: Number(player.attributes?.['level']) || 1,
        playerLocation: player.location,
      };
      console.log('[buildAdventureIndexFromAdventure] index:', index);
      return index;
    } catch (error) {
      console.error('[buildAdventureIndexFromAdventure] Error:', error);
      throw error;
    }
  }

  // Set the current adventure location
  async setLocation(locationId: string) {
    const adventureId = await firstValueFrom(this.currentSlotId$);
    if (!adventureId) return;
    this.save(adventureId, { currentLocationId: locationId });
  }

  // Set the current adventure moment
  async setMoment(momentId: string) {
    const adventureId = await firstValueFrom(this.currentSlotId$);
    if (!adventureId) return;
    this.save(adventureId, { currentMomentId: momentId });
  }

  // // Advance the game clock by N units
  // async advanceGameClock(minutes: number) {
  //   const adventureId = await firstValueFrom(this.currentSlotId$);
  //   if (!adventureId) return;
  //   // Implement your game clock logic here (e.g., update adventure.time)
  //   // Example:
  //   // await this.save(adventureId, { time: newTime });
  // }

  // #region 🔸 Adventure Logs 🔸

  // Add a new log entry (appears at the top)
  async addLogEntry(message: string): Promise<void> {
    const adventure = await firstValueFrom(
      this.store.select(selectCurrentAdventure),
    );
    if (!adventure) return;
    this.store.dispatch(
      AdventureActions.addLogEntry({ slotId: adventure.id, message }),
    );
  }

  // Clear the log
  async clearLog(): Promise<void> {
    const adventure = await firstValueFrom(
      this.store.select(selectCurrentAdventure),
    );
    if (!adventure) return;
    this.store.dispatch(AdventureActions.clearLog({ slotId: adventure.id }));
  }
  // #endregion

  // #region 🔸 Adventure Events 🔸

  // Log a significant event (e.g., moment choice, moment complete)
  async addEvent(event: AdventureEventInput) {
    const accountId = await firstValueFrom(this.accountId$);
    if (!accountId) return;
    console.log('accountId:', accountId);
    const timestamp = new Date().toISOString();
    const id = buildAdventureEntityCompositeId(
      timestamp,
      event.dimensionId,
      event.planeId,
      event.adventureId,
      accountId,
    );
    if (!id) return;
    const adventureEvent: AdventureEvent = {
      ...event,
      id,
      accountId,
      timestamp,
    };
    this.store.dispatch(
      AdventureEventActions.addAdventureEvent({ event: adventureEvent }),
    );
  }

  // Example: Log moment completion
  async addMomentCompleteEvent(
    momentId: string,
    payload: AdventureEventPayload = {},
  ) {
    const adventure = await firstValueFrom(this.current$);
    if (!adventure) return;
    await this.addEvent({
      type: 'moment',
      action: 'complete',
      entityId: momentId,
      payload, // should include choice made
      dimensionId: adventure.currentDimensionId,
      planeId: adventure.currentPlaneId,
      adventureId: adventure.id,
    });
  }
  // #endregion
}
