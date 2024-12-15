/*
============================================
; Title:        rachwalik-whatabook1.ts
; Author:       David Rachwalik
; Date:         2022/02/19
; Description:  What-A-Book App (Part 1) for WEB-330 site
;===========================================
*/

import { CdkTableDataSourceInput } from '@angular/cdk/table';
import { HttpClient } from '@angular/common/http';
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
import { catchError, lastValueFrom, map } from 'rxjs';

export interface BookElement {
  // isbn: number;
  isbn: string;
  title: string;
  description: string;
  // pages: number;
  pages: string;
  authors: string;
}

@Component({
  selector: 'app-whatabook1',
  templateUrl: './whatabook1.component.html',
  styleUrls: ['./whatabook1.component.scss'],
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
export class Whatabook1Component implements OnInit {
  xmlData = '';
  displayedColumns: string[] = [
    'isbn',
    'title',
    'description',
    'pages',
    'authors',
  ];
  dataSource!: CdkTableDataSourceInput<BookElement>; // Define data type

  constructor(private httpClient: HttpClient) {
    // Define the URL of the XML file
    const fileName = 'assets/docs/buwebdev/week-7-books.xml';
    // this.parseXML(fileName);

    // const books = this.parseXmlData(fileName);
    // this.populateTableData(books);

    // eslint-disable-next-line no-void
    void this.loadTableData(fileName);
  }

  ngOnInit(): void {}

  parseBooks(xmlDoc: Document): BookElement[] {
    let books: BookElement[] = [];
    // Parse XML data into an array of book objects
    books = Array.from(xmlDoc.querySelectorAll('book')).map((book) => {
      return {
        isbn: book.querySelector('isbn')?.textContent || '',
        title: book.querySelector('title')?.textContent || '',
        description: book.querySelector('description')?.textContent || '',
        pages: book.querySelector('pages')?.textContent || '',
        authors: book.querySelector('authors')?.textContent || '',
      } as BookElement;
    });
    return books;
  }

  async loadTableData(fileName: string): Promise<void> {
    let books: BookElement[] = [];
    // Parse books from XML data
    try {
      const xmlString = await lastValueFrom(
        this.httpClient.get(fileName, { responseType: 'text' }).pipe(
          catchError((error) => {
            console.error('Error fetching XML data:', error);
            throw error; // Re-throw the error for handling in the catch block
          }),
          map((response) => response || ''),
        ),
      );

      const domParser = new DOMParser();
      const xmlDoc = domParser.parseFromString(xmlString, 'text/xml');

      books = this.parseBooks(xmlDoc);
      // console.log(`XML book count: ${books.length}`);

      // return books;
    } catch (error) {
      console.error('Error parsing XML data:', error);
      // return [];
    }

    // Populate table data using XML parse
    this.dataSource = new MatTableDataSource(books);
  }

  parseXML(fileName: string): void {
    // Fetch the XML data and process it
    this.httpClient
      .get(fileName, { responseType: 'text' })
      .subscribe((xmlString) => {
        // Parse XML into a DOM structure to access and extract data
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
        // Now xmlDoc contains the parsed XML data in a DOM structure

        const books = this.parseBooks(xmlDoc);

        // Create a data source using parsed data
        this.dataSource = new MatTableDataSource(books);
      });
  }

  // Details display of selectedBook section
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

// App page load event for XML
// document.addEventListener('DOMContentLoaded', (event) => {
//   const fileName = 'books.xml';
//   fetch(fileName)
//     .then((res) => res.text())
//     .then((data) => {
//       const domParser = new DOMParser();
//       const xmlBooks = domParser.parseFromString(data, 'text/xml');
//       loadBooks(xmlBooks);
//       addIsbnClickEvents();
//     });
// });
