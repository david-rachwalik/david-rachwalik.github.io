import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';

import { AdventureIndex } from '../../models/adventure';
import { AdventureIndexActions } from './adventure-index.actions';

export interface AdventureIndexState extends EntityState<AdventureIndex> {
  loaded: boolean;
  loading: boolean;
  error: string | null;
}

export const adapter = createEntityAdapter<AdventureIndex>();

export const initialState: AdventureIndexState = adapter.getInitialState({
  loaded: false,
  loading: false,
  error: null,
});

// auto-generates selectors and reducer registration
export const adventureIndexFeature = createFeature({
  name: 'adventureIndex',
  reducer: createReducer(
    initialState,

    // Create adventure index
    on(AdventureIndexActions.addAdventureIndex, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(AdventureIndexActions.addAdventureIndexSuccess, (state, { index }) =>
      adapter.addOne(index, { ...state, loading: false }),
    ),
    on(AdventureIndexActions.addAdventureIndexFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),

    // Load all indexes
    on(AdventureIndexActions.loadAdventureIndexes, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(AdventureIndexActions.loadAdventureIndexesSuccess, (state, { slots }) =>
      adapter.setAll(slots, { ...state, loading: false, loaded: true }),
    ),
    on(
      AdventureIndexActions.loadAdventureIndexesFailure,
      (state, { error }) => ({
        ...state,
        loading: false,
        error,
      }),
    ),

    // Optimistic update of adventure index (lets UI immediately reflect changes)
    on(AdventureIndexActions.saveAdventureIndex, (state, { id, changes }) =>
      adapter.updateOne(
        { id, changes },
        { ...state, loading: true, error: null },
      ),
    ),
    // Update adventure index with actual saved data
    on(AdventureIndexActions.saveAdventureIndexSuccess, (state, { index }) =>
      adapter.upsertOne(index, { ...state, loading: false }),
    ),
    on(AdventureIndexActions.saveAdventureIndexFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),

    // Delete adventure index
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
  ),
});
