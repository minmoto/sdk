import type { SwapState } from "./agent";
export interface AgentEscrowSwapStatus {
    id: string;
    state: SwapState;
    bitcoinAmountSats: string;
    fees: Record<string, unknown>;
    escrowAmountSats: string;
}
export interface AgentEscrowStatus {
    agentId: string;
    totalEscrowSats: string;
    swaps: AgentEscrowSwapStatus[];
}
//# sourceMappingURL=escrow-status.d.ts.map