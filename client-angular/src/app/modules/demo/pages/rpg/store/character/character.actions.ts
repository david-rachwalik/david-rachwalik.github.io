import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Character } from '../../models/character';

export const CharacterActions = createActionGroup({
  source: 'Character',
  events: {
    'Seed All Characters': emptyProps(),
    'Seed All Characters Success': props<{ characters: Character[] }>(),
    'Seed All Characters Failure': props<{ error: string }>(),

    // Create
    'Add Character': props<{ character: Character }>(),
    'Add Character Success': props<{ character: Character }>(),
    'Add Character Failure': props<{ error: string }>(),

    // Read
    'Load All Characters': emptyProps(),
    'Load All Characters Success': props<{ characters: Character[] }>(),
    'Load All Characters Failure': props<{ error: string }>(),

    'Load Character': props<{ id: string }>(),
    'Load Character Success': props<{ character: Character }>(),
    'Load Character Failure': props<{ error: string }>(),

    // Update (with partial changes)
    'Save Character': props<{ id: string; changes: Partial<Character> }>(),
    'Save Character Success': props<{ character: Character }>(),
    'Save Character Failure': props<{ error: string }>(),

    'Save All Characters': props<{ characters: Character[] }>(),
    'Save All Characters Success': props<{ characters: Character[] }>(),
    'Save All Characters Failure': props<{ error: string }>(),

    // Delete
    'Remove Character': props<{ id: string }>(),
    'Remove Character Success': props<{ id: string }>(),
    'Remove Character Failure': props<{ error: string }>(),

    'Remove All Characters': props<{ id: string }>(),
    'Remove All Characters Success': props<{ id: string }>(),
    'Remove All Characters Failure': props<{ error: string }>(),
  },
});
