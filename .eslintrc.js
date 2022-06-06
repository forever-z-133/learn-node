module.exports = {
  ignorePatterns: [
    'utils/**/*.js',
    'test/**/*.js',
    'mine/**/*.js',
    'trash/**',
  ],
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
    'jest/globals': true
  },
  extends: [
    'eslint:recommended',
  ],
  parserOptions: {
    'ecmaVersion': 12,
    'sourceType': 'module',
  },
  plugins: ['jest'],
  rules: {
    'semi': 2,
    'quotes': [2, 'single'],
    'no-multi-spaces': 2,
    'no-trailing-spaces': 2,
    'no-unused-vars': 1,
    'eol-last': 2,
    'arrow-parens': [2, 'as-needed'],
    'indent': [2, 2, { 'SwitchCase': 1 }],
    'no-empty': [2, { 'allowEmptyCatch': true }]
  },
};
