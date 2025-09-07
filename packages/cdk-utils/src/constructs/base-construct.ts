/**
 * Base construct with common utilities
 */

import { Construct } from 'constructs';
import { CDKNamingUtils } from '../naming/cdk-naming-utils.js';
import { EnvironmentConfig } from '../config/environment-config.js';

export interface BaseConstructProps {
    readonly config: EnvironmentConfig;
    readonly naming: CDKNamingUtils;
}

export abstract class BaseConstruct extends Construct {
    protected readonly config: EnvironmentConfig;
    protected readonly naming: CDKNamingUtils;

    constructor(scope: Construct, id: string, props: BaseConstructProps) {
        super(scope, id);

        this.config = props.config;
        this.naming = props.naming;
    }

    /**
     * Get common tags for all resources
     */
    protected getCommonTags(): Record<string, string> {
        return this.naming.resourceTags({
            ConstructId: this.node.id,
            StackName: this.node.root.node.id
        });
    }

    /**
     * Check if this is a production environment
     */
    protected isProduction(): boolean {
        return this.naming.isProduction();
    }

    /**
     * Check if this is a development environment
     */
    protected isDevelopment(): boolean {
        return this.naming.isDevelopment();
    }

    /**
     * Check if this is a staging environment
     */
    protected isStaging(): boolean {
        return this.naming.isStaging();
    }

    /**
     * Get environment-specific configuration value
     */
    protected getEnvConfig<T>(
        prodValue: T,
        stagingValue: T,
        devValue: T
    ): T {
        if (this.isProduction()) {
            return prodValue;
        } else if (this.isStaging()) {
            return stagingValue;
        } else {
            return devValue;
        }
    }

    /**
     * Get resource name using naming utils
     */
    protected resourceName(resourceType: string, name: string): string {
        return this.naming.resourceName(resourceType, name);
    }
}