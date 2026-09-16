/**
 * User-facing milestones in the standard swap lifecycle.
 *
 * Exceptional states such as cancellation, disputes, and refunds do not map
 * to a progress step because they branch away from this standard flow.
 */
export declare enum SwapProgress {
    STARTED = "started",
    ESCROW = "escrow",
    FIAT_PAYMENT = "fiat_payment",
    COMPLETE = "complete"
}
//# sourceMappingURL=swap-progress.d.ts.map