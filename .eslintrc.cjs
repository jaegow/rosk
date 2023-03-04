module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import', 'simple-import-sort'],
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  rules: {
    'semi': ['error', 'always'],
    'comma-dangle': ['error', 'only-multiline'],
    'comma-spacing': ['error', { 'before': false, 'after': true }],
    'array-bracket-spacing': ['error', 'never'],
    'object-curly-spacing': ['error', 'always'],
    'object-property-newline': ['error', { 'allowAllPropertiesOnSameLine': true }],
    'object-curly-newline': ['error', { 'consistent': true }],
    'arrow-parens': ['error', 'always'],
    'arrow-body-style': ['error', 'as-needed'],
    'quotes': ['error', 'single', { 'avoidEscape': true, 'allowTemplateLiterals': true, }],
    'quote-props': ['error', 'as-needed'],
    'max-len': ['error', {
      'code': 185,
      'comments': 400,
      'tabWidth': 2,
      'ignoreStrings': true,
      'ignoreUrls': true,
      'ignoreTemplateLiterals': true,
    }],
    'indent': ['error', 2, { 'SwitchCase': 1 }],
    'linebreak-style': ['error', 'unix'],
    // import/export sorting
    'sort-imports': 'off',
    'import/exports-last': 'error',
    'import/group-exports': 'error',
    'import/newline-after-import': ['error', { count: 1 }],
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': ['error', {
      groups: [
        // `obsidian` related packages come first.
        ['^obsidian', '^@?\\w'],
        // path alias
        ['^Src', '^@?\\w'],
        // relative imports.
        ['^\\.', '^@?\\w'],
        // Side effect imports:
        //  - does not have a from ( simple-import-sort/sort sorts by what comes after from )
        //  - https://github.com/lydell/eslint-plugin-simple-import-sort#why-sort-on-from
        //  - ie - import 'some-polyfill';
        ['^\\u0000', '^@?\\w'],
      ],
    },
    ],
    'no-undef': 'off', // Typescript should be catching this
    'no-unused-vars': 'off', // Typescript should be catching this
    '@typescript-eslint/no-unused-vars': ['error', { varsIgnorePattern: '^_|^React$' }],
    "@typescript-eslint/explicit-member-accessibility": ["error", { accessibility: 'no-public' }],
    // 'no-console': [
    //   'warn',
    //   {
    //     allow: [
    //       'assert',
    //       'clear',
    //       'Console',
    //       'context',
    //       'count',
    //       'countReset',
    //       'dir',
    //       'dirxml',
    //       'error',
    //       'group',
    //       'groupCollapsed',
    //       'groupEnd',
    //       'info',
    //       'profile',
    //       'profileEnd',
    //       'table',
    //       'timeLog',
    //       'timeStamp',
    //       'warn',
    //     ],
    //   },
    // ],
  },
};
