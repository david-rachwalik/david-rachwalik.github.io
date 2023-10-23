/*
============================================
; Title:        required-field.ts
; Author:       David Rachwalik
; Date:         2022/02/12
; Description:  Future Value App for WEB-330 site
;===========================================
*/

export class RequiredField {
  name: string;
  field: string;

  constructor(name: string, field: string) {
    this.name = name;
    this.field = field;
  }

  validate() {
    return Boolean(this.field);
  }

  getMessage() {
    return `${this.name} is a required field.`;
  }
}
