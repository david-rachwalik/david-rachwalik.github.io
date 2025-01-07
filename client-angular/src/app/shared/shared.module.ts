import { CommonModule } from '@angular/common';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideMarkdown } from 'ngx-markdown';

import { BuwebdevLayoutComponent } from '../modules/buwebdev/components/buwebdev-layout/buwebdev-layout.component';
import { BaseLayoutComponent } from './components/base-layout/base-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { RoadmapComponent } from './pages/roadmap/roadmap.component';

@NgModule({
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // Components
    NotFoundComponent,
    BaseLayoutComponent,
    HomeComponent,
    BuwebdevLayoutComponent,
    RoadmapComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // Components
    NotFoundComponent,
    BaseLayoutComponent,
    HomeComponent,
    BuwebdevLayoutComponent,
    RoadmapComponent,
  ],
  providers: [provideHttpClient(withInterceptorsFromDi()), provideMarkdown()],
})
export class SharedModule {}
