import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
// import * as yaml from 'yaml';
import { parse as parseYaml } from 'yaml';

import BLOG_ARTICLES from '@assets/blog-posts/blog-articles.json';
import { BlogArticle, BlogMetadata } from './blog.models';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  constructor(private http: HttpClient) {}

  private parseErrorMessage(error: unknown): string {
    let errorMessage = 'An unknown error occurred.';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (
      typeof error === 'object' &&
      error !== null &&
      'message' in error
    ) {
      errorMessage = String((error as { message: string }).message); // Safely access `message` if it exists
    }
    return errorMessage;
  }

  fetchArticle(name: string): Observable<BlogArticle | undefined> {
    // Find the matching article metadata
    const article = BLOG_ARTICLES.find(
      (a: BlogMetadata) => a.id === name,
    ) as BlogMetadata;

    if (!article) {
      console.error(`No article found for id: ${name}`);
      return of(undefined);
    }

    const { category } = article; // Use destructuring to extract article.category

    return this.http
      .get(`/assets/blog-posts/${category}/${name}.md`, {
        responseType: 'text',
      })
      .pipe(
        // The map() operator works with the emitted value, so using of() within is unnecessary
        map((data) => {
          const parts = data.split('---');
          if (parts.length < 3) {
            throw new Error('Invalid blog post format.');
          }
          const metadata = parseYaml(parts[1]) as BlogMetadata;
          const content = parts.slice(2).join('---').trim();
          return { metadata, content, error: '' };
        }),
        catchError((error: unknown) => {
          // return of<BlogArticle>({
          //   metadata: { title: '', dateCreated: '', active: false },
          //   content: '',
          //   error: errorMessage,
          // });
          const errorMessage = this.parseErrorMessage(error);
          console.error(`Error fetching blog post: ${errorMessage}`);
          return of(undefined); // Gracefully return if not found
        }),
      );
  }
}
