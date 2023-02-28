const postcssImport = require('postcss-import');
const tailwindNesting = require('tailwindcss/nesting');
const tailwind = require('tailwindcss');
const postcssAdvancedVariables = require('postcss-advanced-variables');
const postcssApply = require('postcss-apply');
const postcssNested = require('postcss-nested');
const postcssNestedAncestors = require('postcss-nested-ancestors');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

module.exports = (cfg) => {
  // https://www.sitepoint.com/postcss-sass-configurable-alternative
  // import tokens as Sass variables
  // const variables = require("./tokens.json");

  const dev = cfg.env === 'development';
  const scss = cfg.file.extname === '.scss';

  // mappings in dev; minification in prod
  return {
    map: dev ? { inline: false } : false,
    parser: scss ? 'postcss-scss' : false,
    plugins: [
      postcssImport(), // should be first (https://github.com/postcss/postcss-import)
      postcssNestedAncestors(), // https://github.com/toomuchdesign/postcss-nested-ancestors
      postcssNested(), // https://github.com/postcss/postcss-nested
      tailwindNesting(),
      tailwind(),
      // require("postcss-advanced-variables")({ variables }),
      postcssAdvancedVariables(),
      postcssApply(),
      // require('postcss-assets')({
      //   loadPaths: ['src/assets/'],
      // }), // https://github.com/borodean/postcss-assets
      autoprefixer(), // https://github.com/postcss/autoprefixer
      dev ? null : cssnano(), // https://cssnano.co/docs/config-file
    ],
  };
};
