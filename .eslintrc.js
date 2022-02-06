// https://eslint.org/docs/user-guide/configuring/configuration-files
// https://dev.to/robertcoopercode/using-eslint-and-prettier-in-a-typescript-project-53jb

// alternatively, can be placed in package.json as 'eslintConfig'
module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'airbnb',
    'plugin:prettier/recommended', // mods Prettier errors to throw ESLint errors (always last)
  ],
  parserOptions: {
    ecmaVersion: 'latest', // Parsing of modern ECMAScript features
    sourceType: 'module', // Enables the use of imports
  },
  // https://eslint.org/docs/rules
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    'no-console': 'off',
    'import/prefer-default-export': 'off',
    'import/extensions': [
      'warn',
      'ignorePackages',
      {
        js: 'always',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'no-unused-vars': 'off',
    'no-useless-constructor': 'off',
    'no-restricted-syntax': 'off',
    'no-underscore-dangle': 'off',
  },
  ignorePatterns: ['node_modules/', 'wwwroot/', 'dist/'],
};
