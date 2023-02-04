/*
============================================
; Title:        validator.js
; Author:       David Rachwalik
; Date:         2022/02/12
; Description:  Future Value App for WEB-330 site
;===========================================
*/

import { FloatField } from './float-field.js';
import { FloatMaxField } from './float-max-field.js';
import { FloatMinField } from './float-min-field.js';
import { RequiredField } from './required-field.js';

class Validator {
  validators = [];

  messages = [];

  constructor(name, field) {
    this.name = name;
    this.field = field;
  }

  addRequiredField() {
    this.validators.push(new RequiredField(this.name, this.field));
  }

  addRequiredFloatField() {
    this.validators.push(new FloatField(this.name, this.field));
  }

  addFloatMinField(min) {
    this.validators.push(new FloatMinField(this.name, this.field, min));
  }

  addFloatMaxField(max) {
    this.validators.push(new FloatMaxField(this.name, this.field, max));
  }

  validate() {
    for (const validator of this.validators) {
      const result = validator.validate();
      if (!result) {
        this.messages.push(validator.getMessage());
        return false;
      }
    }
    return true;
  }
}

export { Validator };
