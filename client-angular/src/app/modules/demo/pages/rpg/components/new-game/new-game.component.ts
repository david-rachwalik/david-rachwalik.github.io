import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  inputLimit = 24;
  label = '';
  characterName = '';
  isCreating = false;

  private router = inject(Router);
  private game = inject(GameFacade);
  private snackBar = inject(MatSnackBar);

  async startGame() {
    if (!this.label.trim() || !this.characterName.trim()) {
      this.snackBar.open(
        'Please enter both a save name and character name.',
        'Dismiss',
        {
          duration: 3000,
        },
      );
      return;
    }

    this.isCreating = true;

    try {
      console.log('[NewGame] User input:', {
        label: this.label,
        characterName: this.characterName,
      });

      const adventure = await this.game.utils.adventure.createNewGame(
        this.label,
        this.characterName,
      );
      console.log('[NewGame] Created adventure:', adventure.id);

      this.snackBar.open('Adventure created!  Loading...', 'Dismiss', {
        duration: 2000,
      });

      // Navigate to Play page
      await this.router.navigate(['/demo/rpg/play']);
    } catch (error) {
      console.error('[NewGame] Creation failed:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      this.snackBar.open(
        `Failed to create adventure: ${errorMessage}`,
        'Dismiss',
        {
          duration: 5000,
        },
      );
    } finally {
      this.isCreating = false;
    }
  }

  async cancel() {
    // Go back to RPG Demo landing page
    await this.router.navigate(['/demo/rpg']);
  }
}
