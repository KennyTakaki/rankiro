/**
 * Tests for EnvironmentConfigReader
 */

import { EnvironmentConfigReader, EnvironmentConfig } from '../src/config/environment-config';

describe('EnvironmentConfigReader', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = { ...originalEnv };
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    describe('fromEnvironmentVariables', () => {
        it('should read configuration from environment variables', () => {
            process.env.AWS_REGION = 'us-west-2';
            process.env.AWS_ACCOUNT_ID = '123456789012';
            process.env.PROJECT_NAME = 'test-project';
            process.env.DOMAIN_NAME = 'example.com';

            const config = EnvironmentConfigReader.fromEnvironmentVariables('dev');

            expect(config).toEqual({
                environment: 'dev',
                region: 'us-west-2',
                account: '123456789012',
                project: 'test-project',
                domain: 'example.com',
                certificateArn: undefined,
                hostedZoneId: undefined
            });
        });

        it('should use CDK default environment variables', () => {
            process.env.CDK_DEFAULT_REGION = 'eu-west-1';
            process.env.CDK_DEFAULT_ACCOUNT = '987654321098';

            const config = EnvironmentConfigReader.fromEnvironmentVariables('prod');

            expect(config.region).toBe('eu-west-1');
            expect(config.account).toBe('987654321098');
        });

        it('should use default values when environment variables are not set', () => {
            process.env.AWS_ACCOUNT_ID = '123456789012';

            const config = EnvironmentConfigReader.fromEnvironmentVariables('staging');

            expect(config.region).toBe('us-east-1');
            expect(config.project).toBe('rankiro');
        });

        it('should throw error when account ID is not provided', () => {
            delete process.env.AWS_ACCOUNT_ID;
            delete process.env.CDK_DEFAULT_ACCOUNT;

            expect(() => {
                EnvironmentConfigReader.fromEnvironmentVariables('dev');
            }).toThrow('AWS account ID must be provided');
        });
    });

    describe('getDefaultConfig', () => {
        it('should return development configuration', () => {
            const config = EnvironmentConfigReader.getDefaultConfig('dev');

            expect(config.environment).toBe('dev');
            expect(config.database?.instanceClass).toBe('t3.micro');
            expect(config.database?.multiAz).toBe(false);
            expect(config.database?.deletionProtection).toBe(false);
            expect(config.monitoring?.logRetentionDays).toBe(7);
            expect(config.security?.enableWaf).toBe(false);
        });

        it('should return staging configuration', () => {
            const config = EnvironmentConfigReader.getDefaultConfig('staging');

            expect(config.environment).toBe('staging');
            expect(config.database?.instanceClass).toBe('t3.small');
            expect(config.database?.backupRetentionPeriod).toBe(14);
            expect(config.monitoring?.enableXRay).toBe(true);
            expect(config.security?.enableWaf).toBe(true);
        });

        it('should return production configuration', () => {
            const config = EnvironmentConfigReader.getDefaultConfig('prod');

            expect(config.environment).toBe('prod');
            expect(config.database?.instanceClass).toBe('t3.medium');
            expect(config.database?.multiAz).toBe(true);
            expect(config.database?.deletionProtection).toBe(true);
            expect(config.monitoring?.logRetentionDays).toBe(90);
            expect(config.security?.enableGuardDuty).toBe(true);
        });

        it('should handle case insensitive environment names', () => {
            const devConfig = EnvironmentConfigReader.getDefaultConfig('DEVELOPMENT');
            const prodConfig = EnvironmentConfigReader.getDefaultConfig('PRODUCTION');
            const stageConfig = EnvironmentConfigReader.getDefaultConfig('STAGE');

            expect(devConfig.database?.instanceClass).toBe('t3.micro');
            expect(prodConfig.database?.instanceClass).toBe('t3.medium');
            expect(stageConfig.database?.instanceClass).toBe('t3.small');
        });

        it('should return base configuration for unknown environment', () => {
            const config = EnvironmentConfigReader.getDefaultConfig('unknown');

            expect(config.environment).toBe('unknown');
            expect(config.region).toBe('us-east-1');
            expect(config.project).toBe('rankiro');
            expect(config.database).toBeUndefined();
            expect(config.monitoring).toBeUndefined();
            expect(config.security).toBeUndefined();
        });
    });

    describe('mergeWithDefaults', () => {
        it('should merge partial configuration with defaults', () => {
            const partialConfig: Partial<EnvironmentConfig> = {
                region: 'eu-west-1',
                account: '123456789012',
                database: {
                    engine: 'mysql',
                    instanceClass: 't3.large'
                }
            };

            const config = EnvironmentConfigReader.mergeWithDefaults(partialConfig, 'dev');

            expect(config.region).toBe('eu-west-1');
            expect(config.account).toBe('123456789012');
            expect(config.database?.engine).toBe('mysql');
            expect(config.database?.instanceClass).toBe('t3.large');
            expect(config.database?.multiAz).toBe(false); // From defaults
            expect(config.monitoring?.enableCloudWatch).toBe(true); // From defaults
        });

        it('should override nested configuration properties', () => {
            const partialConfig: Partial<EnvironmentConfig> = {
                monitoring: {
                    enableXRay: false,
                    logRetentionDays: 14
                }
            };

            const config = EnvironmentConfigReader.mergeWithDefaults(partialConfig, 'prod');

            expect(config.monitoring?.enableXRay).toBe(false); // Overridden
            expect(config.monitoring?.logRetentionDays).toBe(14); // Overridden
            expect(config.monitoring?.enableCloudWatch).toBe(true); // From defaults
        });

        it('should preserve environment parameter', () => {
            const partialConfig: Partial<EnvironmentConfig> = {
                environment: 'should-be-overridden',
                region: 'us-west-2'
            };

            const config = EnvironmentConfigReader.mergeWithDefaults(partialConfig, 'staging');

            expect(config.environment).toBe('staging');
            expect(config.region).toBe('us-west-2');
        });
    });

    describe('fromContext', () => {
        it('should read configuration from CDK context', () => {
            const mockApp = {
                node: {
                    tryGetContext: jest.fn().mockReturnValue({
                        region: 'ap-southeast-1',
                        account: '555666777888',
                        project: 'context-project',
                        domain: 'context.example.com'
                    })
                }
            };

            const config = EnvironmentConfigReader.fromContext(mockApp, 'test');

            expect(mockApp.node.tryGetContext).toHaveBeenCalledWith('environments.test');
            expect(config).toEqual({
                environment: 'test',
                region: 'ap-southeast-1',
                account: '555666777888',
                project: 'context-project',
                domain: 'context.example.com'
            });
        });

        it('should throw error when context is not found', () => {
            const mockApp = {
                node: {
                    tryGetContext: jest.fn().mockReturnValue(undefined)
                }
            };

            expect(() => {
                EnvironmentConfigReader.fromContext(mockApp, 'missing');
            }).toThrow('Environment configuration not found for: missing');
        });

        it('should validate required fields', () => {
            const mockApp = {
                node: {
                    tryGetContext: jest.fn().mockReturnValue({
                        // Missing region and account
                        project: 'test'
                    })
                }
            };

            expect(() => {
                EnvironmentConfigReader.fromContext(mockApp, 'invalid');
            }).toThrow('Region is required for environment: invalid');
        });

        it('should set default project name if missing', () => {
            const mockApp = {
                node: {
                    tryGetContext: jest.fn().mockReturnValue({
                        region: 'us-east-1',
                        account: '123456789012'
                        // Missing project
                    })
                }
            };

            const config = EnvironmentConfigReader.fromContext(mockApp, 'test');

            expect(config.project).toBe('rankiro');
        });
    });
});