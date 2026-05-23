import { Routes } from '@angular/router';

import { RpgInfoComponent } from './components/info/info.component';
import { NewGameComponent } from './components/new-game/new-game.component';
import { RpgDataComponent } from './components/rpg-data/rpg-data.component';
import { RpgDemoLayoutComponent } from './components/rpg-demo-layout/rpg-demo-layout.component';
import { RpgPlayComponent } from './components/rpg-play/rpg-play.component';
import { RpgProfileComponent } from './components/rpg-profile/rpg-profile.component';
import { RpgDemoComponent } from './rpg-demo.component';

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
        path: 'new-game',
        component: NewGameComponent,
      },
      {
        path: 'data',
        component: RpgDataComponent,
      },
      {
        path: 'play',
        component: RpgPlayComponent,
      },
      {
        path: 'info',
        component: RpgInfoComponent,
      },
      // {
      //   path: 'admin',
      //   component: RpgAdminComponent,
      // },
      {
        path: 'profile',
        component: RpgProfileComponent,
      },
    ],
  },
];
