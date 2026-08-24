import type { ConsoleFeatureId } from "./features";
export declare enum AnalyticsDashboardScopeType {
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
export declare enum AnalyticsDashboardChartKind {
    SWAP_ACTIVITY = "swap_activity"
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
    SPEED = "speed",
    SWAP = "swap",
    WALLET = "wallet"
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
export type AnalyticsDashboardChart = {
    id: string;
    featureId: ConsoleFeatureId;
    title: string;
    detail: string;
    kind: AnalyticsDashboardChartKind;
    buckets: AnalyticsActivityBucket[];
};
export type AnalyticsDashboardResponse = {
    scope: {
        type: AnalyticsDashboardScopeType.TEAM;
        teamId: string;
        label: string;
    } | {
        type: AnalyticsDashboardScopeType.SYSTEM;
        label: string;
    };
    enabledFeatures: ConsoleFeatureId[];
    headline: string;
    cards: AnalyticsMetricCard[];
    charts: AnalyticsDashboardChart[];
    generatedAt: string;
};
//# sourceMappingURL=analytics.d.ts.map