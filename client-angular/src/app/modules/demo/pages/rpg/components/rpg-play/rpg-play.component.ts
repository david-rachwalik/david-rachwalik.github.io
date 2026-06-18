import { CommonModule } from '@angular/common';
import { Component, inject, isDevMode, OnDestroy, OnInit } from '@angular/core';
// import { MatDialog } from '@angular/material/dialog';
// import { ActivatedRoute, Router } from '@angular/router';
import { MatTooltip } from '@angular/material/tooltip';
import {
  combineLatest,
  map,
  Observable,
  of,
  shareReplay,
  Subject,
  switchMap,
  tap,
} from 'rxjs';

import { Attribute } from '../../models/attribute';
import { Character, EnemyViewModel } from '../../models/character';
import { MomentChoice } from '../../models/moment';
import { GameFacade } from '../../services/game-facade';
import { debugLogObservable } from '../../utils';
import { RpgCharacterPanelComponent } from './rpg-character-panel.component';

@Component({
  standalone: true,
  selector: 'app-rpg-play',
  imports: [CommonModule, RpgCharacterPanelComponent, MatTooltip],
  templateUrl: './rpg-play.component.html',
  styleUrls: ['./rpg-play.component.css'],
})
export class RpgPlayComponent implements OnInit, OnDestroy {
  // private route = inject(ActivatedRoute);
  // private router = inject(Router);
  private game = inject(GameFacade);
  // private dialog = inject(MatDialog);
  private destroy$ = new Subject<void>();
  // debugMode = false; // (d) Set to true to enable logging
  debugMode = isDevMode(); // Set debugMode based on Angular dev mode

  showMomentDetails = false;
  showPlayerDebug = true;

  // --- Observables ---

  isLoading$ = this.game.isLoading$;
  logEntries$ = this.game.log$;

  attributes$ = this.game.utils.attribute.all$;

  currentSlotId$ = this.game.currentSlotId$;

  playerId$ = this.game.utils.character.playerId$;
  player$ = this.game.utils.character.player$;

  playerStats$ = this.game.utils.character.playerAttributes$;
  // statsArray$ = this.stats$.pipe(map((statsObj) => Object.values(statsObj)));

  // // Use the facade-provided playerStats$ (Record<string, Attribute>) and make it shareReplay
  // stats$: Observable<Record<string, Attribute>> =
  //   this.game.utils.character.playerStats$.pipe(
  //     shareReplay({ bufferSize: 1, refCount: true }),
  //   );
  // // safe array view for templates
  // statsArray$ = this.stats$.pipe(
  //   map((statsObj) => Object.values(statsObj ?? {})),
  // );

  // // Filter out attributes that should not be shown in the stats list (e.g. level/health)
  // private readonly statsExcludedKeys = new Set(['level', 'health']);

  // // safe array view for templates — excludes the configured keys so Level/Health aren't duplicated
  // statsArray$ = this.stats$.pipe(
  //   map((statsObj) =>
  //     Object.entries(statsObj ?? {})
  //       .filter(([key]) => !this.statsExcludedKeys.has(key))
  //       .map(([, stat]) => stat),
  //   ),
  // );

  // safe array view for templates — include only attributes of kind 'stat'
  statsArray$: Observable<Attribute[]> = this.playerStats$.pipe(
    map((statsObj: Record<string, Attribute> | undefined) =>
      Object.values(statsObj ?? {}).filter(
        (s): s is Attribute => !!s && s.kind === 'stat',
      ),
    ),
  );

  level$ = this.game.utils.character.getPlayerAttribute$('level');
  // health$ = this.game.utils.character.playerHealth$;
  health$ = this.game.utils.character.getPlayerAttribute$('health');
  // activeEffects$ = this.game.utils.character.playerActiveEffects$;
  inventory$ = this.game.utils.character.playerInventory$;

  moment$ = this.game.currentMoment$;
  choices$ = this.game.currentMomentChoices$;

  activeChoices$: Observable<MomentChoice[]> = this.choices$.pipe(
    map((choices) =>
      (choices ?? []).map((opt) => ({
        ...opt,
        enabled: opt.enabled !== false, // disabled if explicitly false
      })),
    ),
  );

  // For UI: get all combat characters actively tied to this save slot
  combatCharacters$: Observable<Character[]> =
    this.game.activeMomentCharacters$.pipe(
      tap((chars) => console.log('[Play] active combat characters:', chars)),
      shareReplay({ bufferSize: 1, refCount: true }),
    );

  enemyCharacters$: Observable<EnemyViewModel[]> = combineLatest([
    this.combatCharacters$,
    this.playerId$,
  ]).pipe(
    map(([chars, playerId]) => {
      return chars
        .filter((c) => c.id !== playerId) // exclude player
        .map((enemy) => {
          const currentHealth = Number(
            this.game.utils.attribute.getValue(enemy.attributes, 'health', 0),
          );
          const maxHealth = Number(
            this.game.utils.attribute.getMax(enemy.attributes, 'health', 100),
          );

          const healthPercent =
            maxHealth > 0 ? (currentHealth / maxHealth) * 100 : 0;
          const isLowHealth = currentHealth < 0.3 * maxHealth;

          return {
            ...enemy,
            currentHealth,
            maxHealth,
            healthPercent,
            isLowHealth,
          };
        });
    }),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  // Choose a target from the active combat characters
  targetId$: Observable<string | null> = combineLatest([
    this.combatCharacters$,
    this.playerId$,
  ]).pipe(
    map(([chars, playerId]) => {
      const enemy = chars.find((c) => c.id !== playerId);
      return enemy ? enemy.id : null;
    }),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  targetLevel$: Observable<number | undefined> = this.targetId$.pipe(
    switchMap((id) =>
      id ? this.game.utils.character.byId$(id) : of(undefined),
    ),
    map((c) => this.game.utils.attribute.getValue(c?.attributes, 'level', 1)),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  targetHealth$: Observable<number | undefined> = this.targetId$.pipe(
    switchMap((id) =>
      id ? this.game.utils.character.byId$(id) : of(undefined),
    ),
    map((c) => this.game.utils.attribute.getValue(c?.attributes, 'health', 0)),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  targetHealthMax$: Observable<number | undefined> = this.targetId$.pipe(
    switchMap((id) =>
      id ? this.game.utils.character.byId$(id) : of(undefined),
    ),
    map((c) => this.game.utils.attribute.getMax(c?.attributes, 'health', 100)),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  // --- Methods ---

  async ngOnInit() {
    this.initLoggingSubscriptions();

    // Safely triggers active hydration flow (restores in-memory data if page was refreshed)
    this.game.play();

    // Validate the moment and pessimistically inject characters into the database!
    // (This will automatically wait for the play() effect to populate the store because of
    // its internal `firstValueFrom(this.currentAdventure$.pipe(filter((a) => !!a)))` check!)
    await this.game.isMomentIdValid();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Helper to log observables if debugMode is enabled
  logObservable<T>(label: string, obs: Observable<T>): void {
    debugLogObservable(label, obs, this.destroy$, this.debugMode);
  }

  // --- Actions & Logging ---
  private initLoggingSubscriptions() {
    // console.log('[Play] Loaded player:', this.player);
    // console.log('[Play] Loaded moment:', this.moment);
    // console.log('[Play] Loaded inventory:', this.inventory);

    this.logObservable('[Play] currentSlotId$', this.currentSlotId$);
    this.logObservable('[Play] playerId$', this.playerId$);
    this.logObservable('[Play] player$', this.player$);

    this.logObservable('[Play] player attributes$', this.attributes$);
    this.logObservable('[Play] player stats$', this.playerStats$);
    this.logObservable('[Play] player inventory$', this.inventory$);

    this.logObservable('[Play] moment$', this.moment$);
    this.logObservable('[Play] choices$', this.choices$);
    this.logObservable('[Play] activeChoices$', this.activeChoices$);
    // this.logObservable('[Play] logEntries$', this.logEntries$);

    // For UI: get all combat characters actively tied to this Moment
    this.logObservable('[Play] combatCharacters$', this.combatCharacters$);
    this.logObservable('[Play] enemyCharacters$', this.enemyCharacters$);

    this.logObservable('[Play] targetId$', this.targetId$);
    this.logObservable('[Play] targetLevel$', this.targetLevel$);
    this.logObservable('[Play] targetHealth$', this.targetHealth$);
    this.logObservable('[Play] targetHealthMax$', this.targetHealthMax$);
  }

  toggleMomentDetails() {
    this.showMomentDetails = !this.showMomentDetails;
  }

  copyPlayerJson(player: unknown): void {
    const text = JSON.stringify(player, null, 2);
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
  }

  async resetMoment() {
    await this.game.resetCurrentMoment();
  }

  async testStatChange() {
    console.log('[Play] testStatChange() called');
    await this.game.testStatChange();
  }

  async chooseChoice(choiceLabel: string) {
    await this.game.chooseMomentChoice(choiceLabel);
  }

  async rollNextMoment() {
    const nextMomentId = await this.game.utils.moment.getWeightedNextMomentId();
    if (nextMomentId) {
      await this.game.utils.adventure.setMoment(nextMomentId);
      console.log('[Play] Rolled next moment:', nextMomentId);
    } else {
      console.warn('[Play] No available moments for weighted selection.');
    }
  }
}
