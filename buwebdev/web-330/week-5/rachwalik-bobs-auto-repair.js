/*
============================================
; Title:        rachwalik-bobs-auto-repair.js
; Author:       David Rachwalik
; Date:         2022/02/05
; Description:  Auto Repair App for WEB-330 site
;===========================================
*/

import { Product } from './product.js';
import { ShoppingCart } from './shopping-cart.js';

const shoppingCart = new ShoppingCart();

function setCartCount() {
  const cartCountEl = document.getElementById('cart-count');
  if (cartCountEl) cartCountEl.innerHTML = shoppingCart.count();
}

// expected behavior: user selects an option from menu, clicks the "Add to Cart" button,
// and receives an alert that indicates the item was added to their shopping cart
function addProduct() {
  const productList = document.getElementById('productList');
  const shoppingCartEl = document.getElementById('shoppingCart');
  if (!productList || !shoppingCartEl) return;

  // Determine selected product from dropdown list
  const product = productList ? productList.options[productList.selectedIndex].text : '';
  const productValue = productList ? productList.options[productList.selectedIndex].value : '';

  if (product !== '--Select--') {
    const productObj = new Product(product, productValue);
    shoppingCart.add(productObj);
    // User feedback & page cleanup
    setCartCount();
    alert(`${product} was added to your shopping cart!`);
    productList.value = 'select';
  }

  // Generate table HTML for food data (instr: see Exhibit C, item 11)
  let cartDisplayTable = '<table class="table">';
  cartDisplayTable += '<thead><tr><th>ID</th><th>Name</th><th>Price</th></tr></thead><tbody>';
  for (const item of shoppingCart.getProducts()) {
    cartDisplayTable += `<tr><td>${item.id}</td><td>${item.name}</td><td>${item.price}</td></tr>`;
  }
  cartDisplayTable += '</tbody></table>';
  // Send table data to client display
  shoppingCartEl.innerHTML = cartDisplayTable;
}

setCartCount();

// Auto Repair App click event
const submitButton = document.getElementById('btnAddProduct');
if (submitButton) submitButton.addEventListener('click', addProduct);
