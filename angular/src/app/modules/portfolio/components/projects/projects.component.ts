import { Component, OnInit } from '@angular/core';

interface ProjectCard {
  flex: string;
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

  constructor() {
    this.projectCards = [
      {
        flex: '33.3%',
        header: 'WEB-231 Index',
        path: '/buwebdev/web-231',
        content:
          'Collection of my WEB-231 projects while at Bellevue University.',
      },
      {
        flex: '33.3%',
        header: 'Card Dealer App',
        path: '/buwebdev/web-231/card-game',
        content:
          'Demo app that shuffles a full deck of cards and presents them to player.',
      },
      {
        flex: '33.3%',
        header: 'Number Guessing Game App',
        path: '/buwebdev/web-231/number-game',
        content:
          'Simple proof of concept app where the player tries to guess a number between 1 and 10.',
      },
      {
        flex: '33.3%',
        header: 'WEB-330 Index',
        path: '/buwebdev/web-330',
        content:
          'Collection of my WEB-330 course projects created during Bellevue University.',
      },
      {
        flex: '33.3%',
        header: 'Future Value Calculator',
        path: '/buwebdev/web-330/future-value',
        content:
          'Simple calculator that determines value based on monthly payment and interest rate.',
      },
      {
        flex: '33.3%',
        header: 'WEB-420 Capstone API',
        path: 'https://rachwalik-capstone.herokuapp.com',
        content: 'Demo web API for the WEB-420 capstone project.',
      },
      {
        flex: '33.3%',
        header: 'WEB-430 Index',
        path: '/buwebdev/web-430',
        content:
          'Collection of my WEB-430 course projects created during Bellevue University.',
      },
      {
        flex: '100%',
        header: 'WEB-425 - Assignment 7.3 - Form Validation',
        path: 'https://david-rachwalik.github.io/gpa-calculator-app/session/sign-in',
        content:
          'Demo page of Angular using reactive forms and data validation for <i>GPA Calculator App</i>.',
      },
      {
        flex: '100%',
        header: 'WEB-425 - Assignment 8.2 - Server-side Communications',
        path: 'https://david-rachwalik.github.io/in-n-out-books',
        content:
          'Demo page of Angular <i>In-N-Out-Books</i> application using a service with API calls to populate book data.',
      },
      {
        flex: '100%',
        header: 'WEB-425 - Assignment 9.2 - Capstone',
        path: 'https://david-rachwalik.github.io/loan-app',
        content:
          'Demo page of Angular <i>Loan App</i> that calculates loan interest and shows communication between components.',
      },
    ];
  }

  ngOnInit(): void {}
}
