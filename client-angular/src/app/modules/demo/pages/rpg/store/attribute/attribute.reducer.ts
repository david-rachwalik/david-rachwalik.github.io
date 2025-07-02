import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';

import { Attribute } from '../../models/attribute';
import { AttributeActions } from './attribute.actions';

export interface AttributeState extends EntityState<Attribute> {
  loaded: boolean;
  loading: boolean;
  // seeded: boolean; // is static data seed loaded
  error: string | null;
}

export const adapter = createEntityAdapter<Attribute>();

export const initialState: AttributeState = adapter.getInitialState({
  loaded: false,
  loading: false,
  // seeded: false,
  error: null,
});

// auto-generates selectors and reducer registration
export const attributeFeature = createFeature({
  name: 'attribute',
  reducer: createReducer(
    initialState,
    on(AttributeActions.loadAttributes, (state) => ({
      ...state,
      loading: true,
    })),
    on(AttributeActions.loadAttributesSuccess, (state, { attributes }) =>
      adapter.setAll(attributes, { ...state, loading: false, loaded: true }),
    ),
    on(AttributeActions.loadAttributesSeedSuccess, (state, { attributes }) =>
      adapter.setAll(attributes, {
        ...state,
        loading: false,
        loaded: true,
        // seeded: true,
      }),
    ),
    on(AttributeActions.loadAttributesFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),
    on(AttributeActions.addAttributeSuccess, (state, { attribute }) =>
      adapter.addOne(attribute, state),
    ),
    on(AttributeActions.updateAttributeSuccess, (state, { attribute }) =>
      adapter.upsertOne(attribute, state),
    ),
    on(AttributeActions.deleteAttributeSuccess, (state, { id }) =>
      adapter.removeOne(id, state),
    ),
  ),
});
