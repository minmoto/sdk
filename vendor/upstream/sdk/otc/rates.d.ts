import type { AggregatedFxRateResponse, Currency, FxRateRequest, FxRateResponse, PartnerQuoteResponse, FxHealthResponse, PartnerFxRateSourceConfigResponse, UpdatePartnerFxRateSourcesRequest, SupportedPairsResponse } from "@minmo/core";
import type { HttpClient } from "../http";
export declare class RatesClient {
    private readonly http;
    constructor(http: HttpClient);
    health(): Promise<FxHealthResponse>;
    quote(baseCurrency: Currency, targetCurrency: Currency): Promise<FxRateResponse>;
    get(baseCurrency: Currency, targetCurrency: Currency): Promise<FxRateResponse>;
    detailed(baseCurrency: Currency, targetCurrency: Currency): Promise<AggregatedFxRateResponse>;
    supportedPairs(): Promise<SupportedPairsResponse>;
    /** Fetches the rate policy resolved from a selected agent's partner. */
    quoteForAgent(agentId: string, request: FxRateRequest): Promise<PartnerQuoteResponse>;
    /** Fetches a rate using an explicitly authorized partner context. */
    quoteForPartner(partnerId: string, request: FxRateRequest): Promise<PartnerQuoteResponse>;
    detailedForPartner(partnerId: string, baseCurrency: Currency, targetCurrency: Currency): Promise<AggregatedFxRateResponse>;
    healthForPartner(partnerId: string): Promise<FxHealthResponse>;
    sourceConfigForPartner(partnerId: string): Promise<PartnerFxRateSourceConfigResponse>;
    updateSourceConfigForPartner(partnerId: string, input: UpdatePartnerFxRateSourcesRequest): Promise<PartnerFxRateSourceConfigResponse>;
}
//# sourceMappingURL=rates.d.ts.map