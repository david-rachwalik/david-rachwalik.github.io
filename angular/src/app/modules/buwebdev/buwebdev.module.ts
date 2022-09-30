import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { BuwebdevRoutingModule } from './buwebdev-routing.module';

import { AboutComponent } from './components/bioSite/about/about.component';
import { BiositeLayoutComponent } from './components/bioSite/biosite-layout/biosite-layout.component';
import { HobbyComponent } from './components/bioSite/hobby/hobby.component';
import { HomeComponent } from './components/bioSite/home/home.component';
import { CaProcessesComponent } from './components/web430/ca-processes/ca-processes.component';
import { ChangeManagementComponent } from './components/web430/change-management/change-management.component';
import { CiComponent } from './components/web430/ci/ci.component';
import { ItVsBusinessComponent } from './components/web430/it-vs-business/it-vs-business.component';
import { SourceControlSecurityComponent } from './components/web430/source-control-security/source-control-security.component';

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
