import type { BitcoinPaymentDetails, DisputeResolution, DisputeEvidenceData, SwapState } from "@minmo/core";
import type { HttpClient } from "./http";
import type { SwapResource } from "./otc/swap";
export type OpenDisputeInput = {
    reason: string;
    evidence?: DisputeEvidenceData | Record<string, unknown>;
    beneficiaryId?: string;
};
export type SubmitDisputeEvidenceInput = {
    evidence: Record<string, unknown>;
    documentProof?: string;
};
export type ResolveDisputeInput = {
    resolution: DisputeResolution;
    partialPercentage?: number;
    reason: string;
    reviewTeamId?: string;
};
export type ExecuteDisputeRefundInput = {
    destination: BitcoinPaymentDetails;
    beneficiaryId?: string;
};
export type AgentDisputeListQuery = {
    state?: SwapState;
    page?: number;
    limit?: number;
};
export type AgentDisputeListResponse = {
    data: SwapResource[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};
export type AgentDisputeStats = {
    totalDisputes: number;
    activeDisputes: number;
    resolvedDisputes: number;
    userWins: number;
    agentWins: number;
    splits: number;
    resolutionRate: number;
    averageResolutionTime: number;
    disputeTrends: Array<{
        month: string;
        count: number;
    }>;
};
/** Complete typed access to the live swap-dispute API surface. */
export declare class EscrowDisputesClient {
    private readonly http;
    constructor(http: HttpClient);
    /** Lists all swaps currently requiring dispute arbitration. */
    list(): Promise<SwapResource[]>;
    /** Reads the authoritative swap resource containing the dispute. */
    get(swapId: string): Promise<SwapResource>;
    /** Opens a dispute as an authorized swap participant. */
    open(swapId: string, input: OpenDisputeInput): Promise<SwapResource>;
    /** Adds participant evidence while the dispute is collecting evidence. */
    submitEvidence(swapId: string, input: SubmitDisputeEvidenceInput): Promise<SwapResource>;
    /**
     * Records the operator decision for an escrow-backed dispute.
     * Swaps without an escrow record use the API's compatibility path.
     */
    resolve(swapId: string, input: ResolveDisputeInput): Promise<SwapResource>;
    /** Executes the payout required after a dispute enters refund state. */
    executeRefund(swapId: string, input: ExecuteDisputeRefundInput): Promise<SwapResource>;
    /** Lists dispute history for one agent. */
    listForAgent(agentId: string, query?: AgentDisputeListQuery): Promise<AgentDisputeListResponse>;
    /** Reads aggregate dispute outcomes and timing for one agent. */
    statsForAgent(agentId: string): Promise<AgentDisputeStats>;
}
//# sourceMappingURL=disputes.d.ts.map