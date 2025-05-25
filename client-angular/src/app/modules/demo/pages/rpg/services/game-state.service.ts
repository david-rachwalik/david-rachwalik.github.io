import { Injectable } from '@angular/core';

import { GameState } from '../models/game-state';

// Handles the in-memory runtime state:
// - Stores character info, preferences, history
// - Updates attributes or logs actions
// - (like the manual equivalent of an NgRx reducer + state)

@Injectable({ providedIn: 'root' })
export class GameStateService {
  private readonly STORAGE_KEY = 'rpg-demo-game-state';
  private state: GameState | undefined = undefined;

  load(): GameState | undefined {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    this.state = raw ? (JSON.parse(raw) as GameState) : undefined;
    return this.state;
  }

  save(state: GameState): void {
    this.state = state;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
  }

  get current(): GameState | undefined {
    return this.state;
  }

  // TODO: determine if this would ever be needed
  reset(): void {
    this.state = undefined;
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
