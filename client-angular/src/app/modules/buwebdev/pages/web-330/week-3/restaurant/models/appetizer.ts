/*
============================================
; Title:        appetizer.ts
; Author:       David Rachwalik
; Date:         2022/01/22
; Description:  Restaurant App for WEB-330 site
;===========================================
*/

import { Product } from './product';

/* eslint-disable @typescript-eslint/no-useless-constructor */
export class Appetizer extends Product {
  constructor(name: string, price: string) {
    super(name, price);
  }
}
