import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { Adventure, AdventureEvent, AdventureIndex } from '../models/adventure';
import { Character } from '../models/character';
import { AdventureEventActions } from '../store/adventure/adventure-event.actions';
import { AdventureActions } from '../store/adventure/adventure.actions';
import { CharacterActions } from '../store/character/character.actions';
import { idb } from '../store/indexeddb-dexie';

// :: Handles game data backup logic (exports/imports) ::

export interface GameBackup {
  adventure: Adventure;
  adventureIndex: AdventureIndex;
  adventureEvents: AdventureEvent[];
  characters: Character[];
  // items: Item[];
  // eventLogs: GameEvent[];
}

@Injectable({ providedIn: 'root' })
export class GameBackupService {
  constructor(private store: Store) {}

  // Import all data from a JSON file
  async importAll(file: File): Promise<void> {
    console.log('[GameBackupService] importAll called with file:', file);
    const text = await file.text();
    console.log('[GameBackupService] File text loaded:', text.slice(0, 200));
    const backup: GameBackup = JSON.parse(text) as GameBackup;
    console.log('[GameBackupService] Parsed backup:', backup);

    await idb.transaction(
      'rw',
      idb.adventures,
      idb.adventureIndexes,
      idb.adventureEvents,
      idb.characters,
      // idb.items,
      // idb.eventLogs,
      async () => {
        // Optionally: clear existing data before import
        // await idb.adventures.clear();
        // await idb.adventureIndexes.clear();
        // await idb.adventureEvents.clear();
        // await idb.characters.clear();
        // await idb.items.clear();
        // await idb.eventLogs.clear();

        await idb.adventures.put(backup.adventure);
        await idb.adventureIndexes.put(backup.adventureIndex);
        await idb.adventureEvents.bulkPut(backup.adventureEvents || []);
        await idb.characters.bulkPut(backup.characters || []);
        // await idb.items.bulkAdd(backup.items || []);
        // await idb.eventLogs.bulkAdd(backup.eventLogs || []);
        console.log('[GameBackupService] Data imported to IndexedDB');
      },
    );

    // Dispatch NgRx action to ensure the data exists in the store
    this.store.dispatch(
      AdventureActions.loadAdventureSuccess({
        adventure: backup.adventure || [],
      }),
    );
    // this.store.dispatch(
    //   AdventureIndexActions.loadAllAdventureIndexesSuccess({
    //     slots: backup.adventureIndexes || [],
    //   }),
    // );
    this.store.dispatch(
      AdventureEventActions.loadAllAdventureEventsSuccess({
        events: backup.adventureEvents || [],
      }),
    );
    this.store.dispatch(
      CharacterActions.loadAllCharactersSuccess({
        characters: backup.characters || [],
      }),
    );
    // this.store.dispatch(
    //   ItemActions.loadAllItemsSuccess({ items: backup.items || [] }),
    // );
    // If you have an event log feature:
    // this.store.dispatch(EventLogActions.loadEventLogsSuccess({ eventLogs: backup.eventLogs || [] }));

    console.log('[GameBackupService] importAll finished');
  }

  async exportSingle(slotId: string): Promise<void> {
    // Get the adventure for this slot
    const adventure = await idb.adventures.get(slotId);
    if (!adventure) return;

    // Get the adventure index (metadata) for this slot
    const adventureIndex = await idb.adventureIndexes.get(slotId);
    if (!adventureIndex) return;

    // Get all characters and events for this adventure
    const characters = await idb.characters
      .where('adventureId')
      .equals(slotId)
      .toArray();
    const adventureEvents = await idb.adventureEvents
      .where('adventureId')
      .equals(slotId)
      .toArray();

    const backup: GameBackup = {
      adventure,
      adventureIndex,
      adventureEvents,
      characters,
      // items,
      // eventLogs,
    };

    const json = JSON.stringify(backup, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `rpg-${slotId}-${new Date().toISOString().slice(0, 19)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Export all data as a single JSON file
  async exportAll(): Promise<void> {
    const allIndexes = await idb.adventureIndexes.toArray();
    for (const index of allIndexes) {
      await this.exportSingle(index.id);
    }
  }
}

// How to Use in a Component or Facade
// --- Export:
// constructor(private backupService: GameBackupService) {}
// exportGame() {
//   this.backupService.exportAll();
// }

// --- Import:
// onFileSelected(event: Event) {
//     const input = event.target as HTMLInputElement;
//     if (input.files && input.files.length > 0) {
//       this.backupService.importAll(input.files[0]);
//     }
//   }
