import Dexie, { Table } from 'dexie';

import { Adventure, AdventureEvent, AdventureIndex } from '../models/adventure';
import { Character } from '../models/character';

export class GameDB extends Dexie {
  adventures!: Table<Adventure, string>;
  adventureIndexes!: Table<AdventureIndex, string>;
  adventureEvents!: Table<AdventureEvent, string>;
  characters!: Table<Character, string>;
  // locations!: Table<Location, string>;
  // moments!: Table<Moment, string>;
  // items!: Table<Item, string>;
  // skills!: Table<Skill, string>;
  // eventLogs!: Table<GameEvent, string>;

  constructor() {
    super('RPGGameDB');
    this.version(1).stores({
      // `.id` is composite key (entityId:dimensionId:planeId:adventureId:accountId)
      adventures: 'id',
      adventureIndexes: 'id',
      adventureEvents: 'id, entityId, dimensionId, planeId, adventureId',
      characters: 'id, entityId, dimensionId, planeId, adventureId',
      // TODO: check if below can be removed (using NgRx store instead of indexeddb)
      // locations: 'id, entityId, dimensionId, planeId', // possibly covered by eventLogs
      // moments: 'id, entityId, dimensionId, planeId', // possibly covered by eventLogs
      // items: 'id, entityId, dimensionId, planeId', // possibly covered by eventLogs
      // skills: 'id, entityId, dimensionId, planeId', // possibly covered by eventLogs
      // eventLogs: 'id, adventureId, dimensionId, timestamp',
      // TODO: possibly add features: Relationship, Habit
    });
  }
}

export const idb = new GameDB();
