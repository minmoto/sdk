/**
 * Comprehensive Bitcoin types for the MINMO platform
 * This file consolidates all Bitcoin-related types and interfaces
 */
/**
 * Brand utility type for creating nominal types
 */
type Brand<K, T> = K & {
    __brand: T;
};
/**
 * Bitcoin value types with branding to prevent unit confusion
 */
export type Satoshis = Brand<number, "Satoshis">;
export type MilliSatoshis = Brand<number, "MilliSatoshis">;
export type BitcoinAddress = Brand<string, "BitcoinAddress">;
export type PaymentHash = Brand<string, "PaymentHash">;
export type PaymentPreimage = Brand<string, "PaymentPreimage">;
export type TransactionId = Brand<string, "TransactionId">;
export type FederationId = Brand<string, "FederationId">;
export type GatewayId = Brand<string, "GatewayId">;
/**
 * Supported Bitcoin networks for the MINMO platform
 */
export declare enum BitcoinNetwork {
    MAINNET = "mainnet",
    REGTEST = "regtest"
}
/**
 * Display unit for wallet balance (fiat equivalent, BTC, or satoshis)
 */
export declare enum BalanceUnit {
    FIAT = "fiat",
    BTC = "btc",
    SATS = "sats"
}
export declare const BALANCE_UNIT_CYCLE: BalanceUnit[];
/**
 * Payment status enum for consistent status tracking
 */
export declare enum PaymentStatus {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    COMPLETE = "COMPLETE",
    FAILED = "FAILED",
    EXPIRED = "EXPIRED",
    CANCELLED = "CANCELLED"
}
/**
 * Bitcoin transaction status enum for on-chain transactions
 */
export declare enum BitcoinTransactionStatus {
    PENDING = "PENDING",
    CONFIRMING = "CONFIRMING",
    CONFIRMED = "CONFIRMED",
    FAILED = "FAILED",
    REJECTED = "REJECTED"
}
/**
 * Funding status for on-chain deposits
 */
export declare enum FundingStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    FAILED = "failed"
}
/**
 * Configuration validation results
 */
export interface ConfigurationValidationResults {
    isValid: boolean;
    errors: string[];
    warnings: string[];
}
/**
 * Configuration summary
 */
export interface ConfigurationSummary {
    isValid: boolean;
    errors?: string[];
}
/**
 * Configuration summary (simplified for single provider)
 */
export interface ProviderConfigurationSummary {
    enabled: boolean;
    configured: boolean;
    errors?: string[];
}
/**
 * Validation result (simplified for single provider)
 */
export interface ProviderValidationResult {
    valid: boolean;
    errors: string[];
    warnings?: string[];
}
/**
 * Environment defaults for configuration
 */
export interface EnvironmentDefaults {
    timeout: number;
    maxRetries: number;
    logLevel: "debug" | "info" | "warn" | "error";
}
export interface LightningInvoice {
    invoice: string;
    amount_sats: Satoshis;
    description?: string;
    expiry?: number;
    payment_hash: PaymentHash;
    created_at?: string;
    expires_at?: string;
}
export interface LightningPayment {
    payment_hash: PaymentHash;
    amount_sats: Satoshis;
    fee_sats?: Satoshis;
    status: PaymentStatus;
    preimage?: PaymentPreimage;
    created_at?: string;
    completed_at?: string;
}
export interface LightningPaymentResult {
    payment_hash: PaymentHash;
    amount_sats: Satoshis;
    fee_sats?: Satoshis;
    status: PaymentStatus;
    preimage?: PaymentPreimage;
    error?: string;
    completed_at?: string;
}
export interface BitcoinBalance {
    balance_sats: Satoshis;
}
export interface BitcoinInfo {
    balance: BitcoinBalance;
}
export interface LightningWithdrawalResult {
    txid: TransactionId;
    amount_sats: Satoshis;
    fee_sats: Satoshis;
    status: BitcoinTransactionStatus;
    address: BitcoinAddress;
    confirmations?: number;
    broadcast_at?: string;
}
export interface BitcoinFunding {
    address: BitcoinAddress;
    amount_sats: Satoshis;
    status: FundingStatus;
    txid?: TransactionId | string;
    confirmations?: number;
    required_confirmations?: number;
    created_at?: string;
}
export interface BitcoinTransactionResponse {
    id: string;
    type: "lightning" | "onchain";
    amount_sats: Satoshis;
    fee_sats?: Satoshis;
    status: PaymentStatus | BitcoinTransactionStatus;
    timestamp: string;
    description?: string;
    txid?: TransactionId;
    payment_hash?: PaymentHash;
    confirmations?: number;
}
export interface BitcoinTransactionHistoryResponse {
    transactions: BitcoinTransactionResponse[];
    total: number;
    has_more: boolean;
    page?: number;
    limit?: number;
}
/**
 * Base webhook payload structure
 */
interface BaseWebhookPayload {
    timestamp: string;
    signature?: string;
}
/**
 * Lightning payment received webhook
 */
export interface LightningPaymentReceivedWebhook extends BaseWebhookPayload {
    type: "lightning_payment_received";
    data: {
        payment_hash: PaymentHash;
        invoice: string;
        amount_sats: Satoshis;
        status: PaymentStatus;
        received_at: string;
        description?: string;
    };
}
/**
 * Lightning payment sent webhook
 */
export interface LightningPaymentSentWebhook extends BaseWebhookPayload {
    type: "lightning_payment_sent";
    data: {
        payment_hash: PaymentHash;
        amount_sats: Satoshis;
        fee_sats: Satoshis;
        status: PaymentStatus;
        sent_at: string;
        preimage?: PaymentPreimage;
    };
}
/**
 * Lightning invoice created webhook
 */
export interface LightningInvoiceCreatedWebhook extends BaseWebhookPayload {
    type: "lightning_invoice_created";
    data: {
        payment_hash: PaymentHash;
        invoice: string;
        amount_sats: Satoshis;
        description?: string;
        expiry_secs?: number;
        created_at: string;
        expires_at?: string;
    };
}
/**
 * Lightning invoice paid webhook
 */
export interface LightningInvoicePaidWebhook extends BaseWebhookPayload {
    type: "lightning_invoice_paid";
    data: {
        payment_hash: PaymentHash;
        invoice: string;
        amount_sats: Satoshis;
        status: PaymentStatus;
        paid_at: string;
        description?: string;
        preimage?: PaymentPreimage;
    };
}
/**
 * Lightning invoice expired webhook
 */
export interface LightningInvoiceExpiredWebhook extends BaseWebhookPayload {
    type: "lightning_invoice_expired";
    data: {
        payment_hash: PaymentHash;
        invoice: string;
        amount_sats: Satoshis;
        expired_at: string;
    };
}
/**
 * Lightning withdrawal confirmed webhook
 */
export interface LightningWithdrawalConfirmedWebhook extends BaseWebhookPayload {
    type: "lightning_withdrawal_confirmed";
    data: {
        address: BitcoinAddress;
        amount_sats: Satoshis;
        fee_sats: Satoshis;
        txid: TransactionId;
        confirmations: number;
        status: BitcoinTransactionStatus;
        confirmed_at: string;
    };
}
/**
 * Bitcoin transaction received webhook
 */
export interface BitcoinTransactionReceivedWebhook extends BaseWebhookPayload {
    type: "bitcoin_transaction_received";
    data: {
        address: BitcoinAddress;
        amount_sats: Satoshis;
        txid: TransactionId;
        confirmations: number;
        required_confirmations: number;
        status: BitcoinTransactionStatus;
        received_at: string;
        block_height?: number;
    };
}
/**
 * Bitcoin transaction sent webhook
 */
export interface BitcoinTransactionSentWebhook extends BaseWebhookPayload {
    type: "bitcoin_transaction_sent";
    data: {
        to_address: BitcoinAddress;
        amount_sats: Satoshis;
        fee_sats: Satoshis;
        txid: TransactionId;
        confirmations: number;
        status: BitcoinTransactionStatus;
        sent_at: string;
        block_height?: number;
    };
}
/**
 * Discriminated union type for all webhook payloads
 */
export type LightningWebhookPayload = LightningPaymentReceivedWebhook | LightningPaymentSentWebhook | LightningInvoiceCreatedWebhook | LightningInvoicePaidWebhook | LightningInvoiceExpiredWebhook | LightningWithdrawalConfirmedWebhook | BitcoinTransactionReceivedWebhook | BitcoinTransactionSentWebhook;
/**
 * Bitcoin error details for exceptions
 * This interface allows additional properties for flexibility while providing type safety for common fields
 */
export interface BitcoinErrorDetails {
    operation?: string;
    statusCode?: number;
    originalError?: unknown;
    retryable?: boolean;
    context?: Record<string, unknown>;
    [key: string]: unknown;
}
/**
 * Bitcoin exception payload
 */
export interface BitcoinExceptionPayload {
    message: string;
    code: string;
    details?: BitcoinErrorDetails;
    timestamp: string;
}
export {};
//# sourceMappingURL=bitcoin.d.ts.map