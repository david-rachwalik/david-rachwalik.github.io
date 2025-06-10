import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { Character } from '../../models/character';
import { Moment, MomentChoice } from '../../models/moment';
import { GameFacade } from '../../services/game-facade';
import { RpgActionService } from '../../services/rpg-action.service';

interface ItemDisplay {
  id: string;
  name: string;
  qty: number;
}

interface StatDef {
  key: string;
  label: string;
}

interface Effect {
  label: string;
  description: string;
}

@Component({
  standalone: true,
  selector: 'app-rpg-play',
  imports: [CommonModule],
  templateUrl: './rpg-play.component.html',
  styleUrls: ['./rpg-play.component.css'],
})
export class RpgPlayComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private game = inject(GameFacade);
  private dialog = inject(MatDialog);
  private actions = inject(RpgActionService);

  isNewGame = false;
  player?: Character;
  inventory: { name: string; qty: number }[] = [];
  moment?: Moment;

  // Define which stats to show in the sidebar
  mainStats: StatDef[] = [
    { key: 'str', label: 'Strength' },
    { key: 'agi', label: 'Agility' },
    { key: 'int', label: 'Intelligence' },
    { key: 'end', label: 'Endurance' },
    // Add more as needed
  ];

  ngOnInit() {
    this.loadCurrentGame();
  }

  private loadCurrentGame() {
    this.game.loadGame();

    this.player = this.game.currentCharacter;
    this.moment = this.game.currentMoment;
    this.inventory = this.getInventory();

    console.log('[Play] Loaded player:', this.player);
    console.log('[Play] Loaded moment:', this.moment);
    console.log('[Play] Loaded inventory:', this.inventory);
  }

  get logEntries$(): Observable<string[]> {
    return this.game.logEntries$;
  }

  // --- ACTIONS ---

  getChoices(): MomentChoice[] {
    return this.actions.getChoices();
  }

  chooseChoice(choiceId: string) {
    this.actions.chooseChoice(choiceId);
  }

  getInventory(): ItemDisplay[] {
    // Example: aggregate inventory items by name and quantity
    const items = this.player?.inventory || [];
    const itemMap = new Map<string, ItemDisplay>();

    items.forEach((id) => {
      // const def = this.game.characters.getItemDef(id);
      const def = this.game.items.getItem(id);
      if (!def) return;
      if (!itemMap.has(id)) {
        itemMap.set(id, { id, name: def.name, qty: 1 });
      } else {
        itemMap.get(id)!.qty += 1;
      }
    });

    return Array.from(itemMap.values());
  }

  getActiveEffects(): Effect[] {
    // Example: convert effects record to array
    if (!this.player?.effects) return [];
    return Object.entries(this.player.effects)
      .filter(([, value]) => value > 0)
      .map(([key, value]) => ({
        label: key,
        description: `Effect ${key} (${value})`, // Replace with real descriptions
      }));
  }
}
