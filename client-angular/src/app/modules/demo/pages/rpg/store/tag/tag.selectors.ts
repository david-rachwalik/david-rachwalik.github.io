import { createSelector } from '@ngrx/store';

import { adapter, tagFeature } from './tag.reducer';

export const { selectTagState } = tagFeature;

export const {
  selectAll: selectAllTags, // Array of all tags
  selectEntities: selectTagEntities, // Dictionary of all tags
  selectIds: selectTagIds, // Array of all tag IDs
  selectTotal: selectTagTotal, // Total number of tags
} = adapter.getSelectors(selectTagState);

// --- Properties ---

// Feature-provided are already root-state selectors
export const {
  selectSeeded: selectTagSeeded,
  selectLoading: selectTagLoading,
  selectLoaded: selectTagLoaded,
  selectError: selectTagError,
} = tagFeature;

// --- Logical Selectors ---

// Selector to get a tag by id
export const selectTagById = (id: string | undefined) =>
  createSelector(selectTagEntities, (entities) =>
    id ? entities[id] : undefined,
  );
