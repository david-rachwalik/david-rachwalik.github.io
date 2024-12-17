/*
============================================
; Title:        rachwalik-future-value.js
; Author:       David Rachwalik
; Date:         2022/02/12
; Description:  Future Value App for WEB-330 site
;===========================================
*/

import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardTitle,
} from '@angular/material/card';
import { RouterLink } from '@angular/router';

import { FinanceCalculator } from './models/finance-calculator';
import { Validator } from './models/validator';

@Component({
  selector: 'app-future-value',
  templateUrl: './future-value.component.html',
  styleUrls: ['./future-value.component.css'],
  standalone: true,
  imports: [
    MatCard,
    MatCardTitle,
    MatCardContent,
    FormsModule,
    NgFor,
    MatCardActions,
    MatButton,
    RouterLink,
  ],
})
export class FutureValueComponent implements OnInit {
  // constructor() {}

  ngOnInit(): void {
    this.setToday();
  }

  // Define the number of years in dropdown
  numOfYears = 10;
  // Create an array of years from 1 to numOfYears
  years: number[] = Array.from(
    { length: this.numOfYears },
    (_, index) => index + 1,
  );

  setToday() {
    const todayEl = document.getElementById('today');
    if (todayEl) todayEl.innerHTML = new Date().toLocaleDateString('en-US');
  }

  // expected behavior: user provides the monthly payment, rate, and years,
  // clicks the "Calculate" button, and receives the future value
  btnCalculator() {
    const txtMonthlyPaymentEl = document.getElementById(
      'txtMonthlyPayment',
    ) as HTMLInputElement;
    const txtYearlyRateEl = document.getElementById(
      'txtYearlyRate',
    ) as HTMLInputElement;
    const listNumOfYearsEl = document.getElementById(
      'listNumOfYears',
    ) as HTMLSelectElement;
    const errorLogEl = document.getElementById('errorLog') as HTMLDivElement;
    const futureValueEl = document.getElementById(
      'futureValue',
    ) as HTMLDivElement;

    // Determine form values provided by user
    const monthlyPayment = txtMonthlyPaymentEl
      ? parseFloat(txtMonthlyPaymentEl.value)
      : 0;
    const rate = txtYearlyRateEl ? parseFloat(txtYearlyRateEl.value) : 0;
    const years = listNumOfYearsEl ? parseFloat(listNumOfYearsEl.value) : 0;

    // --- Form Validation ---

    const monthlyPaymentValidator = new Validator(
      'Monthly Payment',
      monthlyPayment.toString(),
    );
    monthlyPaymentValidator.addRequiredField();
    monthlyPaymentValidator.addRequiredFloatField();
    monthlyPaymentValidator.addFloatMinField(100);

    const rateValidator = new Validator('Interest Rate', rate.toString());
    rateValidator.addRequiredField();
    rateValidator.addRequiredFloatField();
    rateValidator.addFloatMaxField(100);

    const errorLog: string[] = [];
    const monthlyPaymentValidation = monthlyPaymentValidator.validate();
    const rateValidation = rateValidator.validate();

    // --- Render Results ---

    if (monthlyPaymentValidation && rateValidation) {
      // Send future value calculation to client display
      errorLogEl.innerHTML = '';
      const futureValue = FinanceCalculator.calculateFutureValue(
        monthlyPayment,
        rate,
        years,
      );
      if (futureValueEl)
        futureValueEl.innerHTML = FinanceCalculator.convertToCurrency(
          parseFloat(futureValue),
        );
    } else {
      // Send error messages to client display
      if (futureValueEl) futureValueEl.innerHTML = '';
      if (!monthlyPaymentValidation) {
        // for (const message of monthlyPaymentValidator.messages) {
        //   errorLog.push(message);
        // }
        Array.from(monthlyPaymentValidator.messages).forEach((message) => {
          errorLog.push(message);
        });
      }
      if (!rateValidation) {
        // for (const message of rateValidator.messages) {
        //   errorLog.push(message);
        // }
        Array.from(rateValidator.messages).forEach((message) => {
          errorLog.push(message);
        });
      }
      let errorLogMessage = '<ul>';
      // for (const msg of errorLog) {
      //   errorLogMessage += `<li>${msg}</li>`;
      // }
      Array.from(errorLog).forEach((msg) => {
        errorLogMessage += `<li>${msg}</li>`;
      });
      errorLogMessage += '</ul>';
      errorLogEl.innerHTML = errorLogMessage;
    }
  }
}

// setToday();

// // Future Value App click event
// const btnCalculateEl = document.getElementById('btnCalculate');
// if (btnCalculateEl) btnCalculateEl.addEventListener('click', btnCalculator);
