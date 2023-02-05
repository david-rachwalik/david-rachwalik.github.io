/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx,vue,scss}'],
  // https://tailwindcss.com/docs/adding-custom-styles#customizing-your-theme
  theme: {
    extend: {},
    // https://tailwindcss.com/docs/screens
    // https://material.angular.io/cdk/layout/overview#predefined-breakpoints
    screens: {
      sm: '600px', // => @media (min-width: 600px) { ... }
      md: '960px', // => @media (min-width: 960px) { ... }
      lg: '1280px', // => @media (min-width: 1280px) { ... }
      xl: '1920px', // => @media (min-width: 1920px) { ... }
    },
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
