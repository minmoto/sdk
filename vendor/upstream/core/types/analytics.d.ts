import type { ConsoleFeatureId, FeatureAvailabilityState } from "./features";
export declare enum AnalyticsScopeType {
    TEAM = "team",
    SYSTEM = "system"
}
export declare enum AnalyticsBucket {
    DAY = "day",
    WEEK = "week",
    MONTH = "month",
    YEAR = "year",
    ALL = "all"
}
export declare enum AnalyticsChartKind {
    SWAP_ACTIVITY = "swap_activity",
    ESCROW_ACTIVITY = "escrow_activity"
}
export declare enum AnalyticsMetricCardTone {
    PRIMARY = "primary",
    SECONDARY = "secondary",
    SUCCESS = "success",
    INFO = "info",
    WARNING = "warning"
}
export declare enum AnalyticsMetricCardIcon {
    BITCOIN = "bitcoin",
    CHECK = "check",
    GROUPS = "groups",
    KEY = "key",
    RECEIPT = "receipt",
    SPEED = "speed",
    STORE = "store",
    SWAP = "swap",
    WALLET = "wallet",
    WARNING = "warning"
}
export declare enum AnalyticsMetricCardAmountUnit {
    TEAM_CURRENCY = "team_currency",
    BTC = "btc",
    SATS = "sats"
}
export type AnalyticsMetricCardAmount = {
    sats: string;
    signed?: boolean;
    defaultUnit?: AnalyticsMetricCardAmountUnit;
};
export type AnalyticsMetricCard = {
    id: string;
    featureId: ConsoleFeatureId;
    title: string;
    value: string;
    detail: string;
    icon: AnalyticsMetricCardIcon;
    tone: AnalyticsMetricCardTone;
    amount?: AnalyticsMetricCardAmount;
};
export type AnalyticsActivityBucket = {
    periodStart: string;
    label: string;
    onramp: number;
    offramp: number;
    total: number;
};
export type AnalyticsEscrowActivityBucket = {
    periodStart: string;
    label: string;
    activity: {
        released: number;
        refunded: number;
        expired: number;
        total: number;
    };
    fees: {
        earningsSats: string;
        overageSats: string;
        netEarningsSats: string;
    };
};
type AnalyticsChartBase = {
    id: string;
    featureId: ConsoleFeatureId;
    title: string;
    detail: string;
};
export type AnalyticsSwapActivityChart = AnalyticsChartBase & {
    kind: AnalyticsChartKind.SWAP_ACTIVITY;
    buckets: AnalyticsActivityBucket[];
};
export type AnalyticsEscrowActivityChart = AnalyticsChartBase & {
    kind: AnalyticsChartKind.ESCROW_ACTIVITY;
    buckets: AnalyticsEscrowActivityBucket[];
};
export type AnalyticsChart = AnalyticsSwapActivityChart | AnalyticsEscrowActivityChart;
export type AnalyticsResponse = {
    scope: {
        type: AnalyticsScopeType.TEAM;
        teamId: string;
        label: string;
    } | {
        type: AnalyticsScopeType.SYSTEM;
        label: string;
    };
    enabledFeatures: ConsoleFeatureId[];
    headline: string;
    cards: AnalyticsMetricCard[];
    charts: AnalyticsChart[];
    generatedAt: string;
};
export declare enum PartnerOverviewReadinessStatus {
    READY = "ready",
    SETUP_REQUIRED = "setup_required",
    NEEDS_ATTENTION = "needs_attention"
}
export declare enum PartnerOverviewAttentionSeverity {
    INFO = "info",
    WARNING = "warning",
    ERROR = "error"
}
export type PartnerOverviewFeature = {
    featureId: ConsoleFeatureId;
    label: string;
    description?: string;
    state: FeatureAvailabilityState;
    status: PartnerOverviewReadinessStatus;
    detail: string;
};
export type PartnerOverviewAttentionItem = {
    id: string;
    featureId: ConsoleFeatureId;
    severity: PartnerOverviewAttentionSeverity;
    title: string;
    detail: string;
};
export type PartnerOverviewResponse = {
    partner: {
        id: string;
        label: string;
    };
    features: PartnerOverviewFeature[];
    attention: PartnerOverviewAttentionItem[];
    generatedAt: string;
};
export {};
//# sourceMappingURL=analytics.d.ts.map