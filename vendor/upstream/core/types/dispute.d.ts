import { type PaymentChannel } from "./channels";
/**
 * Subset of React Native's KeyboardTypeOptions relevant to evidence fields.
 * Defined here to keep this package free of react-native dependencies.
 */
export type EvidenceKeyboardType = "default" | "decimal-pad" | "number-pad" | "phone-pad";
export interface EvidenceFieldConfig {
    /** Form key used as the DTO property name */
    key: string;
    label: string;
    placeholder: string;
    required: boolean;
    keyboardType?: EvidenceKeyboardType;
    /** Helper text shown below the input */
    hint?: string;
    autoCapitalize?: "none" | "sentences" | "words" | "characters";
}
/** Dynamic form state — keyed by EvidenceFieldConfig.key */
export type EvidenceForm = Record<string, string>;
/**
 * Payload sent to the dispute evidence endpoint.
 * description is always required; all other keys are channel-specific.
 */
export interface DisputeEvidenceDto {
    description: string;
    [key: string]: string | undefined;
}
/** Per-channel evidence field definitions */
export type ChannelEvidenceConfig = Record<PaymentChannel, EvidenceFieldConfig[]>;
export interface DisputeFilters {
    search?: string;
    status?: string;
    agentId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
}
export interface DisputeItem {
    id: string;
    swapId: string;
    swapReference?: string;
    status: string;
    reason?: string;
    raisedBy?: string;
    assignedTo?: string;
    agentId?: string;
    agentName?: string;
    createdAt: string;
    updatedAt?: string;
    resolvedAt?: string;
    resolution?: string;
    evidenceCount?: number;
}
export interface DisputeListResponse {
    data: DisputeItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export interface DisputeAgentInfo {
    id: string;
    type: string;
    isAutomated?: boolean;
    rating?: number;
}
export interface DisputeConfirmations {
    user: boolean;
    agent: boolean;
}
export interface DisputeMetadata {
    disputeDetails?: unknown;
    paymentProofUser?: unknown;
    paymentProofAgent?: unknown;
    [key: string]: unknown;
}
/** Full dispute detail shape — mirrors SwapResponse as returned via GET /api/disputes/:id */
export interface DisputeDetail {
    id: string;
    reference: string;
    type: "onramp" | "offramp";
    state: string;
    fiatAmount: string;
    fiatCurrency: string;
    bitcoinAmount: string;
    exchangeRate: string;
    agentMargin?: number;
    paymentChannel?: string;
    agent?: DisputeAgentInfo;
    confirmations?: DisputeConfirmations;
    userPaymentDetails?: Record<string, unknown>;
    agentPaymentDetails?: Record<string, unknown>;
    createdAt: string;
    claimedAt?: string;
    completedAt?: string;
    metadata?: DisputeMetadata;
}
//# sourceMappingURL=dispute.d.ts.map