# @frommiddle/cdk-utils

AWS CDK utility functions and helpers for Rankiro infrastructure.

## Features

- **Environment-aware resource naming** with consistent patterns
- **Configuration management** for different environments
- **Base constructs** with common utilities
- **TypeScript support** with full type safety

## Installation

```bash
pnpm add @frommiddle/cdk-utils
```

## Usage

### CDK Naming Utils

```typescript
import { CDKNamingUtils } from '@frommiddle/cdk-utils/naming';

const naming = new CDKNamingUtils({
  environment: 'dev',
  project: 'rankiro',
  region: 'us-east-1'
});

// Generate resource names
const lambdaName = naming.lambdaName('api-handler');
// Result: 'rankiro-dev-lambda-api-handler'

const bucketName = naming.bucketName('assets');
// Result: 'rankiro-dev-assets-us-east-1-1234567890'

const tags = naming.resourceTags({ Owner: 'backend-team' });
// Result: { Environment: 'dev', Project: 'rankiro', ManagedBy: 'CDK', Owner: 'backend-team' }
```

### Environment Configuration

```typescript
import { EnvironmentConfigReader } from '@frommiddle/cdk-utils/config';

// Read from environment variables
const config = EnvironmentConfigReader.fromEnvironmentVariables('dev');

// Read from CDK context
const config = EnvironmentConfigReader.fromContext(app, 'prod');

// Get default configuration
const config = EnvironmentConfigReader.getDefaultConfig('staging');

// Merge with defaults
const config = EnvironmentConfigReader.mergeWithDefaults({
  region: 'eu-west-1',
  database: { instanceClass: 't3.large' }
}, 'prod');
```

### Base Construct

```typescript
import { BaseConstruct, BaseConstructProps } from '@frommiddle/cdk-utils/constructs';
import { Construct } from 'constructs';

export class MyConstruct extends BaseConstruct {
  constructor(scope: Construct, id: string, props: BaseConstructProps) {
    super(scope, id, props);

    // Use inherited utilities
    const functionName = this.resourceName('lambda', 'processor');
    const tags = this.getCommonTags();
    
    if (this.isProduction()) {
      // Production-specific logic
    }
  }
}
```

## API Reference

### CDKNamingUtils

#### Constructor Options

```typescript
interface NamingOptions {
  environment: string;    // Environment name (dev, staging, prod)
  project: string;       // Project name
  region?: string;       // AWS region (optional)
  suffix?: string;       // Additional suffix (optional)
}
```

#### Methods

- `resourceName(resourceType: string, name: string): string` - Generate generic resource name
- `stackName(name: string): string` - Generate CDK stack name
- `lambdaName(name: string): string` - Generate Lambda function name
- `bucketName(name: string): string` - Generate S3 bucket name (globally unique)
- `tableName(name: string): string` - Generate DynamoDB table name
- `apiName(name: string): string` - Generate API Gateway name
- `vpcName(name: string): string` - Generate VPC name
- `securityGroupName(name: string): string` - Generate security group name
- `roleName(name: string): string` - Generate IAM role name
- `policyName(name: string): string` - Generate IAM policy name
- `logGroupName(name: string): string` - Generate CloudWatch log group name
- `resourceTags(additionalTags?: Record<string, string>): Record<string, string>` - Generate resource tags
- `isProduction(): boolean` - Check if production environment
- `isDevelopment(): boolean` - Check if development environment
- `isStaging(): boolean` - Check if staging environment

### EnvironmentConfigReader

#### Methods

- `fromEnvironmentVariables(environment: string): EnvironmentConfig` - Read from env vars
- `fromContext(app: any, environment: string): EnvironmentConfig` - Read from CDK context
- `getDefaultConfig(environment: string): EnvironmentConfig` - Get default config
- `mergeWithDefaults(config: Partial<EnvironmentConfig>, environment: string): EnvironmentConfig` - Merge with defaults

### Environment Variables

The following environment variables are supported:

- `AWS_REGION` or `CDK_DEFAULT_REGION` - AWS region
- `AWS_ACCOUNT_ID` or `CDK_DEFAULT_ACCOUNT` - AWS account ID (required)
- `PROJECT_NAME` - Project name (defaults to 'rankiro')
- `DOMAIN_NAME` - Domain name (optional)
- `CERTIFICATE_ARN` - SSL certificate ARN (optional)
- `HOSTED_ZONE_ID` - Route53 hosted zone ID (optional)

## Development

```bash
# Install dependencies
pnpm install

# Build the package
pnpm build

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run linting
pnpm lint

# Type check
pnpm type-check
```

## License

MIT