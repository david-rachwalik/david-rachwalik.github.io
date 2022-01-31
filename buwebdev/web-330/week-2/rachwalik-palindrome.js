/*
============================================
; Title:        rachwalik-palindrome.js
; Author:       David Rachwalik
; Date:         2022/01/16
; Description:  Palindrome App for WEB-330 site
;===========================================
*/

function getTodaysDate() {
  const today = new Date().toLocaleDateString('en-US');
  return today;
}

function getLength(txt = '') {
  if (typeof txt !== 'string') return -1;
  return txt.length;
}

function reverse(txt = '') {
  if (typeof txt !== 'string' || !txt.length) return '';
  const strArray = txt.split('').reverse();
  const txtReversed = strArray.join('');
  return txtReversed;
}

function isPalindrome(txt = '') {
  if (typeof txt !== 'string' && txt.length > 0) return false;
  const txtReversed = reverse(txt);
  return txt === txtReversed;
}

// Palindrome web app click event
function checkPhrase() {
  const txtInput = document.getElementById('txtPhrase');
  const assignResultsHeader = document.getElementById('assign-results-header');
  const assignResults = document.getElementById('assign-results');

  // Fetch user input
  if (!txtInput) return;
  const txtPhrase = String(txtInput.value).toLowerCase();
  if (!txtPhrase) {
    // Blank out everything for blank input
    if (assignResultsHeader) assignResultsHeader.innerHTML = '';
    if (assignResults) assignResults.innerHTML = '';
    return;
  }
  // console.log("txtPhrase: " + txtPhrase)

  // Gather info for client display
  const result = isPalindrome(txtPhrase);
  const today = getTodaysDate();
  const len = getLength(txtPhrase);
  const reversedPhrase = reverse(txtPhrase);
  const header = `
    Date: ${today}<br />
    Original Phrase: ${txtPhrase}<br />
    Reversed Phrase: ${reversedPhrase}<br />
    Phrase Length: ${len}
  `;

  // Print result message to client display
  if (assignResultsHeader) assignResultsHeader.innerHTML = header;
  if (assignResults) {
    if (result) {
      assignResults.innerHTML = `${txtPhrase} <b><u>is</u></b> a palindrome!`;
    } else {
      assignResults.innerHTML = `${txtPhrase} <b><u>is not</u></b> a palindrome!`;
    }
  }
}

const submitButton = document.getElementById('btnCheckPhrase');
submitButton.addEventListener('click', checkPhrase);
