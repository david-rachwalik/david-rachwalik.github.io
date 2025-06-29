import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, firstValueFrom, map, Observable } from 'rxjs';

import { Adventure, AdventureIndex } from '../models/adventure';
import { Attribute } from '../models/attribute';
import { InventorySlotViewModel } from '../models/item';
import { AdventureIndexActions } from '../store/adventure/adventure-index.actions';
import { selectAllAdventureIndexes } from '../store/adventure/adventure-index.reducer';
import { AdventureActions } from '../store/adventure/adventure.actions';
import { AppActions } from '../store/app.actions';
import {
  selectCurrentAdventure,
  selectCurrentCharacter,
  selectCurrentMoment,
  selectCurrentSlotId,
} from '../store/app.selectors';
import { selectAttributeEntities } from '../store/attribute/attribute.selectors';
import { momentFeature } from '../store/moment/moment.reducer';
import { IdValuePair } from '../utils';
import { GameDataService } from './game-data.service';
import { RpgFacades } from './rpg-facades';
import { RpgLogService } from './rpg-log.service';

// :: Business Logic Layer ::
// Bridges the other services (GameDataService, AdventureService, GameSaveService):
// - Calls state methods, logs history, saves automatically
// - Can be replaced eventually by NgRx effects/selectors/actions

@Injectable({ providedIn: 'root' })
export class GameFacade {
  constructor(
    private store: Store,
    private logService: RpgLogService,
    public data: GameDataService,
    public utils: RpgFacades,
  ) {}

  // #region 🔸 NgRx Selectors 🔸

  // --- Data ---

  attributes$ = this.store
    .select(selectAttributeEntities)
    .pipe(
      map((entities) =>
        Object.values(entities).filter((a): a is Attribute => !!a),
      ),
    );

  // --- Current Adventure ---

  currentSlotId$ = this.store.select(selectCurrentSlotId);
  allSaves$ = this.store.select(selectAllAdventureIndexes);

  currentAdventure$ = this.store.select(selectCurrentAdventure);
  player$ = this.store.select(selectCurrentCharacter);

  playerAttributes$ = combineLatest([
    this.utils.character.listAttributeKeys$(this.player$, ['level', 'health']),
    this.utils.attribute.attributes$, // Attribute[]
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
          return {
            ...def,
            value,
          } as Attribute;
        })
        .filter((a): a is Attribute => !!a),
    ),
  );

  stats$ = combineLatest([this.player$, this.attributes$]).pipe(
    map(([player, attrs]) => {
      if (!player) return [];
      return attrs
        .filter(
          (attr) =>
            attr.type === 'stat' && attr.id !== 'health' && attr.id !== 'level',
        )
        .map((attr) => ({
          id: attr.id,
          name: attr.name,
          value: Number(player.attributes[attr.id] ?? attr.defaultValue ?? 0),
          max: typeof attr.max === 'number' ? attr.max : undefined,
          description: attr.description,
        }));
    }),
  );

  inventory$: Observable<InventorySlotViewModel[]> = this.utils.character
    .getInventorySlots$(this.player$)
    .pipe(
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

  // currentMoment$ = this.utils.moment.byId$(
  //   this.utils.adventure.currentMomentId$,
  // );
  currentMoment$ = this.store.select(selectCurrentMoment);

  moment$ = combineLatest([
    this.store.select(selectCurrentAdventure),
    this.store.select(momentFeature.selectEntities),
  ]).pipe(
    map(([adventure, momentEntities]) => {
      if (!adventure) return undefined;
      return momentEntities[adventure.currentMomentId];
    }),
  );

  currentLocation$ = this.utils.location.byId$(
    this.utils.adventure.currentLocationId$,
  );

  logEntries$ = this.logService.entries$;
  // #endregion

  // #region 🔸 Methods - Save/Load 🔸

  // App initialization: ensure the game state is prepared & ready
  init() {
    console.log('[GameFacade] Dispatching seed and load actions');
    this.store.dispatch(AppActions.init());

    // // Load currentSlotId from client storage
    // this.store.dispatch(AppActions.loadCurrentSlotId());
    // // Seed static data (attributes, items, etc.)
    // this.store.dispatch(AppActions.loadSeeds());
    // // Load AdventureIndexes from client storage
    // this.store.dispatch(AdventureIndexActions.loadAdventureIndexes());

    // this.store.dispatch(AttributeActions.loadAttributes());
    // this.store.dispatch(TagActions.loadTags());
    // this.store.dispatch(CharacterActions.loadCharacters());
    // this.store.dispatch(LocationActions.loadLocations());
    // this.store.dispatch(MomentActions.loadMoments());
    // this.store.dispatch(ItemActions.loadItems());
  }

  async play() {
    // this.currentSlotId$.subscribe((slotId) => {
    //   if (slotId) {
    //     this.store.dispatch(AppActions.play({ slotId }));
    //   }
    // });

    const slotId = await firstValueFrom(this.currentSlotId$);
    if (!slotId) return;
    this.store.dispatch(AppActions.play({ slotId }));
  }

  // Change the active slot id
  setCurrentSlotId(slotId: string) {
    this.store.dispatch(AppActions.setCurrentSlotId({ slotId }));
  }

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

  // Save adventure state (partial update)
  saveAdventure(id: string, changes: Partial<Adventure>) {
    this.store.dispatch(AdventureActions.saveAdventure({ id, changes }));
    // AdventureIndex will be updated by effect after Adventure is persisted
    // (effect will dispatch AdventureIndexActions.saveAdventureIndex)
  }

  // Save or update slot metadata (direct, if needed)
  saveSlotMetadata(id: string, changes: Partial<AdventureIndex>) {
    this.store.dispatch(
      AdventureIndexActions.saveAdventureIndex({ id, changes }),
    );
  }

  // Delete adventure slot
  deleteSlot(id: string) {
    this.store.dispatch(AdventureActions.removeAdventure({ id }));
    this.store.dispatch(AdventureIndexActions.removeAdventureIndex({ id }));
  }

  // --------------------------------------------------------------
  // --------------------------------------------------------------

  private async buildAdventureIndex(
    adventure: Adventure,
    label?: string,
  ): Promise<AdventureIndex> {
    // Try to get the previous AdventureIndex from the store
    const allIndexes = await firstValueFrom(this.allSaves$);
    const prev = allIndexes.find((idx) => idx.id === adventure.id);

    // If found, update only the fields that should change
    if (prev) {
      return {
        ...prev,
        // label: label ?? prev.label,
        savedAt: new Date().toISOString(),
        sizeKB: this.utils.adventure.sizeInKB(adventure),
      };
    }

    // If not found, create a new index (first save)
    return {
      id: adventure.id,
      label: label || '',
      savedAt: new Date().toISOString(),
      sizeKB: this.utils.adventure.sizeInKB(adventure),
      storageType: 'local',
    };
  }

  // Creates a new game state from a character template, saves & activates it
  async newGame(
    label: string,
    characterName: string,
    templateId = 'player-default',
  ) {
    console.log('[GameFacade] Creating new game with:', {
      label,
      characterName,
      templateId,
    });

    const slotId = this.utils.adventure.toSlotId(label);
    const player = this.utils.character.createNewCharacterFromTemplate(
      templateId,
      characterName,
    );
    console.log('[GameFacade] New character:', player);

    const adventure: Adventure = {
      id: slotId,
      label,
      preferences: {
        enableNSFW: false,
        blockedTags: [],
        pronouns: 'they',
        difficulty: 'normal',
        unlockedBonuses: [],
      },
      currentCharacterId: player.id,
      currentLocationId: 'start',
      currentMomentId: 'start',
      eventLog: ['A new adventure begins!'],
      history: [],
      tags: [],
      characters: [player],
      relationships: [],
      moments: [],
      locations: [],
      reputationMap: {},
      items: [],
    };
    // const index = await this.buildAdventureIndex(adventure, label);

    // await this.saveGame(adventure, label);

    // Save Adventure and Index, set as current
    // this.store.dispatch(AdventureActions.saveAdventure({ adventure }));
    // this.store.dispatch(
    //   AdventureIndexActions.addAdventureIndex({ slot: index }),
    // );

    // // Only dispatch `addAdventure`; effect will handle AdventureIndex
    // this.store.dispatch(AdventureActions.addAdventure({ adventure }));
    // this.store.dispatch(AppActions.setCurrentSlotId({ slotId }));

    this.addAdventure(adventure);
    this.setCurrentSlotId(slotId);
  }

  // // Save game slot to client storage
  // async saveGame(adventure: Adventure) {
  //   console.log('[GameFacade] Saving game slot:', adventure.id);
  //   const index = await this.buildAdventureIndex(adventure);

  //   // Save Adventure and AdventureIndex
  //   this.store.dispatch(AdventureActions.saveAdventure({ adventure }));
  //   this.store.dispatch(
  //     AdventureIndexActions.updateAdventureIndex({ slot: index }),
  //   );
  // }

  // Save game slot to client storage
  saveGame(id: string, changes: Partial<Adventure>) {
    console.log('[GameFacade] Saving game slot:', id, changes);
    // this.store.dispatch(AdventureActions.saveAdventure({ id, changes }));
    // // AdventureIndex will be updated by effect after Adventure is persisted
    this.saveAdventure(id, changes);
  }

  // Delete a game slot from client storage
  async deleteGame(slotId: string): Promise<void> {
    console.log('[GameFacade] Deleting adventure slot:', slotId);

    // Dispatch actions to delete Adventure and AdventureIndex
    this.store.dispatch(AdventureActions.removeAdventure({ id: slotId }));
    this.store.dispatch(
      AdventureIndexActions.removeAdventureIndex({ id: slotId }),
    );

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

  // #region 🔸 Methods - Utility 🔸

  async log(message: string): Promise<void> {
    await this.logService.add(message);
  }

  async testStatChange() {
    const player = await firstValueFrom(this.player$);
    console.log('[GameFacade] testStatChange() - currentCharacter:', player);
    if (!player) {
      console.warn('[GameFacade] No current character found!');
      return;
    }

    // STR: +1
    const currentStr = Number(player.attributes['str'] ?? 0);
    const newStr = currentStr + 1;
    console.log(`[GameFacade] STR: ${currentStr} -> ${newStr}`);
    await this.utils.character.updateCharacterAttributeValue(
      player.id,
      'str',
      newStr,
    );

    // HEALTH: +5, capped at max
    const healthAttr = this.utils.attribute.byId('health');
    const currentHealth = Number(player.attributes['health'] ?? 0);
    const maxHealth = Number(healthAttr?.max ?? 100);
    const newHealth = Math.min(currentHealth + 5, maxHealth);
    console.log(
      `[GameFacade] HEALTH: ${currentHealth} -> ${newHealth} (max: ${maxHealth})`,
    );
    await this.utils.character.updateCharacterAttributeValue(
      player.id,
      'health',
      newHealth,
    );
  }
  // #endregion
}

// :: Usage Example (in component) ::

// constructor(private game: GameFacade) {}

// ngOnInit() {
//   // ...
//   this.moment = this.game.currentMoment!;
//   this.eventLog = this.game.eventLog;
// }

// addSword() {
//   this.game.characters.addItemToInventory('sword');
// }

// takeDamage() {
//   this.game.attributes.damageCharacter('char-1', 5);
// }
