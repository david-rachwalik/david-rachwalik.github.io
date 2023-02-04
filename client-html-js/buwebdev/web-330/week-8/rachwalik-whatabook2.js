/*
============================================
; Title:        rachwalik-whatabook2.js
; Author:       David Rachwalik
; Date:         2022/02/27
; Description:  What-A-Book app for WEB-330 site
;===========================================
*/

import { HttpClient } from './http-client.js';

function loadBooks(xml) {
  const books = xml.getElementsByTagName('book');
  const bookListEl = document.getElementById('bookList');
  if (!bookListEl) return;

  // HTML table header
  let tableData = `
    <table id="bookTable" class="table">
      <thead>
          <tr>
              <th>ISBN</th>
              <th>Title</th>
              <th>Description</th>
              <th>Pages</th>
              <th>Authors</th>
          </tr>
      </thead>
      <tbody>`;
  // Generate rows of table content
  for (const book of books) {
    const isbn = book.getElementsByTagName('isbn')[0].childNodes[0].nodeValue;
    const title = book.getElementsByTagName('title')[0].childNodes[0].nodeValue;
    const description = book.getElementsByTagName('description')[0].childNodes[0].nodeValue;
    const pages = book.getElementsByTagName('pages')[0].childNodes[0].nodeValue;
    const authors = book.getElementsByTagName('authors')[0].childNodes[0].nodeValue;
    tableData += `<tr>
        <td data-value="ISBN"><a class="isbn-link">${isbn}</a></td>
        <td data-value="Title">${title}</td>
        <td data-value="Description">${description}</td>
        <td data-value="Pages">${pages}</td>
        <td data-value="Authors">${authors}</td>
      </tr>`;
  }
  tableData += `</tbody></table>`;

  // return tableData;
  bookListEl.innerHTML = tableData;
}

// Details display of selectedBook section
function anchorClicked(e) {
  e.preventDefault();
  const selectedBookEl = document.getElementById('selectedBook');
  if (!selectedBookEl) return;

  const self = this;
  const cell = self.parentElement;
  const row = cell.parentElement;
  const data = row.querySelectorAll('td');

  // Generate HTML details of selected book
  let bookData = `<ul class="book-details">`;
  for (const field of data) {
    // console.log(field); // each <td>
    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement
    bookData += `<li><b>${field.dataset.value}</b>: ${field.innerText}</li>`;
  }
  bookData += `</ul>`;

  selectedBookEl.innerHTML = bookData; // render
}

// Intended functionality: XML records displayed in HTML table when page loads
// - if user selects a book's ISBN number, the details appear in the selectedBook section
function addIsbnClickEvents() {
  const viewButtons = document.querySelectorAll('#bookTable tbody .isbn-link');
  for (let index = 0; index < viewButtons.length; index += 1) {
    viewButtons[index].addEventListener('click', anchorClicked);
  }
}

function buildHtmlString(res, format) {
  let ulString = '';
  // HTML table header
  let tableString = `
    <table id="bookTable" class="table">
      <thead>
          <tr>
              <th>ISBN</th>
              <th>Title</th>
              <th>Description</th>
              <th>Pages</th>
              <th>Authors</th>
          </tr>
      </thead>
      <tbody>`;
  // Generate rows of table content
  for (const key in res) {
    if (Object.hasOwnProperty.call(res, key)) {
      const prop = res[key];
      // console.log(`prop.details: ${Object.keys(prop.details)}`);
      ulString += '<ul style="list-style: none;">';

      let authors = [];
      if (prop.details.authors) {
        authors = prop.details.authors.map((author) => {
          return author.name;
        });
      }

      const book = {
        isbn: prop.details.isbn_13 ? prop.details.isbn_13 : prop.details.isbn_10,
        title: prop.details.title,
        description: prop.details.subtitle ? prop.details.subtitle : 'N/A',
        pages: prop.details.number_of_pages ? prop.details.number_of_pages : 'N/A',
        authors: authors.join(','),
      };

      ulString += `
        <li><b>ISBN:</b> ${book.isbn}</li>
        <li><b>Title:</b> ${book.title}</li>
        <li><b>Description:</b> ${book.description}</li>
        <li><b>Pages:</b> ${book.pages}</li>
        <li><b>Authors:</b> ${book.authors}</li>`;

      tableString += `<tr>
          <td data-value="ISBN"><a class="isbn-link">${book.isbn}</a></td>
          <td data-value="Title">${book.title}</td>
          <td data-value="Description">${book.description}</td>
          <td data-value="Pages">${book.pages}</td>
          <td data-value="Authors">${book.authors}</td>
        </tr>`;
    }
  }
  return format === 'table' ? tableString : ulString;
}

// ---------------------------------------------------------------

function getXml() {
  const fileName = 'books.xml';
  fetch(fileName)
    .then((res) => res.text())
    .then((data) => {
      const domParser = new DOMParser();
      const xmlBooks = domParser.parseFromString(data, 'text/xml');
      loadBooks(xmlBooks);
      addIsbnClickEvents();
    });
}

function getBook(event) {
  event.preventDefault();
  const self = this;
  const isbn = self.innerText;
}

function getBooks(event) {
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
  const params = {
    bibkeys: `ISBN:${isbns.join(',')}`,
    format: 'json',
    jscmd: 'details',
  };

  const http = new HttpClient();
  http
    .get('https://openlibrary.org/api/books', params)
    .then((res) => {
      console.log(res);
      const bookList = document.getElementById('bookList');
      if (bookList) bookList.innerHTML = buildHtmlString(res, 'table');
      addIsbnClickEvents();
    })
    .catch((error) => {
      console.log(error);
    });
}

// ---------------------------------------------------------------

// App page load event for XML
document.addEventListener('DOMContentLoaded', (event) => {
  // getXml();
  getBooks();
});
