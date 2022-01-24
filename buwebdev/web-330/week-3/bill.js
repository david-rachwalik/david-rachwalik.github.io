/*
============================================
; Title:        bill.js
; Author:       David Rachwalik
; Date:         2022/01/22
; Description:  Restaurant App for WEB-330 site
;===========================================
*/

export class Bill {
    constructor() {
        this._beverages = [];
        this._appetizers = [];
        this._mainCourses = [];
        this._desserts = [];
    }

    addBeverage(beverage) {
        this._beverages.push(beverage);
    }

    addAppetizer(appetizer) {
        this._appetizers.push(appetizer);
    }

    addMainCourse(mainCourse) {
        this._mainCourses.push(mainCourse);
    }

    addDessert(dessert) {
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
