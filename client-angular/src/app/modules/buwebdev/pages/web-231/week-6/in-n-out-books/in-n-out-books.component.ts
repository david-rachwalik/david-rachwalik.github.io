import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-in-n-out-books',
  templateUrl: './in-n-out-books.component.html',
  styleUrls: ['./in-n-out-books.component.css'],
  standalone: true,
  imports: [
    MatCard,
    MatCardTitle,
    MatCardContent,
    FormsModule,
    MatButton,
    RouterLink,
  ],
})
export class InNOutBooksComponent implements OnInit {
  book_lord_of_the_rings = {
    isbn: '0395489326',
    title: 'The Lord of the Rings',
    pages: 1214,
  };
  book_illustrated_man = {
    isbn: '9781451678185',
    title: 'The Illustrated Man',
    pages: 279,
  };
  book_martian = {
    isbn: '0553418025',
    title: 'The Martian',
    pages: 387,
  };

  author_jrr_tolkien = {
    name: 'J. R. R. Tolkien',
    genre: 'Fantasy',
  };
  author_rumiko_takahashi = {
    name: 'Rumiko Takahashi',
    genre: 'Manga',
  };
  author_hajime_isayama = {
    name: 'Hajime Isayama',
    genre: 'Manga',
  };

  ngOnInit() {
    // Default display for tables
    const books = document.getElementById('favorite-books');
    if (books === null) {
      return;
    }
    const authors = document.getElementById('favorite-authors');
    if (authors === null) {
      return;
    }

    books.style.display = 'none';
    authors.style.display = 'none';

    // Populate initial table values (book)
    this.applyHTML('txtLordOfTheRingsISBN', this.book_lord_of_the_rings.isbn);
    this.applyHTML('txtLordOfTheRingsTitle', this.book_lord_of_the_rings.title);
    this.applyHTML(
      'txtLordOfTheRingsPages',
      this.book_lord_of_the_rings.pages.toString(),
    );

    this.applyHTML('txtIllustratedManISBN', this.book_illustrated_man.isbn);
    this.applyHTML('txtIllustratedManTitle', this.book_illustrated_man.title);
    this.applyHTML(
      'txtIllustratedManPages',
      this.book_illustrated_man.pages.toString(),
    );

    this.applyHTML('txtMartianISBN', this.book_martian.isbn);
    this.applyHTML('txtMartianTitle', this.book_martian.title);
    this.applyHTML('txtMartianPages', this.book_martian.pages.toString());

    // Populate initial table values (author)
    this.applyHTML('txtJrrTolkienName', this.author_jrr_tolkien.name);
    this.applyHTML('txtJrrTolkienGenre', this.author_jrr_tolkien.genre);

    this.applyHTML('txtRumikoTakahashiName', this.author_rumiko_takahashi.name);
    this.applyHTML(
      'txtRumikoTakahashiGenre',
      this.author_rumiko_takahashi.genre,
    );

    this.applyHTML('txtHajimeIsayamaName', this.author_hajime_isayama.name);
    this.applyHTML('txtHajimeIsayamaGenre', this.author_hajime_isayama.genre);
  }

  applyHTML(elementId: string, value: string): void {
    const element = document.getElementById(elementId);
    if (element !== null) {
      element.innerHTML = value;
    }
  }

  // On click action
  favTable(): void {
    // Default display for tables
    const books = document.getElementById('favorite-books');
    if (books === null) {
      return;
    }
    const authors = document.getElementById('favorite-authors');
    if (authors === null) {
      return;
    }

    const tempInput = document.getElementById(
      'favoriteList',
    ) as HTMLInputElement;
    const choice = tempInput.value;
    // console.log("choice: " + choice);

    if (choice === 'books') {
      books.style.display = 'block';
      authors.style.display = 'none';
    } else if (choice === 'authors') {
      books.style.display = 'none';
      authors.style.display = 'block';
    } else {
      books.style.display = 'none';
      authors.style.display = 'none';
    }
  }

  // const submitButton = document.getElementById('btnDisplayListing');
  // submitButton.onclick = favTable;
}
