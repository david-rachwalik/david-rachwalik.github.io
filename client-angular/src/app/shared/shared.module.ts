import { CommonModule } from '@angular/common';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { BaseLayoutComponent } from './components/base-layout/base-layout.component';
import { BuwebdevLayoutComponent } from './components/buwebdev-layout/buwebdev-layout.component';
import { MaterialModule } from './material.module';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { RoadmapComponent } from './pages/roadmap/roadmap.component';

@NgModule({
  declarations: [
    NotFoundComponent,
    BaseLayoutComponent,
    HomeComponent,
    BuwebdevLayoutComponent,
    RoadmapComponent,
  ],
  exports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    // Components
    NotFoundComponent,
    BaseLayoutComponent,
    HomeComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())],
})
export class SharedModule {}
