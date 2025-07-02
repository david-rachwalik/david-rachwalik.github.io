import { createSelector } from '@ngrx/store';

import { selectCurrentMomentId } from '../app.selectors';
import { adapter, momentFeature } from './moment.reducer';

export const { selectMomentState } = momentFeature;

export const {
  selectAll: selectAllMoments, // Array of all moments
  selectEntities: selectMomentEntities, // Dictionary of all moments
  selectIds: selectMomentIds, // Array of all moment IDs
  selectTotal: selectMomentTotal, // Total number of moments
} = adapter.getSelectors(selectMomentState);

// --- Properties ---

// Feature-provided are already root-state selectors
export const {
  selectLoading: selectMomentLoading,
  selectLoaded: selectMomentLoaded,
  selectError: selectMomentError,
} = momentFeature;

// --- Logical Selectors ---

// Selector to get a moment by id
export const selectMomentById = (id: string | undefined) =>
  createSelector(selectMomentEntities, (entities) =>
    id ? entities[id] : undefined,
  );

export const selectCurrentMoment = createSelector(
  selectCurrentMomentId,
  (momentId) => selectMomentById(momentId),
);
