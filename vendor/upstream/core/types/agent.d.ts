/**
 * Agent related types and enums
 */
export declare enum AgentStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    SUSPENDED = "suspended"
}
export declare enum AgentTeamAssociationStatus {
    PENDING = "pending",
    ACTIVE = "active",
    REMOVED = "removed"
}
export declare enum AgentTeamAssociationVisibility {
    TEAM = "team",
    PRIVATE = "private"
}
export declare enum SwapType {
    ONRAMP = "onramp",
    OFFRAMP = "offramp"
}
export declare enum SwapState {
    CREATED = "created",
    AGENT_MATCHED = "agent_matched",
    ESCROW_PENDING = "escrow_pending",
    ESCROW_LOCKED = "escrow_locked",
    PAYMENT_INSTRUCTED = "payment_instructed",
    PAYMENT_PENDING = "payment_pending",
    PAYMENT_SUBMITTED = "payment_submitted",
    PAYMENT_CONFIRMED_USER = "payment_confirmed_user",
    PAYMENT_CONFIRMED_AGENT = "payment_confirmed_agent",
    CONFIRMATION_PENDING = "confirmation_pending",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
    REFUND_INITIATED = "refund_initiated",
    REFUND_FAILED = "refund_failed",
    DISPUTED = "disputed",
    DISPUTE_EVIDENCE_COLLECTION = "dispute_evidence_collection",
    DISPUTE_INTERNAL_REVIEW = "dispute_internal_review",
    DISPUTE_RESOLVED = "dispute_resolved",
    DISPUTE_REVIEW = "dispute_review",
    REFUNDED = "refunded",
    EXPIRED = "expired",
    FIAT_SENDER_TIMEOUT = "fiat_sender_timeout",
    FIAT_RECEIVER_TIMEOUT = "fiat_receiver_timeout",
    TRANSFERRED_TO_BACKUP = "transferred_to_backup"
}
export declare enum SwapCancellationActorType {
    USER = "user",
    AGENT = "agent",
    TEAM = "team",
    SYSTEM = "system"
}
export declare enum SwapCancellationReason {
    PARTICIPANT_CANCEL = "participant_cancel",
    ADMIN_CANCEL = "admin_cancel"
}
export interface AgentLimits {
    min: string;
    max: string;
    daily: string;
}
export interface AgentMargins {
    onrampBp: number;
    offrampBp: number;
}
export interface AgentMetrics {
    rating: number;
    completedSwaps: number;
    responseTime: number;
}
export interface AgentUser {
    id: string;
    email: string | null;
    status: string;
    metadata?: {
        firstName?: string;
        lastName?: string;
    };
}
export interface AgentLiquidity {
    currency: Currency;
    available: string;
    reserved: string;
    source: string;
    total?: string;
}
export interface AgentPrimaryTeamAssociation {
    teamId: string;
    status: AgentTeamAssociationStatus;
    visibility: AgentTeamAssociationVisibility;
    requestedBy?: string;
    acceptedBy?: string;
    joinedAt?: string;
    removedAt?: string;
    metadata?: Record<string, unknown>;
}
export interface AgentTeamAssociation {
    primary?: AgentPrimaryTeamAssociation;
}
/**
 * Agent settings configuration
 */
export interface AgentSettings {
    autoAccept?: boolean;
    maxConcurrentSwaps?: number;
    notificationEmail?: string;
    minConfirmationTime?: number;
    maxPendingSwaps?: number;
    requireKYC?: boolean;
    allowedCountries?: string[];
    blockedCountries?: string[];
    customMessage?: string;
    enabledSwapTypes?: SwapType[];
    publiclyVisible?: boolean;
    lightningAddress?: string | null;
    walletPreference?: AgentWalletPreference | null;
    onrampWalletPreference?: AgentWalletPreference | null;
}
/** Wallet used for agent escrow funding and settlement. */
export declare enum AgentWalletPreference {
    MINMO = "minmo",
    EXTERNAL = "external"
}
/**
 * Operating hours configuration for agents
 */
export interface OperatingHours {
    monday?: DayHours;
    tuesday?: DayHours;
    wednesday?: DayHours;
    thursday?: DayHours;
    friday?: DayHours;
    saturday?: DayHours;
    sunday?: DayHours;
    timezone?: string;
}
/**
 * Daily operating hours
 */
export interface DayHours {
    start: string;
    end: string;
    closed?: boolean;
}
/**
 * Swap metadata structure
 */
export interface SwapMetadata {
    userAgent?: string;
    ipAddress?: string;
    sessionId?: string;
    source?: string;
    campaign?: string;
    referrer?: string;
    notes?: string;
    customFields?: Record<string, string | number | boolean>;
    escrow?: {
        reference?: string;
        amountSats?: string;
        fundingReference?: string;
    };
    refund?: {
        to: "agent" | "user";
        destination?: PaymentDetails | null;
        amount?: {
            principalSats: string;
            totalSats: string;
        };
        attempts?: number;
        lastError?: string;
        payout?: {
            txid?: string;
            paymentHash?: string;
            feeSats?: string;
            paidAt?: string;
        };
    };
    cancellation?: {
        cancelledAt: string;
        actor: {
            id: string;
            type: SwapCancellationActorType;
        };
        reason: SwapCancellationReason;
    };
}
/**
 * Payment instructions for users
 */
export interface PaymentInstructions {
    method?: string;
    steps?: string[];
    accountDetails?: PaymentDetails;
    expiresAt?: string;
    amount?: string;
    currency?: string;
    reference?: string;
    details?: Record<string, unknown>;
    automatedPayment?: boolean;
    stkPushData?: Record<string, unknown>;
}
/**
 * Dispute details structure - matches entity
 */
export interface DisputeDetails {
    reportedBy: string;
    reason: string;
    evidence: Record<string, unknown>;
    agentEvidence?: DisputePartyEvidence;
    userEvidence?: DisputePartyEvidence;
    paymentProofs?: {
        user?: Record<string, unknown>;
        agent?: Record<string, unknown>;
    };
    bankStatements?: {
        user?: Record<string, unknown>;
        agent?: Record<string, unknown>;
    };
    reviewTeamId?: string;
    resolution?: DisputeResolution;
    resolutionReason?: string;
    partialSettlementPercentage?: number;
    evidenceSubmissionDeadline?: string;
    reviewStartedAt?: string;
    timestamp: string;
    raisedBy?: "user" | "agent";
    raisedAt?: Date;
    status?: "pending" | "investigating" | "resolved" | "rejected";
}
/**
 * Evidence submitted for disputes
 */
export interface DisputeEvidence {
    type: "screenshot" | "transaction_id" | "document" | "text";
    description: string;
    url?: string;
    content?: string;
    submittedBy: string;
    submittedAt: Date;
}
export interface Agent {
    id: string;
    isAutomated: boolean;
    status: AgentStatus | string;
    supportedCurrencies: Currency[];
    supportedChannels: PaymentChannel[];
    limits: AgentLimits;
    margins: AgentMargins;
    metrics?: AgentMetrics;
    operatingHours?: OperatingHours;
    liquidity?: AgentLiquidity[];
    userId?: string;
    user?: AgentUser;
    settings?: AgentSettings;
    paymentDetails?: AgentPaymentDetails;
    currencyChannels?: CurrencyChannels;
    teamAssociation?: AgentTeamAssociation | null;
}
export interface SwapAgentTeamContext {
    primaryTeamId?: string;
    agentId: string;
    capturedAt: string;
    source: "direct_selection" | "claim" | "transfer";
}
import { type Currency } from "./currency";
import { type AgentPaymentDetails, type PaymentChannel, type PaymentDetails } from "./channels";
import { type DisputePartyEvidence, type AgentSelectionMode, type DisputeResolution } from "./common";
import type { CurrencyChannels } from "./agent-currency-channels";
export interface AgentMatchCriteria {
    currency?: Currency;
    paymentChannel?: PaymentChannel;
    amount?: string;
    type?: SwapType;
}
export interface UpdateAvailabilityRequest {
    status: string;
    agentId?: string;
}
/**
 * Update agent request payload
 * Matches UpdateAgentDto structure from API
 */
export interface UpdateAgentDto {
    supportedCurrencies?: Currency[];
    supportedChannels?: PaymentChannel[];
    minTransactionAmount?: string;
    maxTransactionAmount?: string;
    dailyVolumeLimit?: string;
    onrampMarginBp?: number;
    offrampMarginBp?: number;
    operatingHours?: OperatingHours;
    settings?: AgentSettings;
    paymentDetails?: AgentPaymentDetails;
    currencyChannels?: CurrencyChannels;
}
export interface CreateSwapRequest {
    type: SwapType;
    fiatAmount: string;
    fiatCurrency: string;
    paymentChannel: string;
    agentId?: string;
    agentMargin?: number;
    reference?: string;
    paymentDetails?: PaymentDetails;
    metadata?: SwapMetadata;
}
export interface UpdateLiquidityRequest {
    availableLiquidity: string;
}
export interface Swap {
    id: string;
    type: SwapType;
    state: SwapState;
    beneficiaryId: string;
    agentId?: string;
    fiatAmount: string;
    fiatCurrency: string;
    bitcoinAmount?: string;
    paymentChannel: string;
    exchangeRate?: string;
    agentMargin?: number;
    platformFee?: string;
    reference?: string;
    paymentDetails?: PaymentDetails;
    metadata?: SwapMetadata;
    createdAt: string;
    updatedAt: string;
    expiresAt?: string;
    completedAt?: string;
}
/**
 * Minmo-specific agent interface with all fields
 */
export interface MinmoAgent {
    id: string;
    userId: string;
    status: AgentStatus;
    supportedCurrencies: Currency[];
    supportedChannels: PaymentChannel[];
    minTransactionAmount: string;
    maxTransactionAmount: string;
    dailyVolumeLimit: string;
    liquidity?: AgentLiquidity[];
    onrampMarginBp: number;
    offrampMarginBp: number;
    operatingHours: OperatingHours;
    settings: AgentSettings;
    paymentDetails?: AgentPaymentDetails;
    currencyChannels?: CurrencyChannels;
    createdAt: Date;
    updatedAt: Date;
    swaps?: MinmoSwapTransaction[];
    metrics?: MinmoAgentMetrics;
    user?: AgentUser;
    isAutomated?: boolean;
    teamAssociation?: AgentTeamAssociation | null;
}
/**
 * Minmo agent metrics
 */
export interface MinmoAgentMetrics {
    agentId: string;
    totalSwaps: number;
    completedSwaps: number;
    disputedSwaps: number;
    falseDisputes: number;
    totalVolume: string;
    rating: string | null;
    averageCompletionTime: number | null;
    lastActiveAt: Date;
    createdAt: Date;
    updatedAt: Date;
    agent?: MinmoAgent;
}
/**
 * Minmo swap transaction with all fields
 */
export interface MinmoSwapTransaction {
    id: string;
    reference: string;
    type: SwapType;
    state: SwapState;
    beneficiaryId: string;
    agentId: string | null;
    fiatAmount: string;
    fiatCurrency: Currency;
    bitcoinAmount: string;
    exchangeRate: string;
    agentMargin: number;
    paymentChannel: PaymentChannel;
    paymentDetails?: PaymentDetails | null;
    userPaymentDetails?: PaymentDetails | null;
    agentPaymentDetails?: PaymentDetails | null;
    escrowInvoice?: string | null;
    escrowPaymentHash?: string | null;
    escrowPreimage?: string | null;
    userConfirmedAt?: Date | null;
    agentConfirmedAt?: Date | null;
    createdAt: Date;
    claimedAt?: Date | null;
    completedAt?: Date | null;
    expiredAt?: Date | null;
    disputedAt?: Date | null;
    metadata?: SwapMetadata;
    paymentProofUser?: string | null;
    paymentProofAgent?: string | null;
    disputeDetails?: DisputeDetails;
    agentTeamContext?: SwapAgentTeamContext | null;
    backupAgentId?: string | null;
    resolvedAt?: Date | null;
    paymentInstructedAt?: Date | null;
    agentTimeoutAt?: Date | null;
    originalAgentId?: string | null;
    transferredAt?: Date | null;
    paymentInstructions?: PaymentInstructions;
    disputePenaltyApplied?: boolean;
    cancelledAt?: Date | null;
    cancelledBy?: string | null;
    fiatPaymentSentAt?: Date | null;
    btcReleasedAt?: Date | null;
    agentSelectionMode?: AgentSelectionMode;
}
/**
 * Agent profile response
 */
export interface AgentProfileResponse extends Agent {
    user?: AgentUser & {
        firstName?: string;
        lastName?: string;
    };
}
/**
 * Agent stats response
 */
export interface AgentStatsResponse {
    agentId: string;
    totalSwaps: number;
    completedSwaps: number;
    totalVolume: string;
    rating: number | null;
    averageCompletionTime: number | null;
    lastActiveAt: string;
}
//# sourceMappingURL=agent.d.ts.map