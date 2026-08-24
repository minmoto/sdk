export declare enum AppEnv {
    DEVELOPMENT = "development",
    STAGING = "staging",
    PRODUCTION = "production"
}
export interface EnvConfig {
    env: AppEnv;
    name: string;
    subdomain: string;
}
export type EnvConfigMap = {
    current: AppEnv;
} & {
    [K in AppEnv]: EnvConfig;
};
/**
 * Gets the current application environment from environment variables
 */
export declare function getCurrentEnvironment(): AppEnv;
/**
 * Gets current environment configuration and mappings
 */
export declare function getEnvironmentConfig(): EnvConfigMap;
//# sourceMappingURL=environment.d.ts.map