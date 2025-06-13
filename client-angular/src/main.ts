import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  PreloadAllModules,
  provideRouter,
  withPreloading,
} from '@angular/router';
import { provideMarkdown } from 'ngx-markdown';

import { NGRX_PROVIDERS } from '@shared/ngrx.providers';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    // https://angular.dev/guide/http/interceptors
    provideHttpClient(withInterceptors([])),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideAnimations(), // BrowserAnimationsModule
    provideMarkdown(),
    ...NGRX_PROVIDERS,
  ],
}).catch((err) => console.error(err));
