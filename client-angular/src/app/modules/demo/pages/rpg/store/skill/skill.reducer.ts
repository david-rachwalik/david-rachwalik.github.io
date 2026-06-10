import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';

import { Skill } from '../../models/skill';
import { SkillActions } from './skill.actions';

export interface SkillState extends EntityState<Skill> {
  seeded: boolean;
  loading: boolean;
  loaded: boolean;
  saving: boolean;
  error: string | null;
}

export const adapter = createEntityAdapter<Skill>();

export const initialState: SkillState = adapter.getInitialState({
  seeded: false,
  loading: false,
  loaded: false,
  saving: false,
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
      saving: true,
      error: null,
    })),
    on(SkillActions.addSkillSuccess, (state, { skill }) =>
      // `addOne` will only add the entity if it does not already exist (by id)
      adapter.addOne(skill, { ...state, saving: false }),
    ),
    on(SkillActions.addSkillFailure, (state, { error }) => ({
      ...state,
      saving: false,
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

    // Update (optimistic, lets UI immediately reflect changes)
    on(SkillActions.saveSkill, (state, { id, changes }) =>
      adapter.updateOne(
        { id, changes },
        { ...state, saving: true, error: null },
      ),
    ),
    // Full update with actual saved data
    on(SkillActions.saveSkillSuccess, (state, { skill }) =>
      adapter.upsertOne(skill, { ...state, saving: false }),
    ),
    on(SkillActions.saveSkillFailure, (state, { error }) => ({
      ...state,
      saving: false,
      error,
    })),

    // Delete
    on(SkillActions.removeSkill, (state) => ({
      ...state,
      saving: true,
      error: null,
    })),
    on(SkillActions.removeSkillSuccess, (state, { id }) =>
      adapter.removeOne(id, { ...state, saving: false }),
    ),
    on(SkillActions.removeSkillFailure, (state, { error }) => ({
      ...state,
      saving: false,
      error,
    })),
  ),
});
