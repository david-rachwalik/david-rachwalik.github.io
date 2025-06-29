import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';

import {
  Attribute,
  AttributeType,
  AttributeValueType,
} from '../../models/attribute';
import { attributeFeature } from '../../store/attribute/attribute.reducer';
import { GameDataService } from '../game-data.service';

// :: Focused on business logic and orchestration, not storage details ::
// Provides higher-level, feature-focused methods for the UI or other services
// to interact with attributes, orchestrating calls to `GameDataService` and
// adding any business logic (like generating IDs, filtering, sorting, etc.)

@Injectable({ providedIn: 'root' })
export class AttributeFacade {
  constructor(
    private dataService: GameDataService,
    private store: Store,
  ) {}

  // --- NgRx Selectors ---

  // Dict for lookup
  attributeEntities$ = this.store.select(attributeFeature.selectEntities);
  // Array for UI (filter out any `undefined`)
  attributes$ = this.store
    .select(attributeFeature.selectEntities)
    // .pipe(map((entities) => Object.values(entities)));
    .pipe(
      map((entities) =>
        Object.values(entities).filter((attr): attr is Attribute => !!attr),
      ),
    );

  // Synchronous get by id
  byId$(id: string) {
    return this.attributeEntities$.pipe(map((entities) => entities[id]));
  }

  // ----------------------------------------------------------------
  // ----------------------------------------------------------------

  get currentAttributes(): Record<string, Attribute> {
    // Assuming getAllAttributes() returns Attribute[]
    const attrs = this.dataService.getAllAttributes();
    // Convert array to a dictionary for fast lookup
    return attrs.reduce(
      (acc, attr) => {
        acc[attr.id] = attr;
        return acc;
      },
      {} as Record<string, Attribute>,
    );
  }

  byId(id: string): Attribute | undefined {
    const attr = this.currentAttributes[id];
    console.log(`[AttributeFacade] byId(${id}):`, attr);
    return attr;
  }

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
    description: string,
    valueType: AttributeValueType,
    defaultValue: string | number,
    min?: number,
    max?: number,
    tags: string[] = [],
  ): Attribute {
    const id = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const attr: Attribute = {
      id,
      name,
      type,
      description,
      valueType,
      defaultValue,
      min,
      max,
      tags,
    };
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
