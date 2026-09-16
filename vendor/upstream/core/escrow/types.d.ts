import type { BitcoinNetwork } from "../types/bitcoin";
import type { WalletPayoutDetails, WalletProvider } from "../wallet";
export declare enum EscrowAsset {
    BTC = "BTC",
    USDT = "USDT",
    USDC = "USDC"
}
export declare enum EscrowNetwork {
    BITCOIN = "bitcoin",
    LIGHTNING = "lightning",
    SPARK = "spark"
}
export declare enum EscrowCurrency {
    SATS = "sats",
    USDT = "usdt",
    USDC = "usdc"
}
export declare enum PayoutDestinationType {
    LIGHTNING_INVOICE = "lightning_invoice",
    LIGHTNING_ADDRESS = "lightning_address",
    BITCOIN_ADDRESS = "bitcoin_address",
    SPARK_ADDRESS = "spark_address",
    SPARK_INVOICE = "spark_invoice"
}
export type PayoutDestination = {
    type: PayoutDestinationType.LIGHTNING_INVOICE;
    value: string;
} | {
    type: PayoutDestinationType.LIGHTNING_ADDRESS;
    value: string;
} | {
    type: PayoutDestinationType.BITCOIN_ADDRESS;
    value: string;
} | {
    type: PayoutDestinationType.SPARK_ADDRESS;
    value: string;
} | {
    type: PayoutDestinationType.SPARK_INVOICE;
    value: string;
};
export declare enum DescriptorEscrowType {
    CUSTODIAL_ESCROW = "custodial_escrow"
}
export declare enum DescriptorFundingConfirmation {
    CUSTODY_FUNDED = "custody_funded"
}
export declare enum DescriptorReleaseTrigger {
    COUNTERPARTY_FIAT_PAYMENT_CONFIRMED = "counterparty_fiat_payment_confirmed"
}
export declare enum DescriptorRefundTrigger {
    TIMEOUT_OR_DISPUTE_REFUND_DECISION = "timeout_or_dispute_refund_decision"
}
export declare enum DescriptorDisputePolicy {
    OPERATOR_RESOLVED = "operator_resolved"
}
export declare enum DescriptorReferenceFormat {
    BOLT11 = "bolt11",
    BITCOIN_ADDRESS = "bitcoin_address",
    CUSTODIAL_ESCROW_REFERENCE = "custodial_escrow_reference"
}
export declare enum DescriptorAuthority {
    ESCROW_OPERATOR = "escrow_operator"
}
export declare enum DescriptorInvoiceAmountRule {
    DERIVED_FROM_SWAP_REQUEST = "derived_from_swap_request",
    EXACT = "exact"
}
export declare enum DescriptorInvoiceExpiryRule {
    EXPIRES_IF_UNPAID_BEFORE_FUNDING_TIMEOUT = "expires_if_unpaid_before_funding_timeout"
}
export declare enum DescriptorImplementationConfirmation {
    OPERATOR_POLICY = "operator_policy"
}
export declare enum EscrowDescriptorWalletStatus {
    LINKED = "linked",
    MISSING = "missing",
    INVALID = "invalid"
}
type CustodialEscrowDescriptor = {
    version: 1;
    escrow_type: DescriptorEscrowType.CUSTODIAL_ESCROW;
    bitcoin_network: BitcoinNetwork;
    networks: EscrowNetwork[];
    funding_rules: {
        required_confirmation: DescriptorFundingConfirmation.CUSTODY_FUNDED;
    };
    release_rules: {
        release_trigger: DescriptorReleaseTrigger.COUNTERPARTY_FIAT_PAYMENT_CONFIRMED;
        refund_trigger: DescriptorRefundTrigger.TIMEOUT_OR_DISPUTE_REFUND_DECISION;
    };
    dispute_rules: {
        policy: DescriptorDisputePolicy.OPERATOR_RESOLVED;
    };
    reference_format: DescriptorReferenceFormat.CUSTODIAL_ESCROW_REFERENCE;
    custody_authority: DescriptorAuthority.ESCROW_OPERATOR;
    release_authority: DescriptorAuthority.ESCROW_OPERATOR;
    refund_authority: DescriptorAuthority.ESCROW_OPERATOR;
    implementations: Array<{
        network: EscrowNetwork;
        bitcoin_network?: BitcoinNetwork;
        invoice_asset?: EscrowAsset;
        invoice_currency?: EscrowCurrency;
        invoice_amount_rule?: DescriptorInvoiceAmountRule;
        invoice_expiry_rule?: DescriptorInvoiceExpiryRule;
        required_confirmation?: DescriptorImplementationConfirmation.OPERATOR_POLICY;
        payout_network?: EscrowNetwork;
        reference_format?: DescriptorReferenceFormat;
    }>;
    /** Minmo extension pending canonicalization in Pontmore PIP-01. */
    fee_policy?: EscrowFeePolicyDeclaration;
    updated_at: number;
};
export type DescriptorResponse = {
    id: string;
    kind: 30361;
    tags: string[][];
    content: CustodialEscrowDescriptor;
    pubkey?: string;
    relays?: string[];
    naddr?: string;
    lastPublishedAt?: string;
    lastEventId?: string;
};
export type EscrowDescriptorSettingsResponse = DescriptorResponse & {
    walletId?: string;
    label?: string;
    walletStatus?: EscrowDescriptorWalletStatus;
    walletError?: string;
};
export type DescriptorPublishResult = {
    descriptor: DescriptorResponse;
    event: {
        id: string;
        kind: 30361;
        pubkey: string;
        created_at: number;
        tags: string[][];
    };
    relays: Array<{
        relay: string;
        ok: boolean;
        error?: string;
    }>;
};
export type UpdateEscrowDescriptorRequest = {
    label?: string;
    advertisedNetworks?: EscrowNetwork[];
};
export type EscrowFeePolicy = {
    version: number;
    enabled: boolean;
    onrampBps: number;
    offrampBps: number;
    minimumSats?: string;
    maximumSats?: string;
    updatedAt: string;
    updatedBy: string;
};
type EscrowFeePolicyDeclaration = {
    version: number;
    enabled: boolean;
    asset: "BTC";
    currency: "sats";
    calculation: "percentage_bps";
    onramp_bps: number;
    offramp_bps: number;
    minimum_sats?: string;
    maximum_sats?: string;
    payer: "escrow_receiver";
    recipient: "escrow_operator";
    rounding: "floor";
    updated_at: number;
};
export declare enum EscrowStatus {
    ISSUED = "issued",
    FUNDED = "funded",
    RELEASED = "released",
    REFUNDED = "refunded",
    EXPIRED = "expired",
    MANUAL_REVIEW = "manual_review"
}
export declare enum ParticipantRole {
    USER = "user",
    AGENT = "agent",
    OPERATOR = "operator"
}
export declare enum DisputeResolutionOutcome {
    RELEASE = "release",
    REFUND = "refund",
    MANUAL_REVIEW = "manual_review"
}
export declare enum EscrowIdempotencyAction {
    CREATE = "create",
    RELEASE = "release",
    REFUND = "refund",
    DISPUTE_RESOLUTION = "dispute_resolution"
}
export declare enum EscrowFeeStage {
    QUOTED = "quoted",
    REALIZED = "realized"
}
export declare enum EscrowFeeOutcome {
    NORMAL = "normal",
    FEE_HAIRCUT = "fee_haircut",
    QUOTE_OVERAGE = "quote_overage",
    PLATFORM_SUBSIDY = "platform_subsidy"
}
export type EscrowRecord = {
    reference: string;
    teamId: string;
    descriptorId: string;
    asset: EscrowAsset;
    currency: EscrowCurrency;
    amount: string;
    amountSats: string;
    funding: {
        network: EscrowNetwork;
        backend: {
            id: string;
            type: WalletProvider;
        };
        reference: string;
        invoice?: string;
        address?: string;
        paymentHash?: string;
        paymentId?: string;
        expiresAt: string;
    };
    status: EscrowStatus;
    createdAt: string;
    updatedAt: string;
    release?: EscrowPayoutRecord;
    refund?: EscrowPayoutRecord;
    fees: EscrowFeeSnapshot[];
    disputeResolution?: DisputeResolutionRecord;
    idempotency: Record<string, IdempotencyRecord>;
    audit: AuditEvent[];
};
export type EscrowFeeSnapshot = {
    stage?: EscrowFeeStage;
    policyVersion: number;
    feeBps: number;
    feeSats: string;
    /** Provider fee quoted when the payout was sized. Not team revenue. */
    networkFeeSats: string;
    recipientRole: ParticipantRole;
    recordedAt: string;
    outcome?: EscrowFeeOutcome;
    configuredFeeSats?: string;
    feeDeltaSats?: string;
    networkFeeDeltaSats?: string;
};
export type EscrowPayoutRecord = {
    idempotencyKey: string;
    recipientRole: ParticipantRole;
    asset: EscrowAsset;
    currency: EscrowCurrency;
    amount: string;
    amountSats: string;
    destination: PayoutDestination;
    reason: string;
    paymentHash?: string;
    txid?: string;
    feeSats: string;
    completedAt: string;
    walletPayoutStatus?: WalletPayoutDetails;
};
export type DisputeResolutionRecord = {
    outcome: DisputeResolutionOutcome;
    reason: string;
    decidedBy: string;
    decidedAt: string;
};
export type IdempotencyRecord = {
    action: EscrowIdempotencyAction;
    requestHash: string;
    response: unknown;
    createdAt: string;
};
export type AuditEvent = {
    type: string;
    at: string;
    actor: string;
    data: Record<string, unknown>;
};
export type CreateEscrowCommand = {
    asset?: EscrowAsset;
    currency?: EscrowCurrency;
    amount?: string;
    amountSats: string;
    fundingNetwork?: EscrowNetwork;
    descriptorId?: string;
    idempotencyKey: string;
    /** Required for API-created escrows; internal swap paths may provide a snapshot. */
    recipientRole?: ParticipantRole;
    feeSnapshot?: {
        stage?: EscrowFeeStage;
        policyVersion: number;
        feeBps: number;
        feeSats: string;
        networkFeeSats: string;
        recipientRole: ParticipantRole;
    };
};
export type MoneyMovementCommand = {
    asset?: EscrowAsset;
    currency?: EscrowCurrency;
    amount?: string;
    amountSats: string;
    recipientRole: ParticipantRole;
    destination: PayoutDestination;
    reason: string;
    idempotencyKey: string;
    actor: string;
};
export type DisputeResolutionCommand = {
    outcome: DisputeResolutionOutcome;
    reason: string;
    decidedBy: string;
    idempotencyKey: string;
};
export type EscrowPage = {
    items: EscrowRecord[];
    total: number;
    limit: number;
    offset: number;
};
export type EscrowActivityResponse = {
    open: EscrowPage;
    history: EscrowPage;
};
export type EscrowDescriptorMetadata = {
    walletId?: string;
    label?: string;
    advertisedNetworks?: EscrowNetwork[];
    relays?: string[];
    lastPublishedAt?: string;
    lastEventId?: string;
    lastPublishResults?: Array<{
        relay: string;
        ok: boolean;
        error?: string;
    }>;
    feePolicy?: EscrowFeePolicy;
};
export type EscrowDescriptorMetadataCollection = Record<string, EscrowDescriptorMetadata>;
export {};
//# sourceMappingURL=types.d.ts.map