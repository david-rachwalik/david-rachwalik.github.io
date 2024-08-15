const fs = require('fs');
const path = require('path');

// Paths
const distDir = path.join(__dirname, 'dist', 'client-angular');
const nojekyllPath = path.join(distDir, '.nojekyll');
const indexPath = path.join(distDir, 'index.html');
const notFoundPath = path.join(distDir, '404.html');

// Create .nojekyll file
fs.writeFileSync(nojekyllPath, '');

// Copy index.html to 404.html
fs.copyFileSync(indexPath, notFoundPath);

console.log('.nojekyll and 404.html created successfully.');
