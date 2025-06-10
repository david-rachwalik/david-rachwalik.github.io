import { Injectable } from '@angular/core';

import { Character } from '../models/character';
import { Item } from '../models/item';
import { MomentChoice } from '../models/moment';
import { GameFacade } from './game-facade';

@Injectable({ providedIn: 'root' })
export class RpgActionService {
  constructor(private game: GameFacade) {}

  // Get choices for the current moment
  getChoices(): MomentChoice[] {
    const moment = this.game.currentMoment;
    if (!moment?.choices) return [];
    return moment.choices.map((opt) => ({
      id: opt.id,
      label: opt.label,
      enabled: opt.enabled !== false, // enabled by default
    })) as MomentChoice[];
  }

  chooseChoice(choiceId: string) {
    this.game.log(`You chose:  ${choiceId}`);
    // Handle the chosen choice, update state, log, etc.
  }

  attack(target: Character, attacker: Character, damage: number = 5): string {
    // target.body.hp = Math.max(0, target.body.hp - damage);
    const hp = Number(target.attributes['health'] ?? 0);
    const newHp = Math.max(0, hp - damage);
    this.game.characters.updateCharacterAttributeValue(
      target.id,
      'health',
      newHp,
    );
    const msg = `${attacker.name} attacks ${target.name} for ${damage} damage.`;
    this.game.log(msg);
    return msg;
  }

  // const item = this.game.items.getItem(itemId);
  useItem(user: Character, item: Item): string {
    // TODO: Modify user based on item.effect
    const msg = `${user.name} uses ${item.name}.`;
    this.game.log(msg);
    return msg;
  }
}
