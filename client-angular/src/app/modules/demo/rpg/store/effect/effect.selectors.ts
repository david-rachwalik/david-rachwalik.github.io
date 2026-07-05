import { createSelector } from '@ngrx/store';

import { adapter, effectFeature } from './effect.reducer';

export const { selectEffectState } = effectFeature;

export const {
  selectAll: selectAllEffects, // Array of all effects
  selectEntities: selectEffectEntities, // Dictionary of all effects
  selectIds: selectEffectIds, // Array of all effect IDs
  selectTotal: selectEffectTotal, // Total number of effects
} = adapter.getSelectors(selectEffectState);

// --- Properties ---

// Feature-provided are already root-state selectors
export const {
  selectSeeded: selectEffectSeeded,
  selectLoading: selectEffectLoading,
  selectLoaded: selectEffectLoaded,
  selectError: selectEffectError,
} = effectFeature;

// --- Logical Selectors ---

// Selector to get a effect by id
export const selectEffectById = (id: string | undefined) =>
  createSelector(selectEffectEntities, (entities) =>
    id ? entities[id] : undefined,
  );
