/**
 * CDK Naming Utilities for environment-aware resource naming
 */

export interface NamingOptions {
    readonly environment: string;
    readonly project: string;
    readonly region?: string;
    readonly suffix?: string;
}

export class CDKNamingUtils {
    private readonly environment: string;
    private readonly project: string;
    private readonly region?: string;
    private readonly suffix?: string;

    constructor(options: NamingOptions) {
        this.environment = options.environment;
        this.project = options.project;
        this.region = options.region;
        this.suffix = options.suffix;
    }

    /**
     * Generate a resource name with environment and project prefix
     */
    resourceName(resourceType: string, name: string): string {
        const parts = [this.project, this.environment, resourceType, name];

        if (this.suffix) {
            parts.push(this.suffix);
        }

        return parts.join('-').toLowerCase();
    }

    /**
     * Generate a stack name
     */
    stackName(stackName: string): string {
        return this.resourceName('stack', stackName);
    }

    /**
     * Generate a Lambda function name
     */
    lambdaName(functionName: string): string {
        return this.resourceName('lambda', functionName);
    }

    /**
     * Generate an S3 bucket name (must be globally unique)
     */
    bucketName(bucketName: string): string {
        const parts = [this.project, this.environment, bucketName];

        if (this.region) {
            parts.push(this.region);
        }

        if (this.suffix) {
            parts.push(this.suffix);
        }

        // Add timestamp for uniqueness
        parts.push(Date.now().toString());

        return parts.join('-').toLowerCase();
    }

    /**
     * Generate a DynamoDB table name
     */
    tableName(tableName: string): string {
        return this.resourceName('table', tableName);
    }

    /**
     * Generate an API Gateway name
     */
    apiName(apiName: string): string {
        return this.resourceName('api', apiName);
    }

    /**
     * Generate a VPC name
     */
    vpcName(vpcName: string): string {
        return this.resourceName('vpc', vpcName);
    }

    /**
     * Generate a security group name
     */
    securityGroupName(sgName: string): string {
        return this.resourceName('sg', sgName);
    }

    /**
     * Generate an IAM role name
     */
    roleName(roleName: string): string {
        return this.resourceName('role', roleName);
    }

    /**
     * Generate an IAM policy name
     */
    policyName(policyName: string): string {
        return this.resourceName('policy', policyName);
    }

    /**
     * Generate a CloudWatch log group name
     */
    logGroupName(logGroupName: string): string {
        return `/aws/lambda/${this.resourceName('log', logGroupName)}`;
    }

    /**
     * Generate tags for resources
     */
    resourceTags(additionalTags: Record<string, string> = {}): Record<string, string> {
        return {
            Environment: this.environment,
            Project: this.project,
            ManagedBy: 'CDK',
            ...additionalTags
        };
    }

    /**
     * Get the environment name
     */
    getEnvironment(): string {
        return this.environment;
    }

    /**
     * Get the project name
     */
    getProject(): string {
        return this.project;
    }

    /**
     * Get the region
     */
    getRegion(): string | undefined {
        return this.region;
    }

    /**
     * Check if this is a production environment
     */
    isProduction(): boolean {
        return this.environment.toLowerCase() === 'prod' ||
            this.environment.toLowerCase() === 'production';
    }

    /**
     * Check if this is a development environment
     */
    isDevelopment(): boolean {
        return this.environment.toLowerCase() === 'dev' ||
            this.environment.toLowerCase() === 'development';
    }

    /**
     * Check if this is a staging environment
     */
    isStaging(): boolean {
        return this.environment.toLowerCase() === 'staging' ||
            this.environment.toLowerCase() === 'stage';
    }
}