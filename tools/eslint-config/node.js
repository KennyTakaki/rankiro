/**
 * Node.js-specific ESLint configuration
 * Extends base configuration with Node.js specific rules and environment
 */

import baseConfig from './index.js';

export default {
  ...baseConfig,
  env: {
    ...baseConfig.env,
    node: true,
    es2022: true
  },
  rules: {
    ...baseConfig.rules,

    // Node.js specific rules
    'no-console': 'off', // Console is acceptable in Node.js applications
    'no-process-exit': 'error',
    'no-process-env': 'off', // Process.env is common in Node.js
    'prefer-global/process': 'error',
    'prefer-global/buffer': 'error',
    'prefer-global/console': 'error',
    'prefer-global/text-decoder': 'error',
    'prefer-global/text-encoder': 'error',
    'prefer-global/url-search-params': 'error',
    'prefer-global/url': 'error',

    // Import rules specific to Node.js
    'import/no-nodejs-modules': 'off', // Node.js modules are expected
    'import/prefer-default-export': 'off', // Named exports are often preferred

    // Error handling
    'handle-callback-err': 'error',
    'no-new-require': 'error',
    'no-path-concat': 'error',

    // Security
    'no-new-func': 'error',
    'no-eval': 'error',
    'no-implied-eval': 'error',

    // Performance
    'no-sync': 'warn' // Prefer async operations
  },
  overrides: [
    {
      // Configuration files can use require and module.exports
      files: [
        '*.config.js',
        '*.config.mjs',
        '*.config.ts',
        'jest.config.*',
        'turbo.json',
        '.eslintrc.*'
      ],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        'import/no-commonjs': 'off'
      }
    },
    {
      // Test files have relaxed rules
      files: [
        '**/__tests__/**/*',
        '**/*.test.*',
        '**/*.spec.*'
      ],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        'no-console': 'off'
      }
    }
  ]
};