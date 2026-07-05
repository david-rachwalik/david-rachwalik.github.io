import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Observable, take } from 'rxjs';

import { ATTRIBUTES_CATALOG } from '../../data/game-catalogs';
import {
  extractSaveInstance,
  getEntityFromCatalog,
  mergeInstanceWithCatalog,
} from '../../data/utils-seed';
import {
  Attribute,
  AttributeInstance,
  AttributeValue,
  AttributeValueType,
} from '../../models/attribute';
import { AttributeActions } from '../../store/attribute/attribute.actions';
import {
  selectAllAttributes,
  selectAttributeById,
  selectAttributeEntities,
} from '../../store/attribute/attribute.selectors';

@Injectable({ providedIn: 'root' })
export class AttributeFacade {
  constructor(private store: Store) {}

  // #region 🔸 Selectors 🔸

  all$ = this.store.select(selectAllAttributes); // for UI
  entities$ = this.store.select(selectAttributeEntities); // for lookup

  byId$(id: string) {
    return this.store.select(selectAttributeById(id));
  }
  // #endregion

  // #region 🔸 CRUD Methods 🔸

  /** Creates a temporary "blank canvas" for the UI (minimum valid model) */
  buildBlank(
    id: string,
    entityId: string,
    name: string,
    dimensionId: string,
    planeId: string,
  ): Attribute {
    return {
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
    };
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

  // #region 🔸 Value Logic 🔸

  /** Looks up the primitive type of Attribute from static catalog */
  getValueType(attributeId: string): AttributeValueType | undefined {
    const template = this.getFromCatalog(attributeId);
    return template?.valueType;
  }

  private getNumberValue(
    instance?: AttributeInstance,
    fallback: number = 0,
  ): number {
    if (!instance || typeof instance !== 'object') return fallback;
    const raw = instance.value ?? instance.default ?? fallback;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  private getBooleanValue(
    instance?: AttributeInstance,
    fallback: boolean = false,
  ): boolean {
    if (!instance || typeof instance !== 'object') return fallback;
    const raw = instance.value ?? instance.default ?? fallback;
    if (typeof raw === 'boolean') return raw;
    if (typeof raw === 'string') return raw.toLowerCase() === 'true';
    return Boolean(raw);
  }

  private getStringValue(
    instance?: AttributeInstance,
    fallback: string = '',
  ): string {
    if (!instance || typeof instance !== 'object') return fallback;
    const raw = instance.value ?? instance.default ?? fallback;
    return String(raw);
  }

  /**
   * Universal getter driven by the catalog's `valueType`.
   * Pass a typed fallback and TypeScript infers the return type automatically.
   * All ugly casts are buried here so no caller ever needs one.
   *
   * @example
   * const level = this.utils.attribute.getValue(player.attributes, 'level', 1);      // number
   * const name  = this.utils.attribute.getValue(player.attributes, 'name', '');       // string
   * const toxic = this.utils.attribute.getValue(player.attributes, 'is-toxic', false); // boolean
   */
  getValue<T extends AttributeValue>(
    attributes: Record<string, AttributeInstance> | undefined,
    attributeId: string,
    fallback: T,
  ): T {
    const template = this.getFromCatalog(attributeId);
    const instance = attributes?.[attributeId];
    const valueType = template?.valueType;

    switch (valueType) {
      case 'number': {
        let val = this.getNumberValue(
          instance,
          typeof fallback === 'number' ? fallback : 0,
        );
        // Enforce bounds defined by template or instance overrides
        const min = instance?.min ?? template?.min;
        const max = instance?.max ?? template?.max;
        if (typeof min === 'number' && val < min) val = min;
        if (typeof max === 'number' && val > max) val = max;
        return val as T;
      }

      case 'boolean':
        return this.getBooleanValue(
          instance,
          typeof fallback === 'boolean' ? fallback : false,
        ) as T;

      case 'string':
        return this.getStringValue(
          instance,
          typeof fallback === 'string' ? fallback : '',
        ) as T;

      default:
        // Graceful degradation if catalog lookup fails (e.g. invalid ID)
        if (!instance) return fallback;
        return (instance.value ?? instance.default ?? fallback) as T;
    }
  }

  getMin(
    attributes: Record<string, AttributeInstance> | undefined,
    attributeId: string,
    fallback: number = 0,
  ): number {
    const template = this.getFromCatalog(attributeId);
    const instance = attributes?.[attributeId];
    const raw = instance?.min ?? template?.min ?? fallback;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  getMax(
    attributes: Record<string, AttributeInstance> | undefined,
    attributeId: string,
    fallback: number = 0,
  ): number {
    const template = this.getFromCatalog(attributeId);
    const instance = attributes?.[attributeId];
    const raw = instance?.max ?? template?.max ?? fallback;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  isAttributeValue(val: unknown): val is AttributeValue {
    return (
      typeof val === 'string' ||
      typeof val === 'number' ||
      typeof val === 'boolean'
    );
  }
  // #endregion

  // #region 🔸 Attribute Logic 🔸

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
