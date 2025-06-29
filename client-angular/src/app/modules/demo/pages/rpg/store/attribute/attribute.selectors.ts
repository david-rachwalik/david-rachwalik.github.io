import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AttributeState, adapter } from './attribute.reducer';

export const selectAttributeState =
  createFeatureSelector<AttributeState>('attribute');

const { selectAll, selectEntities } = adapter.getSelectors();

export const selectAllAttributes = createSelector(
  selectAttributeState,
  selectAll,
);
export const selectAttributeEntities = createSelector(
  selectAttributeState,
  selectEntities,
);
export const selectAttributeLoading = createSelector(
  selectAttributeState,
  (state) => state.loading,
);
export const selectAttributeLoaded = createSelector(
  selectAttributeState,
  (state) => state.loaded,
);
export const selectAttributeError = createSelector(
  selectAttributeState,
  (state) => state.error,
);
