import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';

import { Moment } from '../../models/moment';
import { MomentActions } from './moment.actions';

export interface MomentState extends EntityState<Moment> {
  loaded: boolean;
  loading: boolean;
  error: string | null;
  currentSlotId: string | null;
}

export const adapter = createEntityAdapter<Moment>();

export const initialState: MomentState = adapter.getInitialState({
  loaded: false,
  loading: false,
  error: null,
  currentSlotId: null,
});

// auto-generates selectors and reducer registration
export const momentFeature = createFeature({
  name: 'moment',
  reducer: createReducer(
    initialState,
    on(MomentActions.loadMoments, (state) => ({
      ...state,
      loading: true,
    })),
    on(MomentActions.loadMomentsSuccess, (state, { moments }) =>
      adapter.setAll(moments, { ...state, loading: false, loaded: true }),
    ),
    on(MomentActions.loadMomentsSeedSuccess, (state, { moments }) =>
      adapter.setAll(moments, {
        ...state,
        loading: false,
        loaded: true,
      }),
    ),
    on(MomentActions.loadMomentsFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),
    on(MomentActions.addMomentSuccess, (state, { moment }) =>
      adapter.addOne(moment, state),
    ),
    on(MomentActions.updateMomentSuccess, (state, { moment }) =>
      adapter.upsertOne(moment, state),
    ),
    on(MomentActions.deleteMomentSuccess, (state, { id }) =>
      adapter.removeOne(id, state),
    ),
  ),
});
