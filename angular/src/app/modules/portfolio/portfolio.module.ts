import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { PortfolioRoutingModule } from './portfolio-routing.module';

import { AboutComponent } from './components/about/about.component';
import { HomeComponent } from './components/home/home.component';
import { FooterComponent } from './components/portfolio-layout/footer/footer.component';
import { HeaderComponent } from './components/portfolio-layout/header/header.component';
import { PortfolioLayoutComponent } from './components/portfolio-layout/portfolio-layout.component';
import { SubheaderComponent } from './components/portfolio-layout/subheader/subheader.component';
import { ResumeComponent } from './components/resume/resume.component';

@NgModule({
  declarations: [
    PortfolioLayoutComponent,
    HomeComponent,
    AboutComponent,
    ResumeComponent,
    HeaderComponent,
    SubheaderComponent,
    FooterComponent,
  ],
  imports: [SharedModule, PortfolioRoutingModule],
})
export class PortfolioModule {}
