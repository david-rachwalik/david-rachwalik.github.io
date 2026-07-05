import { Routes } from '@angular/router';

import { RpgDemoLayoutComponent } from './components/rpg-demo-layout/rpg-demo-layout.component';
import { RpgProfileComponent } from './components/rpg-profile/rpg-profile.component';
import { AdminEditorComponent } from './pages/admin-editor/admin.editor.component';
import { RpgAdminComponent } from './pages/admin/admin.component';
import { RpgInfoComponent } from './pages/info/info.component';
import { NewGameComponent } from './pages/new-game/new-game.component';
import { RpgDataComponent } from './pages/rpg-data/rpg-data.component';
import { RpgPlayComponent } from './pages/rpg-play/rpg-play.component';
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
      {
        path: 'admin',
        component: RpgAdminComponent,
      },
      {
        path: 'admin/:feature/:id',
        component: AdminEditorComponent,
      },
      {
        path: 'profile',
        component: RpgProfileComponent,
      },
    ],
  },
];
