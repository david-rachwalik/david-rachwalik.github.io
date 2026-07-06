import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { GameFacade } from '../../services/game-facade';

@Component({
  selector: 'app-rpg-profile',
  imports: [CommonModule],
  templateUrl: './rpg-profile.component.html',
  styleUrl: './rpg-profile.component.scss',
})
export class RpgProfileComponent {
  private game = inject(GameFacade);

  player$ = this.game.utils.character.player$;
  // health$ = this.game.utils.character.playerHealth$;
  health$ = this.game.utils.character.getPlayerAttribute$('health');
  // attributeKeys$ = this.game.utils.character.playerAttributes$;
  attributeKeys$ = this.game.utils.character.playerAttributesExcluding$([
    'health',
    'level',
  ]);
  inventory$ = this.game.utils.character.playerInventory$;
}
