import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';

import { AdventureEvent } from '../../models/adventure';
import { AdventureEventActions } from './adventure-event.actions';

export interface AdventureEventState extends EntityState<AdventureEvent> {
  loading: boolean;
  loaded: boolean;
  error: string | null;
}

export const adapter = createEntityAdapter<AdventureEvent>();

export const initialState: AdventureEventState = adapter.getInitialState({
  loading: false,
  loaded: false,
  error: null,
});

// auto-generates selectors and reducer registration
export const adventureEventFeature = createFeature({
  name: 'adventureEvent',
  reducer: createReducer(
    initialState,
    // Create
    on(AdventureEventActions.addAdventureEvent, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(AdventureEventActions.addAdventureEventSuccess, (state, { event }) =>
      // `addOne` will only add the entity if it does not already exist (by id)
      adapter.addOne(event, { ...state, loading: false }),
    ),
    on(AdventureEventActions.addAdventureEventFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),
    // Read All
    on(AdventureEventActions.loadAllAdventureEvents, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(
      AdventureEventActions.loadAllAdventureEventsSuccess,
      (state, { events }) =>
        adapter.upsertMany(events, { ...state, loading: false, loaded: true }),
    ),
    on(
      AdventureEventActions.loadAllAdventureEventsFailure,
      (state, { error }) => ({
        ...state,
        loading: false,
        error,
      }),
    ),
    // Read
    on(AdventureEventActions.loadAdventureEvent, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(AdventureEventActions.loadAdventureEventSuccess, (state, { event }) =>
      adapter.upsertOne(event, { ...state, loading: false }),
    ),
    on(AdventureEventActions.loadAdventureEventFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),
    // Update
    on(AdventureEventActions.saveAdventureEvent, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(AdventureEventActions.saveAdventureEventSuccess, (state, { event }) =>
      adapter.upsertOne(event, { ...state, loading: false }),
    ),
    on(AdventureEventActions.saveAdventureEventFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),
    // Delete
    on(AdventureEventActions.removeAdventureEvent, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(AdventureEventActions.removeAdventureEventSuccess, (state, { id }) =>
      adapter.removeOne(id, { ...state, loading: false }),
    ),
    on(
      AdventureEventActions.removeAdventureEventFailure,
      (state, { error }) => ({
        ...state,
        loading: false,
        error,
      }),
    ),
    // Delete All
    on(AdventureEventActions.removeAllAdventureEvents, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(AdventureEventActions.removeAllAdventureEventsSuccess, (state) =>
      adapter.removeAll({
        ...state,
        loading: false,
      }),
    ),
    on(
      AdventureEventActions.removeAllAdventureEventsFailure,
      (state, { error }) => ({
        ...state,
        loading: false,
        error,
      }),
    ),
  ),
});
