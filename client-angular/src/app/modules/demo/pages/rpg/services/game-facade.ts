import { Injectable } from '@angular/core';

import { Character } from '../models/character';
import { GameState } from '../models/game-state';
import { Moment } from '../models/moment';
import { AttributeFacade } from './facades/attribute-facade';
import { CharacterFacade } from './facades/character-facade';
import { ItemFacade } from './facades/item-facade';
import { LocationFacade } from './facades/location-facade';
import { MomentFacade } from './facades/moment-facade';
import { GameStateService } from './game-state.service';

// :: Business Logic Layer ::
// Bridges the other services (GameDataService, GameStateService, GameSaveService):
// - Calls state methods, logs history, saves automatically
// - Can be replaced eventually by NgRx effects/selectors/actions

@Injectable({ providedIn: 'root' })
export class GameFacade {
  constructor(
    private gameState: GameStateService,
    public attributes: AttributeFacade,
    public locations: LocationFacade,
    public moments: MomentFacade,
    public items: ItemFacade,
    public characters: CharacterFacade,
  ) {}

  get state(): GameState | undefined {
    return this.gameState.current;
  }

  get currentCharacter(): Character | undefined {
    return this.characters.currentCharacter;
  }

  get currentMomentId(): string | undefined {
    return this.state?.currentMomentId;
  }
  get currentMoment(): Moment | undefined {
    const id = this.currentMomentId;
    return id ? this.moments.getMoment(id) : undefined;
  }

  get eventLog(): string[] {
    return this.state?.eventLog ?? [];
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
