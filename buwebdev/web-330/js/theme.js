/*
    Title: theme.js
    Author: David Rachwalik
    Date: 2022/03/03
    Description: Theme script for WEB-330 site
 */

function setSelectedTheme(theme, iconMode, iconText) {
  const iconModeEl = document.getElementById('icon-mode');
  const iconTextEl = document.getElementById('icon-text');
  // Apply theme values to the display elements
  document.body.classList.value = theme;
  iconModeEl.classList.value = `fa ${iconMode} pull-right`;
  iconTextEl.innerHTML = iconText;
}

// Theme set to light by default if not in localStorage
function setDefaultTheme() {
  const theme = localStorage.getItem('mode') || 'light-theme';
  const iconMode = localStorage.getItem('iconMode') || 'fa-toggle-off';
  const iconText = localStorage.getItem('iconText') || 'Light Mode';
  setSelectedTheme(theme, iconMode, iconText);
}

// Switch between the website themes
function toggleMode(event) {
  // Update the localStorage
  if (document.body.classList.value === 'light-theme') {
    localStorage.clear();
    localStorage.setItem('mode', 'dark-theme');
    localStorage.setItem('iconMode', 'fa-toggle-on');
    localStorage.setItem('iconText', 'Dark Mode');
  } else {
    localStorage.clear();
    localStorage.setItem('mode', 'light-theme');
    localStorage.setItem('iconMode', 'fa-toggle-off');
    localStorage.setItem('iconText', 'Light Mode');
  }
  // Update the display elements
  setSelectedTheme(localStorage.getItem('mode'), localStorage.getItem('iconMode'), localStorage.getItem('iconText'));
}

/*
    App load page ready actions
 */

document.addEventListener('DOMContentLoaded', (event) => {
  setDefaultTheme(); // style theme mode

  // Apply event handlers
  document.getElementById('icon-mode').addEventListener('click', toggleMode);
});
