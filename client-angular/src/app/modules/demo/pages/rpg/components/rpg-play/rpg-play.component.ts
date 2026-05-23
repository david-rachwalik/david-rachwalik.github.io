import { CommonModule } from '@angular/common';
import { Component, inject, isDevMode, OnDestroy, OnInit } from '@angular/core';
// import { MatDialog } from '@angular/material/dialog';
// import { ActivatedRoute, Router } from '@angular/router';
import { MatTooltip } from '@angular/material/tooltip';
import {
  combineLatest,
  filter,
  map,
  Observable,
  of,
  shareReplay,
  Subject,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs';

import { Attribute } from '../../models/attribute';
import { Character, EnemyViewModel } from '../../models/character';
import { Moment, MomentChoice } from '../../models/moment';
import { GameFacade } from '../../services/game-facade';
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

  attributes$ = this.game.attributes$;

  currentSlotId$ = this.game.currentSlotId$;

  playerId$ = this.game.utils.character.playerId$;
  player$ = this.game.utils.character.player$;

  stats$ = this.game.utils.character.playerStats$;
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
  statsArray$: Observable<Attribute[]> = this.stats$.pipe(
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

  // IDs of combat-plane characters for this moment (including player)
  combatCharacterIds$: Observable<string[]> = combineLatest([
    this.moment$,
    this.playerId$,
  ]).pipe(
    switchMap(async ([moment, playerId]) => {
      if (!moment) return [];
      // Spawn combat-plane characters if needed
      if (moment.isCombat || moment.tags?.includes('combat')) {
        // includes player and all moment characters
        // const ids: string[] = [...(moment.characters ?? []), playerId].filter(
        //   (id): id is string => typeof id === 'string' && !!id,
        // );
        return this.game.utils.character.spawnCombatCharactersForMoment(moment);
      }
      // Non-combat: just use moment characters and player as-is
      return [...(moment.characters ?? []), playerId].filter(
        (id): id is string => typeof id === 'string',
      );
    }),
    switchMap((ids) => (Array.isArray(ids) ? of(ids) : of([]))),
  );

  // // For UI: get all combat characters (player first, then others)
  // combatCharacters$: Observable<Character[]> = combineLatest([
  //   this.combatCharacterIds$,
  //   this.game.utils.character.entities$,
  // ]).pipe(
  //   map(([ids, entities]): Character[] =>
  //     ids
  //       .filter((id): id is string => typeof id === 'string')
  //       .map((id) => entities[id])
  //       .filter((entity): entity is Character => !!entity),
  //   ),
  //   shareReplay({ bufferSize: 1, refCount: true }),
  // );

  // enemyCharacters$: Observable<EnemyViewModel[]> = combineLatest([
  //   this.moment$,
  //   this.player$,
  //   this.game.utils.character.all$,
  // ]).pipe(
  //   map(([moment, player, allChars]) => {
  //     if (!moment || !allChars) return [];
  //     return (moment.characters ?? [])
  //       .filter((id) => id !== player?.id) // exclude player
  //       .map((id) => allChars.find((c) => c.id === id))
  //       .filter((enemy): enemy is Character => !!enemy)
  //       .map((enemy) => {
  //         const currentHealth = Number(enemy.attributes['health'] ?? 0);
  //         const maxHealth = Number(enemy.attributes['maxHealth'] ?? 100);
  //         const healthPercent =
  //           maxHealth > 0 ? (currentHealth / maxHealth) * 100 : 0;
  //         const isLowHealth = currentHealth < 0.3 * maxHealth;
  //         return {
  //           ...enemy,
  //           currentHealth,
  //           maxHealth,
  //           healthPercent,
  //           isLowHealth,
  //         };
  //       });
  //   }),
  //   shareReplay({ bufferSize: 1, refCount: true }),
  // );

  // // Choose a target from the current moment (example: first non-player)
  // targetId$: Observable<string> = combineLatest([
  //   this.moment$,
  //   this.player$,
  // ]).pipe(
  //   map(([moment, player]) => {
  //     const list = moment?.characters ?? [];
  //     return list.find((id) => id !== player?.id) ?? list[0] ?? null;
  //   }),
  //   shareReplay({ bufferSize: 1, refCount: true }),
  // );

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
          // Properly extract active values from AttributeInstance objects
          const healthAttr = enemy.attributes?.['health'];
          const currentHealth = Number(
            healthAttr?.value ?? healthAttr?.default ?? 0,
          );
          const maxHealth = Number(healthAttr?.max ?? 100);

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
      id
        ? this.game.utils.character.getAttributeFor$(id, 'level')
        : of(undefined),
    ),
    map((a) => (typeof a?.value === 'number' ? a.value : undefined)),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  targetHealth$: Observable<number | undefined> = this.targetId$.pipe(
    switchMap((id) =>
      id
        ? this.game.utils.character.getAttributeFor$(id, 'health')
        : of(undefined),
    ),
    map((a) => (typeof a?.value === 'number' ? a.value : undefined)),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  targetHealthMax$: Observable<number | undefined> = this.targetId$.pipe(
    switchMap((id) =>
      id
        ? this.game.utils.character.getAttributeFor$(id, 'health')
        : of(undefined),
    ),
    map((a) => {
      if (typeof a?.max === 'number') {
        return a.max;
      }
      if (typeof a?.value === 'number') {
        return a.value;
      }
      return undefined;
    }),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  // --- Methods ---

  async ngOnInit() {
    // this.game.loadGame();
    this.game.currentSlotId$.subscribe((slotId) => {
      if (slotId) {
        this.game.loadAdventure(slotId);
      }
    });

    this.initLoggingSubscriptions();
    this.initCombatCharacterManagement();

    // 🔸 Validate the moment and pessimistically inject characters into the database!
    await this.game.isMomentIdValid();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Helper to log observables if debugMode is enabled
  logObservable<T>(
    label: string,
    obs: Observable<T>,
    // destroy$: Subject<void>,
    // enabled: boolean,
  ): void {
    const destroy: Subject<void> = this.destroy$;
    const enabled: boolean = this.debugMode;
    if (enabled) {
      obs
        // .pipe(takeUntil(destroy$))
        .pipe(takeUntil(destroy))
        // .subscribe((val) => console.log(`[Character Panel] ${label}`, val));
        .subscribe((val) => console.log(label, val));
    }
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
    this.logObservable('[Play] player stats$', this.stats$);
    this.logObservable('[Play] player inventory$', this.inventory$);

    this.logObservable('[Play] moment$', this.moment$);
    this.logObservable('[Play] choices$', this.choices$);
    // this.logEntries$.subscribe((val) => console.log('[Play] logEntries$', val));

    this.logObservable('[Play] combatCharacterIds$', this.combatCharacterIds$);
    this.logObservable('[Play] combatCharacters$', this.combatCharacters$);
    this.logObservable('[Play] enemyCharacters$', this.enemyCharacters$);

    this.logObservable('[Play] targetId$', this.targetId$);
    this.logObservable('[Play] targetLevel$', this.targetLevel$);
    this.logObservable('[Play] targetHealth$', this.targetHealth$);
    this.logObservable('[Play] targetHealthMax$', this.targetHealthMax$);
  }

  private initCombatCharacterManagement() {
    // Spawn combat-plane characters (player + moment characters)
    this.moment$
      .pipe(
        filter((m): m is Moment => !!m),
        take(1),
        filter(
          (m: Moment) =>
            !!m.isCombat ||
            (Array.isArray(m.tags) && m.tags.includes('combat')),
        ),
        switchMap((m) =>
          this.game.utils.character.spawnCombatCharactersForMoment(m),
        ),
        takeUntil(this.destroy$),
      )
      .subscribe((val) =>
        console.log('[Play] moment$ spawnCombatCharactersForMoment', val),
      );

    // Clean up combat-plane characters on moment exit
    this.moment$
      .pipe(
        takeUntil(this.destroy$),
        filter((m) => !!m),
        switchMap((moment) =>
          moment.isCombat || moment.tags?.includes('combat')
            ? this.game.utils.character.clearCombatCharactersForMoment(moment)
            : of(undefined),
        ),
      )
      .subscribe();
  }

  getChoices(): Observable<MomentChoice[]> {
    return this.moment$.pipe(
      map(
        (moment) =>
          (moment?.choices?.map((opt) => ({
            ...opt,
            enabled: opt.enabled !== false, // enabled unless explicitly false
          })) as MomentChoice[]) ?? [],
      ),
    );
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

  // get logEntries$(): Observable<string[]> {
  //   return this.game.logEntries$;
  // }

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
