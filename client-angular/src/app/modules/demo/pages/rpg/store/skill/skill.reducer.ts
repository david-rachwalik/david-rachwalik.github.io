import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';

import { Skill } from '../../models/skill';
import { SkillActions } from './skill.actions';

export interface SkillState extends EntityState<Skill> {
  seeded: boolean; // for initial load
  loading: boolean; // for any async operation
  loaded: boolean; // for initial load
  error: string | null; // for any async operation
}

export const adapter = createEntityAdapter<Skill>();

export const initialState: SkillState = adapter.getInitialState({
  seeded: false,
  loading: false,
  loaded: false,
  error: null,
});

// auto-generates selectors and reducer registration
export const skillFeature = createFeature({
  name: 'skill',
  reducer: createReducer(
    initialState,
    // Seed load
    on(SkillActions.seedAllSkillsSuccess, (state, { skills }) =>
      adapter.setAll(skills, { ...state, seeded: true }),
    ),
    // Create
    on(SkillActions.addSkill, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(SkillActions.addSkillSuccess, (state, { skill }) =>
      // `addOne` will only add the entity if it does not already exist (by id)
      adapter.addOne(skill, { ...state, loading: false }),
    ),
    on(SkillActions.addSkillFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),
    // Read All
    on(SkillActions.loadAllSkills, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(SkillActions.loadAllSkillsSuccess, (state, { skills }) =>
      adapter.upsertMany(skills, { ...state, loading: false, loaded: true }),
    ),
    on(SkillActions.loadAllSkillsFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),
    // Read
    on(SkillActions.loadSkill, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(SkillActions.loadSkillSuccess, (state, { skill }) =>
      adapter.upsertOne(skill, { ...state, loading: false }),
    ),
    on(SkillActions.loadSkillFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),
    // Update
    on(SkillActions.saveSkill, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(SkillActions.saveSkillSuccess, (state, { skill }) =>
      adapter.upsertOne(skill, { ...state, loading: false }),
    ),
    on(SkillActions.saveSkillFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),
    // Delete
    on(SkillActions.removeSkill, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(SkillActions.removeSkillSuccess, (state, { id }) =>
      adapter.removeOne(id, { ...state, loading: false }),
    ),
    on(SkillActions.removeSkillFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),
  ),
});
