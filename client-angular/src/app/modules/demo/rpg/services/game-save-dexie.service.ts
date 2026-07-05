import { Injectable } from '@angular/core';

import { Adventure, AdventureEvent, AdventureIndex } from '../models/adventure';
import { Character } from '../models/character';
import { Item } from '../models/item';
import { Location } from '../models/location';
import { Moment } from '../models/moment';
import { Skill } from '../models/skill';
import { idb } from '../store/indexeddb-dexie';

// Controls CRUD interactions for IndexedDB (asynchronous)

export interface GameSaveBatchPayload {
  adventure?: Adventure;
  adventureIndex?: AdventureIndex; // Always good to save the metadata alongside it
  adventureEvents?: AdventureEvent[];
  characters?: Character[];
}

@Injectable({ providedIn: 'root' })
export class GameSaveDexieService {
  // #region 🔸 Active Playthrough Instances 🔸

  // Adventure CRUD
  async saveAdventure(adventure: Adventure): Promise<void> {
    await idb.adventures.put(adventure);
  }
  async loadAllAdventures(): Promise<Adventure[]> {
    return idb.adventures.toArray();
  }
  async loadAdventure(id: string): Promise<Adventure | undefined> {
    return idb.adventures.get(id);
  }
  async deleteAdventure(id: string): Promise<void> {
    await idb.adventures.delete(id);
  }

  // AdventureIndex CRUD
  async saveAdventureIndex(index: AdventureIndex): Promise<void> {
    await idb.adventureIndexes.put(index);
  }
  async loadAllAdventureIndexes(): Promise<AdventureIndex[]> {
    return idb.adventureIndexes.toArray();
  }
  async loadAdventureIndex(id: string): Promise<AdventureIndex | undefined> {
    return idb.adventureIndexes.get(id);
  }
  async deleteAdventureIndex(id: string): Promise<void> {
    await idb.adventureIndexes.delete(id);
  }

  // AdventureEvent CRUD
  async saveAdventureEvent(event: AdventureEvent): Promise<void> {
    await idb.adventureEvents.put(event);
  }
  async loadAllAdventureEvents(
    adventureId?: string,
  ): Promise<AdventureEvent[]> {
    if (adventureId)
      return idb.adventureEvents
        .where('adventureId')
        .equals(adventureId)
        .toArray();
    return idb.adventureEvents.toArray();
  }
  async loadAdventureEvent(id: string): Promise<AdventureEvent | undefined> {
    return idb.adventureEvents.get(id);
  }
  async deleteAdventureEvent(id: string): Promise<void> {
    await idb.adventureEvents.delete(id);
  }
  async deleteAllAdventureEvents(adventureId: string): Promise<void> {
    await idb.adventureEvents.where('adventureId').equals(adventureId).delete();
  }

  // Character CRUD
  async saveCharacter(character: Character): Promise<void> {
    await idb.characters.put(character);
  }
  async saveAllCharacters(characters: Character[]): Promise<void> {
    await idb.characters.bulkPut(characters);
  }
  // adventureId optional, returning specific slice or full table
  async loadAllCharacters(adventureId?: string): Promise<Character[]> {
    if (adventureId)
      return idb.characters.where('adventureId').equals(adventureId).toArray();
    return idb.characters.toArray();
  }
  async loadCharacter(id: string): Promise<Character | undefined> {
    return idb.characters.get(id);
  }
  async deleteCharacter(id: string): Promise<void> {
    await idb.characters.delete(id);
  }
  async deleteAllCharacters(adventureId: string): Promise<void> {
    await idb.characters.where('adventureId').equals(adventureId).delete();
  }
  // #endregion

  // #region 🔸 Global Content Templates 🔸

  // Location CRUD
  async saveLocation(location: Location): Promise<void> {
    await idb.locations.put(location);
  }
  async loadAllLocations(): Promise<Location[]> {
    return idb.locations.toArray();
  }
  async loadLocation(id: string): Promise<Location | undefined> {
    return idb.locations.get(id);
  }
  async deleteLocation(id: string): Promise<void> {
    await idb.locations.delete(id);
  }

  // Moment CRUD
  async saveMoment(moment: Moment): Promise<void> {
    await idb.moments.put(moment);
  }
  async loadAllMoments(): Promise<Moment[]> {
    return idb.moments.toArray();
  }
  async loadMoment(id: string): Promise<Moment | undefined> {
    return idb.moments.get(id);
  }
  async deleteMoment(id: string): Promise<void> {
    await idb.moments.delete(id);
  }

  // Item CRUD
  async saveItem(item: Item): Promise<void> {
    await idb.items.put(item);
  }
  async loadAllItems(): Promise<Item[]> {
    return idb.items.toArray();
  }
  async loadItem(id: string): Promise<Item | undefined> {
    return idb.items.get(id);
  }
  async deleteItem(id: string): Promise<void> {
    await idb.items.delete(id);
  }

  // Skill CRUD
  async saveSkill(skill: Skill): Promise<void> {
    await idb.skills.put(skill);
  }
  async loadAllSkills(): Promise<Skill[]> {
    return idb.skills.toArray();
  }
  async loadSkill(id: string): Promise<Skill | undefined> {
    return idb.skills.get(id);
  }
  async deleteSkill(id: string): Promise<void> {
    await idb.skills.delete(id);
  }
  // #endregion

  // // EventLog CRUD
  // async saveEventLog(event: GameEvent): Promise<void> {
  //   await idb.eventLogs.put(event);
  // }
  // async loadAllEventLogs(): Promise<GameEvent[]> {
  //   return idb.eventLogs.toArray();
  // }
  // async loadEventLog(id: string): Promise<GameEvent | undefined> {
  //   return idb.eventLogs.get(id);
  // }
  // async deleteEventLog(id: string): Promise<void> {
  //   await idb.eventLogs.delete(id);
  // }

  // #region 🔸 Dynamic Batch Transaction for Active Playthroughs 🔸
  async saveBatch(payload: GameSaveBatchPayload): Promise<void> {
    if (Object.keys(payload).length === 0) return;

    // Only lock the tables that belong to the mutable save state
    const tables = [
      idb.adventures,
      idb.adventureIndexes,
      idb.adventureEvents,
      idb.characters,
    ];

    await idb.transaction('rw', tables, async () => {
      if (payload.adventure) {
        await idb.adventures.put(payload.adventure);
      }
      if (payload.adventureIndex) {
        await idb.adventureIndexes.put(payload.adventureIndex);
      }
      if (payload.adventureEvents?.length) {
        await idb.adventureEvents.bulkPut(payload.adventureEvents);
      }
      if (payload.characters?.length) {
        await idb.characters.bulkPut(payload.characters);
      }
    });
  }
  // #endregion
} // End of GameSaveDexieService
