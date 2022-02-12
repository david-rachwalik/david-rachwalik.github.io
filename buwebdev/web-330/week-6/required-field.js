/*
============================================
; Title:        required-field.js
; Author:       David Rachwalik
; Date:         2022/02/12
; Description:  Future Value App for WEB-330 site
;===========================================
*/

class RequiredField {
  constructor(name, field) {
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

export { RequiredField };
