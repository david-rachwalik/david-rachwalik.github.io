import Dexie, { Table } from 'dexie';

import { Adventure, AdventureEvent, AdventureIndex } from '../models/adventure';
import { Character } from '../models/character';
import { GameEvent } from '../models/game-event';
import { Item } from '../models/item';
import { Location } from '../models/location';
import { Moment } from '../models/moment';
import { Skill } from '../models/skill';

export class GameDB extends Dexie {
  adventures!: Table<Adventure, string>;
  adventureIndexes!: Table<AdventureIndex, string>;
  adventureEvents!: Table<AdventureEvent, string>;
  characters!: Table<Character, string>;
  locations!: Table<Location, string>;
  moments!: Table<Moment, string>;
  items!: Table<Item, string>;
  skills!: Table<Skill, string>;
  eventLogs!: Table<GameEvent, string>;

  constructor() {
    super('RPGGameDB');
    this.version(1).stores({
      // `.id` is composite key (entityId:dimensionId:planeId:adventureId:accountId)
      adventures: 'id',
      adventureIndexes: 'id',
      adventureEvents: 'id, entityId, dimensionId, planeId, adventureId',
      characters: 'id, entityId, dimensionId, planeId, adventureId',
      // Custom Templates: required for persisting static assets locally
      locations: 'id, entityId, dimensionId, planeId',
      moments: 'id, entityId, dimensionId, planeId',
      items: 'id, entityId, dimensionId, planeId',
      skills: 'id, entityId, dimensionId, planeId',
      // TODO: will likely remove below if eventLogs are replaced by adventureEvents
      eventLogs: 'id, adventureId, dimensionId, timestamp',
      // TODO: possibly add features: Relationship, Habit
    });
  }
}

export const idb = new GameDB();
