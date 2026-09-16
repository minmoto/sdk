import { DestinationType } from "../utils/destination-parser";
import { EscrowAsset, EscrowCurrency, EscrowNetwork, EscrowStatus, PayoutDestinationType, type EscrowFeePolicy, type PayoutDestination } from "./types";
export declare const DEFAULT_ESCROW_FUNDING_INVOICE_EXPIRY_SECONDS: number;
/**
 * How long a client polls for escrow funding after handing an invoice to an
 * external wallet.
 *
 * Far shorter than the invoice expiry above because this bounds a foreground
 * wait, not the invoice's validity: the agent is watching a spinner. A payment
 * that has not landed in five minutes almost certainly was not sent, and the
 * backend reconciler still picks it up later if it was.
 */
export declare const DEFAULT_ESCROW_FOREGROUND_WATCH_SECONDS: number;
export declare const DEFAULT_ESCROW_FUNDING_RECONCILIATION_INTERVAL_SECONDS = 60;
export declare const DEFAULT_ESCROW_FUNDING_RECONCILIATION_BATCH_SIZE = 50;
export declare const TERMINAL_ESCROW_STATUSES: readonly [EscrowStatus.RELEASED, EscrowStatus.REFUNDED, EscrowStatus.EXPIRED];
export declare function isTerminalEscrowStatus(status: EscrowStatus): boolean;
export declare function defaultEscrowFeePolicy(now?: string): EscrowFeePolicy;
export declare function validateEscrowFeePolicy(policy: Pick<EscrowFeePolicy, "enabled" | "onrampBps" | "offrampBps" | "minimumSats" | "maximumSats">): void;
export declare function calculateEscrowFeeSats(principalSats: bigint, bps: number, bounds?: Pick<EscrowFeePolicy, "minimumSats" | "maximumSats">): bigint;
export declare class EscrowValidationError extends Error {
    constructor(message: string);
}
export declare function assertPositiveSats(value: string, field: string): void;
export declare function assertPositiveAmount(value: string, field: string): void;
export declare function normalizeAsset(value: EscrowAsset | undefined): EscrowAsset;
export declare function currencyForAsset(asset: EscrowAsset): EscrowCurrency;
export declare function normalizeFundingNetwork(asset: EscrowAsset, value: EscrowNetwork | undefined): EscrowNetwork;
export declare function assertIdempotencyKey(value: string | undefined): asserts value;
export declare function assertPayoutDestination(destination: PayoutDestination | undefined): asserts destination is PayoutDestination;
export declare function payoutDestinationTypeToDestinationType(type: PayoutDestinationType): DestinationType | undefined;
//# sourceMappingURL=utils.d.ts.map