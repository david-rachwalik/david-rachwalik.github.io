import { Injectable } from '@angular/core';

import { Adventure, AdventureEvent, AdventureIndex } from '../models/adventure';
import { Character } from '../models/character';
import { idb } from '../store/indexeddb-dexie';

// Controls CRUD interactions for IndexedDB

@Injectable({ providedIn: 'root' })
export class GameSaveDexieService {
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
  async loadAllAdventureEvents(): Promise<AdventureEvent[]> {
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
  async loadAllCharacters(): Promise<Character[]> {
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

  // // Location CRUD
  // async saveLocation(location: Location): Promise<void> {
  //   await idb.locations.put(location);
  // }
  // async loadAllLocations(): Promise<Location[]> {
  //   return idb.locations.toArray();
  // }
  // async loadLocation(id: string): Promise<Location | undefined> {
  //   return idb.locations.get(id);
  // }
  // async deleteLocation(id: string): Promise<void> {
  //   await idb.locations.delete(id);
  // }

  // // Moment CRUD
  // async saveMoment(moment: Moment): Promise<void> {
  //   await idb.moments.put(moment);
  // }
  // async loadAllMoments(): Promise<Moment[]> {
  //   return idb.moments.toArray();
  // }
  // async loadMoment(id: string): Promise<Moment | undefined> {
  //   return idb.moments.get(id);
  // }
  // async deleteMoment(id: string): Promise<void> {
  //   await idb.moments.delete(id);
  // }

  // // Item CRUD
  // async saveItem(item: Item): Promise<void> {
  //   await idb.items.put(item);
  // }
  // async loadAllItems(): Promise<Item[]> {
  //   return idb.items.toArray();
  // }
  // async loadItem(id: string): Promise<Item | undefined> {
  //   return idb.items.get(id);
  // }
  // async deleteItem(id: string): Promise<void> {
  //   await idb.items.delete(id);
  // }

  // // Skill CRUD
  // async saveSkill(skill: Skill): Promise<void> {
  //   await idb.skills.put(skill);
  // }
  // async loadAllSkills(): Promise<Skill[]> {
  //   return idb.skills.toArray();
  // }
  // async loadSkill(id: string): Promise<Skill | undefined> {
  //   return idb.skills.get(id);
  // }
  // async deleteSkill(id: string): Promise<void> {
  //   await idb.skills.delete(id);
  // }

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
}
