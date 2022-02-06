/*
============================================
; Title:        product.js
; Author:       David Rachwalik
; Date:         2022/02/05
; Description:  Auto Repair App for WEB-330 site
;===========================================
*/

class Product {
  constructor(name, price) {
    this.id = Math.random().toString(16).slice(2);
    this.name = name;
    this.price = price;
  }
}

export { Product };
