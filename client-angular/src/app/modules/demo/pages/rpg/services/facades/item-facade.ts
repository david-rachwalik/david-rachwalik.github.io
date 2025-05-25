import { Injectable } from '@angular/core';

import { Item } from '../../models/item';
import { GameDataService } from '../game-data.service';

@Injectable({ providedIn: 'root' })
export class ItemFacade {
  constructor(private dataService: GameDataService) {}

  // Get all items
  get all(): Item[] {
    return this.dataService.getAllItems();
  }

  // Get a single item by ID
  getItem(id: string): Item | undefined {
    return this.dataService.getItem(id);
  }

  // TODO: implement later with `.tags` filtered
  // Filter items by type, rarity, etc. (example)
  // getItemsByType(type: string): Item[] {
  //   return this.all.filter((item) => item.type === type);
  // }
}
