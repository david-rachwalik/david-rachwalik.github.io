import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';

import { GameFacade } from './services/game-facade';

@Component({
  standalone: true,
  selector: 'app-rpg-demo',
  templateUrl: './rpg-demo.component.html',
  // styleUrls: ['./rpg-demo.component.css'],
  imports: [CommonModule],
})
export class RpgDemoComponent {
  private router = inject(Router);
  private game = inject(GameFacade);

  // Observable for whether there is a current save slot
  hasCurrentSave$ = this.game.currentSlotId$.pipe(map((id) => !!id));

  async newGame() {
    // // Pass a flag to the play page to trigger new game flow
    // await this.router.navigate(['/demo/rpg/play'], {
    //   queryParams: { new: '1' },
    // });
    await this.router.navigate(['/demo/rpg/new-game']);
  }

  async playGame() {
    await this.router.navigate(['/demo/rpg/play']);
  }

  async dataSlots() {
    await this.router.navigate(['/demo/rpg/data']);
  }

  async openSettings() {
    await this.router.navigate(['/demo/rpg/profile']);
  }
}
