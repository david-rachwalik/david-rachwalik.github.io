// src/app/services/action.service.ts
import { Injectable } from '@angular/core';
import { Character } from '../models/character';
import { Item } from '../models/item';

@Injectable({ providedIn: 'root' })
export class ActionService {
  attack(target: Character, attacker: Character): string {
    const damage = 5; // placeholder logic
    target.body.hp = Math.max(0, target.body.hp - damage);
    return `${attacker.name} attacks ${target.name} for ${damage} damage.`;
  }

  useItem(user: Character, item: Item): string {
    // Modify user based on item.effect
    return `${user.name} uses ${item.name}.`;
  }
}
