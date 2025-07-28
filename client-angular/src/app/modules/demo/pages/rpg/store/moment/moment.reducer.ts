import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';

import { Moment } from '../../models/moment';
import { MomentActions } from './moment.actions';

export interface MomentState extends EntityState<Moment> {
  seeded: boolean; // for initial load
  loading: boolean; // for any async operation
  loaded: boolean; // for initial load
  error: string | null; // for any async operation
}

export const adapter = createEntityAdapter<Moment>();

export const initialState: MomentState = adapter.getInitialState({
  seeded: false,
  loading: false,
  loaded: false,
  error: null,
});

// auto-generates selectors and reducer registration
export const momentFeature = createFeature({
  name: 'moment',
  reducer: createReducer(
    initialState,
    // Seed load
    on(MomentActions.seedAllMomentsSuccess, (state, { moments }) =>
      adapter.setAll(moments, { ...state, seeded: true }),
    ),
    // Create
    on(MomentActions.addMoment, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(MomentActions.addMomentSuccess, (state, { moment }) =>
      // `addOne` will only add the entity if it does not already exist (by id)
      adapter.addOne(moment, { ...state, loading: false }),
    ),
    on(MomentActions.addMomentFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),
    // Read All
    on(MomentActions.loadAllMoments, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(MomentActions.loadAllMomentsSuccess, (state, { moments }) =>
      adapter.upsertMany(moments, { ...state, loading: false, loaded: true }),
    ),
    on(MomentActions.loadAllMomentsFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),
    // Read
    on(MomentActions.loadMoment, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(MomentActions.loadMomentSuccess, (state, { moment }) =>
      adapter.upsertOne(moment, { ...state, loading: false }),
    ),
    on(MomentActions.loadMomentFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),
    // Update
    on(MomentActions.saveMoment, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(MomentActions.saveMomentSuccess, (state, { moment }) =>
      adapter.upsertOne(moment, { ...state, loading: false }),
    ),
    on(MomentActions.saveMomentFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),
    // Delete
    on(MomentActions.removeMoment, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(MomentActions.removeMomentSuccess, (state, { id }) =>
      adapter.removeOne(id, { ...state, loading: false }),
    ),
    on(MomentActions.removeMomentFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),
  ),
});
