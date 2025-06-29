import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs';

import { GameDataService } from '../../services/game-data.service';
import { AppActions } from '../app.actions';
import { CharacterActions } from './character.actions';

// Seed loader
export const loadCharactersSeed$ = createEffect(
  (actions$ = inject(Actions), data = inject(GameDataService)) =>
    actions$.pipe(
      // ofType(CharacterActions.loadCharactersSeed),
      ofType(AppActions.loadSeeds),
      map(() => {
        const characters = data.getAllCharacters();
        console.log('loadCharactersSeed found characters: ', characters);
        return CharacterActions.loadCharactersSeedSuccess({ characters });
      }),
    ),
  { functional: true },
);

// Main entry point - API loader (stub for now)
export const loadCharacters$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(CharacterActions.loadCharacters),
      // Replace with real API call later
      // Will just use `loadCharactersSuccess`, not `loadCharactersAPISuccess`
      map(() =>
        CharacterActions.loadCharactersFailure({
          error: 'API not implemented',
        }),
      ),
    ),
  { functional: true },
);
