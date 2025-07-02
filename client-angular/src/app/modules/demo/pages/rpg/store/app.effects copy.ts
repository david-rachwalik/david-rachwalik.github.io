import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, map, tap, withLatestFrom } from 'rxjs/operators';

import { AppActions } from './app.actions';
import { selectAppSeeded } from './app.selectors';
// import { AttributeActions } from './attribute/attribute.actions';
// import { CharacterActions } from './character/character.actions';
// import { ItemActions } from './item/item.actions';
// import { LocationActions } from './location/location.actions';
// import { MomentActions } from './moment/moment.actions';
// import { TagActions } from './tag/tag.actions';

@Injectable()
export class AppEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
  ) {}

  loadSeeds$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.loadSeeds),
      withLatestFrom(this.store.select(selectAppSeeded)),
      // filter(([, seeded]) => !seeded), // Only seed if not already seeded
      filter(([, seeded]) => {
        console.log('[AppEffects] Checking seeded:', seeded);
        return !seeded;
      }),
      tap(() => {
        console.log('[AppEffects] Dispatching all seed actions...');
      }),
      // mergeMap(() => [
      //   AttributeActions.loadAttributesSeed(),
      //   CharacterActions.loadCharactersSeed(),
      //   ItemActions.loadItemsSeed(),
      //   LocationActions.loadLocationsSeed(),
      //   TagActions.loadTagsSeed(),
      //   MomentActions.loadMomentsSeed(),
      //   // ...other feature seed actions
      //   AppActions.seedsLoaded(), // Mark global seeded as true
      // ]),
      map(() => AppActions.seedsLoaded()), // Mark global seeded as true
    ),
  );
}
