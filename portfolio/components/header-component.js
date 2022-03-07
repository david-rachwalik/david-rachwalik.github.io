/*
============================================
; Title:        header-component.js
; Author:       David Rachwalik
; Date:         2022/03/03
; Description:  Component for personal portfolio site
;===========================================
*/

class HeaderComponent extends HTMLElement {
  constructor() {
    super();
  }

  // connectedCallback() {
  //   this.innerHTML = `
  //     <div class="border-bottom nav-main-bg">
  //       <nav class="container d-flex flex-wrap mb-2">
  //         <ul class="nav justify-content-start col-2"></ul>

  //         <ul class="nav justify-content-center col-8">
  //           <li class="nav-item">
  //             <a href="/" class="nav-link dmr-header">David Rachwalik</a>
  //           </li>
  //         </ul>

  //         <div class="nav justify-content-end col-2 position-relative">
  //           <div id="icon-container" class="position-absolute bottom-0 right-0 text-nowrap">
  //               <i id="icon-mode" class="fa fa-toggle-off pull-right"><span id="icon-text"></span></i>
  //           </div>
  //         </div>
  //       </nav>
  //     </div>

  //     <header class="mb-4 border-bottom nav-main-bg">
  //       <nav-component></nav-component>
  //     </header>
  //   `;
  // }

  connectedCallback() {
    this.innerHTML = `
      <div class="border-bottom nav-main-bg">
        <nav class="container d-flex flex-wrap mb-2">
          <ul class="nav justify-content-start col-2"></ul>
          
          <ul class="nav justify-content-center col-8">
            <li class="nav-item">
              <a href="/" class="nav-link dmr-header">David Rachwalik</a>
            </li>
          </ul>
        </nav>
      </div>
      
      <header class="mb-4 border-bottom nav-main-bg">
        <nav-component></nav-component>
      </header>
    `;
  }
}

customElements.define('header-component', HeaderComponent);
