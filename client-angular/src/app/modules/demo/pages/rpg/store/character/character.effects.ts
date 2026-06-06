import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { filter, map, mergeMap, switchMap, take, withLatestFrom } from 'rxjs';

import { Store } from '@ngrx/store';
import { GameDataService } from '../../services/game-data.service';
import { GameSaveDexieService } from '../../services/game-save-dexie.service';
import { AdventureActions } from '../adventure/adventure.actions';
import { AppActions } from '../app.actions';
import { selectCurrentSlotId } from '../app.selectors';
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
          // console.log('seedAllCharacters$ found characters: ', characters);
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

// #region 🔸 Database Effects 🔸

export const addCharacter$ = createEffect(
  (actions$ = inject(Actions), db = inject(GameSaveDexieService)) =>
    actions$.pipe(
      ofType(CharacterActions.addCharacter),
      mergeMap(async ({ character }) => {
        try {
          await db.saveCharacter(character);
          return CharacterActions.addCharacterSuccess({ character });
        } catch (error) {
          return CharacterActions.addCharacterFailure({ error: String(error) });
        }
      }),
    ),
  { functional: true },
);

export const loadAllCharacters$ = createEffect(
  (
    actions$ = inject(Actions),
    db = inject(GameSaveDexieService),
    store = inject(Store),
  ) =>
    actions$.pipe(
      ofType(AppActions.play, CharacterActions.loadAllCharacters),
      // This asynchronous waiter safeguards page refreshes (use with AppActions.play)
      switchMap((action) =>
        store.select(selectCurrentSlotId).pipe(
          filter((id): id is string => !!id),
          take(1), // waits for first truthy value
          map((storeSlotId) => ({ action, storeSlotId })),
        ),
      ),
      mergeMap(async ({ action, storeSlotId }) => {
        try {
          // Extract optional overrides safely without strict "any"
          const payloadSlotId =
            'adventureId' in action ? action.adventureId : undefined;
          const fetchAll = 'fetchAll' in action ? action.fetchAll : false;

          // If Admin requests ALL characters from database, bypass the ID check
          if (fetchAll) {
            const characters = await db.loadAllCharacters();
            return CharacterActions.loadAllCharactersSuccess({ characters });
          }

          // Prefer explicit action ID, fallback to Store's active session ID
          const slotId = payloadSlotId || storeSlotId;

          // Fail fiercely if lacks context
          if (!slotId) {
            throw new Error(
              '[loadAllCharacters] Failed: No adventureId context provided or active in Store.',
            );
          }

          // Fetch specific active playthrough characters
          const characters = await db.loadAllCharacters(slotId);
          return CharacterActions.loadAllCharactersSuccess({ characters });
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          return CharacterActions.loadAllCharactersFailure({
            error: errorMessage,
          });
        }
      }),
    ),
  { functional: true },
);

export const loadCharacter$ = createEffect(
  (actions$ = inject(Actions), db = inject(GameSaveDexieService)) =>
    actions$.pipe(
      ofType(CharacterActions.loadCharacter),
      mergeMap(async ({ id }) => {
        try {
          const character = await db.loadCharacter(id);
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

export const saveCharacter$ = createEffect(
  (actions$ = inject(Actions), db = inject(GameSaveDexieService)) =>
    actions$.pipe(
      ofType(CharacterActions.saveCharacter),
      mergeMap(async ({ id, changes }) => {
        try {
          // Fetch the existing model and merge with partial changes
          const current = await db.loadCharacter(id);
          if (!current) throw new Error(`Character not found: ${id}`);
          const updated = { ...current, ...changes };
          await db.saveCharacter(updated);
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

export const saveAllCharacters$ = createEffect(
  (actions$ = inject(Actions), db = inject(GameSaveDexieService)) =>
    actions$.pipe(
      ofType(CharacterActions.saveAllCharacters),
      mergeMap(async ({ characters }) => {
        try {
          // TODO: determine if should validate `characters` before/after `saveAllCharacters`
          await db.saveAllCharacters(characters);
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

export const removeCharacter$ = createEffect(
  (actions$ = inject(Actions), db = inject(GameSaveDexieService)) =>
    actions$.pipe(
      ofType(CharacterActions.removeCharacter),
      mergeMap(async ({ id }) => {
        try {
          await db.deleteCharacter(id);
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

export const removeAllCharacters$ = createEffect(
  (actions$ = inject(Actions), db = inject(GameSaveDexieService)) =>
    actions$.pipe(
      ofType(CharacterActions.removeAllCharacters),
      mergeMap(async ({ id }) => {
        try {
          await db.deleteAllCharacters(id);
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
