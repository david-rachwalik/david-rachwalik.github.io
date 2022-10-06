import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { PortfolioRoutingModule } from './portfolio-routing.module';

import { FooterComponent } from './components/portfolio-layout/footer/footer.component';
import { HeaderComponent } from './components/portfolio-layout/header/header.component';
import { InnerCardComponent } from './components/portfolio-layout/inner-card/inner-card.component';
import { PortfolioLayoutComponent } from './components/portfolio-layout/portfolio-layout.component';
import { SubheaderComponent } from './components/portfolio-layout/subheader/subheader.component';
import { AboutComponent } from './pages/about/about.component';
import { ApiTestsComponent } from './pages/api-tests/api-tests.component';
import { DbDiagramsComponent } from './pages/db-diagrams/db-diagrams.component';
import { DevopsComponent } from './pages/devops/devops.component';
import { HomeComponent } from './pages/home/home.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { ResumeComponent } from './pages/resume/resume.component';

@NgModule({
  declarations: [
    PortfolioLayoutComponent,
    HeaderComponent,
    SubheaderComponent,
    FooterComponent,
    InnerCardComponent,
    HomeComponent,
    AboutComponent,
    ResumeComponent,
    ProjectsComponent,
    DbDiagramsComponent,
    ApiTestsComponent,
    DevopsComponent,
  ],
  imports: [SharedModule, PortfolioRoutingModule],
})
export class PortfolioModule {}
