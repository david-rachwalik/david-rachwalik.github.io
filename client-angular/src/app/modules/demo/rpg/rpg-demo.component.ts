import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { map, of } from 'rxjs';

import { GameFacade } from './services/game-facade';

@Component({
  selector: 'app-rpg-demo',
  templateUrl: './rpg-demo.component.html',
  // styleUrl: './rpg-demo.component.scss',
  imports: [CommonModule],
})
export class RpgDemoComponent {
  private router = inject(Router);
  private game = inject(GameFacade);

  // Observable for whether there is a current save slot
  hasCurrentSave$ = this.game.currentSlotId$.pipe(map((id) => !!id));

  // TODO: Wire this to actual User Profile / Account state
  isModerator$ = of(true);

  async newGame() {
    await this.router.navigate(['/demo/rpg/new-game']);
  }

  async playGame() {
    await this.router.navigate(['/demo/rpg/play']);
  }

  async dataSlots() {
    await this.router.navigate(['/demo/rpg/data']);
  }

  async info() {
    await this.router.navigate(['/demo/rpg/info']);
  }

  async admin() {
    await this.router.navigate(['/demo/rpg/admin']);
  }

  async openSettings() {
    await this.router.navigate(['/demo/rpg/profile']);
  }
}
