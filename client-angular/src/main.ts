import { importProvidersFrom } from '@angular/core';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  PreloadAllModules,
  provideRouter,
  withPreloading,
} from '@angular/router';

import { SharedModule } from '@shared/shared.module';
import { AppComponent } from './app/app.component';
// import { AppRoutingModule } from './app/app-routing.module';
import { routes } from './app/app.routes';

// Only import [BrowserModule, BrowserAnimationsModule] once
// All other shared/feature modules will import [CommonModule]
// https://dev.to/sanketmaru/import-once-browser-module-1pie

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      // --- Core imports ---
      BrowserModule,
      // --- Shared imports ---
      SharedModule,
    ),
    provideAnimations(), // BrowserAnimationsModule
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
}).catch((err) => console.error(err));
