/*
============================================
; Title:        float-min-field.js
; Author:       David Rachwalik
; Date:         2022/02/12
; Description:  Future Value App for WEB-330 site
;===========================================
*/

class FloatMinField {
  constructor(name, field, min) {
    this.name = name;
    this.field = field;
    this.min = min;
  }

  validate() {
    const value = parseFloat(this.field);
    return Boolean(!Number.isNaN(value) && value > this.min);
  }

  getMessage() {
    return `${this.name} must be more than ${this.min}. You entered ${this.field}`;
  }
}

export { FloatMinField };
