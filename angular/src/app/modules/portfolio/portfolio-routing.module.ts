import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AboutComponent } from '@modules/portfolio/components/about/about.component';
import { HomeComponent } from '@modules/portfolio/components/home/home.component';
import { PortfolioLayoutComponent } from '@modules/portfolio/components/portfolio-layout/portfolio-layout.component';
import { ResumeComponent } from '@modules/portfolio/components/resume/resume.component';

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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PortfolioRoutingModule {}
