import { Routes } from '@angular/router';

import { RpgSimpleDemoComponent } from './pages/rpg-simple/rpg-simple-demo.component';

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
  },
];
