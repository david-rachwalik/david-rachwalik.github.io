import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { GameState } from '../models/game-state';

// Handles the in-memory runtime state:
// - Stores character info, preferences, history
// - Updates attributes or logs actions
// - (like the manual equivalent of an NgRx reducer + state)

// Manages the current state of the game (player progress, inventory, choices, etc.),
// which is dynamic and changes as the game is played

// Useful to keep the "state container" logic (like a Redux store) isolated from
// business logic and orchestration
// Enables swapping out the state management layer (e.g. NgRx) without touching facade or UI code

@Injectable({ providedIn: 'root' })
export class GameStateService {
  private stateSubject = new BehaviorSubject<GameState | undefined>(undefined);
  state$ = this.stateSubject.asObservable();

  get current(): GameState | undefined {
    return this.stateSubject.value;
  }

  /** Set or replace the current game state */
  set(state: GameState): void {
    this.stateSubject.next(state);
  }
}
