import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';

import { Tag } from '../../models/tag';
import { TagActions } from './tag.actions';

export interface TagState extends EntityState<Tag> {
  loaded: boolean;
  loading: boolean;
  error: string | null;
}

export const adapter = createEntityAdapter<Tag>();

export const initialState: TagState = adapter.getInitialState({
  loaded: false,
  loading: false,
  error: null,
});

// auto-generates selectors and reducer registration
export const tagFeature = createFeature({
  name: 'tag',
  reducer: createReducer(
    initialState,
    on(TagActions.loadTags, (state) => ({
      ...state,
      loading: true,
    })),
    on(TagActions.loadTagsSuccess, (state, { tags }) =>
      adapter.setAll(tags, { ...state, loading: false, loaded: true }),
    ),
    on(TagActions.loadTagsSeedSuccess, (state, { tags }) =>
      adapter.setAll(tags, {
        ...state,
        loading: false,
        loaded: true,
      }),
    ),
    on(TagActions.loadTagsFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),
    on(TagActions.addTagSuccess, (state, { tag }) =>
      adapter.addOne(tag, state),
    ),
    on(TagActions.updateTagSuccess, (state, { tag }) =>
      adapter.upsertOne(tag, state),
    ),
    on(TagActions.deleteTagSuccess, (state, { id }) =>
      adapter.removeOne(id, state),
    ),
  ),
});
