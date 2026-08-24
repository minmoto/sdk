import { PayEventType, type ConnectPayWalletRequest, type CreatePayInvoiceRequest, type CreatePayStoreRequest, type PayInvoice, type PayStore } from "@minmo/core";
import { type DomainEventSubscriptionOptions, type EventSubscription, type EventsClient } from "../events";
import type { HttpClient } from "../http";
export type PayStoreEventOptions = Omit<DomainEventSubscriptionOptions<PayEventType>, "aggregateId" | "partnerId" | "storeId">;
export type PayEventOptions = Omit<DomainEventSubscriptionOptions<PayEventType>, "partnerId">;
/** Minmo Pay operations for the caller's Partner or an explicitly selected Partner. */
export declare class PayClient {
    private readonly http;
    private readonly eventsClient;
    private readonly partnerId?;
    constructor(http: HttpClient, eventsClient: EventsClient, partnerId?: string | undefined);
    /** Lists stores visible in this Partner scope. */
    listStores(): Promise<PayStore[]>;
    /** Creates a store in this Partner scope. */
    createStore(input: CreatePayStoreRequest): Promise<PayStore>;
    /** Subscribes to Pay events across this Partner, optionally for one store. */
    events(options: PayEventOptions): EventSubscription;
    /** Returns a lazy resource handle for one store. No request is made yet. */
    getStore(storeId: string): PayStoreResource;
}
/** Operations bound to one Minmo Pay store. */
export declare class PayStoreResource {
    private readonly http;
    private readonly eventsClient;
    readonly storeId: string;
    readonly partnerId?: string | undefined;
    constructor(http: HttpClient, eventsClient: EventsClient, storeId: string, partnerId?: string | undefined);
    /** Reads current stored and live provider state. */
    read(): Promise<PayStore>;
    /** Connects or rotates the Partner wallet receiving this store's payments. */
    connectWallet(input: ConnectPayWalletRequest): Promise<PayStore>;
    /** Creates an idempotent invoice in this store. */
    createInvoice(input: CreatePayInvoiceRequest, idempotencyKey: string): Promise<PayInvoice>;
    /** Reads authoritative state for an invoice created in this store. */
    getInvoice(invoiceId: string): Promise<PayInvoice>;
    /** Subscribes to standard Minmo Pay events belonging to this store. */
    events(options: PayStoreEventOptions): EventSubscription;
    private path;
}
//# sourceMappingURL=client.d.ts.map