import { SwapState, SwapType } from "../types/agent";
import type { Agent } from "../types/agent";
import { SwapProgress } from "../types/swap-progress";
/** Standard swap milestones in display order. */
export declare const SWAP_PROGRESS_STEPS: readonly SwapProgress[];
/**
 * Collapse the detailed swap state machine into user-facing progress steps.
 * Exceptional branches return null so consumers can present their actual
 * status without implying that the standard flow is still in progress.
 */
export declare function getSwapProgress(state: SwapState): SwapProgress | null;
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
/**
 * States where fiat beneficiary details may be revealed to the party that
 * must send fiat. Keep these details hidden until escrow funding has been
 * verified and the swap has advanced to PAYMENT_INSTRUCTED.
 */
export declare const PAYMENT_CHANNEL_DETAILS_VISIBLE_STATES: ReadonlySet<SwapState>;
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
/** Whether this actor is the one who must send fiat in the given swap type. */
export declare function isFiatSender(actor: SwapActor, type: SwapType): boolean;
/**
 * Actor- and type-aware next-step guidance for a swap state. Shared across
 * clients so "what should I do right now" reads the same everywhere a swap
 * is tracked.
 */
export declare function getSwapProgressMessage(state: SwapState, actor: SwapActor, type: SwapType, fiatCurrency: string): string;
export declare function isTerminalSwapState(state: SwapState): boolean;
export declare function isCancellableSwapState(state: SwapState): boolean;
export declare function canCancelSwap(state: SwapState, hasUserConfirmation?: boolean, hasAgentConfirmation?: boolean): boolean;
export declare function getSwapActionPermissions(context: SwapActionContext): SwapActionMatrix;
export declare function getActorSwapActionPermissions(actor: SwapActor, context: SwapActionContext): SwapActionPermissions;
//# sourceMappingURL=swap.d.ts.map