import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable } from 'rxjs';

import { Location } from '../../models/location';
import { locationFeature } from '../../store/location/location.reducer';
import { GameDataService } from '../game-data.service';

@Injectable({ providedIn: 'root' })
export class LocationFacade {
  constructor(
    private dataService: GameDataService,
    private store: Store,
  ) {}

  // --- NgRx Selectors ---

  // Dict for lookup
  locationEntities$ = this.store.select(locationFeature.selectEntities);

  // Array for UI (filter out any `undefined`)
  locations$ = this.store
    .select(locationFeature.selectEntities)
    // .pipe(map((entities) => Object.values(entities)));
    .pipe(
      map((entities) =>
        Object.values(entities).filter((l): l is Location => !!l),
      ),
    );

  byId$(id$: Observable<string | undefined>) {
    return combineLatest([this.locationEntities$, id$]).pipe(
      map(([entities, id]) => (id ? entities[id] : undefined)),
    );
  }

  // --- Static ---

  // Get all locations
  get all(): Location[] {
    return this.dataService.getAllLocations();
  }

  // Get a single location by ID
  getLocation(id: string): Location | undefined {
    return this.dataService.getLocation(id);
  }

  // Example: Get locations by region or tag
  getLocationsByTag(tag: string): Location[] {
    return this.all.filter((loc) => loc.tags?.includes(tag));
  }
}
