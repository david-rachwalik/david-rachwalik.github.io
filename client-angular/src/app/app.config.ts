import {
  provideHttpClient,
  withInterceptors,
  withXhr,
} from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
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
    provideHttpClient(withXhr(), withInterceptors([])),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideAnimationsAsync(), // Lazy-loaded BrowserAnimations
    provideMarkdown(),
    ...NGRX_PROVIDERS, // Data Store
  ],
};
