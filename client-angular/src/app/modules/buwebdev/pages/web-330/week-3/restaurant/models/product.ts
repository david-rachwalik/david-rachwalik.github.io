/*
============================================
; Title:        product.ts
; Author:       David Rachwalik
; Date:         2022/01/22
; Description:  Restaurant App for WEB-330 site
;===========================================
*/

export class Product {
  name: string;
  price: string;

  constructor(name: string, price: string) {
    this.name = name;
    this.price = price;
  }
}
