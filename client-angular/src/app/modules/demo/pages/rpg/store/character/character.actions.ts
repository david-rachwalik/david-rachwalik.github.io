import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Character } from '../../models/character';

export const CharacterActions = createActionGroup({
  source: 'Character',
  events: {
    'Load Characters': emptyProps(),
    'Load Characters Success': props<{ characters: Character[] }>(),
    'Load Characters Failure': props<{ error: string }>(),

    'Load Characters Seed': emptyProps(),
    'Load Characters Seed Success': props<{ characters: Character[] }>(),

    'Add Character': props<{ character: Character }>(),
    'Add Character Success': props<{ character: Character }>(),

    'Update Character': props<{ character: Character }>(),
    'Update Character Success': props<{ character: Character }>(),

    'Delete Character': props<{ id: string }>(),
    'Delete Character Success': props<{ id: string }>(),
  },
});
