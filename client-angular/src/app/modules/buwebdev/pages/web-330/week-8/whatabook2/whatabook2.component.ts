/*
============================================
; Title:        rachwalik-whatabook2.ts
; Author:       David Rachwalik
; Date:         2022/02/27
; Description:  What-A-Book app for WEB-330 site
;===========================================
*/

import { CdkTableDataSourceInput } from '@angular/cdk/table';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource,
} from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { catchError, lastValueFrom } from 'rxjs';

// Properties defined in HTML Element must be strings
export interface BookElement {
  isbn: string;
  title: string;
  description: string;
  pages: string;
  authors: string;
}

// interface BookApiResponse {
//   [isbn: string]: {
//     bib_key: string;
//     info_url: string;
//     preview: string;
//     preview_url: string;
//     thumbnail_url: string;
//     details: {
//       authors: {
//         name: string;
//       };
//       isbn_10: string;
//       isbn_13: string;
//       title: string;
//       subtitle: string;
//       number_of_pages: number;
//     };
//   };
// }

// Define the structure of 'authors'
interface BookApiAuthor {
  name?: string;
}

// Define the structure of 'details'
interface BookApiDetail {
  authors?: BookApiAuthor[];
  isbn_13?: string;
  isbn_10?: string;
  title?: string;
  subtitle?: string;
  number_of_pages?: string;
}

interface BookApiResponse {
  [isbn: string]: {
    bib_key: string;
    info_url: string;
    preview: string;
    preview_url: string;
    thumbnail_url: string;
    details: BookApiDetail;
  };
}

@Component({
  selector: 'app-whatabook2',
  templateUrl: './whatabook2.component.html',
  styleUrls: ['./whatabook2.component.css'],
  standalone: true,
  imports: [
    MatCard,
    MatCardTitle,
    MatCardContent,
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    RouterLink,
  ],
})
export class Whatabook2Component implements OnInit {
  displayedColumns: string[] = [
    'isbn',
    'title',
    'description',
    'pages',
    'authors',
  ];
  dataSource!: CdkTableDataSourceInput<BookElement>; // Define data type

  constructor(private httpClient: HttpClient) {
    // Define the URL of the books API
    const apiPath = 'https://openlibrary.org/api/books';
    // eslint-disable-next-line no-void
    void this.getBooks(apiPath);
  }

  ngOnInit(): void {}

  // Parse JSON data into an array of book objects
  parseBookResponse(responseString: string): BookElement[] {
    // Convert JavaScript Object Notation (JSON) string into object
    const responseObject: BookApiResponse = JSON.parse(
      responseString,
    ) as BookApiResponse;
    console.log('responseObject:', responseObject);

    const books: BookElement[] = Object.keys(responseObject).map((isbn) => {
      // const details = responseObject[isbn].details;
      const { details } = responseObject[isbn]; // Object destructuring

      // const authors = details.authors?.map((author) => author.name) || [];

      // Check if 'authors' is an array before using map
      const authors = Array.isArray(details.authors)
        ? details.authors.map((author) => author.name)
        : [];

      const book: BookElement = {
        isbn: details.isbn_13 || details.isbn_10 || 'N/A',
        title: details.title || 'N/A',
        description: details.subtitle || 'N/A',
        pages: String(details.number_of_pages || 'N/A'),
        authors: String(authors.join(',')),
      };

      return book;
    });
    return books;
  }

  async getBooks(apiPath: string): Promise<void> {
    const isbns = [
      '0345339681',
      '0261103571',
      '9780593099322',
      '9780261102361',
      '9780261102378',
      '9780590302715',
      '9780316769532',
      '9780743273565',
      '9780590405959',
    ];

    const params = new HttpParams()
      .set('bibkeys', `ISBN:${isbns.join(',')}`)
      .set('format', 'json')
      .set('jscmd', 'details');

    try {
      // Fetch books from API (https://angular.io/api/common/http/HttpClient)
      const responseString = await lastValueFrom(
        this.httpClient.get(apiPath, { responseType: 'text', params }).pipe(
          catchError((error) => {
            console.error('Error fetching XML data:', error);
            throw error; // Re-throw the error for handling in the catch block
          }),
        ),
      );

      // Parse books from JSON
      const books: BookElement[] = this.parseBookResponse(responseString);
      console.log(`JSON book count: ${books.length}`);

      // Populate table data with books
      this.dataSource = new MatTableDataSource(books); // https://material.angular.io/components/table
    } catch (error) {
      console.error('Error:', error);
    }
  }

  // Display details of selected book
  selectBook(event: MouseEvent, book: BookElement): void {
    console.log(`selectBook() called for ISBN: ${book.isbn}`);

    // Access the clicked TD element
    const tdElement = event.target as HTMLElement;

    // Check if the TD element has a certain class
    // const classCheck = 'mat-column-isbn';
    // if (tdElement.classList.contains(classCheck)) {
    //   console.log(`- TD has the class: ${classCheck}`);
    // } else {
    //   console.log(`- TD does not have the class: ${classCheck}`);
    // }

    // Access the parent TR element
    const trElement = tdElement.parentElement as HTMLElement;

    // Select elements within the parent TR
    const elementsWithinTr = trElement.querySelectorAll('td');

    // Array.from(elementsWithinTr).forEach((td) => {
    //   console.log(`- element td: ${td.textContent ?? ''}`);
    // });

    // console.log('preparing to render results');
    const selectedBookEl = document.getElementById('selectedBook');
    if (!selectedBookEl) return;

    // Generate HTML details of selected book
    let bookHTML = '<ul class="book-details">';
    Array.from(elementsWithinTr).forEach((td) => {
      // console.log(field); // each <td>
      // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement
      bookHTML += `<li><b>${td.dataset?.['value'] ?? ''}</b>: ${
        td.innerText
      }</li>`;
    });
    bookHTML += '</ul>';

    selectedBookEl.innerHTML = bookHTML; // render
  }
}

// // App page load event for XML
// document.addEventListener('DOMContentLoaded', (event) => {
//   // getXml();
//   getBooks();
// });
