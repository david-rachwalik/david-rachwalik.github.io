import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';

import { Character } from '../../models/character';
import { CharacterActions } from './character.actions';

export interface CharacterState extends EntityState<Character> {
  seeded: boolean;
  loading: boolean;
  loaded: boolean;
  saving: boolean;
  error: string | null;
}

export const adapter = createEntityAdapter<Character>();

export const initialState: CharacterState = adapter.getInitialState({
  seeded: false,
  loading: false,
  loaded: false,
  saving: false,
  error: null,
});

// auto-generates selectors and reducer registration
export const characterFeature = createFeature({
  name: 'character',
  reducer: createReducer(
    initialState,

    // Seed load
    on(CharacterActions.seedAllCharactersSuccess, (state, { characters }) =>
      adapter.setAll(characters, { ...state, seeded: true }),
    ),

    // Create
    on(CharacterActions.addCharacter, (state) => ({
      ...state,
      saving: true,
      error: null,
    })),
    on(CharacterActions.addCharacterSuccess, (state, { character }) =>
      // `addOne` will only add the entity if it does not already exist (by id)
      adapter.addOne(character, { ...state, saving: false }),
    ),
    on(CharacterActions.addCharacterFailure, (state, { error }) => ({
      ...state,
      saving: false,
      error,
    })),

    // Read All
    on(CharacterActions.loadAllCharacters, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(CharacterActions.loadAllCharactersSuccess, (state, { characters }) =>
      adapter.upsertMany(characters, {
        ...state,
        loading: false,
        loaded: true,
      }),
    ),
    on(CharacterActions.loadAllCharactersFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),

    // Read
    on(CharacterActions.loadCharacter, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(CharacterActions.loadCharacterSuccess, (state, { character }) =>
      adapter.upsertOne(character, { ...state, loading: false }),
    ),
    on(CharacterActions.loadCharacterFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),

    // Update (optimistic, lets UI immediately reflect changes)
    on(CharacterActions.saveCharacter, (state, { id, changes }) =>
      adapter.updateOne(
        { id, changes },
        { ...state, saving: true, error: null },
      ),
    ),
    on(CharacterActions.saveCharacterSuccess, (state, { character }) =>
      // Full update with actual saved data
      adapter.upsertOne(character, { ...state, saving: false }),
    ),
    on(CharacterActions.saveCharacterFailure, (state, { error }) => ({
      ...state,
      saving: false,
      error,
    })),

    // Update All
    on(CharacterActions.saveAllCharacters, (state) => ({
      ...state,
      saving: true,
      error: null,
    })),
    on(CharacterActions.saveAllCharactersSuccess, (state, { characters }) =>
      adapter.upsertMany(characters, { ...state, saving: false }),
    ),
    on(CharacterActions.saveAllCharactersFailure, (state, { error }) => ({
      ...state,
      saving: false,
      error,
    })),

    // Delete
    on(CharacterActions.removeCharacter, (state) => ({
      ...state,
      saving: true,
      error: null,
    })),
    on(CharacterActions.removeCharacterSuccess, (state, { id }) =>
      adapter.removeOne(id, { ...state, saving: false }),
    ),
    on(CharacterActions.removeCharacterFailure, (state, { error }) => ({
      ...state,
      saving: false,
      error,
    })),

    // Delete All
    on(CharacterActions.removeAllCharacters, (state) => ({
      ...state,
      saving: true,
      error: null,
    })),
    on(CharacterActions.removeAllCharactersSuccess, (state) =>
      adapter.removeAll({
        ...state,
        saving: false,
      }),
    ),
    on(CharacterActions.removeAllCharactersFailure, (state, { error }) => ({
      ...state,
      saving: false,
      error,
    })),
  ),
});
