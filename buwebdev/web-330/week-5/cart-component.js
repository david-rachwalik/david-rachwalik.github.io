/*
============================================
; Title:        cart-component.js
; Author:       David Rachwalik
; Date:         2022/02/05
; Description:  Auto Repair App for WEB-330 site
;===========================================
*/

class CartComponent extends HTMLElement {
  constructor(name, price) {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <i id="cartIcon" class="fa fa-shopping-cart"></i> (<span id="cart-count">0</span>)
    `;
  }
}

customElements.define('cart-component', CartComponent);
