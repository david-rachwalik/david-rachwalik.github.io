import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';

import { Attribute } from '../../models/attribute';
import { AttributeActions } from './attribute.actions';

export interface AttributeState extends EntityState<Attribute> {
  seeded: boolean; // is static data seed loaded
  loading: boolean;
  loaded: boolean;
  error: string | null;
}

export const adapter = createEntityAdapter<Attribute>();

export const initialState: AttributeState = adapter.getInitialState({
  seeded: false,
  loading: false,
  loaded: false,
  error: null,
});

// auto-generates selectors and reducer registration
export const attributeFeature = createFeature({
  name: 'attribute',
  reducer: createReducer(
    initialState,
    // Seed load
    on(AttributeActions.seedAllAttributesSuccess, (state, { attributes }) =>
      adapter.setAll(attributes, { ...state, seeded: true }),
    ),
    // Create
    on(AttributeActions.addAttribute, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(AttributeActions.addAttributeSuccess, (state, { attribute }) =>
      // `addOne` will only add the entity if it does not already exist (by id)
      adapter.addOne(attribute, { ...state, loading: false }),
    ),
    on(AttributeActions.addAttributeFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),
    // Read All
    on(AttributeActions.loadAllAttributes, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(AttributeActions.loadAllAttributesSuccess, (state, { attributes }) =>
      adapter.upsertMany(attributes, {
        ...state,
        loading: false,
        loaded: true,
      }),
    ),
    on(AttributeActions.loadAllAttributesFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),
    // Read
    on(AttributeActions.loadAttribute, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(AttributeActions.loadAttributeSuccess, (state, { attribute }) =>
      adapter.upsertOne(attribute, { ...state, loading: false }),
    ),
    on(AttributeActions.loadAttributeFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),
    // Update
    on(AttributeActions.saveAttribute, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(AttributeActions.saveAttributeSuccess, (state, { attribute }) =>
      adapter.upsertOne(attribute, { ...state, loading: false }),
    ),
    on(AttributeActions.saveAttributeFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),
    // Delete
    on(AttributeActions.removeAttribute, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(AttributeActions.removeAttributeSuccess, (state, { id }) =>
      adapter.removeOne(id, { ...state, loading: false }),
    ),
    on(AttributeActions.removeAttributeFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),
  ),
});
