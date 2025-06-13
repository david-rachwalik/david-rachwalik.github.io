// import { importProvidersFrom } from '@angular/core';
// import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  PreloadAllModules,
  provideRouter,
  withPreloading,
} from '@angular/router';

import { NGRX_PROVIDERS } from '@shared/ngrx.providers';
// import { SharedModule } from '@shared/shared.module';
import { SHARED_PROVIDERS } from '@shared/shared.providers';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

// Only import [BrowserModule, BrowserAnimationsModule] once
// All other shared/feature modules will import [CommonModule]
// https://dev.to/sanketmaru/import-once-browser-module-1pie

bootstrapApplication(AppComponent, {
  providers: [
    // importProvidersFrom is for legacy/NgModule-based modules
    // In a standalone app, there's no need to import `BrowserModule` via `importProvidersFrom`
    // The modern Angular handles this when using `bootstrapApplication`
    // importProvidersFrom(
    //   // --- Core imports ---
    //   BrowserModule,
    //   // --- Shared imports ---
    //   SharedModule,
    // ),
    ...SHARED_PROVIDERS,
    provideAnimations(), // BrowserAnimationsModule
    provideRouter(routes, withPreloading(PreloadAllModules)),
    ...NGRX_PROVIDERS,
  ],
}).catch((err) => console.error(err));
