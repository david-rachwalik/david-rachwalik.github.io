/*
============================================
; Title:        shopping-cart.ts
; Author:       David Rachwalik
; Date:         2022/02/05
; Description:  Auto Repair App for WEB-330 site
;===========================================
*/

import { Product } from './product';

export class ShoppingCart {
  id: string;
  name: string;
  calories: string;
  products: Product[];

  constructor(id: string, name: string, calories: string) {
    this.id = id;
    this.name = name;
    this.calories = calories;
    this.products = [];
  }

  count() {
    return this.products.length;
  }

  add(product: Product) {
    if (product) this.products.push(product);
  }

  // *getProducts() {
  getProducts(): Product[] {
    // for (const product of this.products) {
    //   yield product;
    // }

    return this.products.map((product) => product);

    // this.products.forEach((product) => {
    //   yield product;
    // });
  }
}
