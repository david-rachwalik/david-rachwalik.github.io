import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDivider } from '@angular/material/divider';
import { ActivatedRoute } from '@angular/router';
import { MarkdownComponent } from 'ngx-markdown';
import { Observable, of } from 'rxjs';

import { BlogArticle } from '@modules/blog/blog.models';
import { BlogService } from '@modules/blog/blog.service';

@Component({
  selector: 'app-blog-post',
  templateUrl: './blog-post.component.html',
  styleUrl: './blog-post.component.css',
  standalone: true,
  imports: [FormsModule, MarkdownComponent, AsyncPipe, MatDivider],
})
export class BlogPostComponent implements OnInit {
  loading: boolean = true;
  name: string = '';
  // article: BlogArticle | undefined = undefined;
  article$: Observable<BlogArticle | undefined> = of(undefined);
  markdown = `## Markdown __rulez__!
---

### Syntax highlight
\`\`\`typescript
const language = 'typescript';
\`\`\`

### Lists
1. Ordered list
2. Another bullet point
   - Unordered list
   - Another unordered bullet

### Blockquote
> Blockquote to the max`;

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
  ) {}

  ngOnInit(): void {
    // Retrieve blog article based on route's `name` parameter
    this.name = this.route.snapshot.paramMap.get('name') || '';
    this.article$ = this.blogService.fetchArticle(this.name);

    // Stop loading when data is fetched or an error occurs
    this.article$.subscribe({
      next: () => {
        this.loading = false;
      },
      error: () => {
        this.loading = false; // Stop loading on failure
      },
    });

    // Alternative: Use params observable for dynamic changes
    // this.route.paramMap.subscribe(params => {
    //   this.name = params.get('name') || '';
    // });

    // this.blogService.fetchArticle(this.name).subscribe((article) => {
    //   this.article = article;
    // });

    // this.article$ = this.route.paramMap.pipe(
    //   map((params) => params.get('name') || ''),
    //   switchMap((name) => this.blogService.fetchArticle(name)),
    // );
  }
}
