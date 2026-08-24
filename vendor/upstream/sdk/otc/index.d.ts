import { OtcEventType } from "@minmo/core";
import { type DomainEventSubscriptionOptions, type EventSubscription, type EventsClient } from "../events";
import type { HttpClient } from "../http";
import { AgentsClient } from "./agents";
import { RatesClient } from "./rates";
import { SwapClient } from "./swap";
export * from "./agents";
export * from "./rates";
export * from "./swap";
export type OtcSubscriptionOptions = DomainEventSubscriptionOptions<OtcEventType>;
export declare class OtcClient {
    private readonly events;
    readonly swap: SwapClient;
    readonly rates: RatesClient;
    readonly agents: AgentsClient;
    constructor(http: HttpClient, events: EventsClient);
    subscribe(options: OtcSubscriptionOptions): EventSubscription;
}
//# sourceMappingURL=index.d.ts.map