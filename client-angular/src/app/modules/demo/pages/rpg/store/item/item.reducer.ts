import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';

import { Item } from '../../models/item';
import { ItemActions } from './item.actions';

export interface ItemState extends EntityState<Item> {
  loaded: boolean;
  loading: boolean;
  error: string | null;
}

export const adapter = createEntityAdapter<Item>();

export const initialState: ItemState = adapter.getInitialState({
  loaded: false,
  loading: false,
  error: null,
});

// auto-generates selectors and reducer registration
export const itemFeature = createFeature({
  name: 'item',
  reducer: createReducer(
    initialState,
    on(ItemActions.loadItems, (state) => ({
      ...state,
      loading: true,
    })),
    on(ItemActions.loadItemsSuccess, (state, { items }) =>
      adapter.setAll(items, { ...state, loading: false, loaded: true }),
    ),
    on(ItemActions.loadItemsSeedSuccess, (state, { items }) =>
      adapter.setAll(items, {
        ...state,
        loading: false,
        loaded: true,
      }),
    ),
    on(ItemActions.loadItemsFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),
    on(ItemActions.addItemSuccess, (state, { item }) =>
      adapter.addOne(item, state),
    ),
    on(ItemActions.updateItemSuccess, (state, { item }) =>
      adapter.upsertOne(item, state),
    ),
    on(ItemActions.deleteItemSuccess, (state, { id }) =>
      adapter.removeOne(id, state),
    ),
  ),
});
