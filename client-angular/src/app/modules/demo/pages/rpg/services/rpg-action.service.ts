import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { Character } from '../models/character';
import { Item } from '../models/item';
import { MomentChoice } from '../models/moment';
import { GameFacade } from './game-facade';

@Injectable({ providedIn: 'root' })
export class RpgActionService {
  constructor(private game: GameFacade) {}

  // Get choices for the current moment
  getChoices(): Observable<MomentChoice[]> {
    return this.game.currentMoment$.pipe(
      map(
        (moment) =>
          (moment?.choices?.map((opt) => ({
            id: opt.id,
            label: opt.label,
            enabled: opt.enabled !== false, // enabled by default
          })) as MomentChoice[]) ?? [],
      ),
    );
  }

  async chooseChoice(choiceId: string): Promise<void> {
    await this.game.log(`You chose:  ${choiceId}`);
    // Handle the chosen choice, update state, log, etc.
    // TODO: Dispatch NgRx action or call facade method to update state for the chosen choice
  }

  async attack(
    target: Character,
    attacker: Character,
    damage: number = 5,
  ): Promise<string> {
    // target.body.hp = Math.max(0, target.body.hp - damage);
    const hp = Number(target.attributes['health'] ?? 0);
    const newHp = Math.max(0, hp - damage);
    await this.game.utils.character.updateCharacterAttributeValue(
      target.id,
      'health',
      newHp,
    );
    const msg = `${attacker.name} attacks ${target.name} for ${damage} damage.`;
    await this.game.log(msg);
    return msg;
  }

  // const item = this.game.items.getItem(itemId);
  async useItem(user: Character, item: Item): Promise<string> {
    // TODO: Modify user based on item.effect
    const msg = `${user.name} uses ${item.name}.`;
    await this.game.log(msg);
    return msg;
  }
}
