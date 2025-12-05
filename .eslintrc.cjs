/** @type {import("eslint").Linter.Config} */
module.exports = {
  env: {
    es2022: true,
    node: true,
    jest: true,
  },

  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json'],
  },

  plugins: ['@typescript-eslint', 'prettier'],

  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],

  rules: {
    '@typescript-eslint/no-explicit-any': 'off',

    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { args: 'after-used', argsIgnorePattern: '^_|req|res|next' }],

    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        multiline: { delimiter: 'semi', requireLast: true },
        singleline: { delimiter: 'semi', requireLast: false },
      },
    ],

    '@typescript-eslint/ban-ts-comment': [
      'error',
      {
        'ts-nocheck': false,
        'ts-ignore': 'allow-with-description',
      },
    ],

    quotes: ['error', 'single'],
    'prettier/prettier': 'error',

    'no-console': 'off',
    'no-restricted-syntax': 'off',
    'no-iterator': 'off',

    'no-restricted-globals': [
      'error',
      {
        name: 'isNaN',
        message: 'Use Number.isNaN instead.',
      },
    ],

    camelcase: 'off',
    'no-empty-function': 'off',
    'no-restricted-properties': 'off',
  },

  overrides: [
    {
      files: ['*.js'],
      parserOptions: {
        sourceType: 'script',
      },
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
      },
    },
  ],
};
