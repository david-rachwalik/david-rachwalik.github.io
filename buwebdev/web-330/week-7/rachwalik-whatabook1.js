/*
============================================
; Title:        rachwalik-whatabook1.js
; Author:       David Rachwalik
; Date:         2022/02/19
; Description:  What-A-Book App (Part 1) for WEB-330 site
;===========================================
*/

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

// App page load event for XML
document.addEventListener('DOMContentLoaded', (event) => {
  const fileName = 'books.xml';
  fetch(fileName)
    .then((res) => res.text())
    .then((data) => {
      const domParser = new DOMParser();
      const xmlBooks = domParser.parseFromString(data, 'text/xml');
      loadBooks(xmlBooks);
      addIsbnClickEvents();
    });
});
