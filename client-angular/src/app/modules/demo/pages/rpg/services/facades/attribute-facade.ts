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
    console.group('[diffFromBase]');
    console.log('Full:', full);
    console.log('Base:', base);
    for (const key of keys) {
      if (omit.includes(key)) continue;
      const fv = full[key];
      const bv = base[key];
      if (fv !== undefined && !Object.is(fv, bv)) {
        out[key] = fv as T[typeof key];
        console.log(`Diff: ${String(key)} | full:`, fv, '| base:', bv);
      }
    }
    console.log('Result diff:', out);
    console.groupEnd();
    return out;
  }

  // #region 🔸 Attribute Logic 🔸

  // // Catalog lookup of Attribute
  // getAttributeById$(id: string): Observable<Attribute | undefined> {
  //   return this.entities$.pipe(
  //     map((entities) => (id ? entities[id] : undefined)),
  //   );
  // }

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
        console.log('merged:', merged);

        // TODO: implement this switch logic in a GameFacade method

        // const pickFirstDefined = <T>(...vals: (T | undefined)[]) =>
        //   vals.find((v) => v !== undefined);
        // const clampNumber = (val: number, min?: number, max?: number) => {
        //   let out = val;
        //   if (typeof min === 'number') out = Math.min(min, val);
        //   if (typeof max === 'number') out = Math.max(max, val);
        //   return out;
        // };

        // switch (def.valueType) {
        //   case 'number': {
        //     console.log('valueType number');

        //     const val = this.pickFirstDefined<number>(
        //       merged.value as number | undefined,
        //       merged.base as number | undefined,
        //       merged.default as number | undefined,
        //     );
        //     merged.value = this.clampNumber(val, merged.min, merged.max);
        //     break;
        //   }
        //   case 'boolean': {
        //     console.log('valueType boolean');

        //     const val = this.pickFirstDefined<boolean>(
        //       merged.value as boolean | undefined,
        //       merged.default as boolean | undefined,
        //     );
        //     if (val !== undefined) merged.value = val;

        //     break;
        //   }
        //   case 'string': {
        //     console.log('valueType string/text');

        //     const val = this.pickFirstDefined<string>(
        //       merged.value as string | undefined,
        //       merged.default as string | undefined,
        //     );
        //     if (val !== undefined) merged.value = val;

        //     break;
        //   }
        //   default: {
        //     console.log('valueType string/text');
        //     break;
        //   }
        // }

        return merged;
      }),
    );
  }

  // Convert full Attribute → AttributeInstance (entityId + diffs)
  attributeToInstance(full: Attribute, catalog?: Attribute): AttributeInstance {
    const base: Partial<Attribute> = catalog ?? {};
    console.group('[attributeToInstance]');
    console.log('Full Attribute:', full);
    console.log('Catalog Attribute:', base);
    // const patch = CharacterFacade.diffFromBase<Attribute>(full, base, [
    //   'id',
    //   'entityId',
    //   'dimensionId',
    //   'planeId',
    // ] as const);
    // const out: AttributeInstance = {
    //   entityId: full.entityId,
    //   ...(full.id ? ({ id: full.id } as Pick<AttributeInstance, 'id'>) : {}),
    //   ...(patch as Partial<AttributeInstance>),
    // };
    const patch = AttributeFacade.diffFromBase<Attribute>(full, base);
    const out: AttributeInstance = {
      entityId: full.entityId,
      ...patch,
    };
    console.log('AttributeInstance:', out);
    console.groupEnd();
    return out;
  }

  isAttributeValue(val: unknown): val is string | number | boolean {
    // isAttributeValue(val: unknown): val is AttributeValue {
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
        // console.group(
        //   `[convertInstanceToAttribute$] compositeId=${compositeId}`,
        // );
        // console.log('Instance:', instance);
        const catalogAttr = entities[compositeId];
        // console.log('Catalog attribute:', catalogAttr);
        if (!catalogAttr) {
          // console.warn(
          //   'No catalog attribute found for compositeId:',
          //   compositeId,
          // );
          // console.groupEnd();
          return undefined;
        }
        const merged = { ...catalogAttr, ...instance };
        // console.log('Merged attribute:', merged);
        // console.groupEnd();
        return merged;
      }),
      // share and replay last emission; refCount avoids keeping subscription when no listeners
      shareReplay({ bufferSize: 1, refCount: true }),
    );
  }
  // #endregion

  // #region 🔸 Attribute Update Logic 🔸

  // Convert Attribute to AttributeInstance (diff from catalog)
  convertAttributeToInstanceOld(attr: Attribute): AttributeInstance {
    // Find catalog for diff
    const omit: (keyof Attribute)[] = [
      'id',
      'entityId',
      'dimensionId',
      'planeId',
    ];
    const out: AttributeInstance = { entityId: attr.entityId };
    this.entities$
      .pipe(
        map((entities) => {
          let base: Attribute | undefined;
          if (attr.id && entities[attr.id]) {
            base = entities[attr.id];
          } else if (attr.entityId) {
            base = Object.values(entities).find(
              (a) => a?.entityId === attr.entityId,
            );
          }
          // Only copy properties that differ from catalog
          const keys = Object.keys(attr) as (keyof Attribute)[];
          for (const key of keys) {
            if (omit.includes(key)) continue;
            const value = attr[key];
            // const baseValue = base ? base[key] : undefined;
            const valueType = typeof value;
            // Log property name, type, and value
            console.log(
              `[convertAttributeToInstance] property: ${String(key)}, type: ${valueType}, value:`,
              value,
            );

            // if (
            //   value !== undefined &&
            //   !Object.is(value, baseValue) &&
            //   this.isAttributeValue(value)
            // ) {
            //   // out[key] = value as AttributeInstance[typeof key];
            //   // out[key as keyof AttributeInstance] = value;
            //   out[key] = value;
            // }

            // if (value !== undefined && !Object.is(value, baseValue)) {
            //   // Assign explicitly based on type
            //   if (valueType === 'string') {
            //     out[key] = value as string;
            //   } else if (valueType === 'number') {
            //     out[key] = value as number;
            //   } else if (valueType === 'boolean') {
            //     out[key] = value as boolean;
            //   }
            //   // else skip assignment for other types
            // }

            // TODO: Only assign if key exists on AttributeInstance (Partial<Attribute>)
            // if (value !== undefined && !Object.is(value, baseValue)) {
            //   out[key] = value as AttributeInstance[typeof key];
            // }
          }
          console.group('[convertAttributeToInstance]');
          console.log('Attribute:', attr);
          console.log('Catalog:', base);
          console.log('Instance:', out);
          console.groupEnd();
        }),
      )
      .subscribe(); // This will run once, but you may want to refactor for sync use
    return out;
  }

  // // Convert Attribute to AttributeInstance (diff from catalog)
  // async convertAttributeToInstance(
  //   attr: Attribute,
  // ): Promise<AttributeInstance> {
  //   const omit: (keyof Attribute)[] = [
  //     'id',
  //     'entityId',
  //     'dimensionId',
  //     'planeId',
  //   ];

  //   const entities = await firstValueFrom(this.entities$);
  //   const out: AttributeInstance = { entityId: attr.entityId };

  //   let base: Attribute | undefined;
  //   if (attr.id && entities[attr.id]) {
  //     base = entities[attr.id];
  //   } else if (attr.entityId) {
  //     base = Object.values(entities).find((a) => a?.entityId === attr.entityId);
  //   }

  //   const keys = Object.keys(attr) as (keyof Attribute)[];
  //   for (const key of keys) {
  //     if (omit.includes(key)) continue;
  //     const value = attr[key];
  //     const baseValue = base ? base[key] : undefined;
  //     if (
  //       value !== undefined &&
  //       !Object.is(value, baseValue) &&
  //       this.isAttributeValue(value)
  //     ) {
  //       // (out as AttributeInstance)[key as keyof AttributeInstance] =
  //       //   value as AttributeInstance[typeof key];
  //       out[key] = value;
  //     }
  //   }

  //   if (attr.id) {
  //     out.id = attr.id;
  //   }

  //   return out;
  // }

  // Produce an AttributeInstance diff against the Attribute catalog
  // convertAttributeToInstance$(attr: Attribute): Observable<AttributeInstance> {
  //   const omit: (keyof Attribute)[] = [
  //     'id',
  //     'entityId',
  //     'dimensionId',
  //     'planeId',
  //   ];
  //   return this.entities$.pipe(
  //     take(1),
  //     map((entities) => {
  //       const out: AttributeInstance = { entityId: attr.entityId };
  //       let base: Attribute | undefined;
  //       if (attr.id && entities[attr.id]) {
  //         base = entities[attr.id];
  //       } else if (attr.entityId) {
  //         base = Object.values(entities).find(
  //           (a) => a?.entityId === attr.entityId,
  //         );
  //       }
  //       const keys = Object.keys(attr) as (keyof Attribute)[];
  //       for (const key of keys) {
  //         if (omit.includes(key)) continue;
  //         const value = attr[key];
  //         const baseValue = base ? base[key] : undefined;
  //         // only copy primitive values that differ from catalog
  //         if (
  //           value !== undefined &&
  //           !Object.is(value, baseValue) &&
  //           this.isAttributeValue(value)
  //         ) {
  //           // TS: index as any to assign to AttributeInstance flexible shape
  //           (out as any)[key] = value;
  //         }
  //       }
  //       // keep id if present (useful for instance references)
  //       if (attr.id) (out as any).id = attr.id;
  //       return out;
  //     }),
  //   );
  // }

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
        console.group('[convertAttributeToInstance$]');
        console.log('Input Attribute:', attr);

        // resolve catalog/base: prefer explicit id then entityId
        const base: Partial<Attribute> | undefined =
          (attr.id && entities[attr.id]) ||
          Object.values(entities).find((a) => a?.entityId === attr.entityId);
        console.log('Resolved base/catalog:', base ?? '<none>');

        // use the existing, strongly-typed diff helper
        const patch = AttributeFacade.diffFromBase<Attribute>(
          attr,
          base ?? {},
          omit,
        );

        const out: AttributeInstance = {
          entityId: attr.entityId,
          ...(attr.id ? { id: attr.id } : {}),
          ...patch,
        };

        console.log('Computed AttributeInstance (diff):', out);
        console.groupEnd();
        return out;
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
   *
   * Example: facade.updateAttributeFromInstancePatch$({ entityId: 'hp', value: 10, id: 'hp' })
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
        // resolve catalog/base attribute (prefer explicit id, then entityId match)
        let base: Attribute | undefined;
        if (instancePatch.id && entities[instancePatch.id]) {
          base = entities[instancePatch.id];
        } else if (instancePatch.entityId) {
          base = Object.values(entities).find(
            (a) => a?.entityId === instancePatch.entityId,
          );
        }
        // if no base, treat patch as a new full attribute (merge over empty)
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
   *
   * Example: facade.updateAttributeByPartial$({ id: 'str', value: 5 })
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
