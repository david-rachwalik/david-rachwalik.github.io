/*
============================================
; Title:        shopping-cart.js
; Author:       David Rachwalik
; Date:         2022/02/05
; Description:  Auto Repair App for WEB-330 site
;===========================================
*/

class ShoppingCart {
  constructor(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
    this.products = [];
  }

  count() {
    return this.products.length;
  }

  add(product) {
    if (product) this.products.push(product);
  }

  *getProducts() {
    for (const product of this.products) {
      yield product;
    }
  }
}

export { ShoppingCart };
