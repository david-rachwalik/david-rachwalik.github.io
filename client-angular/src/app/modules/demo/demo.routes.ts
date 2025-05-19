import { Routes } from '@angular/router';
import { RpgDemoComponent } from './pages/rpg/rpg-demo.component';

export const demoRoutes: Routes = [
  { path: '', redirectTo: 'rpg', pathMatch: 'full' },
  {
    path: 'rpg',
    component: RpgDemoComponent,
  },
];
