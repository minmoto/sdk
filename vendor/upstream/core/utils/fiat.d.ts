/**
 * Fiat amount conversion between API/storage (smallest unit, e.g. cents)
 * and decimal for display/input.
 * Used across swap, mobile, and console clients.
 */
/**
 * Convert API/storage fiat amount (smallest unit) to decimal for display.
 *
 * @param cents - Amount in smallest unit (string or number from API)
 * @param minorUnitDigits - Number of decimal places (default 2 for cents)
 * @returns Decimal number for display (e.g. 100 for "10000" cents)
 */
export declare function fiatCentsToDecimal(cents: string | number, minorUnitDigits?: number): number;
/**
 * Convert decimal (e.g. user input) to smallest unit for API.
 *
 * @param decimal - Amount in major unit (e.g. 100.50)
 * @param minorUnitDigits - Number of decimal places (default 2)
 * @returns Integer string for API (e.g. "10050")
 */
export declare function fiatDecimalToCents(decimal: number | string, minorUnitDigits?: number): string;
/** Round a smallest-unit fiat amount up to the next whole major unit. */
export declare function roundUpFiatToWhole(cents: string | number, minorUnitDigits?: number): string;
/** Round a major-unit fiat amount upward to a whole amount for display. */
export declare function roundUpFiatAmount(amount: string | number): number;
//# sourceMappingURL=fiat.d.ts.map