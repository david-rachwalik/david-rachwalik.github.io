import { Injectable } from '@angular/core';
import { Tag } from '../models/tag';

@Injectable({ providedIn: 'root' })
export class TagService {
  private tags: Tag[] = [
    { id: 'melee', name: 'Melee' },
    { id: 'magic', name: 'Magic' },
    { id: 'physical', name: 'Physical' },
    { id: 'intellect', name: 'Intellect' },
  ];

  getAll(): Tag[] {
    return this.tags;
  }

  byId(id: string): Tag | undefined {
    return this.tags.find((tag) => tag.id === id);
  }
}
