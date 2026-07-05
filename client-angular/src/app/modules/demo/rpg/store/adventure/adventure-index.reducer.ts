import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';

import { AdventureIndex } from '../../models/adventure';
import { AdventureIndexActions } from './adventure-index.actions';

export interface AdventureIndexState extends EntityState<AdventureIndex> {
  loading: boolean;
  loaded: boolean;
  error: string | null;
}

export const adapter = createEntityAdapter<AdventureIndex>();

export const initialState: AdventureIndexState = adapter.getInitialState({
  loading: false,
  loaded: false,
  error: null,
});

// auto-generates selectors and reducer registration
export const adventureIndexFeature = createFeature({
  name: 'adventureIndex',
  reducer: createReducer(
    initialState,
    // Create
    on(AdventureIndexActions.addAdventureIndex, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(AdventureIndexActions.addAdventureIndexSuccess, (state, { index }) =>
      // `addOne` will only add the entity if it does not already exist (by id)
      adapter.addOne(index, { ...state, loading: false }),
    ),
    on(AdventureIndexActions.addAdventureIndexFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),
    // Read All
    on(AdventureIndexActions.loadAllAdventureIndexes, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(
      AdventureIndexActions.loadAllAdventureIndexesSuccess,
      (state, { slots }) =>
        adapter.upsertMany(slots, { ...state, loading: false, loaded: true }),
    ),
    on(
      AdventureIndexActions.loadAllAdventureIndexesFailure,
      (state, { error }) => ({
        ...state,
        loading: false,
        error,
      }),
    ),
    // Update
    on(AdventureIndexActions.saveAdventureIndex, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(AdventureIndexActions.saveAdventureIndexSuccess, (state, { index }) =>
      adapter.upsertOne(index, { ...state, loading: false }),
    ),
    on(AdventureIndexActions.saveAdventureIndexFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),
    // Delete
    on(AdventureIndexActions.removeAdventureIndex, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(AdventureIndexActions.removeAdventureIndexSuccess, (state, { id }) =>
      adapter.removeOne(id, { ...state, loading: false }),
    ),
    on(
      AdventureIndexActions.removeAdventureIndexFailure,
      (state, { error }) => ({
        ...state,
        loading: false,
        error,
      }),
    ),
    // Delete All
    on(AdventureIndexActions.removeAllAdventureIndexes, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(AdventureIndexActions.removeAllAdventureIndexesSuccess, (state) =>
      adapter.removeAll({
        ...state,
        loading: false,
      }),
    ),
    on(
      AdventureIndexActions.removeAllAdventureIndexesFailure,
      (state, { error }) => ({
        ...state,
        loading: false,
        error,
      }),
    ),
  ),
});
