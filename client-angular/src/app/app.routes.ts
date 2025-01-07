import { Routes } from '@angular/router';

// import { BaseLayoutComponent } from '@shared/components/base-layout/base-layout.component';
import { MainLayoutComponent } from '@shared/components/main-layout/main-layout.component';
import { HomeComponent } from '@shared/pages/home/home.component';
import { NotFoundComponent } from '@shared/pages/not-found/not-found.component';
import { RoadmapComponent } from '@shared/pages/roadmap/roadmap.component';

export const routes: Routes = [
  // { path: '', redirectTo: 'home', pathMatch: 'full' },
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
    path: '',
    // component: BaseLayoutComponent,
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'blog',
        loadChildren: () =>
          import('@modules/blog/blog.routes').then((m) => m.blogRoutes),
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
    ],
  },
];
