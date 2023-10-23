/*
============================================
; Title:        validator.ts
; Author:       David Rachwalik
; Date:         2022/02/12
; Description:  Future Value App for WEB-330 site
;===========================================
*/

import { FloatField } from './float-field';
import { FloatMaxField } from './float-max-field';
import { FloatMinField } from './float-min-field';
import { RequiredField } from './required-field';

type IField = RequiredField | FloatField | FloatMaxField | FloatMinField;

export class Validator {
  name: string;
  field: string;

  // validators = [];
  validators: IField[];

  // messages = [];
  messages: string[];

  constructor(name: string, field: string) {
    this.name = name;
    this.field = field;

    this.validators = [];

    this.messages = [];
  }

  addRequiredField() {
    this.validators.push(new RequiredField(this.name, this.field));
  }

  addRequiredFloatField() {
    this.validators.push(new FloatField(this.name, this.field));
  }

  addFloatMinField(min: number) {
    this.validators.push(new FloatMinField(this.name, this.field, min));
  }

  addFloatMaxField(max: number) {
    this.validators.push(new FloatMaxField(this.name, this.field, max));
  }

  validate(): boolean {
    let isValid = false;
    // for (const validator of this.validators) {
    //   const result = validator.validate();
    //   if (!result) {
    //     this.messages.push(validator.getMessage());
    //     return false;
    //   }
    // }
    Array.from(this.validators).forEach((validator) => {
      const result = validator.validate();
      if (!result) {
        this.messages.push(validator.getMessage());
        return false;
      }
      isValid = true;
      return true;
    });
    isValid = true;
    return isValid;
  }
}
