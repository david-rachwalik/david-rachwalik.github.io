import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, map, mergeMap, tap, withLatestFrom } from 'rxjs/operators';

import { GameBackupService } from '../services/game-backup.service';
import { GameSaveLocalService } from '../services/game-save-local.service';
import { UserService } from '../services/user.service';
import { toId } from '../utils';
import { AdventureActions } from './adventure/adventure.actions';
import { selectAdventureSeeded } from './adventure/adventure.selectors';
import { AppActions } from './app.actions';
import { selectAppSeeded } from './app.selectors';
import { AttributeActions } from './attribute/attribute.actions';
import { selectAttributeSeeded } from './attribute/attribute.selectors';
import { CharacterActions } from './character/character.actions';
import { selectCharacterSeeded } from './character/character.selectors';
import { EffectActions } from './effect/effect.actions';
import { selectEffectSeeded } from './effect/effect.selectors';
import { ItemActions } from './item/item.actions';
import { selectItemSeeded } from './item/item.selectors';
import { LocationActions } from './location/location.actions';
import { selectLocationSeeded } from './location/location.selectors';
import { MomentActions } from './moment/moment.actions';
import { selectMomentSeeded } from './moment/moment.selectors';
import { SkillActions } from './skill/skill.actions';
import { selectSkillSeeded } from './skill/skill.selectors';
import { TagActions } from './tag/tag.actions';
import { selectTagSeeded } from './tag/tag.selectors';

// #region 🔸 Seed Effects 🔸

export const initLoadAllSeeds$ = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) =>
    actions$.pipe(
      // ofType(AppActions.loadAllSeeds),
      ofType(AppActions.init),
      tap(() =>
        console.log('[Effect] AppActions.init received (initLoadSeeds$)'),
      ),
      withLatestFrom(store.select(selectAppSeeded)),
      filter(([, seeded]) => !seeded),
      map(() => AppActions.loadAllSeeds()),
    ),
  { functional: true },
);

export const appSeedSuccess$ = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) =>
    actions$.pipe(
      ofType(
        AdventureActions.seedAllAdventuresSuccess,
        TagActions.seedAllTagsSuccess,
        AttributeActions.seedAllAttributesSuccess,
        EffectActions.seedAllEffectsSuccess,
        CharacterActions.seedAllCharactersSuccess,
        LocationActions.seedAllLocationsSuccess,
        MomentActions.seedAllMomentsSuccess,
        ItemActions.seedAllItemsSuccess,
        SkillActions.seedAllSkillsSuccess,
      ),
      withLatestFrom(
        store.select(selectAdventureSeeded),
        store.select(selectTagSeeded),
        store.select(selectAttributeSeeded),
        store.select(selectEffectSeeded),
        store.select(selectCharacterSeeded),
        store.select(selectLocationSeeded),
        store.select(selectMomentSeeded),
        store.select(selectItemSeeded),
        store.select(selectSkillSeeded),
      ),
      filter(
        ([
          ,
          adventuresSeeded,
          tagSeeded,
          attributesSeeded,
          effectsSeeded,
          charactersSeeded,
          locationsSeeded,
          momentsSeeded,
          itemsSeeded,
          skillsSeeded,
        ]) =>
          adventuresSeeded &&
          tagSeeded &&
          attributesSeeded &&
          effectsSeeded &&
          charactersSeeded &&
          locationsSeeded &&
          momentsSeeded &&
          itemsSeeded &&
          skillsSeeded,
      ),
      map(() => AppActions.loadAllSeedsSuccess()),
    ),
  { functional: true },
);
// #endregion

// When app starts, load current account id
export const initLoadAccountId$ = createEffect(
  (actions$ = inject(Actions), userService = inject(UserService)) =>
    actions$.pipe(
      ofType(AppActions.init),
      // tap(() =>
      //   console.log('[Effect] AppActions.init received (initLoadAccountId$)'),
      // ),
      map(() => userService.accountId),
      tap((id) => console.log('[Effect] Loaded accountId:', id)),
      filter((id): id is string => !!id),
      map((id) => AppActions.setAccountId({ id })),
      // tap((action) =>
      //   console.log('[Effect] Dispatching setAccountId:', action),
      // ),
    ),
  { functional: true },
);

// When app starts, load current adventure slot id
export const initLoadCurrentSlotId$ = createEffect(
  (actions$ = inject(Actions), saveService = inject(GameSaveLocalService)) =>
    actions$.pipe(
      ofType(AppActions.init),
      // tap(() =>
      //   console.log(
      //     '[Effect] AppActions.init received (initLoadCurrentSlotId$)',
      //   ),
      // ),
      map(() => saveService.loadCurrentSlotId()),
      tap((slotId) => console.log('[Effect] Loaded slotId:', slotId)),
      filter((slotId): slotId is string => !!slotId),
      map((slotId) => AppActions.setCurrentSlotId({ slotId })),
      // tap((action) =>
      //   console.log('[Effect] Dispatching setCurrentSlotId:', action),
      // ),
    ),
  { functional: true },
);

export const saveCurrentSlotIdLocal$ = createEffect(
  (actions$ = inject(Actions), saveService = inject(GameSaveLocalService)) =>
    actions$.pipe(
      ofType(AppActions.setCurrentSlotId),
      tap(() => console.log('[Effect] AppActions.setCurrentSlotId received')),
      tap(({ slotId }) => saveService.saveCurrentSlotId(slotId)),
    ),
  { functional: true, dispatch: false },
);

// --- Auto-Load Effects ---

// Centralizes side effects: Keeps business logic and side effects in one place,
// not scattered across components or services.
// Automatic: Whenever the `setCurrentSlotId` action is dispatched (from anywhere in
// the app), the effect will react and dispatch `loadAdventure` for that slot.
// Decouples UI: Components don’t need to subscribe and manually dispatch; the effect
// handles it globally.

export const playLoadAdventure$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(AppActions.play),
      map(({ slotId }) => AdventureActions.loadAdventure({ id: slotId })),
    ),
  { functional: true },
);

// export const autoLoadAdventure$ = createEffect(
//   (actions$ = inject(Actions)) =>
//     actions$.pipe(
//       ofType(AppActions.setCurrentSlotId),
//       filter(({ slotId }) => !!slotId),
//       map(({ slotId }) => AdventureActions.loadAdventure({ id: slotId })),
//     ),
//   { functional: true },
// );

export const downloadSave$ = createEffect(
  (actions$ = inject(Actions), backup = inject(GameBackupService)) =>
    actions$.pipe(
      ofType(AppActions.downloadSave),
      mergeMap(async ({ slotId }) => {
        try {
          await backup.exportSingle(slotId);
          return AppActions.downloadSaveSuccess({ slotId });
        } catch (error) {
          return AppActions.downloadSaveFailure({
            slotId,
            error: String(error),
          });
        }
      }),
    ),
  { functional: true },
);

export const uploadSave$ = createEffect(
  (actions$ = inject(Actions), backup = inject(GameBackupService)) =>
    actions$.pipe(
      ofType(AppActions.uploadSave),
      mergeMap(async ({ file }) => {
        console.log('[Effect] Received uploadSave action:', file);
        try {
          await backup.importAll(file);
          console.log('[Effect] importAll completed');
          return AppActions.uploadSaveSuccess({ file });
        } catch (error) {
          console.error('[Effect] importAll failed:', error);
          return AppActions.uploadSaveFailure({ error: String(error) });
        }
      }),
    ),
  { functional: true },
);

// #region 🔸 Chain Effects 🔸

export const setCurrentSlotIdOnAdventureAdd$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(AdventureActions.addAdventureSuccess),
      map(({ adventure }) => {
        // return AppActions.setCurrentSlotId({ slotId: adventure.id });
        const slotId = toId(adventure.label);
        return AppActions.setCurrentSlotId({ slotId });
      }),
    ),
  { functional: true },
);
// #endregion
