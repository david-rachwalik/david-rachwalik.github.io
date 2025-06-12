import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { Character } from '../models/character';
import { GameState } from '../models/game-state';
import { Moment } from '../models/moment';
import { AttributeFacade } from './facades/attribute-facade';
import { CharacterFacade } from './facades/character-facade';
import { ItemFacade } from './facades/item-facade';
import { LocationFacade } from './facades/location-facade';
import { MomentFacade } from './facades/moment-facade';
import { GameDataService } from './game-data.service';
import { GameSaveService } from './game-save.service';
import { GameStateService } from './game-state.service';
import { RpgLogService } from './rpg-log.service';

// :: Business Logic Layer ::
// Bridges the other services (GameDataService, GameStateService, GameSaveService):
// - Calls state methods, logs history, saves automatically
// - Can be replaced eventually by NgRx effects/selectors/actions

@Injectable({ providedIn: 'root' })
export class GameFacade {
  constructor(
    private gameState: GameStateService,
    private saveService: GameSaveService,
    private logService: RpgLogService,
    public data: GameDataService,
    public attributes: AttributeFacade,
    public locations: LocationFacade,
    public moments: MomentFacade,
    public items: ItemFacade,
    public characters: CharacterFacade,
  ) {}

  get currentSlotId(): string | undefined {
    return this.saveService.currentSlotId;
  }

  get state(): GameState | undefined {
    return this.gameState.current;
  }

  get currentCharacter(): Character | undefined {
    return this.characters.currentCharacter;
  }
  get currentCharacter$(): Observable<Character | undefined> {
    // return this.gameState.currentCharacter$;
    const char = this.gameState.state$.pipe(
      map((state) =>
        state
          ? state.characters.find((c) => c.id === state.currentCharacterId)
          : undefined,
      ),
    );
    return char;
  }

  get currentMomentId(): string | undefined {
    return this.state?.currentMomentId;
  }
  get currentMoment(): Moment | undefined {
    const id = this.currentMomentId;
    return id ? this.moments.getMoment(id) : undefined;
  }

  get logEntries$(): Observable<string[]> {
    return this.logService.entries$;
  }
  log(message: string): void {
    this.logService.add(message);
  }

  /**
   * Creates a new game state from a character template, saves it, and sets it as current.
   */
  newGame(
    label: string,
    characterName = 'Hero',
    templateId = 'player-default',
  ) {
    const slotId = this.saveService.toSlotId(label);
    console.log('[GameFacade] Creating new game with:', {
      slotId,
      label,
      characterName,
      templateId,
    });
    const player = this.characters.createNewCharacterFromTemplate(
      templateId,
      characterName,
    );
    console.log('[GameFacade] New character:', player);
    const state: GameState = {
      preferences: {
        enableNSFW: false,
        blockedTags: [],
        pronouns: 'they/them',
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

    this.saveGame(state, label);
  }

  // Saving game data to storage (only use label for new game)
  saveGame(state: GameState, label = ''): void {
    this.saveService.save(state, label);
    console.log(
      '[GameFacade] Saved new game state to slot:',
      this.saveService.currentSlotId,
      state,
    );
  }

  // Loads the state of the current game slot
  loadGame(): void {
    this.saveService.load();
    console.log('[GameFacade] Loading current game slot complete');
  }

  testStatChange() {
    const player = this.currentCharacter;
    console.log('[GameFacade] testStatChange() - currentCharacter:', player);
    if (!player) {
      console.warn('[GameFacade] No current character found!');
      return;
    }

    // STR: +1
    const currentStr = Number(player.attributes['str'] ?? 0);
    const newStr = currentStr + 1;
    console.log(`[GameFacade] STR: ${currentStr} -> ${newStr}`);
    this.characters.updateCharacterAttributeValue(player.id, 'str', newStr);

    // HEALTH: +5, capped at max
    const healthAttr = this.attributes.getById('health');
    const currentHealth = Number(player.attributes['health'] ?? 0);
    const maxHealth = Number(healthAttr?.max ?? 100);
    const newHealth = Math.min(currentHealth + 5, maxHealth);
    console.log(
      `[GameFacade] HEALTH: ${currentHealth} -> ${newHealth} (max: ${maxHealth})`,
    );
    this.characters.updateCharacterAttributeValue(
      player.id,
      'health',
      newHealth,
    );
  }
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
