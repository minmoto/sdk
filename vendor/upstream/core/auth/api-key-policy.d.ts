import { Permission } from "./permissions";
export declare enum ApiKeyResourceScope {
    TEAM = "team",
    PLATFORM = "platform",
    EXPLICIT = "explicit"
}
export declare enum ApiKeyCapability {
    TEAM_READONLY = "team.readonly",
    TEAM_READ_WRITE = "team.read_write",
    SWAP_READONLY = "swap.readonly",
    SWAP_READ_WRITE = "swap.read_write",
    ESCROW_READONLY = "escrow.readonly",
    ESCROW_OPERATIONS = "escrow.operations",
    ESCROW_ADMIN = "escrow.admin",
    PAY_READONLY = "pay.readonly",
    PAY_READ_WRITE = "pay.read_write"
}
export declare const API_KEY_CAPABILITY_PERMISSIONS: Record<ApiKeyCapability, readonly Permission[]>;
export interface ApiKeyPolicyResources {
    teamIds?: string[];
    agentIds?: string[];
}
export interface ApiKeyResourcePolicy {
    resourceScope: ApiKeyResourceScope;
    capabilities?: ApiKeyCapability[];
    permissions: Permission[];
    resources?: ApiKeyPolicyResources;
}
export declare function parseApiKeyCapabilities(value: unknown): ApiKeyCapability[];
export declare function parseApiKeyPermissions(value: unknown): Permission[];
export declare function getApiKeyCapabilityPermissions(capabilities?: readonly ApiKeyCapability[]): Permission[];
export declare function getApiKeyPolicyPermissions(policy: Pick<ApiKeyResourcePolicy, "capabilities" | "permissions">): Permission[];
export declare function normalizeApiKeyResourcePolicy(policy: ApiKeyResourcePolicy): ApiKeyResourcePolicy;
//# sourceMappingURL=api-key-policy.d.ts.map