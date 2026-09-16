import type { Currency, CurrencyPair } from "./currency";
import type { SwapType } from "./agent";
export declare enum FxRateScope {
    PARTNER = "partner",
    SYSTEM = "system"
}
export interface FxRate {
    /** Currency being priced, for example BTC. */
    baseCurrency: Currency;
    /** Currency in which the base value is expressed, for example KES. */
    targetCurrency: Currency;
    /** Units of targetCurrency equivalent to one unit of baseCurrency. */
    rate: number;
    /** Time at which the source produced or validated this rate. */
    timestamp: Date;
    /** Identifier of the provider or aggregation policy that produced it. */
    source: string;
}
export interface FxRateRequest {
    baseCurrency: Currency;
    targetCurrency: Currency;
    amount?: string;
    type?: SwapType;
}
export interface FxRateSource {
    getName(): string;
    isEnabled(): boolean;
    getSupportedPairs(): CurrencyPair[];
    getRate(baseCurrency: Currency, targetCurrency: Currency): Promise<FxRate | null>;
    healthCheck(): Promise<boolean>;
}
export interface FxSourceSnapshot {
    source: string;
    rate: number;
    timestamp: Date;
}
export interface AggregatedFxRate extends FxRate {
    sources: FxSourceSnapshot[];
    confidence: number;
}
export interface CachedFxRate {
    rate: number;
    timestamp: string;
    source: string;
    confidence?: number;
}
export declare enum FxRateProvider {
    CURRENCY_API = "currency_api",
    COINGECKO = "coingecko",
    CUSTOM_RATES = "custom_rates"
}
export interface FxRateSourceConfig {
    enabled: boolean;
    weight: number;
    timeout?: number;
    fallback?: boolean;
}
export interface FxRateSourceConfigs {
    [FxRateProvider.CURRENCY_API]: FxRateSourceConfig;
    [FxRateProvider.COINGECKO]: FxRateSourceConfig;
    [FxRateProvider.CUSTOM_RATES]: FxRateSourceConfig;
}
export interface FxRateSourceConfigPatch {
    enabled?: boolean;
    weight?: number;
}
export interface FxRateResponse {
    baseCurrency: Currency;
    targetCurrency: Currency;
    rate: number;
    timestamp: string;
    source: string;
    confidence?: number;
}
export interface AggregatedFxRateResponse extends FxRateResponse {
    sources: {
        source: string;
        rate: number;
        timestamp: string;
    }[];
}
export interface SupportedPairsResponse {
    pairs: string[];
}
export interface SourceHealthStatus {
    status: string;
    lastUpdate?: string;
    error?: string;
    responseTime?: number;
    enabled: boolean;
    weight?: number;
}
export interface FxHealthResponse {
    healthy: boolean;
    sources: Record<string, SourceHealthStatus>;
}
export interface PartnerCustomRateEntry {
    rate: number;
    expiresAt?: string;
    updatedAt?: string;
    updatedBy?: string;
}
export interface PartnerCustomRatesConfig {
    rates?: Partial<Record<Currency, PartnerCustomRateEntry>>;
}
export interface UpdatePartnerFxRateSourcesRequest {
    sources: Partial<Record<FxRateProvider, FxRateSourceConfigPatch>>;
    custom_rates?: PartnerCustomRatesConfig | null;
}
export interface PartnerFxRateSourceConfigResponse {
    partnerId: string;
    sources: FxRateSourceConfigs;
    defaults: FxRateSourceConfigs;
    custom_rates: PartnerCustomRatesConfig | null;
}
export interface PartnerCurrencySettings {
    supported_currencies: Currency[];
    display_currency: Currency;
}
export declare enum FxRateErrorType {
    RATE_LIMITING = "RATE_LIMITING",
    SOURCE_UNAVAILABLE = "SOURCE_UNAVAILABLE",
    CACHE_MISS = "CACHE_MISS",
    TEMPORARY_FAILURE = "TEMPORARY_FAILURE",
    CURRENCY_NOT_SUPPORTED = "CURRENCY_NOT_SUPPORTED"
}
export interface FxRateErrorPayload {
    type: FxRateErrorType;
    baseCurrency: Currency;
    targetCurrency: Currency;
    message?: string;
}
export interface PartnerRateResponse {
    partnerId: string;
    agentId?: string;
    /** The resolved FX rate and its source/timestamp metadata. */
    fxRate: FxRate;
    /** Describes whether the team policy or the global market supplied the rate. */
    coverage: PartnerRateCoverage;
    expiresAt?: string;
    policyVersion?: string;
}
export declare enum PartnerRateResolution {
    TEAM_CONFIGURED = "team_configured",
    GLOBAL_FALLBACK = "global_fallback"
}
export declare enum PartnerRateFallbackReason {
    TEAM_CURRENCY_UNSUPPORTED = "team_currency_unsupported",
    TEAM_RATE_UNAVAILABLE = "team_rate_unavailable"
}
export interface PartnerRateCoverage {
    resolution: PartnerRateResolution;
    configuredForTeam: boolean;
    fallbackReason?: PartnerRateFallbackReason;
}
export interface PartnerQuoteFeeBreakdown {
    teamId: string;
    descriptorId: string;
    enabled: boolean;
    policyVersion: number;
    agentMarginBps: number;
    escrowFeeBps: number;
    escrowFeeSats: string;
    payoutNetworkFeeSats: string;
    principalSats: string;
    receiverPayoutSats: string;
    minimumSats?: string;
    maximumSats?: string;
    /** Network fees remain estimates until the final payout destination is known. */
    estimated: boolean;
}
export interface PartnerQuoteResponse extends PartnerRateResponse {
    quoteId: string;
    inputAmount?: string;
    outputAmount?: string;
    fees?: PartnerQuoteFeeBreakdown;
}
//# sourceMappingURL=rates.d.ts.map