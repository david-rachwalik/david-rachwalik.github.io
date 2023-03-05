import { Component, OnInit, ViewEncapsulation } from '@angular/core';

interface ThemeDetails {
  theme: string;
  iconMode: string;
  iconText: string;
}

@Component({
  selector: 'app-buwebdev-layout',
  templateUrl: './buwebdev-layout.component.html',
  styleUrls: ['./buwebdev-layout.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BuwebdevLayoutComponent implements OnInit {
  slideChecked: boolean;

  constructor() {
    this.slideChecked = false;
  }

  ngOnInit(): void {
    this.applyTheme(this.getThemeMode());
  }

  // --- Theme scripts (originated from WEB-330 site) ---

  // Theme set to light by default if not in localStorage
  getThemeMode(): string {
    return localStorage.getItem('theme-mode') || 'light-theme';
  }

  getThemeDetails(theme: string): ThemeDetails {
    let details: ThemeDetails;
    if (theme === 'dark-theme') {
      details = {
        theme: 'dark-theme',
        iconMode: 'fa-toggle-on',
        iconText: 'Dark Mode',
      };
    } else {
      details = {
        theme: 'light-theme',
        iconMode: 'fa-toggle-off',
        iconText: 'Light Mode',
      };
    }
    return details;
  }

  applyTheme(theme: string): void {
    const details = this.getThemeDetails(theme);
    // Apply theme values to the display elements (https://www.w3schools.com/jsref/dom_obj_all.asp)
    document.body.setAttribute('data-theme', details.theme);
    this.slideChecked = details.theme === 'dark-theme';
  }

  // Switch between site themes
  toggleThemeMode(): void {
    // localStorage.clear();
    // Flip the mode string
    const oldTheme = this.getThemeMode();
    const newTheme = oldTheme === 'dark-theme' ? 'light-theme' : 'dark-theme';
    // Update the localStorage
    localStorage.setItem('theme-mode', newTheme);
    // Update the display elements
    this.applyTheme(newTheme);
  }
}
