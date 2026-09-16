import { type CreatePspCollectionRequest, type CreatePspDisbursementRequest, type CreatePspConnectionRequest, type CreatePspReconciliationRequest, type CreateDelegatedPspConnectionRequest, type PspAccountResponse, type PspAccountStatementResponse, type PspConnectionResponse, PspEventType, type PspLiquidityListQuery, type PspLiquidityListResponse, type PspPageResponse, type PspPaymentListQuery, type PspPaymentResponse, type PspProvider, type PspProviderDefinition, type PspReconciliationItemResponse, type PspReconciliationListResponse, type PspReconciliationRunResponse, type ResolvePspReconciliationItemRequest, type RotatePspCredentialsRequest, type RevokePspConnectionRequest } from "@minmo/core";
import { type DomainEventSubscriptionOptions, type EventSubscription, type EventsClient } from "./events";
import type { HttpClient } from "./http";
export type PspEventOptions = Omit<DomainEventSubscriptionOptions<PspEventType>, "partnerId"> & {
    eventTypes?: readonly PspEventType[];
};
/** Partner-scoped payment-provider integration operations. */
export declare class PspClient {
    private readonly http;
    private readonly eventsClient;
    private readonly partnerId?;
    constructor(http: HttpClient, eventsClient: EventsClient, partnerId?: string | undefined);
    /** Subscribes to PSP lifecycle events in this Partner scope. */
    events(options: PspEventOptions): EventSubscription;
    listProviders(): Promise<PspProviderDefinition[]>;
    getProvider(provider: PspProvider): Promise<PspProviderDefinition>;
    listConnections(): Promise<PspConnectionResponse[]>;
    getConnection(connectionId: string): Promise<PspConnectionResponse>;
    createConnection(input: CreatePspConnectionRequest): Promise<PspConnectionResponse>;
    activateConnection(connectionId: string): Promise<PspConnectionResponse>;
    rotateCredentials(connectionId: string, input: RotatePspCredentialsRequest): Promise<PspConnectionResponse>;
    createDelegation(ownerConnectionId: string, input: CreateDelegatedPspConnectionRequest): Promise<PspConnectionResponse>;
    revokeDelegation(connectionId: string, input: RevokePspConnectionRequest): Promise<PspConnectionResponse>;
    createCollection(connectionId: string, input: CreatePspCollectionRequest, idempotencyKey: string): Promise<PspPaymentResponse>;
    createDisbursement(connectionId: string, input: CreatePspDisbursementRequest, idempotencyKey: string): Promise<PspPaymentResponse>;
    getPayment(paymentId: string): Promise<PspPaymentResponse>;
    listPayments(input?: PspPaymentListQuery): Promise<PspPageResponse<PspPaymentResponse>>;
    listAccounts(input?: {
        limit?: number;
        offset?: number;
    }): Promise<PspPageResponse<PspAccountResponse>>;
    getAccount(accountId: string): Promise<PspAccountResponse>;
    listLiquidity(input?: PspLiquidityListQuery): Promise<PspLiquidityListResponse>;
    getAccountStatement(accountId: string, input?: {
        limit?: number;
        offset?: number;
    }): Promise<PspAccountStatementResponse>;
    createReconciliation(input: CreatePspReconciliationRequest): Promise<PspReconciliationRunResponse>;
    listReconciliations(input?: {
        limit?: number;
        offset?: number;
    }): Promise<PspReconciliationListResponse<PspReconciliationRunResponse>>;
    getReconciliation(reconciliationId: string): Promise<PspReconciliationRunResponse>;
    listReconciliationItems(reconciliationId: string, input?: {
        limit?: number;
        offset?: number;
    }): Promise<PspReconciliationListResponse<PspReconciliationItemResponse>>;
    listReconciliationExceptions(reconciliationId: string, input?: {
        limit?: number;
        offset?: number;
    }): Promise<PspReconciliationListResponse<PspReconciliationItemResponse>>;
    resolveReconciliationItem(reconciliationId: string, itemId: string, input: ResolvePspReconciliationItemRequest): Promise<PspReconciliationItemResponse>;
    private path;
}
//# sourceMappingURL=psp.d.ts.map