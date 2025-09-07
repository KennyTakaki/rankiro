---
inclusion: fileMatch
fileMatchPattern: '**/cdk-utils/**/*'
---

# AWS CDK Development Patterns

## CDK Utility Package Standards

### Naming Conventions
Use the CDKNamingUtils class for consistent resource naming:
```typescript
import { CDKNamingUtils } from '@monorepo/cdk-utils';

const namingUtils = new CDKNamingUtils({
  stage: 'dev',
  region: 'us-east-1',
  accountId: '123456789012'
});

// Resource naming: {stage}-{name}-{type}
const bucketName = namingUtils.createResourceName('bucket', 'data-storage');
// Result: "dev-data-storage-bucket"
```

### Environment Configuration
Always use environment-aware configuration:
```typescript
interface EnvironmentConfig {
  stage: 'dev' | 'staging' | 'prod';
  region: string;
  accountId: string;
  domainName?: string;
}

// Read from CDK context or environment variables
const config: EnvironmentConfig = {
  stage: app.node.tryGetContext('stage') || process.env.STAGE || 'dev',
  region: app.node.tryGetContext('region') || process.env.AWS_REGION || 'us-east-1',
  accountId: app.node.tryGetContext('accountId') || process.env.AWS_ACCOUNT_ID
};
```

### Stack Organization
- Use separate stacks for different concerns (networking, compute, storage)
- Implement cross-stack references using CDK exports/imports
- Follow the naming pattern: `{AppName}{Stage}{StackPurpose}Stack`

### Resource Tagging
Apply consistent tagging to all resources:
```typescript
const commonTags = {
  Project: 'Rankiro',
  Environment: config.stage,
  ManagedBy: 'CDK',
  Owner: 'Development Team'
};

// Apply to all constructs in stack
Tags.of(this).add('Project', commonTags.Project);
```

### Security Best Practices
- Use least privilege IAM policies
- Enable encryption at rest and in transit
- Use AWS Secrets Manager for sensitive data
- Implement proper VPC security groups

### Cost Optimization
- Use appropriate instance types for workloads
- Implement auto-scaling where applicable
- Use spot instances for non-critical workloads
- Set up cost monitoring and alerts

### Deployment Patterns
- Use CDK Pipelines for CI/CD
- Implement blue-green deployments for production
- Use feature flags for gradual rollouts
- Maintain separate environments (dev, staging, prod)