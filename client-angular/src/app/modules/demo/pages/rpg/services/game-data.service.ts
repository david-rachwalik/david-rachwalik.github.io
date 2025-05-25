import { Injectable } from '@angular/core';

import { Attribute } from '../models/attribute';
// import { GameItem, GameLocation, Moment } from '../models';
import { Item } from '../models/item';
import { Location } from '../models/location';
import { Moment } from '../models/moment';

// :: Responsible for where game assets are stored (API, local storage, etc.) ::
// and for their low-level data storage/retrieval (CRUD)
// (think of it as your in-memory "database" or API layer)

@Injectable({ providedIn: 'root' })
export class GameDataService {
  private attributes: Attribute[] = [];

  // 🔸 MOMENTS
  private readonly moments: Record<string, Moment> = {
    'first-steps': {
      id: 'first-steps',
      title: 'Your First Steps',
      description: 'You take your first steps into the unknown.',
      content: '',
      tags: ['intro', 'movement'],
      choices: [
        { id: 'go-north', label: 'Go North' },
        { id: 'stay-put', label: 'Stay Put' },
      ],
    },
    intro: {
      id: 'intro',
      title: 'Act 1',
      description: '',
      content: 'You wake up in a strange place...',
      tags: ['start'],
      choices: [],
    },
    'forest-path': {
      id: 'forest-path',
      title: 'Taking the Path Through the Forest',
      description: '',
      content: 'A narrow path winds through the trees.',
      tags: ['location'],
      choices: [],
    },
    // Add more moments...
  };

  // 🔸 ITEMS
  private readonly items: Record<string, Item> = {
    'healing-potion': {
      id: 'healing-potion',
      name: 'Healing Potion',
      description: 'Restores 20 HP when used.',
      effects: { heal: 20 },
      tags: ['potion', 'consumable'],
    },
    sword: {
      id: 'sword',
      name: 'Iron Sword',
      description: '',
      effects: { damage: 20 },
      tags: ['potion', 'consumable'],
    },
  };

  // 🔸 LOCATIONS
  private readonly locations: Record<string, Location> = {
    'village-square': {
      id: 'village-square',
      name: 'Village Square',
      description: 'A peaceful central hub with friendly townsfolk.',
      tags: ['safe-zone', 'town'],
    },
    'peaceful-village': {
      id: 'peaceful-village',
      name: 'Peaceful Village',
      description: 'A quiet town at the edge of the forest.',
      tags: ['safe-zone', 'town'],
    },
    cave: {
      id: 'cave',
      name: 'Dark Cave',
      description: 'You sense danger within.',
      tags: [],
    },
  };

  // 🔹 Accessors
  getMoment(id: string): Moment | undefined {
    return this.moments[id];
  }

  getItem(id: string): Item | undefined {
    return this.items[id];
  }

  getLocation(id: string): Location | undefined {
    return this.locations[id];
  }

  getAllMoments(): Moment[] {
    return Object.values(this.moments);
  }

  getAllItems(): Item[] {
    return Object.values(this.items);
  }

  getAllLocations(): Location[] {
    return Object.values(this.locations);
  }

  // --- Attributes ---
  getAllAttributes(): Attribute[] {
    return [...this.attributes];
  }

  addAttribute(attr: Attribute): void {
    this.attributes.push(attr);
  }

  updateAttribute(id: string, changes: Partial<Attribute>): void {
    const idx = this.attributes.findIndex((a) => a.id === id);
    if (idx >= 0) {
      this.attributes[idx] = { ...this.attributes[idx], ...changes };
    }
  }

  removeAttribute(id: string): void {
    this.attributes = this.attributes.filter((a) => a.id !== id);
  }
}
