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
  character = this.game.currentCharacter;
  attributeKeys = this.game.characters.listDisplayAttributeKeys(this.character);

  // inventory = this.game.characters.inventory;
  // inventory = this.game.currentCharacter?.inventory;
  inventoryIds = this.character?.inventory ?? [];
  inventory = this.game.items.getDisplayList(this.inventoryIds);
}
