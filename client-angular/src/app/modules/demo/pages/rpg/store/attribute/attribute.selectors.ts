import { createSelector } from '@ngrx/store';

import { adapter, attributeFeature } from './attribute.reducer';

export const { selectAttributeState } = attributeFeature;

export const {
  selectAll: selectAllAttributes, // Array of all attributes
  selectEntities: selectAttributeEntities, // Dictionary of all attributes
  selectIds: selectAttributeIds, // Array of all attribute IDs
  selectTotal: selectAttributeTotal, // Total number of attributes
} = adapter.getSelectors(selectAttributeState);

// --- Properties ---

// Feature-provided are already root-state selectors
export const {
  selectSeeded: selectAttributeSeeded,
  selectLoading: selectAttributeLoading,
  selectLoaded: selectAttributeLoaded,
  selectError: selectAttributeError,
} = attributeFeature;

// --- Logical Selectors ---

// Selector to get a attribute by id
export const selectAttributeById = (id: string | undefined) =>
  createSelector(selectAttributeEntities, (entities) =>
    id ? entities[id] : undefined,
  );
