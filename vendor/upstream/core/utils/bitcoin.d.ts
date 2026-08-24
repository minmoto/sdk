/**
 * Bitcoin utility functions, type guards, and validators
 */
import { type Satoshis, type MilliSatoshis, type BitcoinAddress, type PaymentHash, type PaymentPreimage, type TransactionId, BitcoinNetwork, PaymentStatus, BitcoinTransactionStatus, type LightningWebhookPayload, type LightningPaymentReceivedWebhook, type LightningPaymentSentWebhook, type LightningInvoiceCreatedWebhook, type LightningInvoicePaidWebhook, type LightningInvoiceExpiredWebhook, type LightningWithdrawalConfirmedWebhook, type BitcoinTransactionReceivedWebhook, type BitcoinTransactionSentWebhook } from "../types/bitcoin";
/**
 * Supported Bitcoin networks configuration
 */
export declare const SUPPORTED_NETWORKS: readonly [BitcoinNetwork.MAINNET, BitcoinNetwork.REGTEST];
/**
 * Network-specific configuration for address prefixes and invoice prefixes
 */
export declare const NETWORK_CONFIG: {
    readonly mainnet: {
        readonly invoicePrefix: "lnbc";
        readonly bech32Prefix: "bc1";
        readonly name: "mainnet";
    };
    readonly regtest: {
        readonly invoicePrefix: "lnbcrt";
        readonly bech32Prefix: "bcrt1";
        readonly name: "regtest";
    };
};
/**
 * Get the default network for callers that do not have a wallet-scoped network.
 */
export declare function getCurrentNetwork(): BitcoinNetwork;
/**
 * Check if a value is a valid Satoshi amount
 */
export declare function isSatoshis(value: unknown): value is Satoshis;
/**
 * Check if a value is a valid MilliSatoshi amount
 */
export declare function isMilliSatoshis(value: unknown): value is MilliSatoshis;
/**
 * Check if a string is a valid Bitcoin address format for supported networks
 */
export declare function isBitcoinAddress(value: unknown, network?: BitcoinNetwork): value is BitcoinAddress;
/**
 * Check if a string is a valid payment hash
 * A payment hash is a 32-byte value represented as a 64-character hexadecimal string
 * @param value - The value to check
 * @returns true if the value is a valid payment hash format
 */
export declare function isPaymentHash(value: unknown): value is PaymentHash;
/**
 * Check if a string is a valid payment preimage
 */
export declare function isPaymentPreimage(value: unknown): value is PaymentPreimage;
/**
 * Check if a string is a valid transaction ID
 */
export declare function isTransactionId(value: unknown): value is TransactionId;
/**
 * Check if a value is a valid PaymentStatus
 */
export declare function isPaymentStatus(value: unknown): value is PaymentStatus;
/**
 * Check if a value is a valid TransactionStatus
 */
export declare function isTransactionStatus(value: unknown): value is BitcoinTransactionStatus;
/**
 * Type guard for LightningPaymentReceivedWebhook
 */
export declare function isPaymentReceivedWebhook(payload: LightningWebhookPayload): payload is LightningPaymentReceivedWebhook;
/**
 * Type guard for LightningPaymentSentWebhook
 */
export declare function isPaymentSentWebhook(payload: LightningWebhookPayload): payload is LightningPaymentSentWebhook;
/**
 * Type guard for LightningInvoiceCreatedWebhook
 */
export declare function isInvoiceCreatedWebhook(payload: LightningWebhookPayload): payload is LightningInvoiceCreatedWebhook;
/**
 * Type guard for LightningInvoicePaidWebhook
 */
export declare function isInvoicePaidWebhook(payload: LightningWebhookPayload): payload is LightningInvoicePaidWebhook;
/**
 * Type guard for LightningInvoiceExpiredWebhook
 */
export declare function isInvoiceExpiredWebhook(payload: LightningWebhookPayload): payload is LightningInvoiceExpiredWebhook;
/**
 * Type guard for LightningWithdrawalConfirmedWebhook
 */
export declare function isWithdrawalConfirmedWebhook(payload: LightningWebhookPayload): payload is LightningWithdrawalConfirmedWebhook;
/**
 * Type guard for BitcoinTransactionReceivedWebhook
 */
export declare function isBitcoinTransactionReceivedWebhook(payload: LightningWebhookPayload): payload is BitcoinTransactionReceivedWebhook;
/**
 * Type guard for BitcoinTransactionSentWebhook
 */
export declare function isBitcoinTransactionSentWebhook(payload: LightningWebhookPayload): payload is BitcoinTransactionSentWebhook;
/**
 * Convert Satoshis to MilliSatoshis
 */
export declare function satoshisToMilliSatoshis(sats: Satoshis): MilliSatoshis;
/**
 * Convert MilliSatoshis to Satoshis
 */
export declare function milliSatoshisToSatoshis(msats: MilliSatoshis): Satoshis;
/**
 * Convert Satoshis to Bitcoin
 *
 * Accepts branded Satoshis, number, or string. Returns 0 for invalid strings.
 */
export declare function satoshisToBitcoin(sats: Satoshis | number | string): number;
/**
 * Convert Bitcoin to Satoshis
 *
 * Accepts number or string. Returns 0 as Satoshis for invalid strings.
 */
export declare function bitcoinToSatoshis(btc: number | string): Satoshis;
/**
 * Create a branded Satoshis value
 */
export declare function asSatoshis(value: number): Satoshis;
/**
 * Create a branded MilliSatoshis value
 */
export declare function asMilliSatoshis(value: number): MilliSatoshis;
/**
 * Create a branded BitcoinAddress value
 */
export declare function asBitcoinAddress(value: string): BitcoinAddress;
/**
 * Create a branded PaymentHash value
 * @param value - A 32-byte hex string (64 characters) representing a payment hash
 * @throws {Error} If the value is not a valid payment hash format
 */
export declare function asPaymentHash(value: string): PaymentHash;
/**
 * Create a branded PaymentPreimage value
 */
export declare function asPaymentPreimage(value: string): PaymentPreimage;
/**
 * Create a branded TransactionId value
 */
export declare function asTransactionId(value: string): TransactionId;
/**
 * Validate Lightning invoice format for supported networks
 */
export declare function isLightningInvoice(invoice: string, network?: BitcoinNetwork): boolean;
/**
 * Detect the Bitcoin network from a Lightning invoice
 */
export declare function detectNetworkFromInvoice(invoice: string): BitcoinNetwork | null;
/**
 * Detect the Bitcoin network from a Bitcoin address
 */
export declare function detectNetworkFromAddress(address: string): BitcoinNetwork | null;
/**
 * Format satoshis for display (Bitcoin utility version)
 */
export declare function formatSatoshisValue(sats: Satoshis, includeUnit?: boolean): string;
/**
 * Format Bitcoin amount for display (Bitcoin utility version)
 */
export declare function formatBitcoinValue(btc: number, decimals?: number): string;
/**
 * Parse amount string to Satoshis
 */
export declare function parseAmountToSatoshis(amount: string, unit?: "sats" | "btc"): Satoshis;
/**
 * Check if a payment is in a final state
 */
export declare function isPaymentFinal(status: PaymentStatus): boolean;
/**
 * Check if a transaction is confirmed
 */
export declare function isTransactionConfirmed(status: BitcoinTransactionStatus): boolean;
/**
 * Create a Bitcoin-specific error with context
 */
export declare class BitcoinError extends Error {
    readonly code: string;
    readonly details?: Record<string, unknown> | undefined;
    constructor(message: string, code: string, details?: Record<string, unknown> | undefined);
}
/**
 * Check if an error is retryable
 */
export declare function isRetryableError(error: unknown): boolean;
/**
 * Extract amount from a Lightning invoice using BOLT11 format
 * Based on the parsing logic from mini API service
 * @param invoice - Lightning invoice string
 * @returns Amount in millisatoshis
 */
export declare function extractAmountFromInvoice(invoice: string): number;
//# sourceMappingURL=bitcoin.d.ts.map