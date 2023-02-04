/*
============================================
; Title:        footer-component.js
; Author:       David Rachwalik
; Date:         2022/03/03
; Description:  Component for personal portfolio site
;===========================================
*/

class FooterComponent extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <footer class="py-2 border-top">
        <span>© David Rachwalik - 2022</span>
      </footer>
    `;
  }
}

customElements.define('footer-component', FooterComponent);
