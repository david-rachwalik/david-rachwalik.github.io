import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
// import { map, of, switchMap } from 'rxjs';
import { firstValueFrom } from 'rxjs';

import { Adventure, AdventureIndex } from '../../models/adventure';
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
import { selectCurrentAdventure } from '../../store/app.selectors';
import { toId } from '../../utils';
import {
  DEFAULT_DIMENSION_ID,
  DEFAULT_PLANE_ID,
} from '../../utils-composite-id';
import { UserService } from '../user.service';
import { CharacterFacade } from './character-facade';

// :: Focused on business logic and orchestration, not storage details ::

@Injectable({ providedIn: 'root' })
export class AdventureFacade {
  constructor(
    private store: Store,
    private characterFacade: CharacterFacade,
    private userService: UserService,
  ) {}

  // #region 🔸 NgRx Selectors 🔸

  all$ = this.store.select(selectAllAdventures);
  entities$ = this.store.select(selectAdventureEntities);
  current$ = this.store.select(selectCurrentAdventure);

  allIndexes$ = this.store.select(selectAllAdventureIndexes);
  indexEntities$ = this.store.select(selectAdventureIndexEntities);

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

    const { accountId } = this.userService;
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
      currentMomentId: 'start',
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
}
