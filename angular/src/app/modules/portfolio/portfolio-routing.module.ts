import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PortfolioLayoutComponent } from './components/portfolio-layout/portfolio-layout.component';
import { AboutComponent } from './pages/about/about.component';
import { ApiTestsComponent } from './pages/api-tests/api-tests.component';
import { DbDiagramsComponent } from './pages/db-diagrams/db-diagrams.component';
import { DevopsComponent } from './pages/devops/devops.component';
import { HomeComponent } from './pages/home/home.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { ResumeComponent } from './pages/resume/resume.component';

const routes: Routes = [
  {
    path: '',
    component: PortfolioLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'about',
        component: AboutComponent,
      },
      {
        path: 'resume',
        component: ResumeComponent,
      },
      {
        path: 'projects',
        component: ProjectsComponent,
      },
      {
        path: 'diagrams',
        component: DbDiagramsComponent,
      },
      {
        path: 'api-tests',
        component: ApiTestsComponent,
      },
      {
        path: 'devops',
        component: DevopsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PortfolioRoutingModule {}
