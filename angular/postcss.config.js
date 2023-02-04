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
      require('postcss-import'), // should be first (https://github.com/postcss/postcss-import)
      // require("postcss-advanced-variables")({ variables }),
      require('postcss-advanced-variables'),
      require('postcss-nested'),
      // require('postcss-assets')({
      //   loadPaths: ['src/assets/'],
      // }), // https://github.com/borodean/postcss-assets
      require('autoprefixer'), // https://github.com/postcss/autoprefixer
      dev ? null : require('cssnano'), // https://cssnano.co/docs/config-file
    ],
  };
};
