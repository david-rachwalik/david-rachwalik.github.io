import { Injectable } from '@angular/core';
import { map } from 'rxjs';

import { GameStateService } from './game-state.service';

@Injectable({ providedIn: 'root' })
export class RpgLogService {
  private readonly MAX_LOG_ENTRIES = 100;

  constructor(private gameState: GameStateService) {}

  /** Add a new log entry (appears at the top) */
  add(message: string): void {
    const state = this.gameState.current;
    if (!state) return;
    const eventLog = [message, ...(state.eventLog ?? [])].slice(
      0,
      this.MAX_LOG_ENTRIES,
    );
    this.gameState.set({ ...state, eventLog });
  }

  /** Observable for log entries */
  get entries$() {
    return this.gameState.state$.pipe(map((state) => state?.eventLog ?? []));
  }

  /** Get current log as array */
  get entries(): string[] {
    return this.gameState.current?.eventLog ?? [];
  }

  /** Clear the log */
  clear(): void {
    const state = this.gameState.current;
    if (!state) return;
    this.gameState.set({ ...state, eventLog: [] });
  }
}
