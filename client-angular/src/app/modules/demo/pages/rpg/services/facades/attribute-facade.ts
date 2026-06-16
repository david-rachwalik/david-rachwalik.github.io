import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Observable, take } from 'rxjs';

import { ATTRIBUTES_CATALOG } from '../../data/game-catalogs';
import {
  extractSaveInstance,
  getEntityFromCatalog,
  mergeInstanceWithCatalog,
} from '../../data/utils-seed';
import { Attribute, AttributeInstance } from '../../models/attribute';
import { AttributeActions } from '../../store/attribute/attribute.actions';
import {
  selectAllAttributes,
  selectAttributeById,
  selectAttributeEntities,
} from '../../store/attribute/attribute.selectors';

@Injectable({ providedIn: 'root' })
export class AttributeFacade {
  constructor(private store: Store) {}

  // #region 🔸 NgRx Selectors 🔸

  all$ = this.store.select(selectAllAttributes); // for UI
  entities$ = this.store.select(selectAttributeEntities); // for lookup

  byId$(id: string) {
    return this.store.select(selectAttributeById(id));
  }
  // #endregion

  // #region 🔸 Feature CRUD Methods 🔸

  // Creates a temporary "blank canvas" for the UI (minimum valid model)
  addBlank(
    id: string,
    entityId: string,
    name: string,
    dimensionId: string,
    planeId: string,
  ) {
    const attribute: Attribute = {
      id,
      entityId,
      dimensionId,
      planeId,
      name,
      description: '',
      kind: 'stat',
      abbreviation: name.substring(0, 3).toUpperCase(),
      valueType: 'number',
      default: 0,
      base: 0,
      value: 0,
      min: 0,
      max: 100,
      // tags: [],
    };

    this.store.dispatch(AttributeActions.addAttribute({ attribute }));
  }
  add(attribute: Attribute) {
    this.store.dispatch(AttributeActions.addAttribute({ attribute }));
  }
  loadAll() {
    this.store.dispatch(AttributeActions.loadAllAttributes());
  }
  save(changes: AttributeInstance) {
    if (!changes.id) {
      console.warn(
        '[AttributeFacade] Save aborted: Instance is missing ID',
        changes,
      );
      return;
    }
    this.store.dispatch(
      AttributeActions.saveAttribute({ id: changes.id, changes }),
    );
  }
  remove(id: string) {
    this.store.dispatch(AttributeActions.removeAttribute({ id }));
  }
  // #endregion

  // #region 🔸 Catalog & Instance Domain Logic 🔸

  // Retrieves the pure default template from the active static registry
  getFromCatalog(id: string): Attribute | undefined {
    return getEntityFromCatalog(ATTRIBUTES_CATALOG, id);
  }

  // Hydrates a partial instance save file into a complete usable data model
  mergeWithCatalog(instance: AttributeInstance) {
    return mergeInstanceWithCatalog(ATTRIBUTES_CATALOG, instance);
  }

  // Convert full Attribute → AttributeInstance (entityId + diffs)
  // Strips full object down to its bare differences to be saved more efficiently
  toInstance(full: Attribute): AttributeInstance | undefined {
    const base = this.getFromCatalog(full.entityId);
    if (!base) {
      console.warn(
        `[AttributeFacade] Cannot create instance: template not found for entityId "${full.entityId}"`,
      );
      return undefined;
    }

    return extractSaveInstance<Attribute>(full, base);
  }
  // #endregion

  // #region 🔸 Attribute Logic 🔸

  isAttributeValue(val: unknown): val is string | number | boolean {
    return (
      typeof val === 'string' ||
      typeof val === 'number' ||
      typeof val === 'boolean'
    );
  }

  /**
   * Apply a Partial<AttributeInstance> (an instance-level patch) to catalog
   * and/or derive a full Attribute, then dispatch save and emit the merged full Attribute.
   */
  updateAttributeFromInstancePatch$(
    instancePatch: Partial<AttributeInstance> & {
      entityId?: string;
      id?: string;
    },
  ): Observable<Attribute | undefined> {
    return this.entities$.pipe(
      take(1),
      map((entities) => {
        // resolve catalog/base attribute (explicit id or entityId match)
        let base: Attribute | undefined;
        if (instancePatch.id && entities[instancePatch.id]) {
          base = entities[instancePatch.id];
        } else if (instancePatch.entityId) {
          base = Object.values(entities).find(
            (a) => a?.entityId === instancePatch.entityId,
          );
        }
        // if no base, treat patch as new full attribute (merge over empty)
        const merged: Attribute = {
          ...(base ?? ({} as Attribute)),
          ...(instancePatch as Attribute),
        };
        // ensure entityId set
        if (!merged.entityId && instancePatch.entityId)
          merged.entityId = instancePatch.entityId;
        // dispatch save (will upsert in store)
        this.save(merged);
        return merged;
      }),
    );
  }

  /**
   * Apply an arbitrary partial Attribute to the catalog/instance and save result.
   * Emits the merged full Attribute (or undefined if no merge possible).
   */
  updateAttributeByPartial$(
    partial: Partial<Attribute> & { id?: string; entityId?: string },
  ): Observable<Attribute | undefined> {
    return this.entities$.pipe(
      take(1),
      map((entities) => {
        let base: Attribute | undefined;
        if (partial.id && entities[partial.id]) {
          base = entities[partial.id];
        } else if (partial.entityId) {
          base = Object.values(entities).find(
            (a) => a?.entityId === partial.entityId,
          );
        }
        const merged: Attribute = {
          ...(base ?? ({} as Attribute)),
          ...(partial as Attribute),
        };
        if (!merged.entityId && partial.entityId)
          merged.entityId = partial.entityId;
        this.save(merged);
        return merged;
      }),
    );
  }
  // #endregion
}
