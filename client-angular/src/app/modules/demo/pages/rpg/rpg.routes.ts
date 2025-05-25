import { Routes } from '@angular/router';

import { RpgDataComponent } from './components/rpg-data/rpg-data.component';
import { RpgDemoLayoutComponent } from './components/rpg-demo-layout/rpg-demo-layout.component';
import { RpgPlayComponent } from './components/rpg-play/rpg-play.component';
import { RpgDemoComponent } from './rpg-demo.component';
// import { RpgProfileComponent } from './components/rpg-profile/rpg-profile.component'; // Uncomment if exists

export const rpgRoutes: Routes = [
  {
    path: '',
    // component: BaseLayoutComponent,
    component: RpgDemoLayoutComponent,
    children: [
      {
        path: '',
        component: RpgDemoComponent,
      },
      {
        path: 'data',
        component: RpgDataComponent,
      },
      {
        path: 'play',
        component: RpgPlayComponent,
      },
      // {
      //   path: 'profile',
      //   component: RpgProfileComponent,
      // },
    ],
  },
];
