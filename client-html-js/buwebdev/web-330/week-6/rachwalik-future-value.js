/*
============================================
; Title:        rachwalik-future-value.js
; Author:       David Rachwalik
; Date:         2022/02/12
; Description:  Future Value App for WEB-330 site
;===========================================
*/

import { FinanceCalculator } from './finance-calculator.js';
import { Validator } from './validator.js';

function setToday() {
  const todayEl = document.getElementById('today');
  if (todayEl) todayEl.innerHTML = new Date().toLocaleDateString('en-US');
}

// expected behavior: user provides the monthly payment, rate, and years,
// clicks the "Calculate" button, and receives the future value
function btnCalculator() {
  const txtMonthlyPaymentEl = document.getElementById('txtMonthlyPayment');
  const txtYearlyRateEl = document.getElementById('txtYearlyRate');
  const listNumOfYearsEl = document.getElementById('listNumOfYears');
  const errorLogEl = document.getElementById('errorLog');
  const futureValueEl = document.getElementById('futureValue');

  // Determine form values provided by user
  const monthlyPayment = txtMonthlyPaymentEl ? txtMonthlyPaymentEl.value : 0;
  const rate = txtYearlyRateEl ? txtYearlyRateEl.value : 0;
  const years = listNumOfYearsEl ? listNumOfYearsEl.value : 0;

  // --- Form Validation ---

  const monthlyPaymentValidator = new Validator('Monthly Payment', monthlyPayment);
  monthlyPaymentValidator.addRequiredField();
  monthlyPaymentValidator.addRequiredFloatField();
  monthlyPaymentValidator.addFloatMinField(100);

  const rateValidator = new Validator('Interest Rate', rate);
  rateValidator.addRequiredField();
  rateValidator.addRequiredFloatField();
  rateValidator.addFloatMaxField(100);

  const errorLog = [];
  const monthlyPaymentValidation = monthlyPaymentValidator.validate();
  const rateValidation = rateValidator.validate();

  // --- Render Results ---

  if (monthlyPaymentValidation && rateValidation) {
    // Send future value calculation to client display
    errorLogEl.innerHTML = '';
    const futureValue = FinanceCalculator.calculateFutureValue(monthlyPayment, rate, years);
    if (futureValueEl) futureValueEl.innerHTML = FinanceCalculator.convertToCurrency(futureValue);
  } else {
    // Send error messages to client display
    if (futureValueEl) futureValueEl.innerHTML = '';
    if (!monthlyPaymentValidation) {
      for (const message of monthlyPaymentValidator.messages) {
        errorLog.push(message);
      }
    }
    if (!rateValidation) {
      for (const message of rateValidator.messages) {
        errorLog.push(message);
      }
    }
    let errorLogMessage = '<ul>';
    for (const msg of errorLog) {
      errorLogMessage += `<li>${msg}</li>`;
    }
    errorLogMessage += '</ul>';
    errorLogEl.innerHTML = errorLogMessage;
  }
}

setToday();

// Future Value App click event
const btnCalculateEl = document.getElementById('btnCalculate');
if (btnCalculateEl) btnCalculateEl.addEventListener('click', btnCalculator);
