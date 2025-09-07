/**
 * Tests for CDKNamingUtils
 */

import { CDKNamingUtils, NamingOptions } from '../src/naming/cdk-naming-utils';

describe('CDKNamingUtils', () => {
    let namingUtils: CDKNamingUtils;

    const mockOptions: NamingOptions = {
        environment: 'dev',
        project: 'rankiro',
        region: 'us-east-1',
        suffix: 'test'
    };

    beforeEach(() => {
        namingUtils = new CDKNamingUtils(mockOptions);
    });

    describe('constructor', () => {
        it('should initialize with provided options', () => {
            expect(namingUtils.getEnvironment()).toBe('dev');
            expect(namingUtils.getProject()).toBe('rankiro');
            expect(namingUtils.getRegion()).toBe('us-east-1');
        });

        it('should work without optional parameters', () => {
            const minimalOptions: NamingOptions = {
                environment: 'prod',
                project: 'test-project'
            };
            const minimal = new CDKNamingUtils(minimalOptions);

            expect(minimal.getEnvironment()).toBe('prod');
            expect(minimal.getProject()).toBe('test-project');
            expect(minimal.getRegion()).toBeUndefined();
        });
    });

    describe('resourceName', () => {
        it('should generate resource name with all components', () => {
            const result = namingUtils.resourceName('lambda', 'api-handler');
            expect(result).toBe('rankiro-dev-lambda-api-handler-test');
        });

        it('should generate resource name without suffix', () => {
            const noSuffixUtils = new CDKNamingUtils({
                environment: 'prod',
                project: 'myapp'
            });

            const result = noSuffixUtils.resourceName('table', 'users');
            expect(result).toBe('myapp-prod-table-users');
        });

        it('should convert to lowercase', () => {
            const upperCaseUtils = new CDKNamingUtils({
                environment: 'PROD',
                project: 'MyApp'
            });

            const result = upperCaseUtils.resourceName('API', 'UserService');
            expect(result).toBe('myapp-prod-api-userservice');
        });
    });

    describe('specific resource naming methods', () => {
        it('should generate stack name', () => {
            const result = namingUtils.stackName('api');
            expect(result).toBe('rankiro-dev-stack-api-test');
        });

        it('should generate lambda name', () => {
            const result = namingUtils.lambdaName('processor');
            expect(result).toBe('rankiro-dev-lambda-processor-test');
        });

        it('should generate table name', () => {
            const result = namingUtils.tableName('videos');
            expect(result).toBe('rankiro-dev-table-videos-test');
        });

        it('should generate API name', () => {
            const result = namingUtils.apiName('ranking');
            expect(result).toBe('rankiro-dev-api-ranking-test');
        });

        it('should generate VPC name', () => {
            const result = namingUtils.vpcName('main');
            expect(result).toBe('rankiro-dev-vpc-main-test');
        });

        it('should generate security group name', () => {
            const result = namingUtils.securityGroupName('web');
            expect(result).toBe('rankiro-dev-sg-web-test');
        });

        it('should generate role name', () => {
            const result = namingUtils.roleName('lambda-execution');
            expect(result).toBe('rankiro-dev-role-lambda-execution-test');
        });

        it('should generate policy name', () => {
            const result = namingUtils.policyName('s3-access');
            expect(result).toBe('rankiro-dev-policy-s3-access-test');
        });

        it('should generate log group name', () => {
            const result = namingUtils.logGroupName('api');
            expect(result).toBe('/aws/lambda/rankiro-dev-log-api-test');
        });
    });

    describe('bucketName', () => {
        it('should generate unique bucket name with timestamp', () => {
            const result = namingUtils.bucketName('assets');

            expect(result).toMatch(/^rankiro-dev-assets-us-east-1-test-\d+$/);
        });

        it('should generate bucket name without region', () => {
            const noRegionUtils = new CDKNamingUtils({
                environment: 'prod',
                project: 'test'
            });

            const result = noRegionUtils.bucketName('data');
            expect(result).toMatch(/^test-prod-data-\d+$/);
        });

        it('should generate different names for consecutive calls', async () => {
            const result1 = namingUtils.bucketName('test');
            // Add a small delay to ensure different timestamps
            await new Promise(resolve => setTimeout(resolve, 1));
            const result2 = namingUtils.bucketName('test');

            expect(result1).not.toBe(result2);
        });
    });

    describe('resourceTags', () => {
        it('should generate default tags', () => {
            const tags = namingUtils.resourceTags();

            expect(tags).toEqual({
                Environment: 'dev',
                Project: 'rankiro',
                ManagedBy: 'CDK'
            });
        });

        it('should merge additional tags', () => {
            const additionalTags = {
                Owner: 'team-backend',
                CostCenter: 'engineering'
            };

            const tags = namingUtils.resourceTags(additionalTags);

            expect(tags).toEqual({
                Environment: 'dev',
                Project: 'rankiro',
                ManagedBy: 'CDK',
                Owner: 'team-backend',
                CostCenter: 'engineering'
            });
        });

        it('should allow overriding default tags', () => {
            const overrideTags = {
                Environment: 'custom',
                ManagedBy: 'Terraform'
            };

            const tags = namingUtils.resourceTags(overrideTags);

            expect(tags).toEqual({
                Environment: 'custom',
                Project: 'rankiro',
                ManagedBy: 'Terraform'
            });
        });
    });

    describe('environment detection methods', () => {
        it('should detect production environment', () => {
            const prodUtils = new CDKNamingUtils({
                environment: 'prod',
                project: 'test'
            });

            expect(prodUtils.isProduction()).toBe(true);
            expect(prodUtils.isDevelopment()).toBe(false);
            expect(prodUtils.isStaging()).toBe(false);
        });

        it('should detect production environment with full name', () => {
            const prodUtils = new CDKNamingUtils({
                environment: 'production',
                project: 'test'
            });

            expect(prodUtils.isProduction()).toBe(true);
        });

        it('should detect development environment', () => {
            const devUtils = new CDKNamingUtils({
                environment: 'dev',
                project: 'test'
            });

            expect(devUtils.isDevelopment()).toBe(true);
            expect(devUtils.isProduction()).toBe(false);
            expect(devUtils.isStaging()).toBe(false);
        });

        it('should detect development environment with full name', () => {
            const devUtils = new CDKNamingUtils({
                environment: 'development',
                project: 'test'
            });

            expect(devUtils.isDevelopment()).toBe(true);
        });

        it('should detect staging environment', () => {
            const stagingUtils = new CDKNamingUtils({
                environment: 'staging',
                project: 'test'
            });

            expect(stagingUtils.isStaging()).toBe(true);
            expect(stagingUtils.isProduction()).toBe(false);
            expect(stagingUtils.isDevelopment()).toBe(false);
        });

        it('should detect staging environment with short name', () => {
            const stageUtils = new CDKNamingUtils({
                environment: 'stage',
                project: 'test'
            });

            expect(stageUtils.isStaging()).toBe(true);
        });

        it('should handle case insensitive environment names', () => {
            const upperProdUtils = new CDKNamingUtils({
                environment: 'PROD',
                project: 'test'
            });

            expect(upperProdUtils.isProduction()).toBe(true);
        });
    });
});