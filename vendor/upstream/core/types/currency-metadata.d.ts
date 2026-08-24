import { Currency } from "./currency";
import { type FiatCurrency } from "./currency-channels";
import { type RegionCode } from "google-libphonenumber";
/**
 * Metadata for currency-specific input/display (phone prefix, region, digit length).
 * Used by apps for phone number inputs (e.g. M-Pesa), validation, and formatting.
 */
export interface CurrencyMetadata {
    phonePrefix: string;
    regionCode: RegionCode;
    maxPhoneDigits: number;
}
/**
 * Per-currency metadata for phone/region generated from libphonenumber.
 * Only fiat currencies have entries; crypto/stablecoin/other use default fallbacks.
 */
export declare const CURRENCY_METADATA: Record<FiatCurrency, CurrencyMetadata>;
/**
 * Phone country prefix for a currency (e.g. +254 for KES).
 * Non-fiat currencies fall back to DEFAULT_PHONE_PREFIX.
 * Now powered by libphonenumber for accuracy.
 */
export declare function getPhonePrefixForCurrency(currency: Currency): string;
/**
 * ISO region/country code for a currency (e.g. KE for KES).
 * Non-fiat currencies fall back to DEFAULT_REGION_CODE.
 * Now powered by libphonenumber for accuracy.
 */
export declare function getRegionCodeForCurrency(currency: Currency): RegionCode;
/**
 * Max number of digits for a phone number in that currency's region (e.g. 9 for KES).
 * Non-fiat currencies fall back to DEFAULT_MAX_PHONE_DIGITS.
 */
export declare function getMaxPhoneDigitsForCurrency(currency: Currency): number;
/**
 * Format phone digits with the currency's country prefix.
 * Enhanced with libphonenumber for consistent formatting.
 */
export declare function formatPhoneWithPrefix(phoneDigits: string, currency: Currency): string;
/**
 * Get the country code for libphonenumber operations for a given currency.
 * Returns the ISO country code that can be used with libphonenumber functions.
 */
export declare function getCountryCodeForCurrency(currency: Currency): RegionCode;
//# sourceMappingURL=currency-metadata.d.ts.map