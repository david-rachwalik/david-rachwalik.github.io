import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
// import { MatDialog } from '@angular/material/dialog';
// import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { GameFacade } from '../../services/game-facade';
import { RpgActionService } from '../../services/rpg-action.service';

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
  // private route = inject(ActivatedRoute);
  // private router = inject(Router);
  private game = inject(GameFacade);
  // private dialog = inject(MatDialog);
  private actions = inject(RpgActionService);

  // Define which stats to show in the sidebar
  mainStats: StatDef[] = [
    { key: 'str', label: 'Strength' },
    { key: 'agi', label: 'Agility' },
    { key: 'int', label: 'Intelligence' },
    { key: 'end', label: 'Endurance' },
    // Add more as needed
  ];

  // --- Observables ---

  // attributes$ = this.game.data.attributes$;
  attributes$ = this.game.attributes$;

  currentSlotId$ = this.game.currentSlotId$;

  player$ = this.game.player$;
  stats$ = this.game.playerStats$;
  health$ = this.game.playerHealth$;
  activeEffects$ = this.game.playerActiveEffects$;
  inventory$ = this.game.playerInventory$;

  // moment$ = this.game.currentMoment$;
  moment$ = this.game.moment$;
  choices$ = this.actions.getChoices();

  // --- Methods ---

  ngOnInit() {
    // this.game.loadGame();
    this.game.currentSlotId$.subscribe((slotId) => {
      if (slotId) {
        this.game.loadAdventure(slotId);
      }
    });
    // console.log('[Play] Loaded player:', this.player);
    // console.log('[Play] Loaded moment:', this.moment);
    // console.log('[Play] Loaded inventory:', this.inventory);

    this.currentSlotId$.subscribe((val) =>
      console.log('[Play] currentSlotId$', val),
    );

    this.player$.subscribe((val) => console.log('[Play] player$', val));
    this.attributes$.subscribe((val) => console.log('[Play] attributes$', val));
    this.stats$.subscribe((val) => console.log('[Play] stats$', val));
    this.inventory$.subscribe((val) => console.log('[Play] inventory$', val));
    this.moment$.subscribe((val) => console.log('[Play] moment$', val));
    this.logEntries$.subscribe((val) => console.log('[Play] logEntries$', val));
  }

  get logEntries$(): Observable<string[]> {
    return this.game.logEntries$;
  }

  async testStatChange() {
    console.log('[Play] testStatChange() called');
    await this.game.testStatChange();
  }

  async chooseChoice(choiceId: string) {
    await this.actions.chooseChoice(choiceId);
  }
}
