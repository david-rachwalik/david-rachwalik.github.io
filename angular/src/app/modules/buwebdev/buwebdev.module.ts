import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { BuwebdevRoutingModule } from './buwebdev-routing.module';

import { BiositeLayoutComponent } from './components/biosite-layout/biosite-layout.component';
import { AboutComponent } from './pages/bioSite/about/about.component';
import { HobbyComponent } from './pages/bioSite/hobby/hobby.component';
import { BiositeHomeComponent } from './pages/bioSite/home/home.component';
import { PalindromeComponent } from './pages/web-330/week-2/palindrome/palindrome.component';
import { RestaurantComponent } from './pages/web-330/week-3/restaurant/restaurant.component';
import { CalorieComponent } from './pages/web-330/week-4/calorie/calorie.component';
import { BobsAutoRepairComponent } from './pages/web-330/week-5/bobs-auto-repair/bobs-auto-repair.component';
import { FutureValueComponent } from './pages/web-330/week-6/future-value/future-value.component';
import { Whatabook1Component } from './pages/web-330/week-7/whatabook1/whatabook1.component';
import { Whatabook2Component } from './pages/web-330/week-8/whatabook2/whatabook2.component';
import { CaProcessesComponent } from './pages/web-430/ca-processes/ca-processes.component';
import { ChangeManagementComponent } from './pages/web-430/change-management/change-management.component';
import { CiComponent } from './pages/web-430/ci/ci.component';
import { ItVsBusinessComponent } from './pages/web-430/it-vs-business/it-vs-business.component';
import { SourceControlSecurityComponent } from './pages/web-430/source-control-security/source-control-security.component';

@NgModule({
  declarations: [
    // bioSite
    BiositeLayoutComponent,
    BiositeHomeComponent,
    AboutComponent,
    HobbyComponent,
    // WEB-330
    PalindromeComponent,
    RestaurantComponent,
    CalorieComponent,
    BobsAutoRepairComponent,
    FutureValueComponent,
    Whatabook1Component,
    Whatabook2Component,
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
