import { Routes } from '@angular/router';

// import { BaseLayoutComponent } from '@shared/components/base-layout/base-layout.component';
import { BuwebdevLayoutComponent } from '@shared/components/buwebdev-layout/buwebdev-layout.component';
import { HomeComponent } from '@shared/pages/home/home.component';
import { NotFoundComponent } from '@shared/pages/not-found/not-found.component';
import { RoadmapComponent } from '@shared/pages/roadmap/roadmap.component';

export const routes: Routes = [
  // { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '',
    // component: BaseLayoutComponent,
    component: BuwebdevLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
      },
    ],
  },
  {
    path: 'buwebdev',
    loadChildren: () =>
      import('@modules/buwebdev/buwebdev.routes').then((m) => m.buwebdevRoutes),
  },
  {
    path: 'portfolio',
    loadChildren: () =>
      import('@modules/portfolio/portfolio.routes').then(
        (m) => m.portfolioRoutes,
      ),
  },
  {
    path: 'demo',
    loadChildren: () =>
      import('@modules/demo/demo.routes').then((m) => m.demoRoutes),
  },
  {
    path: 'roadmap',
    component: RoadmapComponent,
  },
  // Wild card route for 404 requests
  {
    path: '**',
    component: NotFoundComponent,
  },
];
