/*
============================================
; Title:        rachwalik-bobs-auto-repair.ts
; Author:       David Rachwalik
; Date:         2022/02/05
; Description:  Auto Repair App for WEB-330 site
;===========================================
*/

import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardTitle,
} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { Product, ShoppingCart } from './models/index';

@Component({
  selector: 'app-bobs-auto-repair',
  templateUrl: './bobs-auto-repair.component.html',
  styleUrls: ['./bobs-auto-repair.component.scss'],
  standalone: true,
  imports: [
    MatCard,
    MatCardTitle,
    FormsModule,
    MatCardContent,
    MatCardActions,
    MatButton,
    MatIcon,
    RouterLink,
  ],
})
export class BobsAutoRepairComponent implements OnInit {
  shoppingCart: ShoppingCart;

  constructor() {
    this.shoppingCart = new ShoppingCart('', '', '');
  }

  ngOnInit(): void {
    this.setCartCount();
  }

  setCartCount() {
    const cartCountEl = document.getElementById('cart-count');
    if (cartCountEl)
      cartCountEl.innerHTML = this.shoppingCart.count().toString();
  }

  // expected behavior: user selects an option from menu, clicks the "Add to Cart" button,
  // and receives an alert that indicates the item was added to their shopping cart
  addProduct() {
    const productList = document.getElementById(
      'productList',
    ) as HTMLSelectElement;
    const shoppingCartEl = document.getElementById(
      'shoppingCart',
    ) as HTMLDivElement;
    if (!productList || !shoppingCartEl) return;

    // Determine selected product from dropdown list
    const product = productList
      ? productList.options[productList.selectedIndex].text
      : '';
    const productValue = productList
      ? productList.options[productList.selectedIndex].value
      : '';

    if (product !== '--Select--') {
      const productObj = new Product(product, productValue);
      this.shoppingCart.add(productObj);
      // User feedback & page cleanup
      this.setCartCount();
      alert(`${product} was added to your shopping cart!`);
      productList.value = 'select';
    }

    // Generate table HTML for food data (instr: see Exhibit C, item 11)
    let cartDisplayTable = '<table class="table">';
    cartDisplayTable +=
      '<thead><tr><th>ID</th><th>Name</th><th>Price</th></tr></thead><tbody>';
    // for (const item of this.shoppingCart.getProducts()) {
    //   cartDisplayTable += `<tr><td>${item.id}</td><td>${item.name}</td><td>${item.price}</td></tr>`;
    // }
    Array.from(this.shoppingCart.getProducts()).forEach((item) => {
      cartDisplayTable += `<tr><td>${item.id}</td><td>${item.name}</td><td>$${item.price}</td></tr>`;
    });
    cartDisplayTable += '</tbody></table>';
    // Send table data to client display
    shoppingCartEl.innerHTML = cartDisplayTable;
  }
}

// setCartCount();

// // Auto Repair App click event
// const submitButton = document.getElementById('btnAddProduct');
// if (submitButton) submitButton.addEventListener('click', addProduct);
