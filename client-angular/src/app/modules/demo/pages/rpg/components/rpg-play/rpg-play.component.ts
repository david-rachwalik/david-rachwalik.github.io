import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, map, Observable } from 'rxjs';

import { Attribute } from '../../models/attribute';
import { Character } from '../../models/character';
import { Moment, MomentChoice } from '../../models/moment';
import { GameFacade } from '../../services/game-facade';
import { RpgActionService } from '../../services/rpg-action.service';

interface ItemSlotViewModel {
  id: string;
  name: string;
  qty: number;
}

interface StatDef {
  key: string;
  label: string;
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

  // Observables
  player$ = this.game.currentCharacter$;
  attributes$ = this.game.data.attributes$;

  // Observable for HP (health)
  health$ = combineLatest([this.player$, this.attributes$]).pipe(
    map(
      ([player, attrsDict]: [
        Character | undefined,
        Record<string, Attribute>,
      ]) => {
        if (!player) return null;
        const attrs = Object.values(attrsDict); // Convert to array
        const healthAttr = attrs.find((a) => a.id === 'health');
        const value = Number(
          player.attributes['health'] ?? healthAttr?.defaultValue ?? 0,
        );
        const max =
          typeof healthAttr?.max === 'number' ? healthAttr.max : undefined;
        return { value, max };
      },
    ),
  );

  // Observable for sidebar stats (excluding health/level)
  stats$ = combineLatest([this.player$, this.attributes$]).pipe(
    map(
      ([player, attrsDict]: [
        Character | undefined,
        Record<string, Attribute>,
      ]) => {
        if (!player) return [];
        const attrs = Object.values(attrsDict); // Convert to array
        return attrs
          .filter(
            (attr) =>
              attr.type === 'stat' &&
              attr.id !== 'health' &&
              attr.id !== 'level',
          )
          .map((attr) => ({
            id: attr.id,
            name: attr.name,
            value: Number(player.attributes[attr.id] ?? attr.defaultValue ?? 0),
            max: typeof attr.max === 'number' ? attr.max : undefined,
            description: attr.description,
          }));
      },
    ),
  );

  // Inventory as observable
  inventory$ = this.player$.pipe(
    map((player) => {
      if (!player) return [];
      const items = player.inventory || [];
      const itemMap = new Map<string, ItemSlotViewModel>();
      items.forEach((id) => {
        const def = this.game.items.getItem(id);
        if (!def) return;
        if (!itemMap.has(id)) {
          itemMap.set(id, { id, name: def.name, qty: 1 });
        } else {
          itemMap.get(id)!.qty += 1;
        }
      });
      return Array.from(itemMap.values());
    }),
  );

  // Active effects as observable
  activeEffects$ = this.player$.pipe(
    map((player) => {
      if (!player?.effects) return [];
      return Object.entries(player.effects)
        .filter(([, value]) => value > 0)
        .map(([key, value]) => ({
          label: key,
          description: `Effect ${key} (${value})`, // Replace with real descriptions
        }));
    }),
  );

  isNewGame = false;
  // player?: Character;
  // inventory: { name: string; qty: number }[] = [];
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

    // this.player = this.game.currentCharacter;
    // this.moment = this.game.currentMoment;
    // this.inventory = this.getInventory();

    // console.log('[Play] Loaded player:', this.player);
    // console.log('[Play] Loaded moment:', this.moment);
    // console.log('[Play] Loaded inventory:', this.inventory);
  }

  get logEntries$(): Observable<string[]> {
    return this.game.logEntries$;
  }

  // --- ACTIONS ---

  // Demo/test: simulate stat changes
  // testStatChange() {
  //   if (!this.player) return;
  //   // Example: +1 str, +5 hp (capped at maxHp)
  //   const attrs = { ...this.player.attributes };
  //   attrs['str'] = Number(attrs['str'] || 0) + 1;
  //   const maxHp = Number(attrs['maxHp']) || 20;
  //   attrs['hp'] = Math.min(Number(attrs['hp'] || 0) + 5, maxHp);
  //   // Save back to game state (using your facade/service)
  //   this.game.characters.updateCharacterAttributeValue(
  //     this.player.id,
  //     'str',
  //     attrs['str'],
  //   );
  //   this.game.characters.updateCharacterAttributeValue(
  //     this.player.id,
  //     'hp',
  //     attrs['hp'],
  //   );
  //   // Reload player to reflect changes
  //   this.player = this.game.currentCharacter;
  // }
  testStatChange() {
    console.log('[Play] testStatChange() called');
    this.game.testStatChange();
  }

  getChoices(): MomentChoice[] {
    return this.actions.getChoices();
  }

  chooseChoice(choiceId: string) {
    this.actions.chooseChoice(choiceId);
  }

  // getInventory(): ItemSlotViewModel[] {
  //   // Example: aggregate inventory items by name and quantity
  //   const items = this.player?.inventory || [];
  //   const itemMap = new Map<string, ItemSlotViewModel>();

  //   items.forEach((id) => {
  //     // const def = this.game.characters.getItemDef(id);
  //     const def = this.game.items.getItem(id);
  //     if (!def) return;
  //     if (!itemMap.has(id)) {
  //       itemMap.set(id, { id, name: def.name, qty: 1 });
  //     } else {
  //       itemMap.get(id)!.qty += 1;
  //     }
  //   });

  //   return Array.from(itemMap.values());
  // }

  // getActiveEffects(): Effect[] {
  //   // Example: convert effects record to array
  //   if (!this.player?.effects) return [];
  //   return Object.entries(this.player.effects)
  //     .filter(([, value]) => value > 0)
  //     .map(([key, value]) => ({
  //       label: key,
  //       description: `Effect ${key} (${value})`, // Replace with real descriptions
  //     }));
  // }
}
