import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { map, Observable, of, Subject } from 'rxjs';

import { Attribute } from '../../models/attribute';
import { CharacterFacade } from '../../services/facades/character-facade';
import { debugLogObservable } from '../../utils';

@Component({
  selector: 'app-rpg-character-panel',
  imports: [CommonModule, MatTooltip],
  template: `
    @if (characterId) {
      <ng-container>
        <div class="character-panel">
          <div class="name">
            @if (debugMode) {
              <span matTooltip="ID: {{ characterId }}">{{
                name$ | async
              }}</span>
            } @else {
              {{ name$ | async }}
            }
            @if (level$ | async; as lvl) {
              @if (debugMode) {
                <span class="level-pill" matTooltip="Level">{{ lvl }}</span>
              } @else {
                <span class="level-pill">{{ lvl }}</span>
              }
            }
          </div>
          <div class="stats">
            <div>
              <span class="stat-label">HP:</span>
              <span class="stat-value">
                {{ (health$ | async) ?? '—' }} /
                {{ (healthMax$ | async) ?? '—' }}
              </span>
            </div>
          </div>
        </div>
      </ng-container>
    }
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './rpg-character-panel.component.scss',
})
export class RpgCharacterPanelComponent implements OnInit, OnDestroy {
  @Input() characterId!: string;

  name$: Observable<string | undefined> = of(undefined);
  level$: Observable<number | undefined> = of(undefined);
  health$: Observable<number | undefined> = of(undefined);
  healthMax$: Observable<number | undefined> = of(undefined);

  private destroy$ = new Subject<void>();
  debugMode = false; // (d) Set to true to enable logging
  // debugMode = isDevMode(); // Set debugMode based on Angular dev mode

  constructor(public characterFacade: CharacterFacade) {}

  ngOnInit(): void {
    this.loadCharacterData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Helper to log observables if debugMode is enabled
  logObservable<T>(label: string, obs: Observable<T>): void {
    debugLogObservable(label, obs, this.destroy$, this.debugMode);
  }

  loadCharacterData() {
    // Character name (reacts to store updates)
    this.name$ = this.characterFacade
      .byId$(this.characterId)
      .pipe(map((c) => c?.name));

    if (this.debugMode) {
      this.logObservable('[Character Panel] name$:', this.name$);
    }

    this.loadCharacterAttributeData();
  }

  loadCharacterAttributeData() {
    // Helper to get a shared merged Attribute stream per attrId
    const attr$ = (attrId: string): Observable<Attribute | undefined> =>
      this.characterFacade.getAttributeFor$(this.characterId, attrId);

    // Level / Health (reactive to any attribute changes)
    const levelAttr$ = attr$('level');
    const healthAttr$ = attr$('health');

    this.level$ = levelAttr$.pipe(
      map((a) => (typeof a?.value === 'number' ? a.value : undefined)),
    );
    this.health$ = healthAttr$.pipe(
      map((a) => (typeof a?.value === 'number' ? a.value : undefined)),
    );
    this.healthMax$ = healthAttr$.pipe(
      map((a) => (typeof a?.max === 'number' ? a.max : undefined)),
    );

    if (this.debugMode) {
      this.logObservable('[Character Panel] level$:', this.level$);
      this.logObservable('[Character Panel] health$:', this.health$);
      this.logObservable('[Character Panel] healthMax$:', this.healthMax$);
    }
  }
}
