/*
============================================
; Title:        finance-calculator.js
; Author:       David Rachwalik
; Date:         2022/02/12
; Description:  Future Value App for WEB-330 site
;===========================================
*/

/* eslint-disable no-restricted-properties */
/* eslint-disable prettier/prettier */
/* eslint-disable prefer-exponentiation-operator */
class FinanceCalculator {
  static MONTHS_IN_YEAR = 12;

  constructor(name, field, max) {
    this.name = name;
    this.field = field;
    this.max = max;
  }

  static calculateFutureValue(monthlyPayment, rate, years) {
    const months = years * this.MONTHS_IN_YEAR;
    const interestRate = 1 + rate / 100;
    const presentValue = monthlyPayment * months;
    const futureValue = presentValue * Math.pow(interestRate, months);
    return futureValue.toFixed(2);
  }

  static convertToCurrency(field) {
    const currencyFormatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });
    return currencyFormatter.format(field);
  }
}

export { FinanceCalculator };
