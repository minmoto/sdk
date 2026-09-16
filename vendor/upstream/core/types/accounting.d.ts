import type { Currency } from "./currency";
export declare enum SourceType {
    WALLET = "wallet",
    PSP_CONNECTION = "psp_connection"
}
export declare enum ExportReportType {
    TRANSACTION_HISTORY = "transaction_history",
    GENERAL_LEDGER = "general_ledger"
}
export declare enum AccountingHealthStatus {
    READY = "ready",
    NEEDS_ATTENTION = "needs_attention",
    UNAVAILABLE = "unavailable"
}
export declare enum AccountingExportFailureCode {
    SOURCE_NOT_FOUND = "source_not_found",
    SOURCE_PERMISSION_DENIED = "source_permission_denied",
    SOURCE_UNAVAILABLE = "source_unavailable",
    UNSUPPORTED_REPORT_TYPE = "unsupported_report_type",
    INVALID_PERIOD = "invalid_period",
    PERIOD_TOO_LARGE = "period_too_large",
    EXPORT_TOO_LARGE = "export_too_large",
    VALUATION_INCOMPLETE = "valuation_incomplete",
    JOURNAL_INCOMPLETE = "journal_incomplete",
    JOURNAL_UNBALANCED = "journal_unbalanced",
    SOURCE_PROJECTION_FAILED = "source_projection_failed",
    GENERATION_TIMEOUT = "generation_timeout",
    CONCURRENCY_LIMIT = "export_concurrency_limit",
    DELIVERY_INTERRUPTED = "delivery_interrupted"
}
export declare enum BookEntityType {
    PARTNER = "partner",
    AGENT = "agent"
}
export declare enum AccountType {
    ASSET = "asset",
    LIABILITY = "liability",
    EQUITY = "equity",
    REVENUE = "revenue",
    EXPENSE = "expense",
    MEMORANDUM = "memorandum"
}
export declare enum AccountPurpose {
    WALLET_ASSET = "wallet_asset",
    WALLET_PENDING_OUTBOUND = "wallet_pending_outbound",
    WALLET_UNALLOCATED_RECEIPT = "wallet_unallocated_receipt",
    WALLET_UNCLASSIFIED_OUTFLOW = "wallet_unclassified_outflow",
    WALLET_NETWORK_FEE_EXPENSE = "wallet_network_fee_expense",
    WALLET_TRANSFER_CLEARING = "wallet_transfer_clearing",
    WALLET_RECONCILIATION_SUSPENSE = "wallet_reconciliation_suspense",
    PSP_CASH = "psp_cash",
    PSP_CLEARING = "psp_clearing",
    PSP_ENTITY_LIQUIDITY = "psp_entity_liquidity",
    PSP_PENDING_FUNDS = "psp_pending_funds",
    PSP_FEE_REVENUE = "psp_fee_revenue",
    PSP_PROVIDER_FEE_EXPENSE = "psp_provider_fee_expense",
    PSP_UNALLOCATED_FUNDS = "psp_unallocated_funds",
    PSP_RECONCILIATION_SUSPENSE = "psp_reconciliation_suspense"
}
export declare enum NormalBalance {
    DEBIT = "debit",
    CREDIT = "credit"
}
export declare enum AccountStatus {
    ACTIVE = "active",
    FROZEN = "frozen",
    CLOSED = "closed"
}
export declare enum BalanceBasis {
    INTERNAL_POSTED = "internal_posted"
}
export declare enum JournalStatus {
    PENDING = "pending",
    POSTED = "posted",
    VOIDED = "voided",
    REVERSED = "reversed"
}
export declare enum PostingDirection {
    DEBIT = "debit",
    CREDIT = "credit"
}
export declare enum ExecutionStatus {
    CREATED = "created",
    SUBMITTED = "submitted",
    PENDING = "pending",
    SUCCEEDED = "succeeded",
    FAILED = "failed",
    OUTCOME_UNKNOWN = "outcome_unknown",
    CANCELLED = "cancelled"
}
export declare enum SettlementStatus {
    UNPOSTED = "unposted",
    RESERVED = "reserved",
    POSTED = "posted",
    REVERSED = "reversed"
}
export declare enum ReconciliationStatus {
    NOT_DUE = "not_due",
    PENDING = "pending",
    MATCHED = "matched",
    EXCEPTION = "exception",
    RESOLVED = "resolved"
}
export declare enum TransactionDirection {
    INBOUND = "inbound",
    OUTBOUND = "outbound",
    INTERNAL = "internal"
}
export declare enum TransactionOperation {
    RECEIVE = "receive",
    SEND = "send",
    COLLECTION = "collection",
    DISBURSEMENT = "disbursement",
    FEE = "fee",
    TRANSFER = "transfer"
}
export declare enum ValuationStatus {
    COMPLETE = "complete",
    INCOMPLETE = "incomplete",
    NOT_REQUIRED = "not_required"
}
export declare enum ValuationBasis {
    EXECUTION_TIME = "execution_time",
    PROVIDER_OCCURRED_TIME = "provider_occurred_time",
    FIRST_OBSERVED_TIME = "first_observed_time",
    HISTORICAL_BACKFILL = "historical_backfill",
    IDENTITY = "identity"
}
export type SourceReference = {
    type: SourceType;
    id: string;
};
export type SourceSummary = SourceReference & {
    displayName: string;
    status: string;
    currencyOrAssetScope: string[];
    accountingHealth: AccountingHealthStatus;
    earliestSupportedAt: string | null;
};
export type ReportingTemplate = {
    id: string;
    partnerId: string;
    displayName: string;
    source: SourceReference;
    reportType: ExportReportType;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
};
export type CreateReportingTemplateRequest = {
    displayName: string;
    source: SourceReference;
    reportType: ExportReportType;
};
export type CreateAccountingReportRequest = {
    source: SourceReference;
    reportType: ExportReportType;
    periodStart: string;
    periodEnd: string;
};
export type BookReference = {
    entityType: BookEntityType;
    entityId: string;
};
export type Transaction = {
    id: string;
    partnerId: string;
    source: SourceReference;
    sourceRecordType: string;
    sourceRecordId: string;
    operation: TransactionOperation;
    direction: TransactionDirection;
    executionStatus: ExecutionStatus;
    settlementStatus: SettlementStatus;
    reconciliationStatus: ReconciliationStatus;
    occurredAt: string;
    effectiveAt: string;
    nativeAsset: Currency;
    nativeAmountAtomic: string;
    nativeAssetExponent: number;
    feeAsset: Currency | null;
    feeAmountAtomic: string | null;
    externalReference: string | null;
    finalityBasis: string | null;
    policyVersion: number;
    createdAt: string;
    updatedAt: string;
};
export type ValuationSnapshot = {
    id: string;
    transactionId: string;
    status: ValuationStatus;
    baseCurrency: Currency;
    quoteCurrency: Currency;
    rate: string | null;
    rateSource: string | null;
    rateEffectiveAt: string | null;
    rateObservedAt: string | null;
    basis: ValuationBasis;
    reportingAmountMinor: string | null;
    reportingCurrencyExponent: number;
    fxPolicyVersion: number;
    failureCode: string | null;
    createdAt: string;
};
export type JournalPostingCommand = {
    accountId: string;
    direction: PostingDirection;
    nativeAmountAtomic: string;
    reportingAmountMinor: string;
    dimensions?: Record<string, unknown>;
};
export type JournalCommand = {
    partnerId: string;
    book: BookReference;
    source: SourceReference;
    transactionId: string;
    valuationSnapshotId: string;
    journalType: string;
    templateVersion: number;
    idempotencyKey: string;
    effectiveAt: string;
    finalityBasis: string;
    reversalOfJournalId?: string;
    createdBy: string;
    approvedBy?: string;
    postings: JournalPostingCommand[];
};
//# sourceMappingURL=accounting.d.ts.map