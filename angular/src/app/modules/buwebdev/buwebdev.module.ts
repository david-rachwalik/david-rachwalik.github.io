import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { BuwebdevRoutingModule } from './buwebdev-routing.module';

import { BiositeLayoutComponent } from './components/biosite-layout/biosite-layout.component';
import { AboutComponent } from './pages/bioSite/about/about.component';
import { HobbyComponent } from './pages/bioSite/hobby/hobby.component';
import { HomeComponent } from './pages/bioSite/home/home.component';
import { CaProcessesComponent } from './pages/web-430/ca-processes/ca-processes.component';
import { ChangeManagementComponent } from './pages/web-430/change-management/change-management.component';
import { CiComponent } from './pages/web-430/ci/ci.component';
import { ItVsBusinessComponent } from './pages/web-430/it-vs-business/it-vs-business.component';
import { SourceControlSecurityComponent } from './pages/web-430/source-control-security/source-control-security.component';

@NgModule({
  declarations: [
    // bioSite
    BiositeLayoutComponent,
    HomeComponent,
    AboutComponent,
    HobbyComponent,
    // WEB-430
    CiComponent,
    CaProcessesComponent,
    ItVsBusinessComponent,
    SourceControlSecurityComponent,
    ChangeManagementComponent,
  ],
  imports: [BuwebdevRoutingModule, SharedModule],
})
export class BuwebdevModule {}
