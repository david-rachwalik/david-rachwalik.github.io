import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { getEffectInstanceFromCatalog } from '../../data/effects-seed';
import { AttributeInstance } from '../../models/attribute';
import { Effect, EffectInstance } from '../../models/effect';
import { EffectActions } from '../../store/effect/effect.actions';
import {
  selectAllEffects,
  selectEffectById,
  selectEffectEntities,
} from '../../store/effect/effect.selectors';

@Injectable({ providedIn: 'root' })
export class EffectFacade {
  constructor(private store: Store) {}

  // #region 🔸 NgRx Selectors 🔸

  all$ = this.store.select(selectAllEffects);
  entities$ = this.store.select(selectEffectEntities);
  // #endregion

  // #region 🔸 Feature CRUD Methods 🔸
  add(effect: Effect) {
    this.store.dispatch(EffectActions.addEffect({ effect }));
  }
  loadAll() {
    this.store.dispatch(EffectActions.loadAllEffects());
  }
  save(changes: EffectInstance) {
    if (!changes.id) {
      console.warn(
        '[EffectFacade] Save aborted: Instance is missing ID',
        changes,
      );
      return;
    }
    this.store.dispatch(EffectActions.saveEffect({ id: changes.id, changes }));
  }
  remove(id: string) {
    this.store.dispatch(EffectActions.removeEffect({ id }));
  }
  byId$(id: string) {
    return this.store.select(selectEffectById(id));
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

  // #region 🔸 Effect Logic 🔸

  calculateAttributeDelta(
    effect: Effect,
    currentInstance: AttributeInstance | undefined,
    attributeId: string,
  ): AttributeInstance {
    const current = Number(
      currentInstance?.value ?? currentInstance?.default ?? 0,
    );

    let delta: number = 0; // amount to add, subtract, or multiply
    if (typeof effect.value === 'number') delta = effect.value;
    else if (typeof effect.defaultValue === 'number')
      delta = effect.defaultValue;

    let newValue = current;
    switch (effect.operation) {
      case 'add':
        newValue = current + delta;
        break;
      case 'subtract':
        newValue = current - delta;
        break;
      case 'set':
        newValue = delta;
        break;
      case 'multiply':
        newValue = current * (delta || 1);
        break;
      default:
        console.warn(`[Math] Unsupported operation: ${effect.operation}`);
    }

    const min =
      typeof currentInstance?.min === 'number'
        ? currentInstance.min
        : undefined;
    const max =
      typeof currentInstance?.max === 'number'
        ? currentInstance.max
        : undefined;

    if (typeof min === 'number') newValue = Math.max(min, newValue);
    if (typeof max === 'number') newValue = Math.min(max, newValue);

    return currentInstance
      ? { ...currentInstance, value: newValue }
      : { id: attributeId, value: newValue };
  }

  // Convert full Effect → EffectInstance (entityId + diffs)
  effectToInstance(full: Effect): EffectInstance | undefined {
    const base = getEffectInstanceFromCatalog(full.entityId);
    console.group('[effectToInstance]');
    console.log('Full Effect:', full);
    console.log('Catalog Effect:', base);
    // if (!base) return undefined;
    if (!base) {
      console.warn('No catalog effect found for entityId:', full.entityId);
      console.groupEnd();
      return undefined;
    }
    // const patch = CharacterFacade.diffFromBase<Effect>(full, base, [
    //   'id',
    //   'entityId',
    //   'dimensionId',
    //   'planeId',
    // ] as const);
    // const out: EffectInstance = {
    //   entityId: full.entityId,
    //   ...(full.id ? ({ id: full.id } as Pick<EffectInstance, 'id'>) : {}),
    //   ...(patch as Partial<EffectInstance>),
    // };
    const patch = EffectFacade.diffFromBase<Effect>(full, base);
    const out: EffectInstance = {
      entityId: full.entityId,
      ...patch,
    };
    console.log('EffectInstance:', out);
    console.groupEnd();
    return out;
  }
  // #endregion
}
