import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AboutComponent } from './components/about/about.component';
import { ApiTestsComponent } from './components/api-tests/api-tests.component';
import { DbDiagramsComponent } from './components/db-diagrams/db-diagrams.component';
import { DevopsComponent } from './components/devops/devops.component';
import { HomeComponent } from './components/home/home.component';
import { PortfolioLayoutComponent } from './components/portfolio-layout/portfolio-layout.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { ResumeComponent } from './components/resume/resume.component';

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
        path: 'web-335/diagrams',
        component: DbDiagramsComponent,
      },
      {
        path: 'api-tests',
        component: ApiTestsComponent,
      },
      {
        path: 'web-430/devops',
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
