/*
============================================
; Title:        product.ts
; Author:       David Rachwalik
; Date:         2022/02/05
; Description:  Auto Repair App for WEB-330 site
;===========================================
*/

export class Product {
  id: string;
  name: string;
  price: string;

  constructor(name: string, price: string) {
    this.id = Math.random().toString(16).slice(2);
    this.name = name;
    this.price = price;
  }
}
