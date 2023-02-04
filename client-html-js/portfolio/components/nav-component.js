/*
============================================
; Title:        nav-component.js
; Author:       David Rachwalik
; Date:         2022/03/03
; Description:  Component for personal portfolio site
;===========================================
*/

class NavComponent extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <nav class="container d-flex flex-wrap">
        <ul class="nav justify-content-center col-12">
          <li class="nav-item">
            <a href="/portfolio/index.html" class="nav-link ml-5 px-2 link-secondary">Home</a>
          </li>
          <li class="nav-item">
            <a href="/portfolio/about.html" class="nav-link ml-5 px-2 link-dark">About</a>
          </li>
          <li class="nav-item">
            <a href="/portfolio/resume.html" class="nav-link ml-5 px-2 link-dark">Resume</a>
          </li>
          <li class="nav-item">
            <a href="/portfolio/projects.html" class="nav-link ml-5 px-2 link-dark">Projects</a>
          </li>
          <li class="nav-item">
            <a href="/buwebdev/web-335/rachwalik-diagrams.html" class="nav-link ml-5 px-2 link-dark">WEB-335 Diagrams</a>
          </li>
          <li class="nav-item">
            <a href="/portfolio/diagrams.html" class="nav-link ml-5 px-2 link-dark">Database Diagrams</a>
          </li>
          <li class="nav-item">
            <a href="/portfolio/api-tests.html" class="nav-link ml-5 px-2 link-dark">API Unit Tests</a>
          </li>
          <li class="nav-item">
            <a href="/buwebdev/web-430/index.html" class="nav-link ml-5 px-2 link-dark">DevOps</a>
          </li>
        </ul>
      </nav>
    `;
  }
}

customElements.define('nav-component', NavComponent);
