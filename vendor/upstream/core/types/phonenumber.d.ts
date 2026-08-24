import { type Currency } from "./currency";
/**
 * Phone number utilities powered by Google's libphonenumber library.
 * Provides validation, formatting, and length checking for international phone numbers.
 */
/**
 * Get the expected phone number length for a specific currency/country.
 * Uses actual phone number input to determine the correct length dynamically.
 *
 * @param phoneNumber - Complete phone number with country code
 * @param currency - The currency/country for length determination
 * @returns Expected length of the phone number (digits only)
 */
export declare function getPhoneNumberLengthForCurrency(_phoneNumber: string, currency: Currency): number;
/**
 * Validate a phone number for a specific currency/country.
 *
 * @param phoneNumber - Complete phone number with country code
 * @param currency - The currency/country for validation context
 * @returns true if the phone number is valid for the given currency
 */
export declare function validatePhoneNumberForCurrency(phoneNumber: string, currency: Currency): boolean;
/**
 * Format a phone number using AsYouType formatter for real-time formatting.
 * This provides progressive formatting as users type.
 *
 * @param phoneDigits - Phone number digits (can include country code)
 * @param currency - The currency/country for formatting context
 * @returns Formatted phone number as the user types
 */
export declare function formatPhoneNumberAsYouType(phoneDigits: string, currency: Currency): string;
/**
 * Get a formatted phone number using formatInOriginalFormat for display purposes.
 * This is useful when you have a complete phone number and want to show it formatted.
 *
 * @param phoneNumber - Complete phone number with country code
 * @param currency - The currency/country for parsing context
 * @returns Formatted phone number in original format
 */
export declare function formatCompletePhoneNumber(phoneNumber: string, currency: Currency): string;
/**
 * Check if a phone number would be too long before validation.
 * This provides early detection to prevent unnecessary processing.
 *
 * @param phoneNumber - Phone number to check
 * @param currency - Currency for length context
 * @returns true if the number is likely too long
 */
export declare function isPhoneNumberTooLong(phoneNumber: string, currency: Currency): boolean;
/**
 * Enhanced phone number validation that provides detailed feedback including excess digits detection.
 * Uses google-libphonenumber's comprehensive validation.
 *
 * @param phoneNumber - Complete phone number with country code
 * @param currency - The currency/country for validation context
 * @returns Detailed validation result with specific feedback
 */
export declare function validatePhoneNumberWithDetails(phoneNumber: string, currency: Currency): {
    isValid: boolean;
    reason: "VALID" | "TOO_SHORT" | "TOO_LONG" | "INVALID_FORMAT" | "INVALID_COUNTRY_CODE" | "NOT_A_NUMBER";
    suggestedNumber?: string;
    maxRecommendedLength?: number;
};
/**
 * Smart phone number truncation that removes excess digits while preserving valid format.
 * Uses google-libphonenumber to determine the correct length for the country.
 *
 * @param phoneNumber - Phone number that might have excess digits
 * @param currency - The currency/country for length determination
 * @returns Truncated phone number or original if already valid
 */
export declare function truncateExcessDigits(phoneNumber: string, currency: Currency): string;
/**
 * Strip the national direct dialling prefix from a national-format number.
 *
 * Numbers are commonly written in national form with a trunk prefix — a
 * Malawian TNM line is printed as 0881234567, not 881234567 — but E.164
 * national significant numbers never carry it. Combining the raw input with a
 * country calling code therefore yields a spurious digit (+2650881234567).
 *
 * The prefix is looked up per country rather than assumed: most markets here
 * use "0", the US uses "1", and Mozambique has none at all.
 *
 * @param nationalNumber - Digits as typed, without a country calling code
 * @param currency - The currency/country supplying the dialling rules
 * @returns The national significant number, trunk prefix removed
 *
 * @example
 * stripNationalPrefixForCurrency("0881234567", Currency.MWK) // "881234567"
 * stripNationalPrefixForCurrency("881234567", Currency.MWK)  // "881234567"
 */
export declare function stripNationalPrefixForCurrency(nationalNumber: string, currency: Currency): string;
/**
 * Build an international (E.164-shaped) number from whatever the user typed.
 *
 * Accepts national form (0881234567), bare national significant digits
 * (881234567), and international form with or without a leading "+"
 * (+265881234567 / 265881234567), normalising the trunk prefix in each case.
 *
 * Tolerates incomplete input so it can be called on every keystroke; the result
 * is only guaranteed well-formed once the user has typed a complete number.
 *
 * @param input - Raw user input, any format
 * @param currency - The currency/country supplying the dialling rules
 * @returns Number in "+<country code><national>" form, or "" for empty input
 */
export declare function toInternationalFormat(input: string, currency: Currency): string;
//# sourceMappingURL=phonenumber.d.ts.map