import { createSelector } from '@ngrx/store';

import { adapter, itemFeature } from './item.reducer';

export const { selectItemState } = itemFeature;

export const {
  selectAll: selectAllItems, // Array of all items
  selectEntities: selectItemEntities, // Dictionary of all items
  selectIds: selectItemIds, // Array of all item IDs
  selectTotal: selectItemTotal, // Total number of items
} = adapter.getSelectors(selectItemState);

// --- Properties ---

// Feature-provided are already root-state selectors
export const {
  selectSeeded: selectItemSeeded,
  selectLoading: selectItemLoading,
  selectLoaded: selectItemLoaded,
  selectError: selectItemError,
} = itemFeature;

// --- Logical Selectors ---

// Selector to get a item by id
export const selectItemById = (id: string | undefined) =>
  createSelector(selectItemEntities, (entities) =>
    id ? entities[id] : undefined,
  );
