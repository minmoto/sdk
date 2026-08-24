/**
 * Type-safe amount handling to prevent currency conversion bugs
 *
 * Key principles:
 * - DecimalAmount: Human-readable format (e.g., "100.00")
 * - SmallestUnitAmount: Blockchain/database format (e.g., 10000n for $100.00)
 * - Branded types prevent accidental mixing of formats
 * - Single source of truth: only backend converts to smallest units
 */
import { Currency } from "./currency";
/**
 * Decimal amount string representation (e.g., "100.00", "0.5", "1250.75")
 * Always use this format when sending amounts to APIs or displaying to users
 */
export type DecimalAmount = string & {
    __brand: "DecimalAmount";
};
/**
 * Amount in smallest currency unit as bigint (e.g., cents, satoshis, cents)
 * Used internally by backend services and database storage
 */
export type SmallestUnitAmount = bigint & {
    __brand: "SmallestUnit";
};
/**
 * Currency amount with explicit currency and decimal format
 * Use this interface for API requests and responses
 */
export interface CurrencyAmount {
    currency: Currency;
    amount: DecimalAmount;
}
/**
 * Amount validation result
 */
export interface AmountValidation {
    isValid: boolean;
    error?: string;
    normalizedAmount?: DecimalAmount;
}
/**
 * Create a validated decimal amount from string input
 * @param value - String representation of amount
 * @returns Branded DecimalAmount type
 * @throws Error if format is invalid
 */
export declare const createDecimalAmount: (value: string) => DecimalAmount;
/**
 * Validate decimal amount format
 * @param value - String to validate
 * @returns true if valid decimal format
 */
export declare const isValidDecimalAmount: (value: string) => boolean;
/**
 * Validate and normalize decimal amount
 * @param value - Input amount string
 * @returns Validation result with normalized amount
 */
export declare const validateAndNormalizeAmount: (value: string) => AmountValidation;
/**
 * Detect potentially suspicious amounts that may indicate double conversion
 * @param amount - Decimal amount to check
 * @param currency - Currency type
 * @returns true if amount seems suspiciously large
 */
export declare const isSuspiciousAmount: (amount: DecimalAmount, currency: Currency) => boolean;
/**
 * Format decimal amount for display with appropriate precision
 * @param amount - Decimal amount to format
 * @param currency - Currency type for formatting rules
 * @returns Formatted string for display
 */
export declare const formatDecimalAmount: (amount: DecimalAmount, currency: Currency) => string;
/**
 * Convert between amount formats (for utility functions only)
 * Note: Only use these in controlled scenarios - prefer DecimalAmount for API communication
 */
export declare const amountUtils: {
    /**
     * Extract numeric value from DecimalAmount (use with caution)
     */
    toNumber: (amount: DecimalAmount) => number;
    /**
     * Create DecimalAmount from number (use with caution)
     */
    fromNumber: (value: number) => DecimalAmount;
};
//# sourceMappingURL=amounts.d.ts.map