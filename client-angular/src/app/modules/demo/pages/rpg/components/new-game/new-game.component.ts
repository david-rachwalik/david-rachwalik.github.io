import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { GameFacade } from '../../services/game-facade';

@Component({
  standalone: true,
  selector: 'app-new-game',
  imports: [CommonModule, FormsModule],
  templateUrl: './new-game.component.html',
  // styleUrls: ['./new-game.component.css'],
})
export class NewGameComponent {
  label = '';
  characterName = '';

  private router = inject(Router);
  private game = inject(GameFacade);

  async startGame() {
    if (!this.label.trim() || !this.characterName.trim()) return;
    console.log('[NewGame] User input:', {
      label: this.label,
      characterName: this.characterName,
    });

    // Create and save the new game (also sets the current slot)
    console.log('[NewGame] Calling game.newGame()...');
    this.game.newGame(this.label, this.characterName);

    // Inspect the new state / save slot
    const { state } = this.game;
    console.log('[NewGame] New game state:', state);

    // Navigate to Play page (no query params needed)
    await this.router.navigate(['/demo/rpg/play']);
  }

  async cancel() {
    // Go back to RPG Demo landing page
    await this.router.navigate(['/demo/rpg']);
  }
}
