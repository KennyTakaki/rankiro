---
inclusion: manual
contextKey: package-creation
---

# Package Creation Guide

## Creating New Packages

### 1. Package Structure
When creating a new package, follow this structure:
```
packages/new-package/
├── src/
│   ├── index.ts          # Main entry point
│   └── types.ts          # Type definitions
├── package.json          # Package configuration
├── tsconfig.json         # TypeScript configuration
├── jest.config.js        # Jest configuration (if needed)
└── README.md            # Package documentation
```

### 2. Package.json Template
```json
{
  "name": "@monorepo/package-name",
  "version": "1.0.0",
  "private": true,
  "description": "Package description",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "lint": "eslint src --ext .ts",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "clean": "rm -rf dist"
  },
  "dependencies": {},
  "devDependencies": {
    "@monorepo/eslint-config": "workspace:*",
    "@monorepo/tsconfig": "workspace:*",
    "typescript": "^5.7.2"
  }
}
```

### 3. TypeScript Configuration
Choose the appropriate tsconfig based on package type:

**For Node.js packages:**
```json
{
  "extends": "@monorepo/tsconfig/node.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src/**/*"],
  "exclude": ["**/*.test.ts", "dist"]
}
```

**For React packages:**
```json
{
  "extends": "@monorepo/tsconfig/react.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src/**/*"],
  "exclude": ["**/*.test.tsx", "dist"]
}
```

### 4. Entry Point Template
```typescript
// src/index.ts
export * from './types';

// Main functionality exports
export { default as MainClass } from './main-class';
export { utilityFunction } from './utils';
```

### 5. Adding Package to Workspace
After creating the package:
1. Run `pnpm install` from the root to link workspace dependencies
2. Add the package to any consuming packages' dependencies
3. Update Turborepo pipeline if needed
4. Add appropriate scripts to root package.json if necessary

### 6. Testing Setup
If the package needs testing:
```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/index.ts'
  ]
};
```

### 7. Documentation
Always include a comprehensive README.md with:
- Package purpose and functionality
- Installation and usage instructions
- API documentation
- Examples
- Contributing guidelines