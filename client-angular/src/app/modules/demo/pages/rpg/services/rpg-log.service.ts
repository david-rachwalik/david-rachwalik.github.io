import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { firstValueFrom } from 'rxjs';

import { AdventureActions } from '../store/adventure/adventure.actions';
import {
  selectCurrentAdventure,
  selectCurrentLogEntries,
} from '../store/app.selectors';

@Injectable({ providedIn: 'root' })
export class RpgLogService {
  constructor(private store: Store) {}

  // Observable for log entries
  entries$ = this.store.select(selectCurrentLogEntries);

  // Add a new log entry (appears at the top)
  async add(message: string): Promise<void> {
    const adventure = await firstValueFrom(
      this.store.select(selectCurrentAdventure),
    );
    if (!adventure) return;
    this.store.dispatch(
      AdventureActions.addLogEntry({ slotId: adventure.id, message }),
    );
  }

  // Clear the log
  async clear(): Promise<void> {
    const adventure = await firstValueFrom(
      this.store.select(selectCurrentAdventure),
    );
    if (!adventure) return;
    this.store.dispatch(AdventureActions.clearLog({ slotId: adventure.id }));
  }
}
