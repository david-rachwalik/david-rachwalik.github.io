/*
============================================
; Title:        rachwalik-restaurant.js
; Author:       David Rachwalik
; Date:         2022/01/22
; Description:  Restaurant App for WEB-330 site
;===========================================
*/

import { Appetizer, Beverage, Bill, Dessert, MainCourse } from "./index.js";

function displayTotal(total = "") {
    const orderTotalEl = document.getElementById("order-total");
    if (!orderTotalEl) return;
    if (!total) orderTotalEl.innerHTML = "";
    orderTotalEl.innerHTML = `Your order total is ${total}`;
}

// Restaurant web app click event
function checkPhrase() {
    let bill = new Bill();

    // Fetch user input (beverages)
    const beveragesEl = document.getElementById("beverages");
    const beverages = beveragesEl.getElementsByTagName("input");
    for (let beverage of beverages) {
        if (beverage.checked) {
            bill.addBeverage(new Beverage(beverage.name, beverage.getAttribute("data-value")));
        }
    }
    // console.log("bill._beverages: ", bill._beverages);

    // Fetch user input (appetizers)
    const appetizersEl = document.getElementById("appetizers");
    const appetizers = appetizersEl.getElementsByTagName("input");
    for (let appetizer of appetizers) {
        if (appetizer.checked) {
            bill.addAppetizer(new Appetizer(appetizer.name, appetizer.getAttribute("data-value")));
        }
    }
    // console.log("bill._appetizers: ", bill._appetizers);

    // Fetch user input (main-course)
    const mainCoursesEl = document.getElementById("main-courses");
    const mainCourses = mainCoursesEl.getElementsByTagName("input");
    for (let mainCourse of mainCourses) {
        if (mainCourse.checked) {
            bill.addMainCourse(new MainCourse(mainCourse.name, mainCourse.getAttribute("data-value")));
        }
    }
    // console.log("bill._mainCourses: ", bill._mainCourses);

    // Fetch user input (desserts)
    const dessertsEl = document.getElementById("desserts");
    const desserts = dessertsEl.getElementsByTagName("input");
    for (let dessert of desserts) {
        if (dessert.checked) {
            bill.addDessert(new Dessert(dessert.name, dessert.getAttribute("data-value")));
        }
    }
    // console.log("bill._desserts: ", bill._desserts);

    // Gather info & send to client display
    let total = Number(bill.getTotal()).toFixed(2);
    displayTotal(total);
}

let submitButton = document.getElementById("btnOrder");
if (submitButton) submitButton.addEventListener("click", checkPhrase);
