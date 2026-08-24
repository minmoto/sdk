export declare enum FeatureId {
    FX = "fx",
    AGENTS = "agents",
    ESCROW = "escrow",
    SWAPS = "swaps"
}
export declare enum ConsoleFeatureId {
    WALLETS = "wallets",
    ESCROW = "escrow",
    OTC = "otc",
    INTEGRATIONS = "integrations"
}
export declare enum IntegrationId {
    PAY = "pay"
}
export declare enum FeatureAvailabilityState {
    UNAVAILABLE = "unavailable",
    AVAILABLE = "available",
    ENABLED = "enabled",
    CONFIGURED = "configured",
    ACTIVE = "active",
    SUSPENDED = "suspended"
}
export declare enum FeatureAccessDenialReason {
    TEAM_NOT_FOUND = "team_not_found",
    FEATURE_UNKNOWN = "feature_unknown",
    MISSING_PERMISSION = "missing_permission",
    MISSING_DEPENDENCY = "missing_dependency",
    NOT_ENTITLED = "not_entitled",
    NOT_ENABLED = "not_enabled",
    NOT_CONFIGURED = "not_configured",
    LIMIT_EXCEEDED = "limit_exceeded",
    PAST_DUE = "past_due",
    SUSPENDED = "suspended"
}
export type FeatureMetadata = {
    id: ConsoleFeatureId;
    state: FeatureAvailabilityState;
    label: string;
    description?: string;
    enabledAt?: string;
    enabledByUserId?: string;
    updatedAt?: string;
    updatedByUserId?: string;
    capabilities?: Record<string, unknown>;
    config?: Record<string, unknown>;
};
export type FeaturesMetadata = Partial<Record<ConsoleFeatureId, FeatureMetadata>>;
export type FeatureSummaryDto = FeatureMetadata & {
    enabled: boolean;
};
export type UpdateFeatureRequest = {
    state?: FeatureAvailabilityState;
    label?: string;
    description?: string;
    capabilities?: Record<string, unknown>;
    config?: Record<string, unknown>;
};
//# sourceMappingURL=features.d.ts.map