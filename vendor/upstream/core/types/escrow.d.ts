/**
 * Escrow System - Time-Locked Auto-Release Types
 *
 * This file contains all type definitions for the escrow system as specified
 * in the escrow-design.md document.
 */
/**
 * Escrow timeout configuration
 */
export interface EscrowTimeoutConfig {
    /** Time before auto-release for payment disputes (48 hours) */
    PAYMENT_DISPUTE_TIMEOUT: number;
    /** Time before auto-release for fiat sender unresponsiveness (configurable hours) */
    FIAT_SENDER_UNRESPONSIVE_TIMEOUT: number;
    /** Time before auto-release for fiat receiver unresponsiveness (configurable hours) */
    FIAT_RECEIVER_UNRESPONSIVE_TIMEOUT: number;
    /** Time before auto-release for partial payment disputes (72 hours) */
    PARTIAL_PAYMENT_TIMEOUT: number;
    /** Time before auto-release for invalid payment details (48 hours) */
    INVALID_PAYMENT_TIMEOUT: number;
}
/**
 * Escrow dispute evidence structure
 */
export interface EscrowDisputeEvidence {
    /** Transaction ID or reference number */
    transactionId?: string;
    /** Account statement or bank confirmation */
    accountStatement?: string;
    /** Screenshot or image proof */
    screenshot?: string;
    /** Timestamp of the disputed event */
    timestamp?: string;
    /** Additional metadata */
    metadata?: Record<string, unknown>;
}
/**
 * Dispute resolution outcome
 * Extends the existing DisputeResolution enum from common.ts
 */
export declare enum EscrowDisputeResolution {
    USER_WINS = "user_wins",
    AGENT_WINS = "agent_wins",
    SPLIT = "split",
    REVERSE = "reverse"
}
/**
 * Dispute type classification
 */
export declare enum DisputeType {
    PAYMENT_DISPUTE = "payment_dispute",
    FIAT_PARTY_UNRESPONSIVE = "fiat_party_unresponsive",
    PARTIAL_PAYMENT = "partial_payment",
    INVALID_PAYMENT_DETAILS = "invalid_payment_details"
}
/**
 * Escrow resolution metadata
 */
export interface EscrowResolution {
    /** Resolution type */
    resolution: EscrowDisputeResolution;
    /** Reason for resolution */
    reason: string;
    /** Timestamp of resolution */
    resolvedAt: Date;
    /** Whether resolution was automatic */
    autoResolved: boolean;
    /** Evidence scores if applicable */
    evidenceScores?: {
        user: number;
        agent: number;
    };
    /** Additional metadata */
    metadata?: Record<string, unknown>;
}
/**
 * Escrow event for monitoring
 */
export interface EscrowEvent {
    /** Swap ID */
    swapId: string;
    /** Event type */
    eventType: string;
    /** Resolution details */
    resolution?: EscrowDisputeResolution;
    /** Reason for event */
    reason: string;
    /** Timestamp */
    timestamp: Date;
    /** Additional data */
    metadata?: Record<string, unknown>;
}
/**
 * Escrow evidence validation result
 */
export interface EscrowValidationResult {
    /** Whether evidence is valid */
    isValid: boolean;
    /** List of validation errors */
    errors: string[];
    /** List of validation warnings */
    warnings: string[];
}
/**
 * Escrow fraud analysis result
 */
export interface EscrowFraudAnalysis {
    /** Whether fraud risk is detected */
    hasFraudRisk: boolean;
    /** Detected fraud patterns */
    patterns: EscrowFraudPattern[];
    /** Calculated risk score */
    riskScore: number;
}
/**
 * Escrow fraud pattern detection
 */
export interface EscrowFraudPattern {
    /** Type of fraud pattern */
    type: string;
    /** Severity level */
    severity: "low" | "medium" | "high";
    /** Pattern details */
    details: string;
}
/**
 * Comprehensive dispute statistics
 */
export interface DisputeStats {
    /** Total disputes ever created */
    totalDisputes: number;
    /** Total disputes that reached resolution */
    totalResolved: number;
    /** Currently active disputes */
    totalOpen: number;
    /** Resolution metrics */
    resolutionType: {
        autoResolved: number;
        manuallyResolved: number;
        averageResolutionTime: number;
    };
    /** Resolution outcomes */
    resolutionBreakdown: {
        userWins: number;
        agentWins: number;
        splits: number;
        reversals: number;
    };
    /** Open disputes breakdown by state */
    openDisputesBreakdown: {
        disputed: number;
        evidenceCollection: number;
        internalReview: number;
        review: number;
    };
    /** Dispute types (both open and resolved) */
    disputeTypeBreakdown: {
        paymentDisputes: number;
        fiatPartyUnresponsive: number;
        partialPayments: number;
        invalidDetails: number;
    };
}
/**
 * Health check response
 */
export interface HealthCheckDto {
    /** Service status */
    status: string;
    /** Current timestamp */
    timestamp: Date;
    /** Last check time */
    lastCheck?: Date;
}
/**
 * Escrow timeout configuration DTO
 */
export interface EscrowTimeoutConfigDto {
    /** Payment dispute timeout in milliseconds */
    PAYMENT_DISPUTE_TIMEOUT: number;
    /** Fiat sender unresponsive timeout in milliseconds */
    FIAT_SENDER_UNRESPONSIVE_TIMEOUT: number;
    /** Fiat receiver unresponsive timeout in milliseconds */
    FIAT_RECEIVER_UNRESPONSIVE_TIMEOUT: number;
    /** Partial payment timeout in milliseconds */
    PARTIAL_PAYMENT_TIMEOUT: number;
    /** Invalid payment timeout in milliseconds */
    INVALID_PAYMENT_TIMEOUT: number;
}
/**
 * Evidence scoring weights configuration
 */
export interface EvidenceWeights {
    /** Transaction ID weight (highest reliability) */
    transactionId: number;
    /** Account statement weight (high reliability) */
    accountStatement: number;
    /** Screenshot weight (medium reliability) */
    screenshot: number;
    /** Timestamp weight (low reliability) */
    timestamp: number;
}
/**
 * Default evidence scoring weights
 */
export declare const DEFAULT_EVIDENCE_WEIGHTS: EvidenceWeights;
/**
 * Default resolution threshold
 */
export declare const DEFAULT_RESOLUTION_THRESHOLD = 0.2;
/**
 * Default timeout configuration
 */
export declare const DEFAULT_TIMEOUT_CONFIG: EscrowTimeoutConfig;
//# sourceMappingURL=escrow.d.ts.map