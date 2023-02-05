/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx,vue,scss}'],
  theme: {
    extend: {},
    listStyleType: {
      none: 'none',
      disc: 'disc',
      circle: 'circle',
      decimal: 'decimal',
      square: 'square',
      roman: 'upper-roman',
    },
  },
  plugins: [],
  // add a unique prefix to Tailwind classes to avoid class name overlap
  // example output: tw-text-gray-800 tw-font-medium
  prefix: 'tw-',
};

// https://tailwindcss.com/docs/configuration
// https://github.com/tailwindlabs/tailwindcss/blob/master/stubs/defaultConfig.stub.js

// https://tailwindcss.com/docs/upgrade-guide#configure-content-sources
// option "mode: 'jit'" is already the default in Tailwind CSS v3.0+
// option "purge" changed to "content"
