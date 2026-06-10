import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';

import { Attribute } from '../../models/attribute';
import { AttributeActions } from './attribute.actions';

export interface AttributeState extends EntityState<Attribute> {
  seeded: boolean;
  loading: boolean;
  loaded: boolean;
  saving: boolean;
  error: string | null;
}

export const adapter = createEntityAdapter<Attribute>();

export const initialState: AttributeState = adapter.getInitialState({
  seeded: false,
  loading: false,
  loaded: false,
  saving: false,
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
      saving: true,
      error: null,
    })),
    on(AttributeActions.addAttributeSuccess, (state, { attribute }) =>
      // `addOne` will only add the entity if it does not already exist (by id)
      adapter.addOne(attribute, { ...state, saving: false }),
    ),
    on(AttributeActions.addAttributeFailure, (state, { error }) => ({
      ...state,
      saving: false,
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

    // Update (optimistic, lets UI immediately reflect changes)
    on(AttributeActions.saveAttribute, (state, { id, changes }) =>
      adapter.updateOne(
        { id, changes },
        { ...state, saving: true, error: null },
      ),
    ),
    // Full update with actual saved data
    on(AttributeActions.saveAttributeSuccess, (state, { attribute }) =>
      adapter.upsertOne(attribute, { ...state, saving: false }),
    ),
    on(AttributeActions.saveAttributeFailure, (state, { error }) => ({
      ...state,
      saving: false,
      error,
    })),

    // Delete
    on(AttributeActions.removeAttribute, (state) => ({
      ...state,
      saving: true,
      error: null,
    })),
    on(AttributeActions.removeAttributeSuccess, (state, { id }) =>
      adapter.removeOne(id, { ...state, saving: false }),
    ),
    on(AttributeActions.removeAttributeFailure, (state, { error }) => ({
      ...state,
      saving: false,
      error,
    })),
  ),
});
