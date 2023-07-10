/*
============================================
; Title:        rachwalik-calorie.js
; Author:       David Rachwalik
; Date:         2022/01/30
; Description:  Calorie App for WEB-330 site
;===========================================
*/

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { CalorieConverter } from './calorie-converter';

interface MyFormGroup {
  txtFoodItem: string | null;
}

@Component({
  selector: 'app-calorie',
  templateUrl: './calorie.component.html',
  // styleUrls: ['./calorie.component.scss'],
  styleUrls: [
    '../../styles/theme.css',
    '../../styles/site.css',
    './calorie.component.scss',
  ],
})
export class CalorieComponent implements OnInit {
  form: FormGroup = this.fb.group<MyFormGroup>({
    txtFoodItem: null,
  });

  // constructor() {}
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.populateFoodList();
  }

  populateFoodList() {
    const foodListEl = document.getElementById('foodList');
    if (!foodListEl) return;
    const foodList = CalorieConverter.data;
    let foodListData = '<i>(Ex: ';
    // for (const food of foodList) {
    //   foodListData += `${food.name}, `;
    // }
    Array.from(foodList).forEach((food) => {
      foodListData += `${food.name}, `;
    });
    foodListData = `${foodListData.slice(0, -2)})</i>`;
    foodListEl.innerHTML = foodListData;
  }

  // Calorie web app click event
  checkFoodItems(): void {
    const searchResultsEl = document.getElementById('searchResults');
    // const txtFoodItemEl = document.getElementById('txtFoodItem');
    // if (!searchResultsEl || !txtFoodItemEl) return;
    if (!searchResultsEl) return;
    // const txtFoodItem = txtFoodItemEl.value;
    const txtFoodItem = this.form.controls['txtFoodItem'].value as string;
    // console.log('input provided: ', txtFoodItem);
    const foods = CalorieConverter.find(txtFoodItem);
    console.log('foods: ', foods);

    let tableData = '';
    if (foods.length > 0) {
      // Generate table HTML for food data
      tableData += '<table class="table">';
      tableData +=
        '<thead><tr><th>Name</th><th>Calories</th></tr></thead><tbody>';
      // for (const food of foods) {
      //   tableData += `<tr><td>${food.name}</td><td>${food.calories}</td></tr>`;
      // }
      Array.from(foods).forEach((food) => {
        tableData += `<tr><td>${food.name}</td><td>${food.calories}</td></tr>`;
      });
      tableData += '</tbody></table>';
    } else {
      tableData += 'None';
    }

    // Send table data to client display
    searchResultsEl.innerHTML = tableData;
  }

  // const submitButton = document.getElementById('btnSearch');
  // submitButton.addEventListener('click', checkFoodItems);

  // // Prevent default refresh on form
  // window.addEventListener('keydown', (event) => {
  //   if (event.key === 'Enter') event.preventDefault();
  // });

  // // Call event for when user releases key
  // const foodItemInputEl = document.getElementById('txtFoodItem');
  // if (foodItemInputEl)
  //   foodItemInputEl.addEventListener('keyup', (event) => {
  //     if (event.key === 'Enter') {
  //       event.preventDefault();
  //       document.getElementById('btnSearch').click();
  //     }
  //   });
}
