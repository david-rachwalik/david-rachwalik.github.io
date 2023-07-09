/*
============================================
; Title:        bill.ts
; Author:       David Rachwalik
; Date:         2022/01/22
; Description:  Restaurant App for WEB-330 site
;===========================================
*/

import { Appetizer } from './appetizer';
import { Beverage } from './beverage';
import { Dessert } from './dessert';
import { MainCourse } from './main-course';

/* eslint-disable no-underscore-dangle */
export class Bill {
  _beverages: Beverage[];
  _appetizers: Appetizer[];
  _mainCourses: MainCourse[];
  _desserts: Dessert[];

  constructor() {
    this._beverages = [];
    this._appetizers = [];
    this._mainCourses = [];
    this._desserts = [];
  }

  addBeverage(beverage: Beverage) {
    this._beverages.push(beverage);
  }

  addAppetizer(appetizer: Appetizer) {
    this._appetizers.push(appetizer);
  }

  addMainCourse(mainCourse: MainCourse) {
    this._mainCourses.push(mainCourse);
  }

  addDessert(dessert: Dessert) {
    this._desserts.push(dessert);
  }

  getTotal() {
    let total = 0;
    this._beverages.forEach((beverage) => {
      total += parseFloat(beverage.price);
    });
    this._appetizers.forEach((appetizer) => {
      total += parseFloat(appetizer.price);
    });
    this._mainCourses.forEach((mainCourse) => {
      total += parseFloat(mainCourse.price);
    });
    this._desserts.forEach((dessert) => {
      total += parseFloat(dessert.price);
    });
    return total;
  }
}
