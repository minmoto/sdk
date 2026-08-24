/**
 * Time and date formatting utilities
 * Used across all apps for consistent time/date display
 */
/**
 * Convert epoch timestamp to ISO string
 * Automatically detects if timestamp is in seconds, milliseconds, or microseconds
 * @param epoch - Unix timestamp in seconds (10 digits), milliseconds (13 digits), or microseconds (16 digits)
 * @returns ISO 8601 formatted date string
 */
export declare function epochToISOString(epoch: number): string;
/**
 * Convert epoch timestamp to Date object
 * Automatically detects if timestamp is in seconds, milliseconds, or microseconds
 * @param epoch - Unix timestamp in seconds (10 digits), milliseconds (13 digits), or microseconds (16 digits)
 * @returns Date object
 */
export declare function epochToDate(epoch: number): Date;
/**
 * Format epoch timestamp as a localized date string
 * @param epoch - Unix timestamp in seconds or milliseconds
 * @param locale - Locale string (default: 'en-US')
 * @returns Formatted date string (e.g., "11/13/2025")
 */
export declare function formatEpochDate(epoch: number, locale?: string): string;
/**
 * Format epoch timestamp as a localized time string
 * @param epoch - Unix timestamp in seconds or milliseconds
 * @param locale - Locale string (default: 'en-US')
 * @returns Formatted time string (e.g., "5:27 PM")
 */
export declare function formatEpochTime(epoch: number, locale?: string): string;
/**
 * Format epoch timestamp as a localized date and time string
 * @param epoch - Unix timestamp in seconds or milliseconds
 * @param locale - Locale string (default: 'en-US')
 * @returns Formatted date and time string
 */
export declare function formatEpochDateTime(epoch: number, locale?: string): string;
/**
 * Get a relative time description (e.g., "Today", "Yesterday", "2 days ago")
 * @param epoch - Unix timestamp in seconds or milliseconds
 * @returns Relative time string
 */
export declare function getRelativeTime(epoch: number): string;
/**
 * Format epoch timestamp for transaction display
 * Returns date in format: "13 Nov 2025"
 * @param epoch - Unix timestamp in seconds or milliseconds
 * @returns Formatted date string
 */
export declare function formatTransactionDate(epoch: number): string;
/**
 * Format epoch timestamp for date header grouping
 * Returns "Today", "Yesterday", or "13 Nov 2025"
 * @param epoch - Unix timestamp in seconds or milliseconds
 * @returns Formatted date header string
 */
export declare function formatDateHeader(epoch: number): string;
//# sourceMappingURL=time.d.ts.map