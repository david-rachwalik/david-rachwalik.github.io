import { createSelector } from '@ngrx/store';

import { adapter, skillFeature } from './skill.reducer';

export const { selectSkillState } = skillFeature;

export const {
  selectAll: selectAllSkills, // Array of all skills
  selectEntities: selectSkillEntities, // Dictionary of all skills
  selectIds: selectSkillIds, // Array of all skill IDs
  selectTotal: selectSkillTotal, // Total number of skills
} = adapter.getSelectors(selectSkillState);

// --- Properties ---

// Feature-provided are already root-state selectors
export const {
  selectSeeded: selectSkillSeeded,
  selectLoading: selectSkillLoading,
  selectLoaded: selectSkillLoaded,
  selectError: selectSkillError,
} = skillFeature;

// --- Logical Selectors ---

// Selector to get a skill by id
export const selectSkillById = (id: string | undefined) =>
  createSelector(selectSkillEntities, (entities) =>
    id ? entities[id] : undefined,
  );
