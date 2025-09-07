/**
 * Environment configuration interfaces and utilities
 */

export interface EnvironmentConfig {
    readonly environment: string;
    readonly region: string;
    readonly account: string;
    readonly project: string;
    readonly domain?: string;
    readonly certificateArn?: string;
    readonly hostedZoneId?: string;
    readonly vpc?: VpcConfig;
    readonly database?: DatabaseConfig;
    readonly monitoring?: MonitoringConfig;
    readonly security?: SecurityConfig;
}

export interface VpcConfig {
    readonly vpcId?: string;
    readonly subnetIds?: string[];
    readonly securityGroupIds?: string[];
    readonly enableNatGateway?: boolean;
    readonly enableVpcEndpoints?: boolean;
}

export interface DatabaseConfig {
    readonly engine: 'postgres' | 'mysql' | 'dynamodb';
    readonly instanceClass?: string;
    readonly allocatedStorage?: number;
    readonly multiAz?: boolean;
    readonly backupRetentionPeriod?: number;
    readonly deletionProtection?: boolean;
}

export interface MonitoringConfig {
    readonly enableCloudWatch?: boolean;
    readonly enableXRay?: boolean;
    readonly logRetentionDays?: number;
    readonly alarmEmail?: string;
}

export interface SecurityConfig {
    readonly enableWaf?: boolean;
    readonly enableGuardDuty?: boolean;
    readonly enableSecurityHub?: boolean;
    readonly allowedCidrs?: string[];
}

export class EnvironmentConfigReader {
    /**
     * Read environment configuration from CDK context
     */
    static fromContext(app: any, environment: string): EnvironmentConfig {
        const config = app.node.tryGetContext(`environments.${environment}`);

        if (!config) {
            throw new Error(`Environment configuration not found for: ${environment}`);
        }

        return this.validateConfig(config, environment);
    }

    /**
     * Read environment configuration from environment variables
     */
    static fromEnvironmentVariables(environment: string): EnvironmentConfig {
        const config: EnvironmentConfig = {
            environment,
            region: process.env.AWS_REGION || process.env.CDK_DEFAULT_REGION || 'us-east-1',
            account: process.env.AWS_ACCOUNT_ID || process.env.CDK_DEFAULT_ACCOUNT || '',
            project: process.env.PROJECT_NAME || 'rankiro',
            domain: process.env.DOMAIN_NAME,
            certificateArn: process.env.CERTIFICATE_ARN,
            hostedZoneId: process.env.HOSTED_ZONE_ID
        };

        if (!config.account) {
            throw new Error('AWS account ID must be provided via AWS_ACCOUNT_ID or CDK_DEFAULT_ACCOUNT');
        }

        return config;
    }

    /**
     * Get default configuration for an environment
     */
    static getDefaultConfig(environment: string): EnvironmentConfig {
        const baseConfig: EnvironmentConfig = {
            environment,
            region: 'us-east-1',
            account: '',
            project: 'rankiro'
        };

        switch (environment.toLowerCase()) {
            case 'dev':
            case 'development':
                return {
                    ...baseConfig,
                    database: {
                        engine: 'postgres',
                        instanceClass: 't3.micro',
                        allocatedStorage: 20,
                        multiAz: false,
                        backupRetentionPeriod: 7,
                        deletionProtection: false
                    },
                    monitoring: {
                        enableCloudWatch: true,
                        enableXRay: false,
                        logRetentionDays: 7
                    },
                    security: {
                        enableWaf: false,
                        enableGuardDuty: false,
                        enableSecurityHub: false
                    }
                };

            case 'staging':
            case 'stage':
                return {
                    ...baseConfig,
                    database: {
                        engine: 'postgres',
                        instanceClass: 't3.small',
                        allocatedStorage: 50,
                        multiAz: false,
                        backupRetentionPeriod: 14,
                        deletionProtection: false
                    },
                    monitoring: {
                        enableCloudWatch: true,
                        enableXRay: true,
                        logRetentionDays: 30
                    },
                    security: {
                        enableWaf: true,
                        enableGuardDuty: false,
                        enableSecurityHub: false
                    }
                };

            case 'prod':
            case 'production':
                return {
                    ...baseConfig,
                    database: {
                        engine: 'postgres',
                        instanceClass: 't3.medium',
                        allocatedStorage: 100,
                        multiAz: true,
                        backupRetentionPeriod: 30,
                        deletionProtection: true
                    },
                    monitoring: {
                        enableCloudWatch: true,
                        enableXRay: true,
                        logRetentionDays: 90
                    },
                    security: {
                        enableWaf: true,
                        enableGuardDuty: true,
                        enableSecurityHub: true
                    }
                };

            default:
                return baseConfig;
        }
    }

    /**
     * Validate environment configuration
     */
    private static validateConfig(config: any, environment: string): EnvironmentConfig {
        if (!config.region) {
            throw new Error(`Region is required for environment: ${environment}`);
        }

        if (!config.account) {
            throw new Error(`Account ID is required for environment: ${environment}`);
        }

        if (!config.project) {
            config.project = 'rankiro';
        }

        return {
            environment,
            ...config
        };
    }

    /**
     * Merge configurations with defaults
     */
    static mergeWithDefaults(config: Partial<EnvironmentConfig>, environment: string): EnvironmentConfig {
        const defaults = this.getDefaultConfig(environment);

        return {
            ...defaults,
            ...config,
            environment,
            vpc: config.vpc ? { ...defaults.vpc, ...config.vpc } : defaults.vpc,
            database: config.database ? { ...defaults.database, ...config.database } : defaults.database,
            monitoring: config.monitoring ? { ...defaults.monitoring, ...config.monitoring } : defaults.monitoring,
            security: config.security ? { ...defaults.security, ...config.security } : defaults.security
        };
    }
}