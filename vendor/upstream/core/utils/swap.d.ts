import { SwapState, SwapType } from "../types/agent";
import type { Agent } from "../types/agent";
/** Derive the enabled swap directions with a stable BUY-first order. */
export declare function getEnabledSwapTypes(agent: Agent): SwapType[];
export declare enum SwapActor {
    USER = "user",
    AGENT = "agent"
}
export interface SwapActionPermissions {
    claim: boolean;
    payEscrow: boolean;
    cancel: boolean;
    confirmPayment: boolean;
    raiseDispute: boolean;
    submitEvidence: boolean;
}
export interface SwapActionMatrix {
    user: SwapActionPermissions;
    agent: SwapActionPermissions;
}
export interface SwapActionContext {
    state: SwapState;
    type: SwapType;
    canCancel?: boolean;
}
export declare const TERMINAL_SWAP_STATES: SwapState[];
export declare const CANCELLABLE_SWAP_STATES: SwapState[];
export declare const DISPUTE_STATES: Set<SwapState>;
/** Dispute states that are still in-progress (excludes DISPUTE_RESOLVED). */
export declare const ACTIVE_DISPUTE_STATES: Set<SwapState>;
export declare const DISPUTE_REVIEW_STATES: Set<SwapState>;
export declare const PAYMENT_CONFIRMABLE_STATES: Set<SwapState>;
export declare const REFUND_STATES: Set<SwapState>;
/** Refund states that still require action (excludes REFUNDED). */
export declare const ACTIVE_REFUND_STATES: Set<SwapState>;
export declare const TIMEOUT_STATES: Set<SwapState>;
/**
 * States in which BTC escrow is considered actively locked for ONRAMP swaps.
 *
 * This list is shared across backend/services and UIs that need to reason about
 * "currently escrowed" BTC derived from swap state (not a separate ledger).
 */
export declare const ONRAMP_ESCROW_ACTIVE_STATES: SwapState[];
export declare const STATE_TRANSITIONS: Record<SwapState, SwapState[]>;
export declare function isTerminalSwapState(state: SwapState): boolean;
export declare function isCancellableSwapState(state: SwapState): boolean;
export declare function canCancelSwap(state: SwapState, hasUserConfirmation?: boolean, hasAgentConfirmation?: boolean): boolean;
export declare function getSwapActionPermissions(context: SwapActionContext): SwapActionMatrix;
export declare function getActorSwapActionPermissions(actor: SwapActor, context: SwapActionContext): SwapActionPermissions;
//# sourceMappingURL=swap.d.ts.map