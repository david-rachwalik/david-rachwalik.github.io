import { importProvidersFrom } from '@angular/core';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';

import { SharedModule } from '@shared/shared.module';
import { AppRoutingModule } from './app/app-routing.module';
import { AppComponent } from './app/app.component';

// Only import [BrowserModule, BrowserAnimationsModule] once
// All other shared/feature modules will import [CommonModule]
// https://dev.to/sanketmaru/import-once-browser-module-1pie

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      // --- Core imports ---
      BrowserModule,
      // --- Routing imports ---
      AppRoutingModule,
      // --- Shared imports ---
      SharedModule,
    ),
    provideAnimations(), // BrowserAnimationsModule
  ],
}).catch((err) => console.error(err));
