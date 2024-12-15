/*
============================================
; Title:        palindrome
; Author:       David Rachwalik
; Date:         2022/01/16
; Description:  Palindrome App for WEB-330 site
;===========================================
*/

import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardTitle,
} from '@angular/material/card';
import { MatInput } from '@angular/material/input';
import { RouterLink } from '@angular/router';

interface MyFormGroup {
  text?: string;
  txtPhrase: string | null;
}

@Component({
  selector: 'app-palindrome',
  templateUrl: './rachwalik-palindrome.html',
  // styleUrls: ['./palindrome.component.scss'],
  // <link rel="stylesheet" type="text/css" href="../styles/theme.css">
  // <link rel="stylesheet" type="text/css" href="../styles/site.css">
  styleUrls: ['../../styles/theme.css', '../../styles/site.css'],
  standalone: true,
  imports: [
    MatCard,
    MatCardTitle,
    FormsModule,
    ReactiveFormsModule,
    MatCardContent,
    MatInput,
    MatCardActions,
    MatButton,
    RouterLink,
  ],
})
export class PalindromeComponent implements OnInit {
  form: FormGroup = this.fb.group<MyFormGroup>({
    txtPhrase: null,
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

  getTodaysDate() {
    const today = new Date().toLocaleDateString('en-US');
    return today;
  }

  getLength(txt = '') {
    if (typeof txt !== 'string') return -1;
    return txt.length;
  }

  reverse(txt = '') {
    if (typeof txt !== 'string' || !txt.length) return '';
    const strArray = txt.split('').reverse();
    const txtReversed = strArray.join('');
    return txtReversed;
  }

  isPalindrome(txt = '') {
    // if (typeof txt !== 'string' && txt.length > 0) return false;
    const txtReversed = this.reverse(txt);
    return txt === txtReversed;
  }

  mockCheckPhrase() {
    console.log('mockCheckPhrase');
    const textValue: string = this.form.controls['text'].value as string;
    console.log(`textValue: ${textValue}`);
  }

  // Palindrome web app click event
  checkPhrase() {
    // const txtInput = document.getElementById('txtPhrase');
    const txtInput: string =
      (this.form.controls['txtPhrase'].value as string) || '';
    console.log(`txtInput: ${txtInput}`);

    const assignResultsHeader = document.getElementById(
      'assign-results-header',
    );
    const assignResults = document.getElementById('assign-results');

    // Fetch user input
    if (!txtInput) return;
    const txtPhrase = String(txtInput).toLowerCase();
    if (!txtPhrase) {
      // Blank out everything for blank input
      if (assignResultsHeader) assignResultsHeader.innerHTML = '';
      if (assignResults) assignResults.innerHTML = '';
      return;
    }
    // console.log("txtPhrase: " + txtPhrase)

    // Gather info for client display
    const result = this.isPalindrome(txtPhrase);
    const today = this.getTodaysDate();
    const len = this.getLength(txtPhrase);
    const reversedPhrase = this.reverse(txtPhrase);
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
}
