import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';

import { Adventure } from '../../models/adventure';
import { AdventureActions } from './adventure.actions';

// const MAX_LOG_ENTRIES = 100;

export interface AdventureState extends EntityState<Adventure> {
  seeded: boolean; // for initial load
  loading: boolean; // for any async operation
  loaded: boolean; // for initial load
  error: string | null; // for any async operation
}

export const adapter = createEntityAdapter<Adventure>();

export const initialState: AdventureState = adapter.getInitialState({
  seeded: false,
  loading: false,
  loaded: false,
  error: null,
});

// auto-generates selectors and reducer registration
export const adventureFeature = createFeature({
  name: 'adventure',
  reducer: createReducer(
    initialState,
    // Seed load
    on(AdventureActions.seedAllAdventuresSuccess, (state, { adventures }) =>
      adapter.setAll(adventures, { ...state, seeded: true }),
    ),
    // Create
    on(AdventureActions.addAdventure, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(AdventureActions.addAdventureSuccess, (state, { adventure }) =>
      // `addOne` will only add the entity if it does not already exist (by id)
      adapter.addOne(adventure, { ...state, loading: false }),
    ),
    on(AdventureActions.addAdventureFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),
    // Read All
    on(AdventureActions.loadAllAdventures, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(AdventureActions.loadAllAdventuresSuccess, (state, { adventures }) =>
      adapter.upsertMany(adventures, {
        ...state,
        loading: false,
        loaded: true,
      }),
    ),
    on(AdventureActions.loadAllAdventuresFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),
    // Read
    on(AdventureActions.loadAdventure, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(AdventureActions.loadAdventureSuccess, (state, { adventure }) =>
      adapter.upsertOne(adventure, { ...state, loading: false }),
    ),
    on(AdventureActions.loadAdventureFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),
    // Update (optimistic, lets UI immediately reflect changes)
    on(AdventureActions.saveAdventure, (state, { id, changes }) =>
      adapter.updateOne(
        { id, changes },
        { ...state, loading: true, error: null },
      ),
    ),
    // Update with actual saved data
    on(AdventureActions.saveAdventureSuccess, (state, { adventure }) =>
      adapter.upsertOne(adventure, { ...state, loading: false }),
    ),
    on(AdventureActions.saveAdventureFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),
    // Delete
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

    // // Logging
    // on(AdventureActions.addLogEntry, (state, { slotId, message }) => {
    //   const adventure = state.entities[slotId];
    //   if (!adventure) return state;
    //   const eventLog = [message, ...(adventure.eventLog ?? [])].slice(
    //     0,
    //     MAX_LOG_ENTRIES,
    //   );
    //   return {
    //     ...state,
    //     entities: {
    //       ...state.entities,
    //       [slotId]: { ...adventure, eventLog },
    //     },
    //   };
    // }),
    // on(AdventureActions.clearLog, (state, { slotId }) => {
    //   const adventure = state.entities[slotId];
    //   if (!adventure) return state;
    //   return {
    //     ...state,
    //     entities: {
    //       ...state.entities,
    //       [slotId]: { ...adventure, eventLog: [] },
    //     },
    //   };
    // }),

    // // Clear all in-memory adventures
    // on(AdventureActions.clearAdventure, (state) =>
    //   adapter.removeAll({
    //     ...state,
    //     loaded: false,
    //     loading: false,
    //     error: null,
    //   }),
    // ),
  ),
});
