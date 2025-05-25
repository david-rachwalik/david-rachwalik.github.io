import { Injectable } from '@angular/core';

import { Attribute, AttributeType } from '../../models/attribute';
import { GameDataService } from '../game-data.service';

// :: Focused on business logic and orchestration, not storage details ::
// Provides higher-level, feature-focused methods for the UI or other services
// to interact with attributes, orchestrating calls to `GameDataService` and
// adding any business logic (like generating IDs, filtering, sorting, etc.)

@Injectable({ providedIn: 'root' })
export class AttributeFacade {
  constructor(private dataService: GameDataService) {}

  // List all attributes, optionally filtered/sorted
  listAttributes(type?: AttributeType): Attribute[] {
    let attrs = this.dataService.getAllAttributes();
    if (type) {
      attrs = attrs.filter((attr) => attr.type === type);
    }
    // Example sort by name
    return attrs.sort((a, b) => a.name.localeCompare(b.name));
  }

  // Add a new attribute
  addAttribute(
    name: string,
    type: AttributeType,
    valueType: string,
    min?: number,
    max?: number,
    tags: string[] = [],
  ): Attribute {
    const id = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const attr: Attribute = { id, name, type, valueType, min, max, tags };
    this.dataService.addAttribute(attr);
    return attr;
  }

  // Update an attribute
  updateAttribute(id: string, changes: Partial<Attribute>): void {
    this.dataService.updateAttribute(id, changes);
  }

  // Remove an attribute
  removeAttribute(id: string): void {
    this.dataService.removeAttribute(id);
  }
}
