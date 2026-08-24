import { type Currency } from "./currency";
/** TransactionStatus: Enum representing the possible statuses of a transaction. */
export declare enum TransactionState {
    Pending = "PENDING",
    Processing = "PROCESSING",
    Retry = "RETRY",
    Failed = "FAILED",
    Complete = "COMPLETE",
    Cancelled = "CANCELLED"
}
/** Agent selection mode for swap transactions */
export declare enum AgentSelectionMode {
    DIRECT = "direct",
    AUTO = "auto"
}
/** Dispute resolution outcomes */
export declare enum DisputeResolution {
    RELEASE_TO_USER = "release_to_user",
    RELEASE_TO_AGENT = "release_to_agent",
    PARTIAL_SETTLEMENT = "partial_settlement",
    FULL_REFUND = "full_refund"
}
/** Payment confirmation roles */
export declare enum ConfirmationRole {
    USER = "user",
    AGENT = "agent"
}
/** Entity types for swap participants */
export declare enum EntityType {
    USER = "user",
    AGENT = "agent"
}
/** Environment types for configuration */
export declare enum Environment {
    SANDBOX = "sandbox",
    PRODUCTION = "production"
}
/** Service status states */
export declare enum ServiceStatus {
    ACTIVE = "active",
    DEPRECATED = "deprecated",
    MAINTENANCE = "maintenance"
}
export interface TransactionStateTracker {
    id: string;
    state: TransactionState;
    reference?: string;
}
export interface MobileMoney {
    /** Phone number for the mobile money offramp */
    phone: string;
}
export interface OnrampSwapSource {
    /** Currency code for the target currency */
    currency: Currency;
    /** Target destination */
    origin: MobileMoney | undefined;
}
export interface OnrampSwapTarget {
    /** Lightning protocol payout */
    payout: Bolt11 | undefined;
}
export interface OfframpSwapTarget {
    /** Currency code for the target currency */
    currency: Currency;
    /** Mobile money payout destination */
    payout: MobileMoney | undefined;
}
export interface Bolt11 {
    /** Bolt11 lightning invoice */
    invoice: string;
}
/**
 * Standard API response wrapper
 */
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
    errors?: Record<string, string[]>;
}
/**
 * Paginated API response for general use
 */
export interface ApiPaginatedResponse<T = unknown> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}
/**
 * Standard error response
 */
export interface ErrorResponse {
    success: false;
    error: string;
    message?: string;
    statusCode?: number;
    timestamp?: string;
}
/**
 * Validation error response
 */
export interface ValidationErrorResponse extends ErrorResponse {
    errors: Record<string, string[]>;
}
export type DisputePartyEvidence = Record<string, unknown>;
export interface EvidenceFile {
    filename: string;
    mimeType: string;
    base64Data: string;
}
export interface StoredEvidenceFile {
    filename: string;
    url: string;
    gsUrl: string;
    size: number;
    contentType: string;
}
export interface DisputeEvidenceData {
    screenshots: string[];
    files: EvidenceFile[];
    transactionId?: string;
    amount?: string;
    currency?: string;
    paymentTimestamp?: string;
    description?: string;
    documentProof?: string;
}
export interface StoredDisputeEvidenceData extends Omit<DisputeEvidenceData, "files"> {
    files: StoredEvidenceFile[];
}
export interface DisputeEvidenceFile {
    filename: string;
    mimeType: string;
    base64Data: string;
}
export interface UploadResult {
    filename: string;
    publicUrl: string;
    gsUrl: string;
    size: number;
    contentType: string;
}
export interface DisputeEvidenceUpload {
    swapId: string;
    role: "beneficiary" | "agent";
    files: DisputeEvidenceFile[];
    metadata?: Record<string, any>;
}
//# sourceMappingURL=common.d.ts.map