import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BiositeLayoutComponent } from './components/biosite-layout/biosite-layout.component';
import { AboutComponent } from './pages/bioSite/about/about.component';
import { HobbyComponent } from './pages/bioSite/hobby/hobby.component';
import { HomeComponent } from './pages/bioSite/home/home.component';
import { CaProcessesComponent } from './pages/web430/ca-processes/ca-processes.component';
import { ChangeManagementComponent } from './pages/web430/change-management/change-management.component';
import { CiComponent } from './pages/web430/ci/ci.component';
import { ItVsBusinessComponent } from './pages/web430/it-vs-business/it-vs-business.component';
import { SourceControlSecurityComponent } from './pages/web430/source-control-security/source-control-security.component';

const routes: Routes = [
  {
    path: 'bioSite',
    component: BiositeLayoutComponent,
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
        path: 'hobby',
        component: HobbyComponent,
      },
    ],
  },
  {
    path: 'web-430',
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
