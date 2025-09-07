---
inclusion: always
---

# Monorepo Development Commands

## Package Management
```bash
# Install all dependencies
pnpm install

# Install dependency to specific package
pnpm add <package> --filter @monorepo/package-name

# Install dev dependency to root
pnpm add -D <package> -w

# Update all dependencies
pnpm update --recursive
```

## Build and Development
```bash
# Build all packages
pnpm turbo run build

# Build specific package and its dependencies
pnpm turbo run build --filter @monorepo/package-name

# Start development mode for all packages
pnpm turbo run dev

# Start development for specific package
pnpm turbo run dev --filter @monorepo/web
```

## Testing
```bash
# Run all tests
pnpm turbo run test

# Run tests with coverage
pnpm turbo run test:coverage

# Run tests in watch mode
pnpm turbo run test:watch

# Run tests for specific package
pnpm turbo run test --filter @monorepo/rankiro
```

## Code Quality
```bash
# Lint all packages
pnpm turbo run lint

# Type check all packages
pnpm turbo run type-check

# Format all code
pnpm format:all

# Check formatting
pnpm format:check
```

## Workspace Management
```bash
# List all packages in workspace
pnpm list --recursive

# Check workspace dependencies
pnpm why <package-name>

# Clean all build outputs
pnpm clean:all

# Reset workspace (clean + reinstall)
pnpm reset
```

## Turborepo Specific
```bash
# Run task with cache info
pnpm turbo run build --dry-run

# Clear Turborepo cache
pnpm turbo run build --force

# Run task for changed packages only
pnpm turbo run test --filter=[HEAD^1]

# Run task with specific concurrency
pnpm turbo run build --concurrency 2
```

## Git and Quality Checks
```bash
# Run pre-commit checks manually
pnpm lint:all && pnpm type-check && pnpm test:all

# Check for secrets
npx gitleaks detect --source .

# Audit dependencies
pnpm audit
```