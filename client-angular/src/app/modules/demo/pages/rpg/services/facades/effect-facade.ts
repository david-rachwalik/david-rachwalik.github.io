import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { EFFECTS_CATALOG } from '../../data/game-catalogs';
import {
  extractSaveInstance,
  getEntityFromCatalog,
  mergeInstanceWithCatalog,
} from '../../data/utils-seed';
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

  all$ = this.store.select(selectAllEffects); // for UI
  entities$ = this.store.select(selectEffectEntities); // for lookup

  byId$(id: string) {
    return this.store.select(selectEffectById(id));
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
    const effect: Effect = {
      id,
      entityId,
      dimensionId,
      planeId,
      name,
      kind: 'attribute',
    } as Effect;
    this.store.dispatch(EffectActions.addEffect({ effect }));
  }
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
  // #endregion

  // #region 🔸 Catalog & Instance Domain Logic 🔸

  // Retrieves the pure default template from the active static registry
  getFromCatalog(id: string): Effect | undefined {
    return getEntityFromCatalog(EFFECTS_CATALOG, id);
  }

  // Hydrates a partial instance save file into a complete usable data model
  mergeWithCatalog(instance: EffectInstance) {
    return mergeInstanceWithCatalog(EFFECTS_CATALOG, instance);
  }

  // Convert full Effect → EffectInstance (entityId + diffs)
  // Strips full object down to its bare differences to be saved more efficiently
  toInstance(full: Effect): EffectInstance | undefined {
    const base = this.getFromCatalog(full.entityId);
    if (!base) {
      console.warn(
        `[EffectFacade] Cannot create instance: template not found for entityId "${full.entityId}"`,
      );
      return undefined;
    }

    return extractSaveInstance<Effect>(full, base);
  }
  // #endregion

  // #region 🔸 Effect Logic 🔸

  // Delta: the difference between two values - represents the change/variation in a variable over time or between different states
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
  // #endregion
}
