---
inclusion: always
---

# Coding Standards and Best Practices

## TypeScript Standards
- **Strict Mode**: Always use strict TypeScript configuration
- **ESModules**: Use ESModules (`import/export`) throughout the codebase
- **Type Safety**: Prefer explicit types over `any`, use proper type annotations
- **Naming Conventions**: 
  - PascalCase for classes, interfaces, types, and enums
  - camelCase for variables, functions, and methods
  - UPPER_SNAKE_CASE for constants
  - kebab-case for file names and package names

## Code Organization
- **File Structure**: Follow the established monorepo structure (apps/, packages/, tools/)
- **Package Naming**: Use `@frommiddle/` prefix for internal packages
- **Exports**: Use proper package.json exports with ESModules support
- **Dependencies**: Use workspace references (`workspace:*`) for internal dependencies

## Code Quality
- **Linting**: Use shared ESLint configuration from `@monorepo/eslint-config`
- **Formatting**: Use Prettier with consistent configuration across all packages
- **Testing**: Write comprehensive unit tests with Jest and ts-jest
- **Documentation**: Include JSDoc comments for public APIs

## Git Practices
- **Commit Messages**: Use conventional commit format (feat:, fix:, docs:, etc.)
- **Branch Naming**: Use descriptive branch names (feature/task-name, fix/issue-description)
- **Pre-commit Hooks**: Ensure all pre-commit checks pass before committing
- **Secret Scanning**: Never commit secrets or sensitive information

## Package Development
- **TypeScript Config**: Extend from appropriate shared tsconfig (base, node, or react)
- **Build Output**: Use `dist/` directory for compiled output
- **Source Code**: Keep source code in `src/` directory
- **Testing**: Place tests alongside source files or in `__tests__/` directories

## Performance Considerations
- **Build Optimization**: Leverage Turborepo caching for faster builds
- **Bundle Size**: Monitor and optimize package bundle sizes
- **Dependencies**: Minimize dependencies and prefer peer dependencies where appropriate
- **Tree Shaking**: Ensure code is tree-shakeable with proper ESModule exports