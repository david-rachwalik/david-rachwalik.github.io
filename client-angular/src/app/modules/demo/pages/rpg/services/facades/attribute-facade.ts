import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { firstValueFrom, map, Observable, shareReplay, take } from 'rxjs';

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
  all$ = this.store.select(selectAllAttributes);
  entities$ = this.store.select(selectAttributeEntities);
  // #endregion

  // #region 🔸 Feature CRUD Methods 🔸
  add(attribute: Attribute) {
    this.store.dispatch(AttributeActions.addAttribute({ attribute }));
  }
  loadAll() {
    this.store.dispatch(AttributeActions.loadAllAttributes());
  }
  save(attribute: Attribute) {
    this.store.dispatch(AttributeActions.saveAttribute({ attribute }));
  }
  remove(id: string) {
    this.store.dispatch(AttributeActions.removeAttribute({ id }));
  }
  byId$(id: string) {
    return this.store.select(selectAttributeById(id));
  }
  // #endregion

  // ---- Typed, dynamic utilities (no any, no unsafe indexing) ----
  private static mergeInstanceOverBase<T extends object, U extends Partial<T>>(
    base: T,
    inst: U,
    omit: readonly (keyof T)[] = [],
  ): T {
    const patch: Partial<T> = {};
    for (const key of Object.keys(inst) as (keyof T)[]) {
      if (omit.includes(key)) continue;
      const val = inst[key as keyof U];
      if (val !== undefined) {
        patch[key] = val as T[typeof key];
      }
    }
    return { ...base, ...patch };
  }

  private static diffFromBase<T extends object>(
    full: T,
    base: Partial<T>,
    omit: readonly (keyof T)[] = [],
  ): Partial<T> {
    const out: Partial<T> = {};
    const keys = new Set<keyof T>([
      ...(Object.keys(full) as (keyof T)[]),
      ...(Object.keys(base) as (keyof T)[]),
    ]);
    // console.group('[diffFromBase]');
    // console.log('Full:', full);
    // console.log('Base:', base);
    for (const key of keys) {
      if (omit.includes(key)) continue;
      const fv = full[key];
      const bv = base[key];
      if (fv !== undefined && !Object.is(fv, bv)) {
        out[key] = fv as T[typeof key];
        // console.log(`Diff: ${String(key)} | full:`, fv, '| base:', bv);
      }
    }
    // console.log('Result diff:', out);
    // console.groupEnd();
    return out;
  }

  // #region 🔸 Attribute Logic 🔸

  // Merge AttributeInstance with its catalog Attribute
  getAttributeByInstance$(
    inst: AttributeInstance | undefined,
  ): Observable<Attribute | undefined> {
    return this.entities$.pipe(
      map((entities) => {
        if (!inst?.id) return undefined;
        // Lookup full Attribute definition in catalog
        const def = entities[inst.id];
        if (!def) return undefined;

        // Resolve property differences (prefer instance)
        const merged: Attribute = { ...def, ...inst };
        // console.log('merged:', merged);
        return merged;
      }),
    );
  }

  // Convert full Attribute → AttributeInstance (entityId + diffs)
  attributeToInstance(full: Attribute, catalog?: Attribute): AttributeInstance {
    const base: Partial<Attribute> = catalog ?? {};
    const patch = AttributeFacade.diffFromBase<Attribute>(full, base);
    return {
      entityId: full.entityId,
      ...patch,
    };
  }

  isAttributeValue(val: unknown): val is string | number | boolean {
    return (
      typeof val === 'string' ||
      typeof val === 'number' ||
      typeof val === 'boolean'
    );
  }

  // Converts an AttributeInstance to a full Attribute by merging with catalog
  convertInstanceToAttribute$(
    instance: AttributeInstance,
    compositeId: string,
  ): Observable<Attribute | undefined> {
    // Even if `instance.id` exists, it must be explicitly passed as `compositeId`
    return this.entities$.pipe(
      map((entities) => {
        const catalogAttr = entities[compositeId];
        if (!catalogAttr) return undefined;
        return { ...catalogAttr, ...instance };
      }),
      // share and replay last emission; refCount avoids keeping subscription when no listeners
      shareReplay({ bufferSize: 1, refCount: true }),
    );
  }
  // #endregion

  // #region 🔸 Attribute Update Logic 🔸

  // Produce an AttributeInstance diff against the Attribute catalog
  convertAttributeToInstance$(attr: Attribute): Observable<AttributeInstance> {
    const omit: (keyof Attribute)[] = [
      'id',
      'entityId',
      'dimensionId',
      'planeId',
    ];

    return this.entities$.pipe(
      take(1),
      map((entities) => {
        // resolve catalog/base: prefer explicit id then entityId
        const base: Partial<Attribute> | undefined =
          (attr.id && entities[attr.id]) ||
          Object.values(entities).find((a) => a?.entityId === attr.entityId);

        // use the existing, strongly-typed diff helper
        const patch = AttributeFacade.diffFromBase<Attribute>(
          attr,
          base ?? {},
          omit,
        );

        return {
          entityId: attr.entityId,
          ...(attr.id ? { id: attr.id } : {}),
          ...patch,
        };
      }),
    );
  }

  /**
   * Convenience imperative wrapper when you need a Promise / single value.
   */
  async convertAttributeToInstanceOnce(
    attr: Attribute,
  ): Promise<AttributeInstance> {
    return firstValueFrom(this.convertAttributeToInstance$(attr));
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
