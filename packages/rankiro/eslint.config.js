import nodeConfig from '@frommiddle/eslint-config/node.js';

export default [
  ...nodeConfig,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname
      }
    },
    ignores: [
      'dist/',
      'coverage/',
      '*.config.js'
    ]
  }
];