import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { firstValueFrom } from 'rxjs';

import {
  Adventure,
  AdventureEvent,
  AdventureEventPayload,
  AdventureIndex,
  AdventureInstance,
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
  DEFAULT_ACCOUNT_ID,
  DEFAULT_DIMENSION_ID,
  DEFAULT_PLANE_ID,
} from '../../utils-composite-id';
import { AttributeFacade } from './attribute-facade';
import { CharacterFacade } from './character-facade';

// :: Focused on business logic and orchestration, not storage details ::

type AdventureEventOmittedKeys = 'id' | 'timestamp' | 'accountId';
type AdventureEventInput = Omit<AdventureEvent, AdventureEventOmittedKeys>;

@Injectable({ providedIn: 'root' })
export class AdventureFacade {
  constructor(
    private store: Store,
    private attributeFacade: AttributeFacade,
    private characterFacade: CharacterFacade,
  ) {}

  // #region 🔸 Selectors 🔸

  all$ = this.store.select(selectAllAdventures); // for UI
  entities$ = this.store.select(selectAdventureEntities); // for lookup

  byId$(id: string) {
    return this.store.select(selectAdventureById(id));
  }

  currentSlotId$ = this.store.select(selectCurrentSlotId);
  current$ = this.store.select(selectCurrentAdventure);

  allIndexes$ = this.store.select(selectAllAdventureIndexes);
  indexEntities$ = this.store.select(selectAdventureIndexEntities);

  accountId$ = this.store.select(selectAccountId);
  log$ = this.store.select(selectCurrentAdventureLog);
  events$ = this.store.select(selectCurrentAdventureEvents);

  player$ = this.characterFacade.player$;
  // #endregion

  // #region 🔸 CRUD Methods 🔸

  add(adventure: Adventure) {
    this.store.dispatch(AdventureActions.addAdventure({ adventure }));
  }
  load() {
    this.store.dispatch(AdventureActions.loadAllAdventures());
  }
  save(changes: AdventureInstance) {
    if (!changes.id) {
      console.warn('Save aborted: Instance is missing ID', changes);
      return;
    }
    this.store.dispatch(
      AdventureActions.saveAdventure({ id: changes.id, changes }),
    );
  }
  remove(id: string) {
    this.store.dispatch(AdventureActions.removeAdventure({ id }));
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

  async createNewGame(
    label: string,
    characterName: string,
    dimensionId: string = DEFAULT_DIMENSION_ID,
    planeId: string = DEFAULT_PLANE_ID,
  ): Promise<Adventure> {
    const slotId = toId(label);
    if (!slotId) throw new Error('Adventure ID could not be built');

    const accountId =
      (await firstValueFrom(this.accountId$)) || DEFAULT_ACCOUNT_ID;
    if (!accountId) throw new Error('Missing accountId');

    const currentLocationId = buildDimensionEntityCompositeId(
      'start',
      dimensionId,
      planeId,
    );
    const currentMomentId = buildDimensionEntityCompositeId(
      'training-room',
      dimensionId,
      planeId,
    );

    if (!currentLocationId || !currentMomentId) {
      throw new Error('Failed to build starting location/moment IDs');
    }

    const player = await this.characterFacade.createNewCharacterFromTemplate(
      characterName,
      slotId,
      accountId,
    );

    if (!player)
      throw new Error(`Player could not be created: ${characterName}`);

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
      originDimensionId: dimensionId,
      originPlaneId: planeId,
      currentDimensionId: dimensionId,
      currentPlaneId: planeId,
      currentCharacterId: player.id,
      currentLocationId,
      currentMomentId,
      log: [],
    };

    console.log('New character:', player);
    console.log('New adventure:', adventure);

    this.characterFacade.add(player);
    this.add(adventure);

    return adventure;
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

      const playerLevel = Number(
        this.attributeFacade.getValue(player.attributes, 'level', 1),
      );
      console.log('[buildAdventureIndexFromAdventure] level:', playerLevel);

      const index: AdventureIndex = {
        id: adventure.id,
        label: adventure.label ?? 'Unnamed Save',
        savedAt: new Date().toISOString(),
        sizeKB: this.sizeInKB(adventure),
        storageType: 'local',
        playerName: player.name || 'Unknown',
        playerLevel,
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
    this.save({ id: adventureId, currentLocationId: locationId });
  }

  // Set the current adventure moment
  async setMoment(momentId: string) {
    const adventureId = await firstValueFrom(this.currentSlotId$);
    if (!adventureId) return;
    this.save({ id: adventureId, currentMomentId: momentId });
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
