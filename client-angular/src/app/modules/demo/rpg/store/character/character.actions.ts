import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Character, CharacterInstance } from '../../models/character';

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
    // 'Load All Characters': emptyProps(),
    // Optional props allow the Admin page to target specific datasets
    'Load All Characters': props<{
      adventureId?: string;
      fetchAll?: boolean;
    }>(),
    'Load All Characters Success': props<{ characters: Character[] }>(),
    'Load All Characters Failure': props<{ error: string }>(),

    'Load Character': props<{ id: string }>(),
    'Load Character Success': props<{ character: Character }>(),
    'Load Character Failure': props<{ error: string }>(),

    // Update (with partial changes)
    'Save Character': props<{ id: string; changes: CharacterInstance }>(),
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
