import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs';

import { ALL_TAGS } from '../../data/game-catalogs';
import { AppActions } from '../app.actions';
import { TagActions } from './tag.actions';

// Seed loader
export const seedAllTags$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(AppActions.loadAllSeeds),
      // Directly pass static catalog
      map(() => TagActions.seedAllTagsSuccess({ tags: ALL_TAGS })),
    ),
  { functional: true },
);

// Main entry point - API loader (stub for now)
export const loadAllTags$ = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(TagActions.loadAllTags),
      // Replace with real API call later
      // Will just use `loadTagsSuccess`, not `loadTagsAPISuccess`
      map(() =>
        TagActions.loadAllTagsFailure({
          error: 'API not implemented',
        }),
      ),
    ),
  { functional: true },
);
