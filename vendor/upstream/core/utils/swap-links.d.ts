/**
 * Agent swap link generation utilities
 * Shared functionality for generating swap links across different environments
 */
export interface SwapLinkConfig {
    swapUrl: string;
    environment?: string;
}
/**
 * Validates that the swap URL is properly formatted
 * @param swapUrl - The base swap URL to validate
 * @returns boolean indicating if URL is valid
 */
export declare const validateSwapUrl: (swapUrl: string) => boolean;
/**
 * Generates a swap link for an agent
 * @param agentId - The agent's unique identifier
 * @param config - Configuration object containing swap URL and optional environment
 * @returns The swap link URL or null if invalid inputs
 */
export declare const generateAgentSwapLink: (agentId: string | undefined, config: SwapLinkConfig) => string | null;
/**
 * Generates swap link configuration based on environment
 * @param baseSwapUrl - The base swap URL
 * @param environment - Optional environment identifier (dev, staging, prod)
 * @returns Configuration object for swap link generation
 */
export declare const createSwapLinkConfig: (baseSwapUrl: string, environment?: string) => SwapLinkConfig;
/**
 * Formats a swap link for sharing with a custom message
 * @param swapUrl - The swap URL to format
 * @param customMessage - Optional custom message to include
 * @returns Formatted message string for sharing
 */
export declare const formatSwapLinkMessage: (swapUrl: string, customMessage?: string) => string;
/**
 * Extracts agent ID from a swap URL
 * @param swapUrl - The full swap URL
 * @param baseSwapUrl - The base swap URL to match against
 * @returns The agent ID or null if extraction fails
 */
export declare const extractAgentIdFromSwapUrl: (swapUrl: string, baseSwapUrl: string) => string | null;
//# sourceMappingURL=swap-links.d.ts.map