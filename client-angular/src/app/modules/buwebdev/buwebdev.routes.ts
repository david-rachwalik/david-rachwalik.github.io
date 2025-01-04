import { Routes } from '@angular/router';

import { BuwebdevLayoutComponent } from '@modules/buwebdev/components/buwebdev-layout/buwebdev-layout.component';
import { PortfolioLayoutComponent } from '@shared/components/portfolio-layout/portfolio-layout.component';
import { BiositeLayoutComponent } from './components/biosite-layout/biosite-layout.component';
import { AboutComponent } from './pages/bioSite/about/about.component';
import { HobbyComponent } from './pages/bioSite/hobby/hobby.component';
import { BiositeHomeComponent } from './pages/bioSite/home/home.component';
import { BuwebdevHomeComponent } from './pages/home/home.component';
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

export const buwebdevRoutes: Routes = [
  {
    path: '',
    // component: BaseLayoutComponent,
    component: BuwebdevLayoutComponent,
    children: [
      {
        path: '',
        component: BuwebdevHomeComponent,
      },
    ],
  },
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
      {
        path: 'exercise2',
        component: Exercise2Component,
      },
      {
        path: 'payroll',
        component: PayrollComponent,
      },
      {
        path: 'temp-conversion',
        component: TempConversionComponent,
      },
      {
        path: 'number-game',
        component: NumberGameComponent,
      },
      {
        path: 'sequence-game',
        component: SequenceGameComponent,
      },
      {
        path: 'in-n-out-books',
        component: InNOutBooksComponent,
      },
      {
        path: 'javazon',
        component: JavazonComponent,
      },
      {
        path: 'alphabet-game',
        component: AlphabetGameComponent,
      },
      {
        path: 'card-game',
        component: CardGameComponent,
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
      {
        path: 'palindrome',
        component: PalindromeComponent, // week 02
      },
      {
        path: 'restaurant',
        component: RestaurantComponent, // week 03
      },
      {
        path: 'calorie',
        component: CalorieComponent, // week 04
      },
      {
        path: 'bobs-auto-repair',
        component: BobsAutoRepairComponent, // week 05
      },
      {
        path: 'future-value',
        component: FutureValueComponent, // week 06
      },
      {
        path: 'whatabook1',
        component: Whatabook1Component, // week 07
      },
      {
        path: 'whatabook2',
        component: Whatabook2Component, // week 08
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
