import { isDevMode } from '@angular/core';
import { provideEntityData, withEffects } from '@ngrx/data';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

// import { RPG_STORE_PROVIDERS } from '@modules/demo/pages/rpg/store/rpg.providers';
import { entityConfig } from './entity-metadata';
// Add reducers and effects as needed
// import { reducers } from './store/reducers';
// import { effects } from './store/effects';

export const NGRX_PROVIDERS = [
  provideStore(), // Optionally: provideStore(reducers)
  // ...RPG_STORE_PROVIDERS,
  provideEffects(), // Optionally: provideEffects(effects)
  provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  provideEntityData(entityConfig, withEffects()),
];
