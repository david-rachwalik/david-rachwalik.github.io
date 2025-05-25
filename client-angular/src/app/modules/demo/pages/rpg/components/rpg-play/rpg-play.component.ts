import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Character } from '../../models/character';
import { Moment, MomentChoice } from '../../models/moment';
import { GameFacade } from '../../services/game-facade';

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

  isNewGame = false;
  character!: Character;
  inventory: { name: string; qty: number }[] = [];
  moment!: Moment;
  eventLog: string[] = [];

  // Define which stats to show in the sidebar
  mainStats: StatDef[] = [
    { key: 'str', label: 'Strength' },
    { key: 'agi', label: 'Agility' },
    { key: 'int', label: 'Intelligence' },
    { key: 'end', label: 'Endurance' },
    // Add more as needed
  ];

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.isNewGame = params['new'] === '1';
      if (this.isNewGame) {
        // Show new game scenario/choices
      } else {
        // Normal play flow
      }
    });
    // Load the current character, moment, and inventory
    this.character = this.game.characters.currentCharacter!;
    // this.moment = this.game.state?.currentMoment!;
    this.moment = this.game.currentMoment!;
    this.inventory = this.getInventory();
    this.eventLog = this.getEventLog();
  }

  // async confirmNewGame(choices: MomentChoice[]) {
  async confirmNewGame() {
    // Create the new save here, then start the game
    // this.saveService.save(...);
    await this.router.navigate([], { queryParams: {} }); // Remove 'new' param
    // Continue to first moment
  }

  getInventory(): ItemDisplay[] {
    // Example: aggregate inventory items by name and quantity
    const items = this.character.inventory || [];
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
    if (!this.character.effects) return [];
    return Object.entries(this.character.effects)
      .filter(([, value]) => value > 0)
      .map(([key, value]) => ({
        label: key,
        description: `Effect ${key} (${value})`, // Replace with real descriptions
      }));
  }

  getChoices(): MomentChoice[] {
    // Example: get choices for the current moment
    if (!this.moment?.choices) return [];
    return this.moment.choices.map((opt) => ({
      id: opt.id,
      label: opt.label,
      enabled: opt.enabled !== false, // enabled by default
    }));
  }

  chooseChoice(choiceId: string) {
    // Handle the chosen choice, update state, log, etc.
    this.eventLog.unshift(`You chose: ${choiceId}`);
    // Example: update moment, character, etc.
    // this.game.handleChoice(choiceId);
    // this.moment = this.game.state?.currentMoment!;
    // this.character = this.game.characters.currentCharacter!;
    // this.inventory = this.getInventory();
  }

  getEventLog(): string[] {
    // Example: fetch from state or service
    return this.game.state?.eventLog ?? [];
  }
}
