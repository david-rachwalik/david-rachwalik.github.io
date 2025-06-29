import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  PreloadAllModules,
  provideRouter,
  withPreloading,
} from '@angular/router';
import { provideMarkdown } from 'ngx-markdown';

import { NGRX_PROVIDERS } from '@shared/ngrx.providers';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // https://angular.dev/guide/http/interceptors
    provideHttpClient(withInterceptors([])),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideAnimations(), // BrowserAnimationsModule
    provideMarkdown(),
    ...NGRX_PROVIDERS, // Data Store
  ],
};
