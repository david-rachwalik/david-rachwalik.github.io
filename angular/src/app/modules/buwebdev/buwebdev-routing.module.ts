import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuwebdevLayoutComponent } from '@shared/components/buwebdev-layout/buwebdev-layout.component';

import { PortfolioLayoutComponent } from '@shared/components/portfolio-layout/portfolio-layout.component';
import { BiositeLayoutComponent } from './components/biosite-layout/biosite-layout.component';
import { AboutComponent } from './pages/bioSite/about/about.component';
import { HobbyComponent } from './pages/bioSite/hobby/hobby.component';
import { BiositeHomeComponent } from './pages/bioSite/home/home.component';
import { Web231HomeComponent } from './pages/web-231/home/home.component';
import { Web330HomeComponent } from './pages/web-330/home/home.component';
import { CaProcessesComponent } from './pages/web-430/ca-processes/ca-processes.component';
import { ChangeManagementComponent } from './pages/web-430/change-management/change-management.component';
import { CiComponent } from './pages/web-430/ci/ci.component';
import { ItVsBusinessComponent } from './pages/web-430/it-vs-business/it-vs-business.component';
import { SourceControlSecurityComponent } from './pages/web-430/source-control-security/source-control-security.component';

const routes: Routes = [
  {
    path: 'bioSite',
    component: BiositeLayoutComponent,
    children: [
      {
        path: '',
        component: BiositeHomeComponent,
      },
      {
        path: 'about',
        component: AboutComponent,
      },
      {
        path: 'hobby',
        component: HobbyComponent,
      },
    ],
  },
  {
    path: 'web-231',
    component: BuwebdevLayoutComponent,
    children: [
      {
        path: '',
        component: Web231HomeComponent,
      },
    ],
  },
  {
    path: 'web-330',
    component: BuwebdevLayoutComponent,
    children: [
      {
        path: '',
        component: Web330HomeComponent,
      },
    ],
  },
  {
    path: 'web-430',
    component: PortfolioLayoutComponent,
    children: [
      { path: '', redirectTo: '/portfolio/devops', pathMatch: 'full' },
      {
        path: 'ci',
        component: CiComponent,
      },
      {
        path: 'ca-processes',
        component: CaProcessesComponent,
      },
      {
        path: 'it-vs-business',
        component: ItVsBusinessComponent,
      },
      {
        path: 'source-control-security',
        component: SourceControlSecurityComponent,
      },
      {
        path: 'change-management',
        component: ChangeManagementComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BuwebdevRoutingModule {}
