import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, of, switchMap } from 'rxjs';

import { Adventure } from '../../models/adventure';
import { adventureFeature } from '../../store/adventure/adventure.reducer';
import { toId } from '../../utils';
import { GameSaveService } from '../game-save.service';

// :: Focused on business logic and orchestration, not storage details ::
// Provides higher-level, feature-focused methods for the UI or other services
// to interact with adventures, orchestrating calls to `GameDataService` and
// adding any business logic (like generating IDs, filtering, sorting, etc.)

@Injectable({ providedIn: 'root' })
export class AdventureFacade {
  constructor(
    private store: Store,
    private gameSaveService: GameSaveService,
  ) {}

  // --- NgRx Selectors ---

  // Dict for lookup
  adventureEntities$ = this.store.select(adventureFeature.selectEntities);
  // adventure$ = this.store.select(adventureFeature.selectAdventureState);
  // Array for UI (filter out any `undefined`)
  adventures$ = this.store
    .select(adventureFeature.selectEntities)
    // .pipe(map((entities) => Object.values(entities)));
    .pipe(
      map((entities) =>
        Object.values(entities).filter((char): char is Adventure => !!char),
      ),
    );

  // Synchronous get by id
  byId$(id: string) {
    return this.adventureEntities$.pipe(map((entities) => entities[id]));
  }

  // Current Adventure (Game State) Selectors
  currentAdventure$ = of(this.gameSaveService.loadCurrentSlotId()).pipe(
    switchMap((id) => (id ? this.byId$(id) : of(undefined))),
  );
  current$ = this.currentAdventure$;
  // `currentAdventureId` is GameSaveService.currentSlotId

  currentCharacterId$ = this.currentAdventure$.pipe(
    map((a) => a?.currentCharacterId),
  );
  currentLocationId$ = this.currentAdventure$.pipe(
    map((a) => a?.currentLocationId),
  );
  currentMomentId$ = this.currentAdventure$.pipe(
    map((a) => a?.currentMomentId),
  );

  // Formats user-chosen label into slot ID
  toSlotId(label: string) {
    const INDEX_PREFIX = 'rpg-demo-slot';
    if (!label) return '';
    const id = toId(label);
    return `${INDEX_PREFIX}:${id}`;
    // TODO: remove duplication of INDEX_PREFIX eventually
  }

  // Calculate slot size in KB
  sizeInKB(slot: Adventure) {
    const json = JSON.stringify(slot);
    const blobSize = new Blob([json]).size / 1024;
    console.log('[AdventureFacade] sizeInKB blob:', blobSize);
    const lenSize = Math.round(json.length / 1024);
    console.log('[AdventureFacade] sizeInKB length:', lenSize);
    return blobSize;
  }
}
