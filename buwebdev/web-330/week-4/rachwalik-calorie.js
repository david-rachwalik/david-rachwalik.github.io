/*
============================================
; Title:        rachwalik-calorie.js
; Author:       David Rachwalik
; Date:         2022/01/30
; Description:  Calorie App for WEB-330 site
;===========================================
*/

import { CalorieConverter } from './calorie-converter.js';

function populateFoodList() {
  const foodListEl = document.getElementById('foodList');
  if (!foodListEl) return;
  const foodList = CalorieConverter.data;
  let foodListData = '<i>(Ex: ';
  for (const food of foodList) {
    foodListData += `${food.name}, `;
  }
  foodListData = `${foodListData.slice(0, -2)})</i>`;
  foodListEl.innerHTML = foodListData;
}
populateFoodList();

// Calorie web app click event
function checkFoodItems() {
  const searchResultsEl = document.getElementById('searchResults');
  const txtFoodItemEl = document.getElementById('txtFoodItem');
  if (!searchResultsEl || !txtFoodItemEl) return;
  const txtFoodItem = txtFoodItemEl.value;
  const foods = CalorieConverter.find(txtFoodItem);
  console.log('foods: ', foods);

  let tableData = '';
  if (foods.length > 0) {
    // Generate table HTML for food data
    tableData += '<table class="table">';
    tableData += '<thead><tr><th>Name</th><th>Calories</th></tr></thead><tbody>';
    for (const food of foods) {
      tableData += `<tr><td>${food.name}</td><td>${food.calories}</td></tr>`;
    }
    tableData += '</tbody></table>';
  }

  // Send table data to client display
  searchResultsEl.innerHTML = tableData;
}

const submitButton = document.getElementById('btnSearch');
submitButton.addEventListener('click', checkFoodItems);

// Prevent default refresh on form
window.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') event.preventDefault();
});

// Call event for when user releases key
const foodItemInputEl = document.getElementById('txtFoodItem');
if (foodItemInputEl)
  foodItemInputEl.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      document.getElementById('btnSearch').click();
    }
  });
