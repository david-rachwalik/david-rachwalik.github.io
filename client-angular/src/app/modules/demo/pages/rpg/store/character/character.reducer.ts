import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';

import { Character } from '../../models/character';
import { CharacterActions } from './character.actions';

export interface CharacterState extends EntityState<Character> {
  loaded: boolean;
  loading: boolean;
  error: string | null;
}

export const adapter = createEntityAdapter<Character>();

export const initialState: CharacterState = adapter.getInitialState({
  loaded: false,
  loading: false,
  error: null,
});

// auto-generates selectors and reducer registration
export const characterFeature = createFeature({
  name: 'character',
  reducer: createReducer(
    initialState,
    on(CharacterActions.loadCharacters, (state) => ({
      ...state,
      loading: true,
    })),
    on(CharacterActions.loadCharactersSuccess, (state, { characters }) =>
      adapter.setAll(characters, { ...state, loading: false, loaded: true }),
    ),
    on(CharacterActions.loadCharactersSeedSuccess, (state, { characters }) =>
      adapter.setAll(characters, {
        ...state,
        loading: false,
        loaded: true,
      }),
    ),
    on(CharacterActions.loadCharactersFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),
    on(CharacterActions.addCharacterSuccess, (state, { character }) =>
      adapter.addOne(character, state),
    ),
    on(CharacterActions.updateCharacterSuccess, (state, { character }) =>
      adapter.upsertOne(character, state),
    ),
    on(CharacterActions.deleteCharacterSuccess, (state, { id }) =>
      adapter.removeOne(id, state),
    ),
  ),
});
