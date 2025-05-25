import { Injectable } from '@angular/core';

import { Moment } from '../../models/moment';
import { GameDataService } from '../game-data.service';

@Injectable({ providedIn: 'root' })
export class MomentFacade {
  constructor(private dataService: GameDataService) {}

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
