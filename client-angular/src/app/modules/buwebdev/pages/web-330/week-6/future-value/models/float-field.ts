/*
============================================
; Title:        float-field.ts
; Author:       David Rachwalik
; Date:         2022/02/12
; Description:  Future Value App for WEB-330 site
;===========================================
*/

export class FloatField {
  name: string;
  field: string;

  constructor(name: string, field: string) {
    this.name = name;
    this.field = field;
  }

  validate() {
    const value = parseFloat(this.field);
    return !Number.isNaN(value);
  }

  getMessage() {
    return `${this.name} must be a float value. You entered ${this.field}`;
  }
}
