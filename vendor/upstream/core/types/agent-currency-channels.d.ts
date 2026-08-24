/**
 * TODO: Remove legacy format (supportedCurrencies, supportedChannels, paymentDetails)
 * once all clients have migrated to currencyChannels.
 */
import { type Currency } from "./currency";
import { type PaymentChannel, type AgentPaymentDetails, type FiatPaymentFields } from "./channels";
export interface CurrencyChannelConfig {
    channels: PaymentChannel[];
    details: Partial<Record<PaymentChannel, FiatPaymentFields>>;
}
export type CurrencyChannels = Partial<Record<Currency, CurrencyChannelConfig>>;
export interface LegacyAgentPaymentFormat {
    supportedCurrencies: Currency[];
    supportedChannels: PaymentChannel[];
    paymentDetails?: AgentPaymentDetails;
}
export interface AgentWithCurrencyChannels {
    currencyChannels?: CurrencyChannels;
    supportedCurrencies?: Currency[];
    supportedChannels?: PaymentChannel[];
    paymentDetails?: AgentPaymentDetails;
}
export declare function fromLegacyAgentFormat(legacy: LegacyAgentPaymentFormat): CurrencyChannels;
export declare function toLegacyAgentFormat(currencyChannels: CurrencyChannels): LegacyAgentPaymentFormat;
export declare function getSupportedCurrencies(agent: AgentWithCurrencyChannels): Currency[];
export declare function getAgentChannelsForCurrency(agent: AgentWithCurrencyChannels, currency: Currency): PaymentChannel[];
export declare function getDetailsForCurrencyChannel(agent: AgentWithCurrencyChannels, currency: Currency, channel: PaymentChannel): FiatPaymentFields | undefined;
/** @deprecated Use fromLegacyAgentFormat */
export declare const migrateToCurrencyChannels: typeof fromLegacyAgentFormat;
//# sourceMappingURL=agent-currency-channels.d.ts.map