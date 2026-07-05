import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';

import { Tag } from '../../models/tag';
import { TagActions } from './tag.actions';

export interface TagState extends EntityState<Tag> {
  seeded: boolean;
  loading: boolean;
  loaded: boolean;
  saving: boolean;
  error: string | null;
}

export const adapter = createEntityAdapter<Tag>();

export const initialState: TagState = adapter.getInitialState({
  seeded: false,
  loading: false,
  loaded: false,
  saving: false,
  error: null,
});

// auto-generates selectors and reducer registration
export const tagFeature = createFeature({
  name: 'tag',
  reducer: createReducer(
    initialState,

    // Seed load
    on(TagActions.seedAllTagsSuccess, (state, { tags }) =>
      adapter.setAll(tags, { ...state, seeded: true }),
    ),

    // Create
    on(TagActions.addTag, (state) => ({
      ...state,
      saving: true,
      error: null,
    })),
    on(TagActions.addTagSuccess, (state, { tag }) =>
      // `addOne` will only add the entity if it does not already exist (by id)
      adapter.addOne(tag, { ...state, saving: false }),
    ),
    on(TagActions.addTagFailure, (state, { error }) => ({
      ...state,
      saving: false,
      error,
    })),

    // Read All
    on(TagActions.loadAllTags, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(TagActions.loadAllTagsSuccess, (state, { tags }) =>
      adapter.upsertMany(tags, {
        ...state,
        loading: false,
        loaded: true,
      }),
    ),
    on(TagActions.loadAllTagsFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),

    // Read
    on(TagActions.loadTag, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(TagActions.loadTagSuccess, (state, { tag }) =>
      adapter.upsertOne(tag, { ...state, loading: false }),
    ),
    on(TagActions.loadTagFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),

    // Update (optimistic, lets UI immediately reflect changes)
    on(TagActions.saveTag, (state, { id, changes }) =>
      adapter.updateOne(
        { id, changes },
        { ...state, saving: true, error: null },
      ),
    ),
    // Full update with actual saved data
    on(TagActions.saveTagSuccess, (state, { tag }) =>
      adapter.upsertOne(tag, { ...state, saving: false }),
    ),
    on(TagActions.saveTagFailure, (state, { error }) => ({
      ...state,
      saving: false,
      error,
    })),

    // Delete
    on(TagActions.removeTag, (state) => ({
      ...state,
      saving: true,
      error: null,
    })),
    on(TagActions.removeTagSuccess, (state, { id }) =>
      adapter.removeOne(id, { ...state, saving: false }),
    ),
    on(TagActions.removeTagFailure, (state, { error }) => ({
      ...state,
      saving: false,
      error,
    })),
  ),
});
