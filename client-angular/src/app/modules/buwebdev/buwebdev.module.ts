import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { BuwebdevRoutingModule } from './buwebdev-routing.module';

import { BiositeLayoutComponent } from './components/biosite-layout/biosite-layout.component';
import { AboutComponent } from './pages/bioSite/about/about.component';
import { HobbyComponent } from './pages/bioSite/hobby/hobby.component';
import { BiositeHomeComponent } from './pages/bioSite/home/home.component';
import { Web231HomeComponent } from './pages/web-231/home/home.component';
import { Exercise2Component } from './pages/web-231/week-2/exercise2/exercise2.component';
import { PayrollComponent } from './pages/web-231/week-2/payroll/payroll.component';
import { TempConversionComponent } from './pages/web-231/week-3/temp-conversion/temp-conversion.component';
import { NumberGameComponent } from './pages/web-231/week-4/number-game/number-game.component';
import { SequenceGameComponent } from './pages/web-231/week-5/sequence-game/sequence-game.component';
import { InNOutBooksComponent } from './pages/web-231/week-6/in-n-out-books/in-n-out-books.component';
import { JavazonComponent } from './pages/web-231/week-7/javazon/javazon.component';
import { AlphabetGameComponent } from './pages/web-231/week-8/alphabet-game/alphabet-game.component';
import { CardGameComponent } from './pages/web-231/week-9/card-game/card-game.component';
import { Web330HomeComponent } from './pages/web-330/home/home.component';
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
  imports: [
    BuwebdevRoutingModule,
    SharedModule,
    // bioSite
    BiositeLayoutComponent,
    BiositeHomeComponent,
    AboutComponent,
    HobbyComponent,
    // WEB-231
    Web231HomeComponent,
    Exercise2Component,
    PayrollComponent,
    TempConversionComponent,
    NumberGameComponent,
    SequenceGameComponent,
    InNOutBooksComponent,
    JavazonComponent,
    AlphabetGameComponent,
    CardGameComponent,
    // WEB-330
    Web330HomeComponent,
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
})
export class BuwebdevModule {}
