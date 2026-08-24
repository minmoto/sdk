import { Currency } from "./currency";
import { PaymentChannel } from "./channels";
/**
 * Type representing currencies that have fiat payment rails (M-Pesa, bank transfer, card).
 * These are the currencies that can be sent/received via traditional payment channels.
 *
 */
export type FiatCurrency = Currency.GBP | Currency.INR | Currency.KES | Currency.MUR | Currency.MWK | Currency.MZN | Currency.NGN | Currency.PKR | Currency.USD | Currency.ZAR;
/**
 * Currencies that are fiat (have fiat payment rails).
 * This is the subset of Currency that can be sent/received via payment channels.
 */
export declare const FIAT_CURRENCIES: readonly FiatCurrency[];
/**
 * Payment channel matrix: maps currencies to their supported payment channels.
 *
 * IMPORTANT:
 * - Supported fiat currencies (KES, USD) map to fiat payment channels (M-Pesa, bank, card)
 * - BTC maps to Bitcoin payment channels (LIGHTNING, ONCHAIN)
 * - USDT is NOT currently supported (empty array) - see note below
 * - UNRECOGNIZED has no supported channels
 *
 * USDT EXCLUSION: USDT is intentionally excluded from payment channel support at this time.
 * While USDT is included in the Currency type for future extensibility, it has no
 * payment channels configured.
 *
 * The matrix is typed as Record<Currency, ...> for backward compatibility.
 */
export declare const CURRENCY_PAYMENT_CHANNELS: Record<Currency, PaymentChannel[]>;
/**
 * Payment channel to currencies mapping.
 * Inverse of CURRENCY_PAYMENT_CHANNELS for validation (e.g. "channel X requires one of these currencies").
 *
 * IMPORTANT: Fiat payment channels (M-Pesa, bank, card) only support fiat currencies.
 * Bitcoin payment channels (LIGHTNING, ONCHAIN) only support BTC.
 */
export declare const PAYMENT_CHANNEL_CURRENCIES: Record<PaymentChannel, Currency[]>;
/**
 * Display metadata for each currency (name, country, symbol).
 * Used for labels and getAgentCountry (e.g. KES → Kenya).
 */
export declare const CURRENCY_DISPLAY: Record<Currency, {
    name: string;
    country?: string;
    symbol?: string;
}>;
/**
 * Get payment channels valid for a currency.
 * Returns empty array if currency is not in the matrix (defensive).
 *
 * Note:
 * - Fiat currencies return fiat payment channels (M-Pesa, bank, card)
 * - BTC returns Bitcoin payment channels (LIGHTNING, ONCHAIN)
 * - UNRECOGNIZED returns []
 */
export declare function getChannelsForCurrency(currency: Currency): PaymentChannel[];
/**
 * Get payment channels valid for a fiat currency.
 * Type-safe version that only accepts FiatCurrency.
 *
 * @param fiat - A fiat currency (KES, USD, or USDT)
 * @returns Array of payment channels supported for this fiat currency
 */
export declare function getChannelsForFiatCurrency(fiat: FiatCurrency): PaymentChannel[];
/**
 * Get currencies valid for a payment channel.
 * Returns empty array if channel is not in the matrix (defensive).
 *
 * Note:
 * - Fiat payment channels return fiat currencies (KES, USD, USDT)
 * - Bitcoin payment channels (LIGHTNING, ONCHAIN) return [BTC]
 */
export declare function getCurrenciesForChannel(channel: PaymentChannel): Currency[];
/**
 * Get fiat currencies valid for a payment channel.
 * Type-safe version that returns FiatCurrency[].
 *
 * @param channel - A payment channel
 * @returns Array of fiat currencies supported by this channel
 */
export declare function getFiatCurrenciesForChannel(channel: PaymentChannel): FiatCurrency[];
/**
 * Check if a (currency, channel) pair is valid.
 * Returns false if either is missing from the matrix (defensive).
 *
 * Note:
 * - Fiat currencies can pair with fiat payment channels
 * - BTC can pair with Bitcoin payment channels (LIGHTNING, ONCHAIN)
 * - UNRECOGNIZED returns false for all channels
 */
export declare function isValidCurrencyChannelPair(currency: Currency, channel: PaymentChannel): boolean;
/**
 * Check if a (fiat currency, channel) pair is valid.
 * Type-safe version that only accepts FiatCurrency.
 *
 * @param fiat - A fiat currency (KES, USD, or USDT)
 * @param channel - A payment channel
 * @returns true if the fiat currency supports this payment channel
 */
export declare function isValidFiatChannelPair(fiat: FiatCurrency, channel: PaymentChannel): boolean;
/**
 * Check if a currency is a fiat currency (has fiat payment rails).
 *
 * @param currency - Any currency
 * @returns true if the currency is in FIAT_CURRENCIES
 */
export declare function isFiatCurrency(currency: Currency): currency is FiatCurrency;
/**
 * Validate that a string value is a valid Currency enum value.
 * Useful for runtime validation of currency values from external sources (APIs, user input, etc.).
 *
 * @param value - String value to validate
 * @returns true if the value is a valid Currency enum value, false otherwise
 *
 * @example
 * ```typescript
 * isValidCurrency("KES") // true
 * isValidCurrency("USD") // true
 * isValidCurrency("INVALID") // false
 * isValidCurrency("") // false
 * ```
 */
export declare function isValidCurrency(value: string): value is Currency;
/**
 * Get fiat currencies that have at least one payment channel.
 * Used for agent currency selection
 *
 * @returns FiatCurrency[] - Currencies that support payment channels (e.g. KES, USD)
 */
export declare function getFiatCurrenciesWithChannels(): FiatCurrency[];
/**
 * Get all currencies that have at least one payment channel.
 * Used for FX default cache preload (bases = these minus bridge currencies).
 * Excludes UNRECOGNIZED so it is not included in FX rates.
 *
 * @returns Currency[] - Currencies that support payment channels (e.g. BTC, KES, USD)
 */
export declare function getCurrenciesWithPaymentChannels(): Currency[];
//# sourceMappingURL=currency-channels.d.ts.map