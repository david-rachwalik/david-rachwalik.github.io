import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { BaseLayoutComponent } from '@shared/components/base-layout/base-layout.component';
import { MaterialModule } from '@shared/material.module';
import { HomeComponent } from '@shared/pages/home/home.component';
import { NotFoundComponent } from '@shared/pages/not-found/not-found.component';
import { BuwebdevLayoutComponent } from './components/buwebdev-layout/buwebdev-layout.component';
import { RoadmapComponent } from './pages/roadmap/roadmap.component';

@NgModule({
  declarations: [
    NotFoundComponent,
    BaseLayoutComponent,
    HomeComponent,
    BuwebdevLayoutComponent,
    RoadmapComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    // Components
    NotFoundComponent,
    BaseLayoutComponent,
    HomeComponent,
  ],
})
export class SharedModule {}
