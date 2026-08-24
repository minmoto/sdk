/**
 * Formatting utilities for Bitcoin and currency display
 * Used across all apps for consistent number formatting
 */
import { type Currency } from "../types/currency";
export declare const SATS_PER_BTC = 100000000;
/**
 * Bitcoin display units
 */
export declare enum BitcoinUnit {
    SATS = "sats",
    BTC = "BTC",
    MBTC = "mBTC",// millibitcoin (0.001 BTC)
    UBTC = "\u03BCBTC"
}
/**
 * Number formatting options
 */
export interface FormatOptions {
    /** Whether to include the unit suffix */
    includeUnit?: boolean;
    /** Maximum number of decimal places */
    maxDecimals?: number;
    /** Minimum number of decimal places */
    minDecimals?: number;
    /** Whether to use compact notation for large numbers */
    compact?: boolean;
    /** Locale for number formatting */
    locale?: string;
}
/**
 * Format satoshis in a human-readable way
 * Default format: shows in sats with thousand separators
 *
 * NOTE: When compact=true (default) and amount >= 10M sats (0.1 BTC),
 * this automatically switches to BTC format by calling formatBitcoin()
 *
 * @param satoshis - Amount in satoshis
 * @param options - Formatting options
 * @returns Formatted string (e.g., "1,000 sats" or "0.1 BTC" if large)
 */
export declare function formatSatoshis(satoshis: number | string, options?: FormatOptions): string;
/**
 * Format satoshis as BTC with appropriate decimal places
 *
 * NOTE: Despite the name, this function takes SATOSHIS as input (not BTC)
 * and converts them to BTC for display
 *
 * @param satoshis - Amount in SATOSHIS (will be converted to BTC)
 * @param options - Formatting options
 * @returns Formatted string in BTC (e.g., "0.001 BTC")
 */
export declare function formatBitcoin(satoshis: number | string, options?: FormatOptions): string;
/**
 * Smart format that chooses the best unit based on the amount
 */
export declare function formatBitcoinSmart(satoshis: number | string, options?: FormatOptions): string;
/** Format an exchange rate as fiat per bitcoin or sats per fiat unit. */
export declare function formatExchangeRate(rate: number, fiatCurrency: Currency, options?: {
    asSats?: boolean;
}): string;
/**
 * Format fiat currency amounts
 */
export declare function formatFiatCurrency(amount: number | string, currency: Currency | string, options?: FormatOptions): string;
/**
 * Format percentage values
 */
export declare function formatPercentage(value: number, options?: FormatOptions): string;
/**
 * Format large numbers with appropriate suffixes (K, M, B)
 */
export declare function formatCompactNumber(value: number | string, options?: FormatOptions): string;
/**
 * Convert basis points to percentage
 */
export declare function basisPointsToPercentage(basisPoints: number): number;
/**
 * Parse satoshi amount from various input formats
 *
 * WARNING: This function has implicit conversion logic that may be confusing:
 * - If input is a number, it just floors it (assumes already in sats)
 * - If input is a string with a decimal point AND value < 100, it assumes BTC and converts to sats
 * - Otherwise, it treats the string as satoshis
 *
 * Consider using explicit conversion functions (btcToSatoshis/satoshisToBtc) instead
 *
 * @param input - String or number to parse
 * @returns Amount in satoshis
 * @example parseSatoshis(0.001) // returns 0 (floors the number)
 * @example parseSatoshis("0.001") // returns 100000 (interprets as BTC)
 * @example parseSatoshis("1000") // returns 1000 (interprets as sats)
 */
export declare function parseSatoshis(input: string | number): number;
/**
 * Format transaction limits for display
 */
export declare function formatTransactionLimit(satoshis: number | string, options?: FormatOptions): string;
//# sourceMappingURL=formatting.d.ts.map