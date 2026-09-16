/**
 * Billing, subscription, and entitlement types.
 *
 * Billing grants entitlements, entitlements gate features, and feature modules
 * never call the billing provider directly. Team-scoped billing state lives on
 * `teams.metadata.billing`; the plan catalog below is code-owned so that plan
 * definitions ship and roll back with the code that reads them.
 *
 * See `docs/billing/README.md` and `docs/billing/storage.md`.
 */
/** Product package a team subscribes to. */
export declare enum PlanCode {
    WALLET_PARTNER = "wallet_partner",
    INTEGRATION_PARTNER = "integration_partner",
    OPERATING_PARTNER = "operating_partner"
}
/** How often a subscription is billed. */
export declare enum BillingInterval {
    MONTHLY = "monthly",
    YEARLY = "yearly"
}
/** Billing status of a team's subscription. */
export declare enum SubscriptionStatus {
    TRIALING = "trialing",
    ACTIVE = "active",
    PAST_DUE = "past_due",
    GRACE = "grace",
    PAUSED = "paused",
    CANCELED = "canceled"
}
/**
 * Normalized, request-time-readable permission to use a product or capability.
 *
 * These strings are persisted in team metadata, so they are stable. Renaming
 * one is a data migration: `EntitlementService` drops entitlement keys it does
 * not recognize, so a team holding the old string silently loses that
 * entitlement until its plan is re-expanded.
 *
 * `integration.pay` names the capability rather than its current backend.
 * BTCPay Server is what implements Minmo Pay today; the entitlement outlives
 * that choice, and the name matches `IntegrationId.PAY`, which is already
 * persisted in team feature config.
 */
export declare enum EntitlementKey {
    PRODUCT_WALLET = "product.wallet",
    PRODUCT_INTEGRATIONS = "product.integrations",
    INTEGRATION_API_KEY = "integration.api_key",
    INTEGRATION_PAY = "integration.pay",
    PRODUCT_ESCROW = "product.escrow",
    PRODUCT_OTC = "product.otc"
}
/** Lifecycle state of a single entitlement record. */
export declare enum EntitlementStatus {
    ACTIVE = "active",
    TRIALING = "trialing",
    GRACE = "grace",
    PAST_DUE = "past_due",
    SUSPENDED = "suspended",
    EXPIRED = "expired"
}
/** What produced an entitlement record. */
export declare enum EntitlementSource {
    PLAN = "plan",
    TRIAL = "trial",
    MANUAL_OVERRIDE = "manual_override",
    BILLING_SYNC = "billing_sync",
    INTERNAL = "internal"
}
/** Which set of operations an entitlement applies to. */
export declare enum EntitlementScope {
    TEAM_AGENTS = "team_agents",
    TEAM_OPERATED_ESCROW = "team_operated_escrow",
    MINMO_OPERATED_ESCROW = "minmo_operated_escrow",
    PLATFORM = "platform"
}
/** Who operates escrow for a swap. */
export declare enum EscrowOperatingMode {
    TEAM_OPERATED = "team_operated",
    MINMO_OPERATED = "minmo_operated"
}
/** Whether exceeding a limit blocks the operation or bills as overage. */
export declare enum LimitMode {
    HARD_CAP = "hard_cap",
    OVERAGE = "overage"
}
/** Known numeric limit keys carried by entitlements. */
export declare enum EntitlementLimitKey {
    WALLET_INSTANCES = "walletInstances",
    MONTHLY_SWAPS = "monthlySwaps",
    MONTHLY_VOLUME_SATS = "monthlyVolumeSats",
    ACTIVE_AGENTS = "activeAgents"
}
export declare const UNLIMITED: "unlimited";
export type Unlimited = typeof UNLIMITED;
/**
 * A bounded limit. `included` is a string when the quantity can exceed the
 * safe integer range, as monthly satoshi volume can.
 */
export interface EntitlementLimit {
    included: number | string;
    mode: LimitMode;
}
export type EntitlementLimitValue = Unlimited | EntitlementLimit;
export type EntitlementLimits = Partial<Record<EntitlementLimitKey, EntitlementLimitValue>>;
/** Fee or revenue-share policy attached to an entitlement. */
export type EntitlementFees = Record<string, unknown>;
/** A single resolved entitlement, whether plan-derived or an override. */
export interface EntitlementRecord {
    status: EntitlementStatus;
    source: EntitlementSource;
    scope?: EntitlementScope;
    mode?: EscrowOperatingMode;
    limits?: EntitlementLimits;
    fees?: EntitlementFees;
    reason?: string;
    effectiveFrom?: string;
    effectiveUntil?: string;
    updatedAt?: string;
    updatedByUserId?: string;
}
export type EntitlementMap = Partial<Record<EntitlementKey, EntitlementRecord>>;
/** Provider-neutral subscription state for a team. */
export interface TeamSubscriptionMetadata {
    status: SubscriptionStatus;
    /** Defaults to monthly when absent, which is what every team predates. */
    interval?: BillingInterval;
    provider?: string;
    providerCustomerId?: string;
    providerSubscriptionId?: string;
    currentPeriodStart?: string;
    currentPeriodEnd?: string;
    trialEndsAt?: string;
    cancelAt?: string;
    canceledAt?: string;
}
/**
 * Team billing state, stored at `teams.metadata.billing`.
 *
 * `entitlements` is rewritten wholesale by plan expansion. `overrides` is never
 * touched by expansion, so an admin grant or suspension survives a plan change
 * and the resolver can always explain which one decided access.
 */
export interface TeamBillingMetadata {
    planCode: PlanCode;
    subscription: TeamSubscriptionMetadata;
    entitlements: EntitlementMap;
    overrides?: EntitlementMap;
    syncedAt?: string;
}
/**
 * List price for a plan on one interval.
 *
 * Yearly is twelve times monthly: paying up front costs the same as paying as
 * you go. Any discount is a commercial choice held in the catalog, not a rule
 * applied here, so repricing one interval never silently moves the other.
 */
export declare function planPriceUsd(plan: BillingPlanDefinition, interval: BillingInterval): number;
/**
 * The struck-through price to show beside the real one, or null when the plan
 * has none. Never used for invoicing — `planPriceUsd` is what a team pays.
 */
export declare function planCompareAtUsd(plan: BillingPlanDefinition, interval: BillingInterval): number | null;
/** Entitlement grant as declared by a plan, before expansion into a record. */
export interface PlanEntitlementDefinition {
    scope?: EntitlementScope;
    mode?: EscrowOperatingMode;
    limits?: EntitlementLimits;
    fees?: EntitlementFees;
}
export interface BillingPlanDefinition {
    code: PlanCode;
    name: string;
    /** Monthly list price in USD. Zero for free plans. */
    monthlyPriceUsd: number;
    /**
     * Yearly list price in USD. Zero for free plans.
     *
     * Held as its own figure rather than derived from a discount rate, so a plan
     * can be repriced on one interval without moving the other.
     */
    yearlyPriceUsd: number;
    /**
     * Price shown struck through beside the monthly price, to frame it as a
     * discount. Omit when there is nothing to compare against.
     *
     * This is presentation only: nothing is ever invoiced at this figure.
     */
    monthlyCompareAtUsd?: number;
    /** Yearly counterpart of `monthlyCompareAtUsd`. */
    yearlyCompareAtUsd?: number;
    entitlements: Partial<Record<EntitlementKey, PlanEntitlementDefinition>>;
}
/**
 * Provider-neutral plan catalog. Product access is cumulative: each tier
 * includes everything the tier below it grants.
 */
export declare const BILLING_PLAN_CATALOG: Record<PlanCode, BillingPlanDefinition>;
export declare function entitlementStatusForSubscription(status: SubscriptionStatus): EntitlementStatus;
export interface ExpandPlanOptions {
    /** Billing status driving the expanded entitlement status. */
    subscriptionStatus?: SubscriptionStatus;
    /** What produced this expansion. Defaults to the plan itself. */
    source?: EntitlementSource;
    /** ISO timestamp stamped onto every expanded record. */
    effectiveFrom?: string;
}
/**
 * Expand a plan into entitlement records.
 *
 * Pure: the same plan and options always produce the same map. Callers replace
 * `teams.metadata.billing.entitlements` with the result and leave `overrides`
 * untouched, so entitlement keys the new plan no longer grants simply disappear.
 */
export declare function expandPlanEntitlements(planCode: PlanCode, options?: ExpandPlanOptions): EntitlementMap;
/** Which map an entitlement decision came from. */
export declare enum EntitlementOrigin {
    OVERRIDE = "override",
    PLAN = "plan"
}
export interface ResolvedEntitlement {
    key: EntitlementKey;
    record: EntitlementRecord;
    origin: EntitlementOrigin;
}
/**
 * Resolve one entitlement for a team, override first.
 *
 * Returns `null` when neither map grants the key, which callers must treat as
 * denied. This is a lookup only: it does not evaluate limits, feature state, or
 * whether the record's effective window has elapsed.
 */
export declare function resolveEntitlement(billing: TeamBillingMetadata | null | undefined, key: EntitlementKey): ResolvedEntitlement | null;
/**
 * Whether a resolved entitlement currently permits new billable use.
 *
 * `past_due` is excluded: reads may still be allowed by the feature evaluator,
 * but new billable writes are not permitted on this status alone.
 */
export declare function isEntitlementUsable(record: EntitlementRecord | null | undefined): boolean;
export declare function isUnlimited(value: EntitlementLimitValue | undefined): value is Unlimited;
//# sourceMappingURL=billing.d.ts.map