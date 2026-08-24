/**
 * Stable identifiers for events in the Minmo event contract.
 *
 * These values are event-type IDs. They are safe to persist, use as routing
 * keys, and expose on the wire. They are not occurrence IDs: every emitted
 * event occurrence still needs its own globally unique `id`.
 */
import type { SwapResponse } from "./swap";
import type { PayInvoice, PayStore } from "./pay";
import type { AgentStatus } from "./agent";
import type { EscrowRecord } from "../escrow";
/** Events belonging to the over-the-counter exchange domain. */
export declare enum OtcEventType {
    SWAP_CREATED = "otc.swap.created",
    SWAP_ESCROW_PENDING = "otc.swap.escrow.pending",
    SWAP_ESCROW_LOCKED = "otc.swap.escrow.locked",
    SWAP_CLAIMED = "otc.swap.claimed",
    SWAP_PAYMENT_INSTRUCTED = "otc.swap.payment.instructed",
    SWAP_PAYMENT_PENDING = "otc.swap.payment.pending",
    SWAP_PAYMENT_SUBMITTED = "otc.swap.payment.submitted",
    SWAP_PAYMENT_CONFIRMED_USER = "otc.swap.payment.confirmed.user",
    SWAP_PAYMENT_CONFIRMED_AGENT = "otc.swap.payment.confirmed.agent",
    SWAP_CONFIRMATION_PENDING = "otc.swap.confirmation.pending",
    SWAP_COMPLETED = "otc.swap.completed",
    SWAP_CANCELLED = "otc.swap.cancelled",
    SWAP_REFUND_INITIATED = "otc.swap.refund.initiated",
    SWAP_REFUND_FAILED = "otc.swap.refund.failed",
    SWAP_DISPUTED = "otc.swap.disputed",
    SWAP_DISPUTE_EVIDENCE_COLLECTION = "otc.swap.dispute.evidence.collection",
    SWAP_DISPUTE_INTERNAL_REVIEW = "otc.swap.dispute.internal.review",
    SWAP_DISPUTE_REVIEW = "otc.swap.dispute.review",
    SWAP_DISPUTE_RESOLVED = "otc.swap.dispute.resolved",
    SWAP_REFUNDED = "otc.swap.refunded",
    SWAP_EXPIRED = "otc.swap.expired",
    SWAP_FIAT_SENDER_TIMEOUT = "otc.swap.fiat.sender.timeout",
    SWAP_FIAT_RECEIVER_TIMEOUT = "otc.swap.fiat.receiver.timeout",
    SWAP_TRANSFERRED_TO_BACKUP = "otc.swap.transferred.to.backup",
    AGENT_REGISTERED = "otc.agent.registered",
    AGENT_UPDATED = "otc.agent.updated",
    AGENT_AVAILABILITY_CHANGED = "otc.agent.availability.changed",
    AGENT_TEAM_ASSOCIATED = "otc.agent.team.associated",
    AGENT_TEAM_REMOVED = "otc.agent.team.removed",
    RATE_QUOTED = "otc.rate.quoted",
    RATE_UPDATED = "otc.rate.updated",
    RATE_EXPIRED = "otc.rate.expired"
}
/**
 * Events belonging to Minmo Pay.
 *
 * Invoice events mirror the transitions in `PayInvoiceStatus`. There is no
 * separate event for the awaiting-payment state: an invoice is awaiting
 * payment from creation until it moves on.
 *
 * `INVOICE_PROCESSING` means a payment was seen and is confirming. Only
 * `INVOICE_SETTLED` means the funds are the partner's, so a consumer must not
 * treat processing as completion.
 */
export declare enum PayEventType {
    INVOICE_CREATED = "pay.invoice.created",
    INVOICE_PROCESSING = "pay.invoice.processing",
    INVOICE_SETTLED = "pay.invoice.settled",
    INVOICE_EXPIRED = "pay.invoice.expired",
    INVOICE_INVALID = "pay.invoice.invalid",
    STORE_CONNECTED = "pay.store.connected",
    STORE_CONNECTION_FAILED = "pay.store.connection.failed"
}
export declare enum WalletEventType {
    SYNCED = "wallet.synced",
    PAYMENT_PENDING = "wallet.payment.pending",
    PAYMENT_SUCCEEDED = "wallet.payment.succeeded",
    PAYMENT_FAILED = "wallet.payment.failed"
}
/** Events belonging to the Partner-operated escrow product. */
export declare enum EscrowEventType {
    REFERENCE_ISSUED = "escrow.reference.issued",
    FUNDING_CONFIRMED = "escrow.funding.confirmed",
    DISPUTE_RESOLUTION_RECORDED = "escrow.dispute.resolution.recorded",
    RELEASED = "escrow.released",
    REFUNDED = "escrow.refunded",
    EXPIRED = "escrow.expired"
}
/** Union of all domain-scoped event types. */
export type MinmoEventType = OtcEventType | PayEventType | WalletEventType | EscrowEventType;
/** Runtime registry useful for validation, documentation, and tests. */
export declare const MINMO_EVENT_TYPES: readonly MinmoEventType[];
type Brand<T, Name extends string> = T & {
    readonly __brand: Name;
};
/** Globally unique identity of one persisted event occurrence. */
export type MinmoEventOccurrenceId = Brand<string, "MinmoEventOccurrenceId">;
/** Monotonic position in a stream, independent of the event UUID. */
export type MinmoEventStreamPosition = Brand<string, "MinmoEventStreamPosition">;
/** Deterministic identity used to collapse retries into one logical event. */
export type MinmoEventDeduplicationKey = Brand<string, "MinmoEventDeduplicationKey">;
export declare enum MinmoEventSourceModule {
    SWAP = "swap",
    AGENT = "agent",
    FX = "fx",
    WALLET = "wallet",
    ESCROW = "escrow",
    PAYMENT = "payment",
    AUTH = "auth",
    SYSTEM = "system"
}
export type MinmoEventMetadata = {
    sourceModule: MinmoEventSourceModule;
    deduplicationKey: MinmoEventDeduplicationKey;
    streamPosition?: MinmoEventStreamPosition;
    version: number;
    aggregateId: string;
    occurredAt: string;
    /** Authorized domain scope, never a substitute for server-side auth. */
    scope?: {
        partnerId?: string;
        storeId?: string;
        agentId?: string;
        beneficiaryId?: string;
    };
};
export type AgentAvailabilityChangedResponse = {
    agentId: string;
    available: boolean;
    status: AgentStatus;
};
export type AgentRegisteredResponse = {
    agentId: string;
    userId: string;
    status: AgentStatus;
};
export type AgentUpdatedResponse = {
    agentId: string;
    updatedBy?: string;
};
export type AgentTeamAssociationResponse = {
    agentId: string;
    teamId: string;
    status: string;
    visibility?: string;
    actorUserId?: string;
};
export type RateResponse = {
    quoteId: string;
    baseCurrency: string;
    quoteCurrency: string;
    rate: string;
    quotedAt?: string;
    expiresAt?: string;
};
export type WalletSyncedResponse = {
    walletId: string;
    syncedAt: string;
};
export declare enum WalletPaymentType {
    SEND = "send",
    RECEIVE = "receive"
}
export declare enum WalletPaymentStatus {
    COMPLETED = "completed",
    PENDING = "pending",
    FAILED = "failed"
}
export type WalletPaymentResponse = {
    walletId: string;
    paymentId: string;
    paymentType: WalletPaymentType;
    amountSats: string;
    status: WalletPaymentStatus;
    method: string;
    feeSats: string;
    createdAt: string;
    sentAt?: string;
    description?: string;
    txid?: string;
    invoice?: string;
    paymentHash?: string;
    providerPaymentId?: string;
};
/**
 * Redacted escrow transition snapshot for event delivery.
 *
 * Funding invoices, addresses, wallet identifiers, payout destinations,
 * dispute reasons, and payment proofs remain on the authenticated HTTP read.
 */
export type EscrowEventResponse = Pick<EscrowRecord, "reference" | "teamId" | "descriptorId" | "asset" | "currency" | "amount" | "amountSats" | "status" | "createdAt" | "updatedAt"> & {
    funding: Pick<EscrowRecord["funding"], "network" | "expiresAt">;
    payout?: {
        action: "release" | "refund";
        recipientRole: NonNullable<EscrowRecord["release"] | EscrowRecord["refund"]>["recipientRole"];
        amount: string;
        amountSats: string;
        completedAt: string;
    };
    disputeResolution?: Pick<NonNullable<EscrowRecord["disputeResolution"]>, "outcome" | "decidedAt">;
};
/** Maps every public event type to the payload clients receive. */
export type MinmoEventPayloadMap = {
    [OtcEventType.SWAP_CREATED]: SwapResponse;
    [OtcEventType.SWAP_ESCROW_PENDING]: SwapResponse;
    [OtcEventType.SWAP_ESCROW_LOCKED]: SwapResponse;
    [OtcEventType.SWAP_CLAIMED]: SwapResponse;
    [OtcEventType.SWAP_PAYMENT_INSTRUCTED]: SwapResponse;
    [OtcEventType.SWAP_PAYMENT_PENDING]: SwapResponse;
    [OtcEventType.SWAP_PAYMENT_SUBMITTED]: SwapResponse;
    [OtcEventType.SWAP_PAYMENT_CONFIRMED_USER]: SwapResponse;
    [OtcEventType.SWAP_PAYMENT_CONFIRMED_AGENT]: SwapResponse;
    [OtcEventType.SWAP_CONFIRMATION_PENDING]: SwapResponse;
    [OtcEventType.SWAP_COMPLETED]: SwapResponse;
    [OtcEventType.SWAP_CANCELLED]: SwapResponse;
    [OtcEventType.SWAP_REFUND_INITIATED]: SwapResponse;
    [OtcEventType.SWAP_REFUND_FAILED]: SwapResponse;
    [OtcEventType.SWAP_DISPUTED]: SwapResponse;
    [OtcEventType.SWAP_DISPUTE_EVIDENCE_COLLECTION]: SwapResponse;
    [OtcEventType.SWAP_DISPUTE_INTERNAL_REVIEW]: SwapResponse;
    [OtcEventType.SWAP_DISPUTE_REVIEW]: SwapResponse;
    [OtcEventType.SWAP_DISPUTE_RESOLVED]: SwapResponse;
    [OtcEventType.SWAP_REFUNDED]: SwapResponse;
    [OtcEventType.SWAP_EXPIRED]: SwapResponse;
    [OtcEventType.SWAP_FIAT_SENDER_TIMEOUT]: SwapResponse;
    [OtcEventType.SWAP_FIAT_RECEIVER_TIMEOUT]: SwapResponse;
    [OtcEventType.SWAP_TRANSFERRED_TO_BACKUP]: SwapResponse;
    [OtcEventType.AGENT_REGISTERED]: AgentRegisteredResponse;
    [OtcEventType.AGENT_UPDATED]: AgentUpdatedResponse;
    [OtcEventType.AGENT_AVAILABILITY_CHANGED]: AgentAvailabilityChangedResponse;
    [OtcEventType.AGENT_TEAM_ASSOCIATED]: AgentTeamAssociationResponse;
    [OtcEventType.AGENT_TEAM_REMOVED]: AgentTeamAssociationResponse;
    [OtcEventType.RATE_QUOTED]: RateResponse;
    [OtcEventType.RATE_UPDATED]: RateResponse;
    [OtcEventType.RATE_EXPIRED]: RateResponse;
    [PayEventType.INVOICE_CREATED]: PayInvoice;
    [PayEventType.INVOICE_PROCESSING]: PayInvoice;
    [PayEventType.INVOICE_SETTLED]: PayInvoice;
    [PayEventType.INVOICE_EXPIRED]: PayInvoice;
    [PayEventType.INVOICE_INVALID]: PayInvoice;
    [PayEventType.STORE_CONNECTED]: PayStore;
    [PayEventType.STORE_CONNECTION_FAILED]: PayStore;
    [WalletEventType.SYNCED]: WalletSyncedResponse;
    [WalletEventType.PAYMENT_PENDING]: WalletPaymentResponse;
    [WalletEventType.PAYMENT_SUCCEEDED]: WalletPaymentResponse;
    [WalletEventType.PAYMENT_FAILED]: WalletPaymentResponse;
    [EscrowEventType.REFERENCE_ISSUED]: EscrowEventResponse;
    [EscrowEventType.FUNDING_CONFIRMED]: EscrowEventResponse;
    [EscrowEventType.DISPUTE_RESOLUTION_RECORDED]: EscrowEventResponse;
    [EscrowEventType.RELEASED]: EscrowEventResponse;
    [EscrowEventType.REFUNDED]: EscrowEventResponse;
    [EscrowEventType.EXPIRED]: EscrowEventResponse;
};
/**
 * Canonical persisted and projected event envelope.
 *
 * `version` orders changes within an aggregate. Payload schema negotiation is
 * intentionally deferred until the event contract needs multiple formats.
 */
export type MinmoEvent<TType extends MinmoEventType = MinmoEventType> = {
    id: MinmoEventOccurrenceId;
    type: TType;
    /**
     * Typed on the initial delivery and null on retries. The durable event
     * record stores metadata only; consumers hydrate after a null payload.
     */
    payload: MinmoEventPayloadMap[TType] | null;
    metadata: MinmoEventMetadata;
};
export {};
//# sourceMappingURL=events.d.ts.map