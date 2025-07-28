import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs';

import { GameDataService } from '../../services/game-data.service';
import { AppActions } from '../app.actions';
import { TagActions } from './tag.actions';

// Seed loader
export const seedAllTags$ = createEffect(
  (actions$ = inject(Actions), data = inject(GameDataService)) =>
    actions$.pipe(
      // ofType(TagActions.loadTagsSeed),
      ofType(AppActions.loadAllSeeds),
      map(() => {
        const tags = data.getAllTags();
        console.log('loadTagsSeed found tags: ', tags);
        return TagActions.seedAllTagsSuccess({ tags });
      }),
    ),
  { functional: true },
);

// Main entry point - API loader (stub for now)
export const loadTags$ = createEffect(
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
