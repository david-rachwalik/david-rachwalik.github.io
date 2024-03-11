import { Component, OnInit } from '@angular/core';

interface ProjectCard {
  // flex: string;
  // cls: string;
  style: string;
  header: string;
  path: string;
  content: string;
}

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit {
  projectCards: ProjectCard[];
  // widthFull = 'tw-flex-item-full';
  // widthOneThird = 'tw-flex-item-1/3';

  constructor() {
    // https://tailwindcss.com/docs/grid-column
    // https://www.w3schools.com/cssref/pr_grid-column.php
    this.projectCards = [
      {
        style: 'grid-column: span 3;',
        // flex: '100%',
        // cls: this.widthFull,
        header: "WEB-450 - Assignment #2 - Bob's Computer Repair Shop *",
        // path: 'https://slytherin-bcrs-web450.herokuapp.com',
        path: 'https://bcrs.azurewebsites.net',
        content:
          'Demo page of Angular <i>BCRS</i>&nbsp; that tracks account role access, repair services, invoices, and data graphs.',
      },
      {
        style: 'grid-column: span 3;',
        // flex: '100%',
        // cls: this.widthFull,
        header: 'WEB-450 - Assignment #1 - nodebucket *',
        // path: 'https://rachwalik-nodebucket.herokuapp.com',
        path: 'https://nodebucket.azurewebsites.net',
        content:
          'Demo page of Angular <i>nodebucket</i>&nbsp; that provides a to-do tracker for logged-in users.',
      },
      {
        style: 'grid-column: auto;',
        // flex: '33.3%',
        // cls: this.widthOneThird,
        header: 'WEB-231 Index',
        path: '/buwebdev/web-231',
        content:
          'Collection of my WEB-231 projects while at Bellevue University.',
      },
      {
        style: 'grid-column: auto;',
        // flex: '33.3%',
        // cls: this.widthOneThird,
        header: 'Card Dealer App',
        path: '/buwebdev/web-231/card-game',
        content:
          'Demo app that shuffles a full deck of cards and presents them to player.',
      },
      {
        style: 'grid-column: auto;',
        // flex: '33.3%',
        // cls: this.widthOneThird,
        header: 'Number Guessing Game App',
        path: '/buwebdev/web-231/number-game',
        content:
          'Simple proof of concept app where the player tries to guess a number between 1 and 10.',
      },
      {
        style: 'grid-column: auto;',
        // flex: '33.3%',
        // cls: this.widthOneThird,
        header: 'WEB-330 Index',
        path: '/buwebdev/web-330',
        content:
          'Collection of my WEB-330 course projects created during Bellevue University.',
      },
      {
        style: 'grid-column: auto;',
        // flex: '33.3%',
        // cls: this.widthOneThird,
        header: 'Future Value Calculator',
        path: '/buwebdev/web-330/future-value',
        content:
          'Simple calculator that determines value based on monthly payment and interest rate.',
      },
      {
        style: 'grid-column: auto;',
        // flex: '33.3%',
        // cls: this.widthOneThird,
        header: 'WEB-420 Capstone API *',
        path: 'https://rachwalik-capstone.herokuapp.com',
        content: 'Demo web API for the WEB-420 capstone project.',
      },
      {
        style: 'grid-column: span 3;',
        // flex: '100%',
        // cls: this.widthFull,
        header: 'WEB-425 - Assignment 7.3 - Form Validation',
        path: 'https://david-rachwalik.github.io/gpa-calculator-app/session/sign-in',
        content:
          'Demo page of Angular using reactive forms and data validation for <i>GPA Calculator App</i>.',
      },
      {
        style: 'grid-column: span 3;',
        // flex: '100%',
        // cls: this.widthFull,
        header: 'WEB-425 - Assignment 8.2 - Server-side Communications',
        path: 'https://david-rachwalik.github.io/in-n-out-books',
        content:
          'Demo page of Angular <i>In-N-Out-Books</i>&nbsp; application using a service with API calls to populate book data.',
      },
      {
        style: 'grid-column: span 3;',
        // flex: '100%',
        // cls: this.widthFull,
        header: 'WEB-425 - Assignment 9.2 - Capstone',
        path: 'https://david-rachwalik.github.io/loan-app',
        content:
          'Demo page of Angular <i>Loan App</i>&nbsp; that calculates loan interest and shows communication between components.',
      },
      {
        style: 'grid-column: auto;',
        // flex: '33.3%',
        // cls: this.widthOneThird,
        header: 'WEB-430 Index',
        path: '/buwebdev/web-430',
        content:
          'Collection of my DevOps course presentations created during Bellevue University.',
      },
    ];
  }

  ngOnInit(): void {}
}
