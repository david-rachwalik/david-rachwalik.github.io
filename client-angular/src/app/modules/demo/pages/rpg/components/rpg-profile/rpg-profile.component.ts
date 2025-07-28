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

  player$ = this.game.utils.character.player$;
  health$ = this.game.utils.character.playerHealth$;
  attributeKeys$ = this.game.utils.character.playerAttributes$;
  inventory$ = this.game.utils.character.playerInventory$;
}
