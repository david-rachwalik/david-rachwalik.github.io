import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';

import { Item } from '../../models/item';
import { ItemActions } from './item.actions';

export interface ItemState extends EntityState<Item> {
  seeded: boolean; // for initial load
  loading: boolean; // for any async operation
  loaded: boolean; // for initial load
  error: string | null; // for any async operation
}

export const adapter = createEntityAdapter<Item>();

export const initialState: ItemState = adapter.getInitialState({
  seeded: false,
  loading: false,
  loaded: false,
  error: null,
});

// auto-generates selectors and reducer registration
export const itemFeature = createFeature({
  name: 'item',
  reducer: createReducer(
    initialState,
    // Seed load
    on(ItemActions.seedAllItemsSuccess, (state, { items }) =>
      adapter.setAll(items, { ...state, seeded: true }),
    ),
    // Create
    on(ItemActions.addItem, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(ItemActions.addItemSuccess, (state, { item }) =>
      // `addOne` will only add the entity if it does not already exist (by id)
      adapter.addOne(item, { ...state, loading: false }),
    ),
    on(ItemActions.addItemFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),
    // Read All
    on(ItemActions.loadAllItems, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(ItemActions.loadAllItemsSuccess, (state, { items }) =>
      adapter.upsertMany(items, { ...state, loading: false, loaded: true }),
    ),
    on(ItemActions.loadAllItemsFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),
    // Read
    on(ItemActions.loadItem, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(ItemActions.loadItemSuccess, (state, { item }) =>
      adapter.upsertOne(item, { ...state, loading: false }),
    ),
    on(ItemActions.loadItemFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),
    // Update
    on(ItemActions.saveItem, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(ItemActions.saveItemSuccess, (state, { item }) =>
      adapter.upsertOne(item, { ...state, loading: false }),
    ),
    on(ItemActions.saveItemFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),
    // Delete
    on(ItemActions.removeItem, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(ItemActions.removeItemSuccess, (state, { id }) =>
      adapter.removeOne(id, { ...state, loading: false }),
    ),
    on(ItemActions.removeItemFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),
  ),
});
