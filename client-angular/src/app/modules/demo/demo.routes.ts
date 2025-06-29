import { Routes } from '@angular/router';

import { RpgSimpleDemoComponent } from './pages/rpg-simple/rpg-simple-demo.component';
import { RPG_STORE_PROVIDERS } from './pages/rpg/store/rpg.providers';

export const demoRoutes: Routes = [
  { path: '', redirectTo: 'rpg', pathMatch: 'full' },
  {
    path: 'rpg-simple',
    component: RpgSimpleDemoComponent,
  },
  {
    path: 'rpg',
    loadChildren: () =>
      import('./pages/rpg/rpg.routes').then((m) => m.rpgRoutes),
    providers: [...RPG_STORE_PROVIDERS], // Lazy Loaded NgRx State
  },
];
