/*
============================================
; Title:        float-max-field.js
; Author:       David Rachwalik
; Date:         2022/02/12
; Description:  Future Value App for WEB-330 site
;===========================================
*/

class FloatMaxField {
  constructor(name, field, max) {
    this.name = name;
    this.field = field;
    this.max = max;
  }

  validate() {
    const value = parseFloat(this.field);
    return Boolean(!Number.isNaN(value) && value < this.max);
  }

  getMessage() {
    return `${this.name} must be less than ${this.max}. You entered ${this.field}`;
  }
}

export { FloatMaxField };
