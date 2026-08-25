/**
 * Minmo Pay contracts shared by the API, the console, and the Minmo SDK.
 *
 * Minmo Pay lets a Partner accept Bitcoin through BTCPay Server without holding
 * BTCPay credentials. These types describe what crosses the API boundary; the
 * credentials Minmo uses to talk to BTCPay never appear here.
 */
/** Readiness state shown by the existing Minmo Pay store status indicator. */
export declare enum PayStoreStatus {
    /** The store exists in BTCPay but no wallet is connected yet. */
    CREATED = "created",
    /** Store setup is healthy and a Minmo wallet is connected. */
    CONNECTED = "connected",
    /** Store setup needs attention; inspect `failureReason` for the cause. */
    FAILED = "failed"
}
/** Stable machine-readable errors returned by Minmo Pay endpoints. */
export declare enum PayErrorCode {
    PARTNER_SCOPE_REQUIRED = "pay_partner_scope_required",
    STORE_NOT_FOUND = "pay_store_not_found",
    STORE_NOT_CONNECTED = "pay_store_not_connected",
    INVOICE_NOT_FOUND = "pay_invoice_not_found",
    IDEMPOTENCY_KEY_INVALID = "pay_idempotency_key_invalid",
    IDEMPOTENCY_CONFLICT = "pay_idempotency_conflict",
    PROVIDER_UNAVAILABLE = "pay_provider_unavailable",
    PROVIDER_REJECTED = "pay_provider_rejected",
    PERSISTENCE_FAILED = "pay_persistence_failed",
    WALLET_CONNECTION_FAILED = "pay_wallet_connection_failed",
    WALLET_ROTATION_UNAVAILABLE = "pay_wallet_rotation_unavailable",
    WALLET_NOT_FOUND = "pay_wallet_not_found",
    WALLET_UNAVAILABLE = "pay_wallet_unavailable"
}
/**
 * A payment method BTCPay reports for a store.
 *
 * BTCPay also returns a `config` for each method. It is deliberately absent
 * here: for `BTC-LN` that config carries the wallet connection string, which
 * is a live credential against the Partner's wallet and must not leave the API.
 */
export interface PayStorePaymentMethod {
    /** For example `BTC-LN` or `BTC-CHAIN`. */
    paymentMethodId: string;
    enabled: boolean;
}
/** What BTCPay currently reports about a store. */
export interface PayStoreLiveState {
    exists: boolean;
    name?: string;
    paymentMethods: PayStorePaymentMethod[];
}
/** A Minmo Pay store as returned by the API. */
export interface PayStore {
    /** Identifier of the store in BTCPay. */
    storeId: string;
    name: string;
    /** Wallet this store settles into; unset until one is connected. */
    walletId?: string | null;
    status: PayStoreStatus;
    /** Payment method Minmo configured, for example `BTC-LN`. */
    paymentMethodId?: string | null;
    /** Wallet connection backing the payment method. An id, never the token. */
    walletConnectionId?: string | null;
    failureReason?: string | null;
    createdAt: string;
    updatedAt: string;
    /**
     * Live BTCPay state, joined onto the stored record so drift between the two
     * is visible. Null when BTCPay could not be reached.
     */
    live?: PayStoreLiveState | null;
    /** Why BTCPay could not be read, when `live` is null. */
    liveError?: string;
}
export interface CreatePayStoreRequest {
    name: string;
    defaultCurrency?: string;
    website?: string;
    supportUrl?: string;
    brandColor?: string;
}
export interface ConnectPayWalletRequest {
    walletId: string;
}
export interface PayStoreListResponse {
    items: PayStore[];
}
export interface PayStoreResponse {
    store: PayStore;
}
/**
 * Lifecycle of a Minmo Pay invoice.
 *
 * `PROCESSING` means the payment was seen and is confirming. It is not
 * success: only `SETTLED` means the funds are the partner's.
 */
export declare enum PayInvoiceStatus {
    /** Awaiting payment. */
    NEW = "new",
    /** Payment received and confirming. Not yet final. */
    PROCESSING = "processing",
    /** Confirmed. The payment is complete. */
    SETTLED = "settled",
    /** The invoice expired before it was paid. */
    EXPIRED = "expired",
    /** The invoice can no longer be settled. */
    INVALID = "invalid"
}
/** Qualifier explaining how an invoice reached its status. */
export declare enum PayInvoiceDetail {
    NONE = "none",
    /** Paid after expiry. */
    PAID_LATE = "paid_late",
    /** Paid more than the amount due. */
    PAID_OVER = "paid_over",
    /** Paid less than the amount due. */
    PAID_PARTIAL = "paid_partial",
    /** Status was set manually rather than observed. */
    MARKED = "marked"
}
/** A Minmo Pay invoice as returned by the API. */
export interface PayInvoice {
    invoiceId: string;
    /** Store the invoice was raised against. */
    storeId: string;
    amount: string;
    currency: string;
    status: PayInvoiceStatus;
    detail: PayInvoiceDetail;
    /** Amount received so far, in the invoice currency. */
    paidAmount?: string;
    /** Hosted checkout page to send the customer to. */
    checkoutUrl?: string;
    /** Raw BOLT11 payment request for a direct Lightning payment. */
    lightningInvoice?: string;
    /** Bitcoin address for a direct on-chain payment. */
    onChainAddress?: string;
    /** The partner's own reference, echoed back. */
    reference?: string | null;
    createdAt?: string;
    expiresAt?: string;
}
export interface CreatePayInvoiceRequest {
    /** Decimal string in `currency`, for example "1500.00". */
    amount: string;
    currency: string;
    /** The partner's order or reference id. */
    reference?: string;
    description?: string;
    /** How long the customer has to pay. */
    expirationMinutes?: number;
}
export interface PayInvoiceResponse {
    invoice: PayInvoice;
}
//# sourceMappingURL=pay.d.ts.map