import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
// import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { RouterLink } from '@angular/router';

import ARTICLES from '@assets/blog-posts/blog-articles.json';
import CATEGORIES from '@assets/blog-posts/blog-categories.json';
import { BlogMetadata } from '@modules/blog/blog.models';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    DatePipe,
    MatCard,
    MatCardTitle,
    MatCardContent,
    // MatCardActions,
    // MatButton,
    MatChipsModule,
  ],
})
export class BlogComponent implements OnInit {
  angularVersion = '18.2.12';
  ngxMarkdownVersion = '19.0.0';
  articles: BlogMetadata[] = ARTICLES as BlogMetadata[];
  categories: string[] = CATEGORIES;

  ngOnInit(): void {
    // Sort articles by created (descending order)
    this.articles.sort(
      (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime(),
    );
    console.log('articles: ', this.articles);
  }
}
