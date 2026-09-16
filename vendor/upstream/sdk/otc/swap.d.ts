import type { AgentSelectionMode, ConfirmationRole, Currency, DisputeDetails, PaymentDetails, PaymentChannel, PaymentInstructions, SwapAgentTeamContext, SwapMetadata, SwapRepairAction, SwapListSegment, SwapState, SwapType, PartnerQuoteResponse } from "@minmo/core";
import type { ExecuteDisputeRefundInput, OpenDisputeInput, ResolveDisputeInput, SubmitDisputeEvidenceInput } from "../disputes";
import type { SwapEscrowPaymentStatusResponse } from "../escrow";
import type { HttpClient } from "../http";
export type CreateSwapInput = {
    type: SwapType;
    fiatAmount?: string;
    fiatCurrency: Currency;
    paymentChannel: PaymentChannel;
    agentMargin?: number;
    reference?: string;
    userPaymentDetails?: Record<string, unknown>;
    agentPaymentDetails?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
    agentId?: string;
    agentSelectionMode?: AgentSelectionMode;
    beneficiaryId: string;
    quoteId?: string;
    rateSnapshot?: PartnerQuoteResponse;
};
export type SwapResource = {
    id: string;
    reference: string;
    type: SwapType;
    state: SwapState;
    beneficiaryId: string;
    fiatAmount: string;
    fiatCurrency: Currency;
    bitcoinAmount: string;
    exchangeRate: string;
    agentMargin: number;
    fees: SwapFeeSnapshot;
    paymentChannel: PaymentChannel;
    userPaymentDetails?: PaymentDetails;
    agentPaymentDetails?: PaymentDetails;
    paymentInstructions?: PaymentInstructions;
    agent?: SwapAgentResource;
    agentId?: string;
    agentTeamContext?: SwapAgentTeamContext | null;
    escrowInvoice?: string;
    confirmations: SwapConfirmations;
    canCancel?: boolean;
    createdAt: string;
    updatedAt: string;
    claimedAt?: string;
    completedAt?: string;
    disputedAt?: string;
    resolvedAt?: string;
    metadata?: SwapResourceMetadata;
};
export type SwapFeeSnapshot = {
    teamId?: string;
    descriptorId?: string;
    enabled?: boolean;
    capturedAt?: string;
    agentMarginBps: number;
    escrowFeeBps: number;
    escrowFeeSats: string;
    payoutNetworkFeeSats: string;
    receiverPayoutSats?: string;
    principalSats?: string;
    receiverRole: ConfirmationRole;
    policyVersion: number;
    estimated?: boolean;
};
export type SwapAgentResource = {
    id: string;
    type: string;
    isAutomated?: boolean;
    rating?: number;
};
export type SwapConfirmations = {
    user: boolean;
    agent: boolean;
};
export type SwapResourceMetadata = SwapMetadata & Record<string, unknown> & {
    disputeDetails?: DisputeDetails | null;
    paymentProofUser?: string | null;
    paymentProofAgent?: string | null;
    agentSelectionMode?: AgentSelectionMode;
    manualRecovery?: Record<string, unknown> & {
        enabled?: boolean;
    };
};
export type SwapListQuery = {
    page?: number;
    limit?: number;
    segment?: SwapListSegment;
    state?: SwapState;
    type?: SwapType;
    id?: string;
    currency?: Currency;
    beneficiaryId?: string;
    agentId?: string;
    reference?: string;
    startDate?: string;
    endDate?: string;
};
export type SwapListResponse = {
    data: SwapResource[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};
export type SwapClaimInput = {
    lightningInvoice?: string;
};
export type ConfirmPaymentInput = {
    role: ConfirmationRole;
    beneficiaryId?: string;
};
export type CancelSwapInput = {
    beneficiaryId?: string;
};
export type SubmitPaymentProofInput = {
    proof: string;
    beneficiaryId?: string;
};
export type SwapActionInput = Record<string, unknown>;
export type SwapRepairInput = {
    action: SwapRepairAction;
    expectedState: SwapState;
    reason: string;
    newInvoice?: string;
    newOnchainAddress?: string;
};
export declare class SwapClient {
    private readonly http;
    constructor(http: HttpClient);
    private listPath;
    create(input: CreateSwapInput): Promise<SwapResource>;
    get(swapId: string): Promise<SwapResource>;
    listDisputes(): Promise<SwapResource[]>;
    list(query?: SwapListQuery): Promise<SwapListResponse>;
    listForPartner(partnerId: string, query?: SwapListQuery): Promise<SwapListResponse>;
    getForPartner(partnerId: string, swapId: string): Promise<SwapResource>;
    cancelForPartner(partnerId: string, swapId: string, input?: CancelSwapInput): Promise<SwapResource>;
    claim(swapId: string, input?: SwapClaimInput): Promise<SwapResource>;
    cancel(swapId: string, input?: CancelSwapInput): Promise<SwapResource>;
    confirmPayment(swapId: string, input: ConfirmPaymentInput): Promise<SwapResource>;
    submitPaymentProof(swapId: string, input: SubmitPaymentProofInput): Promise<SwapResource>;
    verifyEscrow(swapId: string): Promise<SwapResource>;
    dispute(swapId: string, input: OpenDisputeInput): Promise<SwapResource>;
    submitDisputeEvidence(swapId: string, input: SubmitDisputeEvidenceInput): Promise<SwapResource>;
    executeRefund(swapId: string, input: ExecuteDisputeRefundInput): Promise<SwapResource>;
    resolveDispute(swapId: string, input: ResolveDisputeInput): Promise<SwapResource>;
    transfer(swapId: string, input: SwapActionInput): Promise<SwapResource>;
    repair(partnerId: string, swapId: string, input: SwapRepairInput): Promise<SwapResource>;
    escrowStatus(swapId: string): Promise<SwapEscrowPaymentStatusResponse>;
}
//# sourceMappingURL=swap.d.ts.map