import { Currency } from "./currency";
import type { AccountPurpose, AccountStatus, AccountType, BalanceBasis, ExecutionStatus, NormalBalance, PostingDirection, ReconciliationStatus, SettlementStatus } from "./accounting";
export type PspPaymentChannelId = string;
export declare enum PspProvider {
    SAFARICOM_DARAJA = "safaricom_daraja"
}
export declare enum PspEnvironment {
    SANDBOX = "sandbox",
    PRODUCTION = "production"
}
export declare enum PspConnectionKind {
    OWNER = "owner",
    DELEGATED = "delegated"
}
export declare enum PspEntityType {
    PARTNER = "partner",
    AGENT = "agent"
}
export declare enum PspConnectionStatus {
    DRAFT = "draft",
    ACTIVE = "active",
    SUSPENDED = "suspended",
    REVOKED = "revoked"
}
export declare enum PspCapability {
    COLLECTION_CREATE = "collection_create",
    DISBURSEMENT_CREATE = "disbursement_create",
    PAYMENT_READ = "payment_read",
    WEBHOOK_RECEIVE = "webhook_receive"
}
export declare enum PspPaymentMethod {
    DARAJA_STK_PUSH = "daraja_stk_push",
    DARAJA_SEND_MONEY = "daraja_send_money",
    DARAJA_BUY_GOODS = "daraja_buy_goods",
    DARAJA_PAYBILL = "daraja_paybill"
}
export declare enum PspCallbackMode {
    OPAQUE_ENDPOINT = "opaque_endpoint"
}
export declare enum PspProviderSetupFieldType {
    TEXT = "text",
    SECRET = "secret"
}
export type PspProviderSetupFieldDefinition = {
    key: string;
    label: string;
    description: string;
    type: PspProviderSetupFieldType;
    documentationUrl: `https://${string}`;
};
export type PspProviderCredentialSectionDefinition = {
    key: string;
    title: string;
    description: string;
    required: boolean;
    fields: readonly PspProviderSetupFieldDefinition[];
};
export type PspProviderPaymentMethodDefinition = {
    id: PspPaymentMethod;
    operation: PspPaymentOperation;
    displayName: string;
    description: string;
    currency: Currency;
    currencyExponent: number;
    amountIncrementMinor: string;
    paymentChannelId: PspPaymentChannelId;
    paymentChannelVersion: number;
    referenceMaxLength: number;
    defaultReference: string;
};
export declare enum PspAccountingTemplate {
    DARAJA_COLLECTION_CLEARING_TO_PENDING_ENTITY_V1 = "daraja_collection_clearing_to_pending_entity_v1",
    DARAJA_DISBURSEMENT_PENDING_ENTITY_TO_CLEARING_V1 = "daraja_disbursement_pending_entity_to_clearing_v1"
}
export type PspProviderDefinition = {
    provider: PspProvider;
    displayName: string;
    paymentMethodName: string;
    description: string;
    marketLabel: string;
    capabilitySummary: string;
    supportedEnvironments: readonly PspEnvironment[];
    supportedCurrencies: readonly Currency[];
    capabilities: readonly PspCapability[];
    paymentMethods: readonly PspProviderPaymentMethodDefinition[];
    credentialSchemaVersion: number;
    connectionConfigSchemaVersion: number;
    callbackModes: readonly PspCallbackMode[];
    providerAccountReferenceField: PspProviderSetupFieldDefinition;
    credentialSections: readonly PspProviderCredentialSectionDefinition[];
    requiresOptionalCredentialSection: boolean;
};
export type CreatePspConnectionRequest = {
    provider: PspProvider;
    environment: PspEnvironment;
    displayName: string;
    providerAccountReference: string;
    credentials: Record<string, unknown>;
};
export type RotatePspCredentialsRequest = {
    credentials: Record<string, unknown>;
};
export type PspConnectionLimits = {
    minAmountMinor?: string;
    maxAmountMinor?: string;
};
export type CreateDelegatedPspConnectionRequest = {
    authorizedEntityType: PspEntityType;
    authorizedEntityId: string;
    displayName: string;
    capabilities: PspCapability[];
    currencyScope: Currency[];
    limits?: PspConnectionLimits;
    effectiveUntil?: string;
};
export type RevokePspConnectionRequest = {
    reason: string;
};
export type CreatePspCollectionRequest = {
    initiatingEntityType: PspEntityType;
    initiatingEntityId: string;
    amountMinor: string;
    currency: Currency;
    exponent: number;
    paymentMethod: PspPaymentMethod;
    channelData: Record<string, unknown>;
    reference: string;
};
export declare enum PspDisbursementDestinationType {
    MOBILE_WALLET = "mobile_wallet",
    MERCHANT_ACCOUNT = "merchant_account",
    BILL_ACCOUNT = "bill_account"
}
export type CreatePspDisbursementRequest = {
    initiatingEntityType: PspEntityType;
    initiatingEntityId: string;
    amountMinor: string;
    currency: Currency;
    exponent: number;
    paymentMethod: PspPaymentMethod;
    channelData: Record<string, unknown>;
    reference: string;
};
export type CreateOwnerPspConnectionCommand = CreatePspConnectionRequest & {
    partnerId: string;
};
export type RotatePspCredentialsCommand = RotatePspCredentialsRequest & {
    partnerId: string;
    connectionId: string;
};
export type CreateDelegatedPspConnectionCommand = CreateDelegatedPspConnectionRequest & {
    partnerId: string;
    ownerConnectionId: string;
    requestedBy: string;
};
export type RevokePspConnectionCommand = RevokePspConnectionRequest & {
    partnerId: string;
    connectionId: string;
    requestedBy: string;
};
export type CreatePspCollectionCommand = {
    partnerId: string;
    connectionId: string;
    initiatingEntityType: PspEntityType;
    initiatingEntityId: string;
    requestedBy: string;
    idempotencyKey: string;
    money: ExactMoney;
    paymentMethod: PspPaymentMethod;
    channelData: Record<string, unknown>;
    reference: string;
};
export type CreatePspDisbursementCommand = {
    partnerId: string;
    connectionId: string;
    initiatingEntityType: PspEntityType;
    initiatingEntityId: string;
    requestedBy: string;
    idempotencyKey: string;
    money: ExactMoney;
    paymentMethod: PspPaymentMethod;
    channelData: Record<string, unknown>;
    reference: string;
};
export type PspConnectionResponse = {
    id: string;
    partnerId: string;
    connectionKind: PspConnectionKind;
    parentConnectionId: string | null;
    ownerEntityType: PspEntityType;
    ownerEntityId: string;
    authorizedEntityType: PspEntityType;
    authorizedEntityId: string;
    provider: PspProvider;
    environment: PspEnvironment;
    status: PspConnectionStatus;
    displayName: string;
    providerAccountReference: string | null;
    capabilities: PspCapability[];
    currencyScope: Currency[];
    limits: Record<string, unknown>;
    automationPolicy: Record<string, unknown>;
    policyVersion: number;
    validationHealthCode: string | null;
    lastValidatedAt: string | null;
    effectiveFrom: string | null;
    effectiveUntil: string | null;
    approvedBy: string | null;
    approvedAt: string | null;
    revokedBy: string | null;
    revokedAt: string | null;
    revocationReason: string | null;
    createdAt: string;
    updatedAt: string;
};
export declare enum PspPaymentOperation {
    COLLECTION = "collection",
    DISBURSEMENT = "disbursement"
}
export type PspPaymentResponse = {
    id: string;
    partnerId: string;
    connectionId: string;
    bookEntityType: PspEntityType;
    bookEntityId: string;
    initiatingEntityType: PspEntityType;
    initiatingEntityId: string;
    operation: PspPaymentOperation;
    paymentMethod: PspPaymentMethod | null;
    paymentChannelId: PspPaymentChannelId | null;
    paymentChannelVersion: number | null;
    money: ExactMoney;
    executionStatus: ExecutionStatus;
    settlementStatus: SettlementStatus;
    reconciliationStatus: ReconciliationStatus;
    providerPaymentId: string | null;
    providerRequestId: string | null;
    payerReference: string | null;
    payeeReference: string | null;
    failureCode: string | null;
    submittedAt: string | null;
    pendingAt: string | null;
    succeededAt: string | null;
    failedAt: string | null;
    createdAt: string;
    updatedAt: string;
};
export type PspPaymentListQuery = {
    connectionId?: string;
    initiatingEntityType?: PspEntityType;
    initiatingEntityId?: string;
    executionStatus?: ExecutionStatus;
    settlementStatus?: SettlementStatus;
    reconciliationStatus?: ReconciliationStatus;
    limit?: number;
    offset?: number;
};
export declare enum PspProviderBalanceStatus {
    UNAVAILABLE = "unavailable"
}
/** A signed or zero point-in-time balance expressed in exact minor units. */
export type PspBalance = {
    amountMinor: string;
    currency: Currency;
    exponent: number;
};
export type PspAccountResponse = {
    id: string;
    partnerId: string;
    bookEntityType: PspEntityType;
    bookEntityId: string;
    counterpartyEntityType: PspEntityType | null;
    counterpartyEntityId: string | null;
    connectionId: string | null;
    accountCode: string;
    name: string;
    accountType: AccountType;
    purpose: AccountPurpose;
    normalBalance: NormalBalance;
    status: AccountStatus;
    balance: PspBalance;
    balanceBasis: BalanceBasis;
    providerBalance: PspBalance | null;
    providerBalanceStatus: PspProviderBalanceStatus;
    createdAt: string;
    closedAt: string | null;
};
export type PspLiquidityResponse = {
    accountId: string;
    partnerId: string;
    connectionId: string | null;
    entityType: PspEntityType;
    entityId: string;
    attributedBalance: PspBalance;
    availableBalance: PspBalance;
    reservedBalance: PspBalance;
    balanceBasis: BalanceBasis;
    providerBalance: PspBalance | null;
    providerBalanceStatus: PspProviderBalanceStatus;
};
export type PspConnectionLiquidityBalance = {
    attributedBalance: PspBalance;
    availableBalance: PspBalance;
    reservedBalance: PspBalance;
    providerBalance: PspBalance | null;
    providerBalanceStatus: PspProviderBalanceStatus;
};
export type PspConnectionLiquiditySummary = {
    connectionId: string;
    balanceBasis: BalanceBasis;
    balances: PspConnectionLiquidityBalance[];
};
export type PspLiquidityListQuery = {
    connectionId?: string;
    limit?: number;
    offset?: number;
};
export type PspLiquidityListResponse = PspPageResponse<PspLiquidityResponse> & {
    connectionSummaries: PspConnectionLiquiditySummary[];
};
export type PspStatementEntryResponse = {
    postingId: string;
    journalId: string;
    journalType: string;
    sourceType: string;
    sourceId: string;
    direction: PostingDirection;
    money: ExactMoney;
    balanceAfter: PspBalance;
    effectiveAt: string;
    postedAt: string;
    providerSettlementReference: string | null;
    dimensions: Record<string, unknown>;
};
export type PspAccountStatementResponse = {
    account: PspAccountResponse;
    entries: PspStatementEntryResponse[];
    total: number;
    limit: number;
    offset: number;
};
export declare enum PspReconciliationType {
    TRANSACTION = "transaction",
    BALANCE = "balance"
}
export declare enum PspReconciliationRecordKind {
    RUN = "run",
    ITEM = "item"
}
export declare enum PspReconciliationStatus {
    PENDING = "pending",
    MATCHED = "matched",
    EXCEPTION = "exception",
    RESOLVED = "resolved"
}
export declare enum PspReconciliationExceptionCode {
    MISSING_PROVIDER_EVIDENCE = "missing_provider_evidence",
    UNMATCHED_PROVIDER_TRANSACTION = "unmatched_provider_transaction",
    CONFLICTING_PROVIDER_OUTCOME = "conflicting_provider_outcome",
    UNRESOLVED_PROVIDER_OUTCOME = "unresolved_provider_outcome",
    PAYMENT_STATUS_MISMATCH = "payment_status_mismatch",
    AMOUNT_MISMATCH = "amount_mismatch",
    CURRENCY_MISMATCH = "currency_mismatch",
    MISSING_RECOGNITION_JOURNAL = "missing_recognition_journal",
    ACCOUNTING_SCOPE_MISMATCH = "accounting_scope_mismatch"
}
export declare enum PspReconciliationResolutionAction {
    CONFIRM_EXISTING_MATCH = "confirm_existing_match",
    LINK_PAYMENT = "link_payment",
    RECORD_ACCOUNTING_CORRECTION = "record_accounting_correction"
}
export type CreatePspReconciliationRequest = {
    connectionId: string;
    currency: Currency;
    exponent: number;
    evidencePeriodStart: string;
    evidencePeriodEnd: string;
};
export type ResolvePspReconciliationItemRequest = {
    action: PspReconciliationResolutionAction;
    reason: string;
    evidenceReference: string;
    approvalReference: string;
    paymentId?: string;
    resolutionJournalId?: string;
};
export type PspReconciliationRunResponse = {
    id: string;
    partnerId: string;
    connectionId: string;
    bookEntityType: PspEntityType;
    bookEntityId: string;
    type: PspReconciliationType;
    status: PspReconciliationStatus;
    currency: Currency;
    exponent: number;
    providerAccountReference: string | null;
    evidencePeriodStart: string;
    evidencePeriodEnd: string;
    sourceArtifactHash: string;
    internalRecordCount: number;
    externalRecordCount: number;
    internalTotalMinor: string;
    externalTotalMinor: string;
    createdBy: string;
    startedAt: string;
    completedAt: string;
    createdAt: string;
    updatedAt: string;
};
export type PspReconciliationItemResponse = {
    id: string;
    runId: string;
    partnerId: string;
    connectionId: string;
    status: PspReconciliationStatus;
    currency: Currency;
    exponent: number;
    paymentId: string | null;
    journalId: string | null;
    providerTransactionId: string | null;
    providerSettlementReference: string | null;
    expectedAmountMinor: string | null;
    observedAmountMinor: string | null;
    discrepancyAmountMinor: string | null;
    matchRuleVersion: string | null;
    exceptionCode: PspReconciliationExceptionCode | null;
    exceptionOwner: string | null;
    resolutionAction: PspReconciliationResolutionAction | null;
    resolutionEvidenceReference: string | null;
    resolutionReason: string | null;
    approvalReference: string | null;
    resolutionJournalId: string | null;
    resolvedBy: string | null;
    resolvedAt: string | null;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
};
export type PspPageResponse<T> = {
    items: T[];
    total: number;
    limit: number;
    offset: number;
};
export type PspReconciliationListResponse<T> = PspPageResponse<T>;
export declare enum PspEventType {
    CONNECTION_CREATED = "psp.connection.created",
    CONNECTION_ACTIVATED = "psp.connection.activated",
    CONNECTION_SUSPENDED = "psp.connection.suspended",
    CONNECTION_REVOKED = "psp.connection.revoked",
    PAYMENT_CREATED = "psp.payment.created",
    PAYMENT_SUBMITTED = "psp.payment.submitted",
    PAYMENT_PENDING = "psp.payment.pending",
    PAYMENT_SUCCEEDED = "psp.payment.succeeded",
    PAYMENT_FAILED = "psp.payment.failed",
    PAYMENT_OUTCOME_UNKNOWN = "psp.payment.outcome.unknown",
    PAYMENT_CANCELLED = "psp.payment.cancelled",
    RECONCILIATION_COMPLETED = "psp.reconciliation.completed",
    RECONCILIATION_EXCEPTION_DETECTED = "psp.reconciliation.exception.detected",
    RECONCILIATION_EXCEPTION_RESOLVED = "psp.reconciliation.exception.resolved"
}
export type MinorUnitAmount = string & {
    readonly __brand: "MinorUnitAmount";
};
export type ExactMoney = {
    amountMinor: MinorUnitAmount;
    currency: Currency;
    exponent: number;
};
export declare function isMinorUnitAmount(value: unknown): value is MinorUnitAmount;
export declare function createMinorUnitAmount(value: string): MinorUnitAmount;
export declare function isExactMoney(value: unknown): value is ExactMoney;
export declare function createExactMoney(input: {
    amountMinor: string;
    currency: Currency;
    exponent: number;
}): ExactMoney;
export type PspConnectionEventResponse = {
    connectionId: string;
    provider: PspProvider;
    status: PspConnectionStatus;
    entityType: PspEntityType;
    entityId: string;
};
export type PspPaymentEventResponse = {
    paymentId: string;
    connectionId: string;
    entityType: PspEntityType;
    entityId: string;
    operation: PspPaymentOperation;
    money: ExactMoney;
    executionStatus: ExecutionStatus;
    settlementStatus: SettlementStatus;
    reconciliationStatus: ReconciliationStatus;
    failureCode?: string;
};
export type PspReconciliationEventResponse = {
    reconciliationId: string;
    connectionId: string;
    entityType: PspEntityType;
    entityId: string;
    type: PspReconciliationType;
    status: PspReconciliationStatus;
};
//# sourceMappingURL=psp.d.ts.map