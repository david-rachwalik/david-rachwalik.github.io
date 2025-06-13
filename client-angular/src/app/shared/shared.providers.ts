import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideMarkdown } from 'ngx-markdown';

export const SHARED_PROVIDERS = [
  //   provideHttpClient(withInterceptorsFromDi()),
  // https://angular.dev/guide/http/interceptors
  provideHttpClient(withInterceptors([])),
  provideMarkdown(),
];
