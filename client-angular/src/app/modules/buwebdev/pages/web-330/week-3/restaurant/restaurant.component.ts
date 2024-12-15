/*
============================================
; Title:        rachwalik-restaurant.ts
; Author:       David Rachwalik
; Date:         2022/01/22
; Description:  Restaurant App for WEB-330 site
;===========================================
*/

import { Component, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardTitle,
} from '@angular/material/card';
import { MatCheckbox } from '@angular/material/checkbox';
import { RouterLink } from '@angular/router';

import { Appetizer, Beverage, Bill, Dessert, MainCourse } from './models/index';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  // styleUrls: ['./restaurant.component.scss'],
  styleUrls: ['../../styles/theme.css', '../../styles/site.css'],
  standalone: true,
  imports: [
    MatCard,
    MatCardTitle,
    MatCardContent,
    MatCheckbox,
    MatCardActions,
    MatButton,
    RouterLink,
  ],
})
export class RestaurantComponent implements OnInit {
  ngOnInit(): void {}

  displayTotal(total = '') {
    const orderTotalEl = document.getElementById('order-total');
    if (!orderTotalEl) return;
    if (!total) orderTotalEl.innerHTML = '';
    orderTotalEl.innerHTML = `Your order total is ${total}`;
  }

  // Restaurant web app click event
  checkPhrase() {
    const bill = new Bill();

    // Fetch user input (beverages)
    const beveragesEl = document.getElementById('beverages');
    if (beveragesEl) {
      const beverages = beveragesEl.getElementsByTagName('mat-checkbox');
      // 'no-restricted-syntax' rule: https://github.com/airbnb/javascript/issues/1271
      // Use Object.entries, Object.keys, or Object.values
      // Object.values(beverages).forEach((beverage) => {
      Array.from(beverages).forEach((beverage) => {
        if (beverage.classList.contains('mat-mdc-checkbox-checked')) {
          bill.addBeverage(
            new Beverage(
              beverage.getAttribute('name') || '',
              beverage.getAttribute('value') || '',
            ),
          );
        }
      });
    }
    // console.log("bill._beverages: ", bill._beverages);

    // Fetch user input (appetizers)
    const appetizersEl = document.getElementById('appetizers');
    if (appetizersEl) {
      const appetizers = appetizersEl.getElementsByTagName('mat-checkbox');
      Array.from(appetizers).forEach((appetizer) => {
        if (appetizer.classList.contains('mat-mdc-checkbox-checked')) {
          bill.addAppetizer(
            new Appetizer(
              appetizer.getAttribute('name') || '',
              appetizer.getAttribute('value') || '',
            ),
          );
        }
      });
    }
    // console.log("bill._appetizers: ", bill._appetizers);

    // Fetch user input (main-course)
    const mainCoursesEl = document.getElementById('main-courses');
    if (mainCoursesEl) {
      const mainCourses = mainCoursesEl.getElementsByTagName('mat-checkbox');
      Array.from(mainCourses).forEach((mainCourse) => {
        if (mainCourse.classList.contains('mat-mdc-checkbox-checked')) {
          bill.addMainCourse(
            new MainCourse(
              mainCourse.getAttribute('name') || '',
              mainCourse.getAttribute('value') || '',
            ),
          );
        }
      });
    }
    // console.log("bill._mainCourses: ", bill._mainCourses);

    // Fetch user input (desserts)
    const dessertsEl = document.getElementById('desserts');
    if (dessertsEl) {
      const desserts = dessertsEl.getElementsByTagName('mat-checkbox');
      Array.from(desserts).forEach((dessert) => {
        if (dessert.classList.contains('mat-mdc-checkbox-checked')) {
          bill.addDessert(
            new Dessert(
              dessert.getAttribute('name') || '',
              dessert.getAttribute('value') || '',
            ),
          );
        }
      });
    }
    // console.log("bill._desserts: ", bill._desserts);

    // Gather info & send to client display
    const total = Number(bill.getTotal()).toFixed(2);
    this.displayTotal(total);
  }
}
