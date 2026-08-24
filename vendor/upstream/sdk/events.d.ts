import type { MinmoEvent, MinmoEventType } from "@minmo/core";
import type { HttpClient } from "./http";
export declare enum EventConnectionState {
    IDLE = "idle",
    CONNECTING = "connecting",
    CONNECTED = "connected",
    RECONNECTING = "reconnecting",
    RESYNC_REQUIRED = "resync_required",
    CLOSED = "closed"
}
export type EventCursorStore = {
    load(streamKey: string): Promise<string | undefined>;
    save(streamKey: string, cursor: string): Promise<void>;
    clear(streamKey: string): Promise<void>;
};
export declare class MemoryEventCursorStore implements EventCursorStore {
    private readonly cursors;
    load(streamKey: string): Promise<string | undefined>;
    save(streamKey: string, cursor: string): Promise<void>;
    clear(streamKey: string): Promise<void>;
}
export declare class ResyncRequiredError extends Error {
    readonly reason: string;
    constructor(reason?: string);
}
export type EventSubscriptionOptions<TType extends MinmoEventType = MinmoEventType> = {
    eventTypes?: readonly TType[];
    aggregateId?: string;
    beneficiaryId?: string;
    principalId?: string;
    partnerId?: string;
    storeId?: string;
    cursorStore?: EventCursorStore;
    streamKey?: string;
    onEvent(event: MinmoEvent<TType>): void | Promise<void>;
    onStateChange?(state: EventConnectionState): void;
    onResyncRequired?(error: ResyncRequiredError): void | Promise<void>;
    onError?(error: Error): void;
    signal?: AbortSignal;
    eventHydrators?: Partial<Record<MinmoEventType, EventHydrator>>;
};
export type EventHydrator = (event: MinmoEvent) => Promise<unknown> | unknown;
export type EventSubscription = {
    readonly ready: Promise<void>;
    readonly state: EventConnectionState;
    close(): Promise<void>;
};
export type DomainEventSubscriptionOptions<TType extends MinmoEventType> = Omit<EventSubscriptionOptions<TType>, "eventTypes">;
export type DomainEventFilter<TType extends MinmoEventType> = (event: MinmoEvent<TType>) => boolean;
export declare class EventsClient {
    private readonly http;
    private readonly defaultCursorStore?;
    private readonly defaultHydrators?;
    constructor(http: HttpClient, defaultCursorStore?: EventCursorStore | undefined, defaultHydrators?: Partial<Record<MinmoEventType, EventHydrator>> | undefined);
    subscribe<TType extends MinmoEventType = MinmoEventType>(options: EventSubscriptionOptions<TType>): EventSubscription;
    subscribeToBeneficiarySwaps(beneficiaryId: string, options: Omit<EventSubscriptionOptions, "beneficiaryId">): EventSubscription;
    subscribeToPartner(partnerId: string, options: Omit<EventSubscriptionOptions, "partnerId">): EventSubscription;
    subscribeToPartnerRates(partnerId: string, options?: Omit<EventSubscriptionOptions, "partnerId">): EventSubscription;
}
export declare function subscribeToDomainEvents<TType extends MinmoEventType>(events: EventsClient, domain: string, eventTypes: readonly TType[], options: DomainEventSubscriptionOptions<TType>, filter?: DomainEventFilter<TType>): EventSubscription;
//# sourceMappingURL=events.d.ts.map