import type { PlanCode } from "./billing";
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
/**
 * Whether a team's plan grants the entitlement a feature is gated on.
 *
 * Separate from `state`: `state` is the team's own enablement flag, which an
 * admin toggles, while this is what the plan bought. A feature needs both, so
 * reporting them apart lets a client say "switched on but not covered by this
 * plan" rather than collapsing the two into one misleading answer.
 */
export type FeatureEntitlementSummary = {
    entitled: boolean;
    /** Cheapest plan that would grant it. Null once entitled, or if no plan does. */
    requiredPlanCode: PlanCode | null;
};
/**
 * Entitlement fields are optional because they are added at the API boundary,
 * where billing state is reachable, rather than by the team metadata reader
 * that produces the rest. Absent means unknown, and a client should read that
 * as entitled: visibility fails open, and the server-side feature gate — not
 * the UI — is the enforcement boundary.
 */
export type FeatureSummaryDto = FeatureMetadata & {
    enabled: boolean;
} & Partial<FeatureEntitlementSummary>;
export type UpdateFeatureRequest = {
    state?: FeatureAvailabilityState;
    label?: string;
    description?: string;
    capabilities?: Record<string, unknown>;
    config?: Record<string, unknown>;
};
//# sourceMappingURL=features.d.ts.map