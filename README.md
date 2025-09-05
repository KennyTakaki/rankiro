# Rankiro Monorepo

A modern TypeScript monorepo for the Rankiro application, featuring AWS CDK infrastructure and web frontend components.

## Project Structure

```
rankiro-monorepo/
├── apps/
│   └── web/                    # Frontend React/Next.js application
├── packages/
│   ├── rankiro/               # Core business logic package
│   └── cdk-utils/             # AWS CDK utility functions
├── tools/
│   ├── eslint-config/         # Shared ESLint configuration
│   └── tsconfig/              # Shared TypeScript configurations
└── ...
```

## Prerequisites

- Node.js >= 18.0.0
- pnpm >= 9.0.0

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development servers
pnpm dev

# Build all packages
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint

# Type check
pnpm type-check
```

## Development

This monorepo uses:

- **pnpm** for package management with workspace support
- **Turborepo** for efficient task running and caching
- **TypeScript** with strict configuration
- **ESLint** and **Prettier** for code quality
- **Jest** for testing

## Package Management

```bash
# Add dependency to specific package
pnpm add <package> --filter @monorepo/web

# Add dev dependency to root
pnpm add -D <package> -w

# Update all dependencies
pnpm update-deps
```

## Scripts

- `pnpm dev` - Start all development servers
- `pnpm build` - Build all packages
- `pnpm test` - Run all tests
- `pnpm test:coverage` - Run tests with coverage
- `pnpm lint` - Lint all packages
- `pnpm type-check` - Type check all packages
- `pnpm format` - Format code with Prettier
- `pnpm clean` - Clean all build artifacts
- `pnpm reset` - Reset workspace (clean + reinstall)
