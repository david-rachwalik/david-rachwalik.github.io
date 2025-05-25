import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { GameStateService } from '../../services/game-state.service';

@Component({
  standalone: true,
  selector: 'app-rpg-profile',
  imports: [CommonModule],
  template: `
    <h2>Character Profile</h2>
    <div *ngIf="character">
      <p>Name: {{ character.name }}</p>
      <p>Health: {{ character.attributes['health'] }}</p>
      <!-- Add more stats/inventory display here -->
    </div>
  `,
})
export class RpgProfileComponent {
  private state = inject(GameStateService);
  character = this.state.current?.characters[0];
}
