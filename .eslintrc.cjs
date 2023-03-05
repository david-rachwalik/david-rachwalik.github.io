// https://eslint.org/docs/user-guide/configuring/configuration-files
// https://dev.to/robertcoopercode/using-eslint-and-prettier-in-a-typescript-project-53jb

// alternatively, can be placed in package.json as 'eslintConfig'
module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true,
  },
  // https://stackoverflow.com/questions/53189200/whats-the-difference-between-plugins-and-extends-in-eslint
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'airbnb-base', // https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base
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
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'class-methods-use-this': 'warn',
    'no-underscore-dangle': 'warn',
  },
  // https://stackoverflow.com/questions/58510287/parseroptions-project-has-been-set-for-typescript-eslint-parser
  // https://eslint.org/docs/user-guide/configuring/configuration-files#how-do-overrides-work
  // Could also use overrides to set different rules for specific directories
  overrides: [
    {
      files: ['*.ts', '*.tsx'], // Specified only for TypeScript file extension
      // Extend TypeScript plugins here instead of outside `overrides`
      plugins: ['@typescript-eslint'],
      extends: [
        'plugin:@typescript-eslint/recommended', // Uses the recommended rules from @typescript-eslint/eslint-plugin
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'airbnb-typescript/base', // https://github.com/iamturns/eslint-config-airbnb-typescript
      ],
      parser: '@typescript-eslint/parser',
      // https://stackoverflow.com/questions/64933543/parsing-error-cannot-read-file-tsconfig-json-eslint
      parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: `${__dirname}/client-angular`,
        sourceType: 'module',
      },
      rules: {
        // e.g. "@typescript-eslint/explicit-function-return-type": "off",
        // "@typescript-eslint/no-unused-vars" : "off",
        // "@typescript-eslint/no-explicit-any": "off"
        '@typescript-eslint/lines-between-class-members': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
      },
    },
  ],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  // https://eslint.org/docs/user-guide/configuring/ignoring-code
  ignorePatterns: ['node_modules/', 'wwwroot/', 'dist/'],
};
