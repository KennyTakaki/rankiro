---
inclusion: always
---

# Rankiro Monorepo Project Overview

## Project Description
Rankiro is a comprehensive monorepo for developing TypeScript applications with AWS CDK infrastructure and web frontend components. The project establishes a modern development environment with industry-standard tooling for efficient development, testing, and deployment.

## Architecture Overview
- **Monorepo Structure**: Uses pnpm workspaces with apps/, packages/, and tools/ organization
- **Build System**: Turborepo for efficient task orchestration and caching
- **Package Manager**: pnpm for optimized dependency management
- **Language**: TypeScript with strict type checking and ESModules
- **Infrastructure**: AWS CDK for cloud resource management
- **Frontend**: React/Next.js applications

## Key Packages
- `apps/web`: Frontend React/Next.js application
- `packages/rankiro`: Core business logic package
- `packages/cdk-utils`: AWS CDK utility functions and helpers
- `tools/tsconfig`: Shared TypeScript configurations
- `tools/eslint-config`: Shared ESLint configurations

## Development Workflow
1. Use `pnpm install` for dependency management
2. Use `pnpm turbo run <task>` for running tasks across packages
3. Follow workspace references for inter-package dependencies
4. Maintain consistent code quality with automated linting and formatting

## Current Implementation Status
The project is currently in the setup phase, implementing the monorepo structure and shared tooling configurations as defined in the monorepo-setup specification.