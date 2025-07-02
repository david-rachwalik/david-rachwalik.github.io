import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';

import { Adventure } from '../../models/adventure';
import { AdventureActions } from './adventure.actions';

const MAX_LOG_ENTRIES = 100;

export interface AdventureState extends EntityState<Adventure> {
  seeded: boolean;
  loaded: boolean;
  loading: boolean;
  error: string | null;
}

export const adapter = createEntityAdapter<Adventure>();

export const initialState: AdventureState = adapter.getInitialState({
  seeded: false,
  loaded: false,
  loading: false,
  error: null,
});

// auto-generates selectors and reducer registration
export const adventureFeature = createFeature({
  name: 'adventure',
  reducer: createReducer(
    initialState,
    // Init adventures
    on(AdventureActions.loadAdventuresSeedSuccess, (state, { adventures }) =>
      adapter.setAll(adventures, {
        ...state,
        seeded: true,
      }),
    ),

    // Create adventure
    on(AdventureActions.addAdventure, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(AdventureActions.addAdventureSuccess, (state, { adventure }) =>
      // adapter.upsertOne(adventure, { ...state, loading: false }),
      // `addOne` will only add the entity if it does not already exist (by id)
      adapter.addOne(adventure, { ...state, loading: false }),
    ),
    on(AdventureActions.addAdventureFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),

    // Load single adventure
    on(AdventureActions.loadAdventure, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(AdventureActions.loadAdventureSuccess, (state, { adventure }) =>
      adapter.upsertOne(adventure, { ...state, loading: false, loaded: true }),
    ),
    // on(AdventureActions.loadAdventureSuccess, (state, { adventure }) => {
    //   console.log('[Reducer] Adventure loaded:', adventure);
    //   return adapter.upsertOne(adventure, {
    //     ...state,
    //     loading: false,
    //     loaded: true,
    //   });
    // }),
    on(AdventureActions.loadAdventureFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),

    // Optimistic update of adventure (lets UI immediately reflect changes)
    on(AdventureActions.saveAdventure, (state, { id, changes }) =>
      adapter.updateOne(
        { id, changes },
        { ...state, loading: true, error: null },
      ),
    ),
    // Update adventure with actual saved data
    on(AdventureActions.saveAdventureSuccess, (state, { adventure }) =>
      adapter.upsertOne(adventure, { ...state, loading: false }),
    ),
    on(AdventureActions.saveAdventureFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),

    // Delete adventure
    on(AdventureActions.removeAdventure, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(AdventureActions.removeAdventureSuccess, (state, { id }) =>
      adapter.removeOne(id, { ...state, loading: false }),
    ),
    on(AdventureActions.removeAdventureFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),

    // Logging
    on(AdventureActions.addLogEntry, (state, { slotId, message }) => {
      const adventure = state.entities[slotId];
      if (!adventure) return state;
      const eventLog = [message, ...(adventure.eventLog ?? [])].slice(
        0,
        MAX_LOG_ENTRIES,
      );
      return {
        ...state,
        entities: {
          ...state.entities,
          [slotId]: { ...adventure, eventLog },
        },
      };
    }),
    on(AdventureActions.clearLog, (state, { slotId }) => {
      const adventure = state.entities[slotId];
      if (!adventure) return state;
      return {
        ...state,
        entities: {
          ...state.entities,
          [slotId]: { ...adventure, eventLog: [] },
        },
      };
    }),

    // Clear all in-memory adventures
    on(AdventureActions.clearAdventure, (state) =>
      adapter.removeAll({
        ...state,
        loaded: false,
        loading: false,
        error: null,
      }),
    ),
  ),
});
