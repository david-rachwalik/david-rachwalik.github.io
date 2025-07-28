import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';

import { Effect } from '../../models/effect';
import { EffectActions } from './effect.actions';

export interface EffectState extends EntityState<Effect> {
  seeded: boolean; // for initial load
  loading: boolean; // for any async operation
  loaded: boolean; // for initial load
  error: string | null; // for any async operation
}

export const adapter = createEntityAdapter<Effect>();

export const initialState: EffectState = adapter.getInitialState({
  seeded: false,
  loading: false,
  loaded: false,
  error: null,
});

// auto-generates selectors and reducer registration
export const effectFeature = createFeature({
  name: 'effect',
  reducer: createReducer(
    initialState,
    // Seed load
    on(EffectActions.seedAllEffectsSuccess, (state, { effects }) =>
      adapter.setAll(effects, { ...state, seeded: true }),
    ),
    // Create
    on(EffectActions.addEffect, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(EffectActions.addEffectSuccess, (state, { effect }) =>
      // `addOne` will only add the entity if it does not already exist (by id)
      adapter.addOne(effect, { ...state, loading: false }),
    ),
    on(EffectActions.addEffectFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),
    // Read All
    on(EffectActions.loadAllEffects, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(EffectActions.loadAllEffectsSuccess, (state, { effects }) =>
      adapter.upsertMany(effects, { ...state, loading: false, loaded: true }),
    ),
    on(EffectActions.loadAllEffectsFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),
    // Read
    on(EffectActions.loadEffect, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(EffectActions.loadEffectSuccess, (state, { effect }) =>
      adapter.upsertOne(effect, { ...state, loading: false }),
    ),
    on(EffectActions.loadEffectFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),
    // Update
    on(EffectActions.saveEffect, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(EffectActions.saveEffectSuccess, (state, { effect }) =>
      adapter.upsertOne(effect, { ...state, loading: false }),
    ),
    on(EffectActions.saveEffectFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),
    // Delete
    on(EffectActions.removeEffect, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(EffectActions.removeEffectSuccess, (state, { id }) =>
      adapter.removeOne(id, { ...state, loading: false }),
    ),
    on(EffectActions.removeEffectFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),
  ),
});
