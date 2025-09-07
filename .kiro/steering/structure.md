# Rankiro Project Structure

## Monorepo Organization

The Rankiro project follows a modern monorepo structure using pnpm workspaces and Turborepo for efficient development and build processes.

```
rankiro/
├── apps/                           # Application packages
│   └── web/                       # Next.js frontend application
│       ├── src/
│       │   ├── app/              # Next.js App Router pages
│       │   ├── components/       # React components
│       │   ├── lib/              # Utility functions and configurations
│       │   └── styles/           # Global styles and Tailwind config
│       ├── public/               # Static assets
│       ├── package.json
│       └── next.config.js
│
├── packages/                       # Shared packages and libraries
│   ├── rankiro/                   # Core business logic package
│   │   ├── src/
│   │   │   ├── ranking/          # Ranking algorithm implementations
│   │   │   ├── analytics/        # Analytics and metrics processing
│   │   │   ├── data/             # Data models and types
│   │   │   └── utils/            # Shared utilities
│   │   ├── tests/                # Unit and integration tests
│   │   └── package.json
│   │
│   └── cdk-utils/                 # AWS CDK utility functions
│       ├── src/
│       │   ├── constructs/       # Reusable CDK constructs
│       │   ├── stacks/           # CDK stack definitions
│       │   └── utils/            # CDK helper functions
│       └── package.json
│
├── tools/                          # Development tools and configurations
│   ├── tsconfig/                  # Shared TypeScript configurations
│   │   ├── base.json             # Base TypeScript config
│   │   ├── node.json             # Node.js specific config
│   │   ├── react.json            # React specific config
│   │   └── package.json
│   │
│   └── eslint-config/             # Shared ESLint configurations
│       ├── index.js              # Base ESLint config
│       ├── react.js              # React specific rules
│       └── package.json
│
├── infrastructure/                 # Infrastructure as Code
│   ├── stacks/                   # CDK stack implementations
│   │   ├── api-stack.ts          # API infrastructure
│   │   ├── database-stack.ts     # Database resources
│   │   ├── frontend-stack.ts     # Frontend deployment
│   │   └── monitoring-stack.ts   # Monitoring and logging
│   ├── bin/                      # CDK app entry points
│   └── cdk.json                  # CDK configuration
│
├── docs/                          # Documentation
│   ├── api/                      # API documentation
│   ├── architecture/             # Architecture diagrams and docs
│   ├── deployment/               # Deployment guides
│   └── development/              # Development setup guides
│
├── .kiro/                         # Kiro IDE configuration
│   ├── specs/                    # Feature specifications
│   │   └── monorepo-setup/       # Current monorepo setup spec
│   └── steering/                 # Development guidance files
│
├── .github/                       # GitHub configuration
│   ├── workflows/                # GitHub Actions workflows
│   │   ├── ci.yml               # Continuous integration
│   │   ├── deploy.yml           # Deployment workflow
│   │   └── quality.yml          # Code quality checks
│   └── ISSUE_TEMPLATE/           # Issue templates
│
├── .husky/                        # Git hooks
│   ├── pre-commit               # Pre-commit quality checks
│   └── pre-push                 # Pre-push validations
│
├── package.json                   # Root package.json with workspace config
├── pnpm-workspace.yaml           # pnpm workspace configuration
├── turbo.json                     # Turborepo configuration
├── .gitignore                     # Git ignore patterns
├── .gitleaksignore               # Gitleaks ignore patterns
├── README.md                      # Project overview and setup
├── product.md                     # Product specification
├── tech.md                        # Technical architecture
└── structure.md                   # This file - project structure
```

## Package Dependencies

### Workspace Dependencies
```
apps/web
├── @frommiddle/rankiro (workspace:*)
├── @frommiddle/cdk-utils (workspace:*)
└── @frommiddle/tsconfig (workspace:*)

packages/rankiro
├── @frommiddle/tsconfig (workspace:*)
└── @frommiddle/eslint-config (workspace:*)

packages/cdk-utils
├── @frommiddle/tsconfig (workspace:*)
└── aws-cdk-lib
```

### External Dependencies
- **Frontend**: React, Next.js, Tailwind CSS, React Query
- **Backend**: Node.js, Express, GraphQL, Jest
- **Infrastructure**: AWS CDK, AWS SDK
- **Development**: TypeScript, ESLint, Prettier, Turborepo

## File Naming Conventions

### General Rules
- **Directories**: kebab-case (e.g., `user-management`, `api-routes`)
- **Files**: kebab-case for most files (e.g., `user-service.ts`, `api-client.ts`)
- **Components**: PascalCase for React components (e.g., `UserProfile.tsx`)
- **Types**: PascalCase for TypeScript types and interfaces (e.g., `UserData.ts`)
- **Constants**: UPPER_SNAKE_CASE for constant files (e.g., `API_ENDPOINTS.ts`)

### Specific Patterns
```
src/
├── components/
│   ├── ui/                       # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── index.ts             # Barrel exports
│   ├── features/                # Feature-specific components
│   │   ├── ranking/
│   │   │   ├── RankingList.tsx
│   │   │   ├── RankingCard.tsx
│   │   │   └── index.ts
│   │   └── analytics/
│   │       ├── AnalyticsDashboard.tsx
│   │       └── MetricsChart.tsx
│   └── layout/                  # Layout components
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       └── Layout.tsx
│
├── lib/                         # Utility functions and configurations
│   ├── api/                     # API client and utilities
│   ├── auth/                    # Authentication utilities
│   ├── utils/                   # General utility functions
│   └── constants/               # Application constants
│
├── types/                       # TypeScript type definitions
│   ├── api.ts                   # API response types
│   ├── user.ts                  # User-related types
│   └── ranking.ts               # Ranking-related types
│
└── hooks/                       # Custom React hooks
    ├── useAuth.ts
    ├── useRanking.ts
    └── useAnalytics.ts
```

## Build and Output Structure

### Development Build
```
apps/web/.next/                   # Next.js build output
packages/rankiro/dist/            # Compiled TypeScript output
packages/cdk-utils/dist/          # CDK utilities build
tools/tsconfig/dist/              # TypeScript configs (if needed)
```

### Production Build
```
dist/                            # Production build artifacts
├── web/                         # Frontend build
├── api/                         # Backend build
└── infrastructure/              # CDK synthesized templates
```

## Configuration Files

### Root Level Configuration
- `package.json` - Root package configuration and scripts
- `pnpm-workspace.yaml` - Workspace package definitions
- `turbo.json` - Turborepo task configuration
- `.gitignore` - Git ignore patterns
- `.gitleaksignore` - Secret scanning ignore patterns

### Package Level Configuration
- `package.json` - Package-specific dependencies and scripts
- `tsconfig.json` - TypeScript configuration (extends from tools/tsconfig)
- `.eslintrc.js` - ESLint configuration (extends from tools/eslint-config)
- `jest.config.js` - Jest testing configuration

### Environment Configuration
- `.env.local` - Local development environment variables
- `.env.development` - Development environment variables
- `.env.staging` - Staging environment variables
- `.env.production` - Production environment variables

## Development Workflow

### Local Development
1. **Setup**: `pnpm install` - Install all dependencies
2. **Development**: `pnpm turbo run dev` - Start all development servers
3. **Testing**: `pnpm turbo run test` - Run all tests
4. **Building**: `pnpm turbo run build` - Build all packages
5. **Linting**: `pnpm turbo run lint` - Check code quality

### Package Development
1. **Create Package**: Follow tools/package-creation-guide.md
2. **Add Dependencies**: Use `pnpm add` with appropriate filters
3. **Configure Build**: Set up package.json scripts and tsconfig
4. **Add Tests**: Create comprehensive test suite
5. **Document**: Add README and API documentation

### Infrastructure Development
1. **CDK Development**: Use packages/cdk-utils for reusable constructs
2. **Stack Definition**: Define stacks in infrastructure/stacks/
3. **Testing**: Use CDK testing utilities for infrastructure tests
4. **Deployment**: Use GitHub Actions for automated deployment

## Best Practices

### Code Organization
- Keep related functionality together in feature directories
- Use barrel exports (index.ts) for clean imports
- Separate concerns between UI, business logic, and data access
- Follow the established naming conventions consistently

### Dependency Management
- Use workspace references for internal packages
- Keep external dependencies minimal and up-to-date
- Use peer dependencies for shared libraries
- Document dependency decisions in package README files

### Testing Strategy
- Unit tests alongside source files or in __tests__ directories
- Integration tests in dedicated test directories
- E2E tests in apps/web/tests/ directory
- Infrastructure tests in infrastructure/tests/ directory

### Documentation
- README.md in each package explaining purpose and usage
- API documentation using JSDoc comments
- Architecture documentation in docs/ directory
- Keep documentation up-to-date with code changes