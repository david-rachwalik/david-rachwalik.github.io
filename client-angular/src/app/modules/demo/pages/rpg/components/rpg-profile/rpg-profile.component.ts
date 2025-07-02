import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { GameFacade } from '../../services/game-facade';

@Component({
  standalone: true,
  selector: 'app-rpg-profile',
  imports: [CommonModule],
  templateUrl: './rpg-profile.component.html',
  styleUrls: ['./rpg-profile.component.css'],
})
export class RpgProfileComponent {
  private game = inject(GameFacade);

  player$ = this.game.player$;
  health$ = this.game.playerHealth$;
  attributeKeys$ = this.game.playerAttributes$;
  inventory$ = this.game.playerInventory$;
}
