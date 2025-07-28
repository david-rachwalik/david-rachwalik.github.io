import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap, withLatestFrom } from 'rxjs';

import { Store } from '@ngrx/store';
import { GameDataService } from '../../services/game-data.service';
import { GameSaveDexieService } from '../../services/game-save-dexie.service';
import { AdventureActions } from '../adventure/adventure.actions';
import { AppActions } from '../app.actions';
import { CharacterActions } from './character.actions';
import { selectAllCharacters } from './character.selectors';

// Seed loader
export const seedAllCharacters$ = createEffect(
  (actions$ = inject(Actions), data = inject(GameDataService)) =>
    actions$.pipe(
      ofType(AppActions.loadAllSeeds),
      map(() => {
        try {
          const characters = data.getAllCharacters();
          console.log('loadCharactersSeed found characters: ', characters);
          return CharacterActions.seedAllCharactersSuccess({ characters });
        } catch (error) {
          return CharacterActions.seedAllCharactersFailure({
            error: String(error),
          });
        }
      }),
    ),
  { functional: true },
);

// Main entry point - API loader (stub for now)
export const loadAllCharactersApi$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(CharacterActions.loadAllCharacters),
      // Replace with real API call later
      // Will just use `loadCharactersSuccess`, not `loadCharactersAPISuccess`
      map(() =>
        CharacterActions.loadAllCharactersFailure({
          error: 'API not implemented',
        }),
      ),
    ),
  { functional: true },
);

// #region 🔸 Dexie Effects (IndexedDb, asynchronous) 🔸

export const addCharacterDexie$ = createEffect(
  (actions$ = inject(Actions), saveService = inject(GameSaveDexieService)) =>
    actions$.pipe(
      ofType(CharacterActions.addCharacter),
      mergeMap(async ({ character }) => {
        try {
          await saveService.saveCharacter(character);
          return CharacterActions.addCharacterSuccess({ character });
        } catch (error) {
          return CharacterActions.addCharacterFailure({ error: String(error) });
        }
      }),
    ),
  { functional: true },
);

export const loadAllCharactersDexie$ = createEffect(
  (actions$ = inject(Actions), saveService = inject(GameSaveDexieService)) =>
    actions$.pipe(
      ofType(AppActions.init, CharacterActions.loadAllCharacters),
      mergeMap(async () => {
        try {
          const characters = await saveService.loadAllCharacters();
          return CharacterActions.loadAllCharactersSuccess({ characters });
        } catch (error) {
          return CharacterActions.loadAllCharactersFailure({
            error: String(error),
          });
        }
      }),
    ),
  { functional: true },
);

export const loadCharacterDexie$ = createEffect(
  (actions$ = inject(Actions), saveService = inject(GameSaveDexieService)) =>
    actions$.pipe(
      ofType(CharacterActions.loadCharacter),
      mergeMap(async ({ id }) => {
        try {
          const character = await saveService.loadCharacter(id);
          if (!character) throw new Error(`Character not found: ${id}`);
          return CharacterActions.loadCharacterSuccess({ character });
        } catch (error) {
          return CharacterActions.loadCharacterFailure({
            error: String(error),
          });
        }
      }),
    ),
  { functional: true },
);

export const saveCharacterDexie$ = createEffect(
  (actions$ = inject(Actions), saveService = inject(GameSaveDexieService)) =>
    actions$.pipe(
      ofType(CharacterActions.saveCharacter),
      mergeMap(async ({ id, changes }) => {
        try {
          // Fetch the existing character and merge with partial changes
          const current = await saveService.loadCharacter(id);
          if (!current) throw new Error(`Character not found: ${id}`);
          const updated = { ...current, ...changes };
          await saveService.saveCharacter(updated);
          return CharacterActions.saveCharacterSuccess({ character: updated });
        } catch (error) {
          return CharacterActions.saveCharacterFailure({
            error: String(error),
          });
        }
      }),
    ),
  { functional: true },
);

export const saveAllCharactersDexie$ = createEffect(
  (actions$ = inject(Actions), saveService = inject(GameSaveDexieService)) =>
    actions$.pipe(
      ofType(CharacterActions.saveAllCharacters),
      mergeMap(async ({ characters }) => {
        try {
          // TODO: determine if should validate `characters` before/after `saveAllCharacters`
          await saveService.saveAllCharacters(characters);
          return CharacterActions.saveAllCharactersSuccess({ characters });
        } catch (error) {
          console.error('[Character] save all error:', error);
          return CharacterActions.saveAllCharactersFailure({
            error: String(error),
          });
        }
      }),
    ),
  { functional: true },
);

export const removeCharacterDexie$ = createEffect(
  (actions$ = inject(Actions), saveService = inject(GameSaveDexieService)) =>
    actions$.pipe(
      ofType(CharacterActions.removeCharacter),
      mergeMap(async ({ id }) => {
        try {
          await saveService.deleteCharacter(id);
          return CharacterActions.removeCharacterSuccess({ id });
        } catch (error) {
          return CharacterActions.removeCharacterFailure({
            error: String(error),
          });
        }
      }),
    ),
  { functional: true },
);

export const removeAllCharactersDexie$ = createEffect(
  (actions$ = inject(Actions), saveService = inject(GameSaveDexieService)) =>
    actions$.pipe(
      ofType(CharacterActions.removeAllCharacters),
      mergeMap(async ({ id }) => {
        try {
          await saveService.deleteAllCharacters(id);
          return CharacterActions.removeAllCharactersSuccess({ id });
        } catch (error) {
          return CharacterActions.removeAllCharactersFailure({
            error: String(error),
          });
        }
      }),
    ),
  { functional: true },
);
// #endregion

// #region 🔸 Chain Effects (sync characters with Adventure) 🔸

export const saveAllCharactersOnAdventureSave$ = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) =>
    actions$.pipe(
      ofType(AdventureActions.saveAdventureSuccess),
      withLatestFrom(store.select(selectAllCharacters)),
      map(([{ adventure }, characters]) => {
        const relatedCharacters = characters.filter(
          (c) => c.adventureId === adventure.id,
        );
        return CharacterActions.saveAllCharacters({
          characters: relatedCharacters,
        });
      }),
    ),
  { functional: true },
);
// #endregion
