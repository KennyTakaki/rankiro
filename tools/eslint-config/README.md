# @frommiddle/eslint-config

Shared ESLint configuration for the Rankiro monorepo. Provides consistent code quality standards across all packages with TypeScript support, Prettier integration, and environment-specific rules.

## Features

- **TypeScript Support**: Full TypeScript ESLint rules with type checking
- **Prettier Integration**: Seamless integration with Prettier for code formatting
- **Environment Specific**: Separate configurations for Node.js and React applications
- **Code Quality**: Strict rules for code quality, security, and best practices
- **Import Organization**: Automatic import sorting and organization
- **Accessibility**: React accessibility rules for inclusive web applications

## Usage

### Base Configuration (Node.js/TypeScript)

For Node.js applications and packages:

```javascript
// .eslintrc.js
export default {
  extends: ['@frommiddle/eslint-config']
};
```

### React Configuration

For React applications with accessibility rules:

```javascript
// .eslintrc.js
export default {
  extends: ['@frommiddle/eslint-config/react']
};
```

### Node.js Specific Configuration

For Node.js applications with Node.js specific rules:

```javascript
// .eslintrc.js
export default {
  extends: ['@frommiddle/eslint-config/node']
};
```

## Package.json Scripts

Add these scripts to your package.json:

```json
{
  "scripts": {
    "lint": "eslint src --ext .ts,.tsx,.js,.jsx",
    "lint:fix": "eslint src --ext .ts,.tsx,.js,.jsx --fix",
    "type-check": "tsc --noEmit"
  }
}
```

## Configuration Details

### Base Rules

The base configuration includes:

- **TypeScript**: Strict TypeScript rules with type checking
- **Import Organization**: Automatic import sorting and duplicate detection
- **Code Quality**: Consistent naming conventions and code style
- **Security**: Rules to prevent common security issues
- **Performance**: Rules to encourage performant code patterns

### React Rules

Additional rules for React applications:

- **React Best Practices**: Modern React patterns and hooks rules
- **Accessibility**: Comprehensive a11y rules for inclusive applications
- **JSX**: Proper JSX formatting and usage patterns

### Node.js Rules

Additional rules for Node.js applications:

- **Node.js APIs**: Proper usage of Node.js built-in modules
- **Error Handling**: Callback error handling patterns
- **Security**: Node.js specific security considerations
- **Performance**: Async operation preferences

## Peer Dependencies

This package requires the following peer dependencies:

- `eslint` ^9.0.0
- `prettier` ^3.0.0
- `typescript` ^5.0.0

## Rule Customization

You can override specific rules in your local ESLint configuration:

```javascript
// .eslintrc.js
export default {
  extends: ['@frommiddle/eslint-config'],
  rules: {
    // Override specific rules
    '@typescript-eslint/explicit-function-return-type': 'off',
    'no-console': 'off'
  }
};
```

## Integration with Prettier

This configuration is designed to work seamlessly with Prettier. Make sure you have a `.prettierrc` file in your project root:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

## IDE Integration

### VS Code

Install the ESLint extension and add to your settings.json:

```json
{
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## Troubleshooting

### TypeScript Project References

If you're using TypeScript project references, make sure your `tsconfig.json` includes the correct project paths:

```json
{
  "compilerOptions": {
    "composite": true
  },
  "references": [
    { "path": "../other-package" }
  ]
}
```

### Import Resolution

For proper import resolution, ensure your `tsconfig.json` includes the correct paths:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

## Contributing

When adding new rules:

1. Consider the impact on existing code
2. Document the reasoning for the rule
3. Test with different project types
4. Update this README with any new configuration options

## License

MIT