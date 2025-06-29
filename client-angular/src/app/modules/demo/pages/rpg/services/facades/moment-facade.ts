import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable } from 'rxjs';

import { Moment } from '../../models/moment';
import { momentFeature } from '../../store/moment/moment.reducer';
import { GameDataService } from '../game-data.service';

@Injectable({ providedIn: 'root' })
export class MomentFacade {
  constructor(
    private dataService: GameDataService,
    private store: Store,
  ) {}

  // --- NgRx Selectors ---

  // Dict for lookup
  momentEntities$ = this.store.select(momentFeature.selectEntities);

  // Array for UI (filter out any `undefined`)
  moments$ = this.store
    .select(momentFeature.selectEntities)
    // .pipe(map((entities) => Object.values(entities)));
    .pipe(
      map((entities) =>
        Object.values(entities).filter((m): m is Moment => !!m),
      ),
    );

  byId$(id$: Observable<string | undefined>) {
    return combineLatest([this.momentEntities$, id$]).pipe(
      map(([entities, id]) => (id ? entities[id] : undefined)),
    );
  }

  // --- Static ---

  // Get all moments
  get all(): Moment[] {
    return this.dataService.getAllMoments();
  }

  // Get a single moment by ID
  getMoment(id: string): Moment | undefined {
    return this.dataService.getMoment(id);
  }

  // Example: Get moments by type, tag, or chapter
  getMomentsByTag(tag: string): Moment[] {
    return this.all.filter((moment) => moment.tags?.includes(tag));
  }
}
