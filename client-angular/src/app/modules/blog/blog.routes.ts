import { Routes } from '@angular/router';

import { BlogPostComponent } from './pages/blog-post/blog-post.component';
import { BlogComponent } from './pages/blog/blog.component';

export const blogRoutes: Routes = [
  {
    path: '',
    component: BlogComponent,
  },
  {
    path: ':name',
    component: BlogPostComponent,
  },
];
