import type { AuditEvent, CreateEscrowCommand, DescriptorPublishResult, DisputeResolutionCommand, EscrowDescriptorSettingsResponse, EscrowFeePolicy, EscrowPage, EscrowPayoutRecord, EscrowRecord, MoneyMovementCommand, ParticipantRole, UpdateEscrowDescriptorRequest, WalletPayoutDetails } from "@minmo/core";
import { EscrowEventType } from "@minmo/core";
import { EscrowDisputesClient } from "./disputes";
import { type DomainEventSubscriptionOptions, type EventSubscription, type EventsClient } from "./events";
import type { HttpClient } from "./http";
import type { SwapResource } from "./otc/swap";
export type CreateEscrowInput = Omit<CreateEscrowCommand, "feeSnapshot" | "recipientRole"> & {
    recipientRole: ParticipantRole;
};
export type EscrowListQuery = {
    limit?: number;
    offset?: number;
};
export type EscrowPayoutStatus = {
    escrowReference: string;
    payout: EscrowPayoutRecord | null;
    walletPayoutStatus: WalletPayoutDetails | null;
};
export type EscrowAuditResponse = {
    items: AuditEvent[];
};
export type UpdateEscrowDescriptorWalletInput = {
    walletId: string;
    descriptorId?: string;
};
export type UpdateEscrowFeePolicyInput = {
    enabled?: boolean;
    onrampBps?: number;
    offrampBps?: number;
    minimumSats?: string;
    maximumSats?: string;
};
export declare enum SwapEscrowPaymentStatus {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    COMPLETE = "COMPLETE",
    FAILED = "FAILED",
    EXPIRED = "EXPIRED",
    CANCELLED = "CANCELLED",
    NOT_APPLICABLE = "NOT_APPLICABLE",
    NOT_FOUND = "NOT_FOUND"
}
export type SwapEscrowPaymentStatusResponse = {
    swapId: string;
    status: SwapEscrowPaymentStatus;
    paymentHash?: string;
    invoice?: string;
};
export type EscrowFundingReconciliationResult = {
    checked: number;
    funded: number;
    failed: Array<{
        reference: string;
        error: string;
    }>;
};
export type SwapEscrowReconciliationResult = {
    checked: number;
    updated: number;
    skipped: Array<{
        swapId: string;
        reason: string;
    }>;
    failed: Array<{
        swapId: string;
        error: string;
    }>;
};
export type EscrowReconciliationResult = {
    funding: EscrowFundingReconciliationResult;
    swaps: SwapEscrowReconciliationResult;
};
export type ReconcileEscrowSwapInput = {
    reason?: string;
};
export type EscrowSubscriptionOptions = Omit<DomainEventSubscriptionOptions<EscrowEventType>, "aggregateId" | "partnerId"> & {
    teamId: string;
    escrowReferences?: readonly string[];
};
/** Typed reads, commands, dispute operations, and events for Partner escrows. */
export declare class EscrowClient {
    private readonly http;
    private readonly events;
    readonly disputes: EscrowDisputesClient;
    constructor(http: HttpClient, events: EventsClient);
    create(teamId: string, input: CreateEscrowInput): Promise<EscrowRecord>;
    list(teamId: string, query?: EscrowListQuery): Promise<EscrowPage>;
    get(teamId: string, reference: string): Promise<EscrowRecord>;
    payoutStatus(teamId: string, reference: string): Promise<EscrowPayoutStatus>;
    audit(teamId: string, reference: string): Promise<EscrowAuditResponse>;
    verifyFunding(teamId: string, reference: string): Promise<EscrowRecord>;
    /** Test-only command; production deployments reject it. */
    markMockFundingComplete(teamId: string, reference: string): Promise<EscrowRecord>;
    release(teamId: string, reference: string, input: MoneyMovementCommand): Promise<EscrowRecord>;
    refund(teamId: string, reference: string, input: MoneyMovementCommand): Promise<EscrowRecord>;
    recordDisputeResolution(teamId: string, reference: string, input: DisputeResolutionCommand): Promise<EscrowRecord>;
    getDescriptor(teamId: string): Promise<EscrowDescriptorSettingsResponse>;
    publishDescriptor(teamId: string): Promise<DescriptorPublishResult>;
    updateDescriptor(teamId: string, input: UpdateEscrowDescriptorRequest): Promise<EscrowDescriptorSettingsResponse>;
    updateDescriptorWallet(teamId: string, input: UpdateEscrowDescriptorWalletInput): Promise<EscrowDescriptorSettingsResponse>;
    getFeePolicy(teamId: string, descriptorId: string): Promise<EscrowFeePolicy>;
    updateFeePolicy(teamId: string, descriptorId: string, input: UpdateEscrowFeePolicyInput): Promise<EscrowFeePolicy>;
    reconcile(teamId: string): Promise<EscrowReconciliationResult>;
    reconcileSwap(teamId: string, reference: string, input?: ReconcileEscrowSwapInput): Promise<SwapResource>;
    subscribe(options: EscrowSubscriptionOptions): EventSubscription;
}
//# sourceMappingURL=escrow.d.ts.map