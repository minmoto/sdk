import type { MinmoAuthProvider } from "./auth";
import type { MinmoEventType } from "@minmo/core";
import { EventsClient } from "./events";
import { EscrowClient } from "./escrow";
import type { EventCursorStore, EventHydrator } from "./events";
import { HttpClient } from "./http";
import type { FetchLike } from "./http";
import { OtcClient } from "./otc";
import { PayClient } from "./pay";
import { AccountClient, AnalyticsClient, ApiKeysClient, InvitationsClient, MembersClient, ReferralsClient, SettingsClient } from "./partner";
import { WalletClient } from "./wallet";
export * from "./auth";
export * from "./events";
export * from "./escrow";
export * from "./disputes";
export * from "./http";
export * from "./otc";
export * from "./pay";
export * from "./partner";
export * from "./wallet";
export type MinmoClientOptions = {
    baseUrl: string;
    auth?: MinmoAuthProvider;
    fetch?: FetchLike;
    cursorStore?: EventCursorStore;
    timeoutMs?: number;
    eventHydrators?: Partial<Record<MinmoEventType, EventHydrator>>;
};
export declare class MinmoClient {
    protected readonly options: MinmoClientOptions;
    protected readonly partnerId?: string | undefined;
    protected readonly http: HttpClient;
    readonly events: EventsClient;
    readonly escrow: EscrowClient;
    readonly wallet: WalletClient;
    readonly otc: OtcClient;
    readonly integrations: {
        readonly pay: PayClient;
    };
    constructor(options: MinmoClientOptions, partnerId?: string | undefined);
    /**
     * Returns the same SDK interface bound to an explicitly selected Partner.
     * This does not grant access; the API still enforces the credential policy.
     */
    forPartner(partnerId: string): PartnerClient;
}
/** SDK interface bound to one explicitly selected Partner. */
export declare class PartnerClient extends MinmoClient {
    readonly account: AccountClient;
    readonly settings: SettingsClient;
    readonly analytics: AnalyticsClient;
    readonly members: MembersClient;
    readonly invitations: InvitationsClient;
    readonly apiKeys: ApiKeysClient;
    readonly referrals: ReferralsClient;
    constructor(options: MinmoClientOptions, partnerId: string);
}
//# sourceMappingURL=index.d.ts.map