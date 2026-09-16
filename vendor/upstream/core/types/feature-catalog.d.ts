/**
 * Feature catalog: the static map from a console feature to the entitlement
 * that gates it, the features it depends on, and what each action requires.
 *
 * This is data, not policy enforcement. `FeatureAccessService` in the API reads
 * it to evaluate a request. See `docs/billing/enforcement.md`.
 */
import { EntitlementKey, PlanCode } from "./billing";
import { ConsoleFeatureId, FeatureAvailabilityState } from "./features";
/**
 * What a caller wants to do with a feature.
 *
 * The split exists because billing states treat reads and writes differently:
 * a past-due team may still read, but may not make new billable writes.
 */
export declare enum FeatureAction {
    /** Read feature data. Permitted while past due. */
    READ = "read",
    /** Create or mutate billable domain state. Blocked while past due. */
    WRITE = "write",
    /** Change feature configuration. Blocked while past due. */
    CONFIGURE = "configure"
}
export interface FeatureActionPolicy {
    /** Whether the team's feature state must be enabled, configured, or active. */
    requiresEnabled: boolean;
    /** Whether the entitlement must permit new billable use. */
    requiresBillable: boolean;
}
export interface FeatureCatalogEntry {
    id: ConsoleFeatureId;
    /** The entitlement that gates this feature. */
    entitlementKey: EntitlementKey;
    /** Features that must themselves be accessible before this one is. */
    dependencies: ConsoleFeatureId[];
    /** Additional entitlements a caller may hold under this feature. */
    capabilityEntitlements: EntitlementKey[];
    actions: Record<FeatureAction, FeatureActionPolicy>;
}
export declare const FEATURE_CATALOG: Record<ConsoleFeatureId, FeatureCatalogEntry>;
/** Feature states that count as enabled for actions requiring enablement. */
export declare const ENABLED_FEATURE_STATES: ReadonlySet<FeatureAvailabilityState>;
export declare function getFeatureCatalogEntry(featureId: ConsoleFeatureId): FeatureCatalogEntry | null;
/**
 * Plans cheapest first.
 *
 * Product access is cumulative, so the first plan in this order that grants an
 * entitlement is the cheapest way to buy it.
 */
export declare const PLAN_UPGRADE_ORDER: readonly PlanCode[];
/**
 * The cheapest plan granting an entitlement, so a locked capability can name
 * what to buy rather than only saying it is locked.
 */
export declare function cheapestPlanForEntitlement(key: EntitlementKey): PlanCode | null;
/** The cheapest plan granting the entitlement a console feature is gated on. */
export declare function cheapestPlanForFeature(featureId: ConsoleFeatureId): PlanCode | null;
//# sourceMappingURL=feature-catalog.d.ts.map