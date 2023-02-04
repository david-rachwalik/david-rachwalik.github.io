/*
============================================
; Title:  rachwalik-in-n-out-books.js
; Author: David Rachwalik
; Date:   2021/11/27
; Description: Exercise 6.2 for Bellevue University course WEB-231
;===========================================
*/

(function () {
  const book_lord_of_the_rings = {
    isbn: '0395489326',
    title: 'The Lord of the Rings',
    pages: 1214,
  };
  const book_illustrated_man = {
    isbn: '9781451678185',
    title: 'The Illustrated Man',
    pages: 279,
  };
  const book_martian = {
    isbn: '0553418025',
    title: 'The Martian',
    pages: 387,
  };

  const author_jrr_tolkien = {
    name: 'J. R. R. Tolkien',
    genre: 'Fantasy',
  };
  const author_rumiko_takahashi = {
    name: 'Rumiko Takahashi',
    genre: 'Manga',
  };
  const author_hajime_isayama = {
    name: 'Hajime Isayama',
    genre: 'Manga',
  };

  // Default display for tables
  const books = document.getElementById('favorite-books');
  const authors = document.getElementById('favorite-authors');
  books.style.display = 'none';
  authors.style.display = 'none';

  // Populate initial table values (book)
  document.getElementById('txtLordOfTheRingsISBN').innerHTML = book_lord_of_the_rings.isbn;
  document.getElementById('txtLordOfTheRingsTitle').innerHTML = book_lord_of_the_rings.title;
  document.getElementById('txtLordOfTheRingsPages').innerHTML = book_lord_of_the_rings.pages;

  document.getElementById('txtIllustratedManISBN').innerHTML = book_illustrated_man.isbn;
  document.getElementById('txtIllustratedManTitle').innerHTML = book_illustrated_man.title;
  document.getElementById('txtIllustratedManPages').innerHTML = book_illustrated_man.pages;

  document.getElementById('txtMartianISBN').innerHTML = book_martian.isbn;
  document.getElementById('txtMartianTitle').innerHTML = book_martian.title;
  document.getElementById('txtMartianPages').innerHTML = book_martian.pages;

  // Populate initial table values (author)
  document.getElementById('txtJrrTolkienName').innerHTML = author_jrr_tolkien.name;
  document.getElementById('txtJrrTolkienGenre').innerHTML = author_jrr_tolkien.genre;

  document.getElementById('txtRumikoTakahashiName').innerHTML = author_rumiko_takahashi.name;
  document.getElementById('txtRumikoTakahashiGenre').innerHTML = author_rumiko_takahashi.genre;

  document.getElementById('txtHajimeIsayamaName').innerHTML = author_hajime_isayama.name;
  document.getElementById('txtHajimeIsayamaGenre').innerHTML = author_hajime_isayama.genre;

  // On click action
  function favTable() {
    const tempInput = document.getElementById('favoriteList');
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

  const submitButton = document.getElementById('btnDisplayListing');
  submitButton.onclick = favTable;
})();
