import { Injectable } from '@angular/core';

import { Location } from '../../models/location';
import { GameDataService } from '../game-data.service';

@Injectable({ providedIn: 'root' })
export class LocationFacade {
  constructor(private dataService: GameDataService) {}

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
