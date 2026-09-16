import { WalletEventType, type BitcoinNetwork, type EscrowNetwork, type OnchainConfirmationSpeed, type PayoutFeeQuote, type PayoutDestinationType, type PayoutResult, type StableBalanceConfig, type StableBalanceResult, type WalletOverview, type WalletDepositClaimInput, type WalletDepositClaimResult, type WalletPaymentHistoryItem, type WalletPayoutDetails, type WalletProvider, type WalletResponse, type WalletConnectionScope } from "@minmo/core";
import { type DomainEventSubscriptionOptions, type EventSubscription, type EventsClient } from "./events";
import type { HttpClient } from "./http";
export type { PayoutFeeQuote, PayoutResult, StableBalanceConfig, StableBalanceOverview, StableBalanceResult, WalletOverview, WalletDepositClaimInput, WalletDepositClaimResult, WalletUnclaimedDeposit, WalletPaymentHistoryItem, WalletPayoutDetails, WalletResponse, } from "@minmo/core";
export type WalletListResponse = {
    items: WalletResponse[];
};
export type WalletHistoryResponse = {
    items: WalletPaymentHistoryItem[];
};
export type CreateWalletInput = {
    provider?: WalletProvider;
    name?: string;
    network?: BitcoinNetwork;
    usdtTokenIdentifier?: string;
    usdcTokenIdentifier?: string;
    stableBalance?: Partial<StableBalanceConfig>;
};
export type CreateWalletResponse = {
    wallet: WalletResponse;
    seedPhrase?: string;
};
export type DeleteWalletResponse = {
    deleted: true;
};
export type RevealWalletSeedResponse = {
    seedPhrase: string;
};
export type UpdateWalletInput = {
    name?: string;
    description?: string;
    stableBalance?: Partial<StableBalanceConfig> | null;
};
export type WalletReceiveInput = {
    network?: EscrowNetwork.BITCOIN | EscrowNetwork.LIGHTNING;
    amountSats?: string;
    memo?: string;
    expiresInSeconds?: number;
};
export type WalletReceiveResponse = {
    invoice?: string;
    address?: string;
    reference: string;
    paymentHash?: string;
    expiresAt?: string;
};
export type WalletSendInput = {
    destinationType?: PayoutDestinationType;
    destination: string;
    amountSats: string;
    memo?: string;
    onchainConfirmationSpeed?: OnchainConfirmationSpeed;
};
export type WalletPayoutQuoteInput = WalletSendInput;
export type WalletTransferInput = {
    destinationWalletId: string;
    amountSats: string;
    memo?: string;
};
export type WalletTransferResponse = PayoutResult & {
    destinationWalletId: string;
};
export type WalletStabilizeInput = {
    amountSats: string;
};
export type WalletConnection = {
    id: string;
    label: string;
    tokenPrefix: string;
    scopes: WalletConnectionScope[];
    createdAt: string;
    createdBy: string;
    lastUsedAt?: string;
    revokedAt?: string;
};
export type WalletConnectionSecret = WalletConnection & {
    connectionString: string;
};
export type WalletConnectionListResponse = {
    items: WalletConnection[];
};
export type CreateWalletConnectionInput = {
    label?: string;
};
export type CreateWalletConnectionResponse = {
    connection: WalletConnectionSecret;
};
export type RevokeWalletConnectionResponse = {
    connection: WalletConnection;
};
export type WalletSubscriptionOptions = Omit<DomainEventSubscriptionOptions<WalletEventType>, "aggregateId" | "partnerId"> & {
    teamId: string;
    walletIds?: readonly string[];
};
export declare class WalletClient {
    private readonly http;
    private readonly events;
    constructor(http: HttpClient, events: EventsClient);
    list(teamId: string): Promise<WalletListResponse>;
    create(teamId: string, input: CreateWalletInput): Promise<CreateWalletResponse>;
    get(teamId: string, walletId: string): Promise<WalletResponse>;
    update(teamId: string, walletId: string, input: UpdateWalletInput): Promise<WalletResponse>;
    delete(teamId: string, walletId: string): Promise<DeleteWalletResponse>;
    overview(teamId: string, walletId: string): Promise<WalletOverview>;
    history(teamId: string, walletId: string): Promise<WalletHistoryResponse>;
    claimDeposit(teamId: string, walletId: string, txid: string, vout: number, input: WalletDepositClaimInput): Promise<WalletDepositClaimResult>;
    receive(teamId: string, walletId: string, input: WalletReceiveInput): Promise<WalletReceiveResponse>;
    send(teamId: string, walletId: string, input: WalletSendInput): Promise<PayoutResult>;
    quotePayout(teamId: string, walletId: string, input: WalletPayoutQuoteInput): Promise<PayoutFeeQuote>;
    transfer(teamId: string, walletId: string, input: WalletTransferInput, idempotencyKey: string): Promise<WalletTransferResponse>;
    revealSeed(teamId: string, walletId: string): Promise<RevealWalletSeedResponse>;
    stabilize(teamId: string, walletId: string, input: WalletStabilizeInput): Promise<StableBalanceResult>;
    payoutStatus(teamId: string, walletId: string, reference: string): Promise<WalletPayoutDetails>;
    listConnections(teamId: string, walletId: string): Promise<WalletConnectionListResponse>;
    createConnection(teamId: string, walletId: string, input: CreateWalletConnectionInput): Promise<CreateWalletConnectionResponse>;
    revokeConnection(teamId: string, walletId: string, connectionId: string): Promise<RevokeWalletConnectionResponse>;
    subscribe(options: WalletSubscriptionOptions): EventSubscription;
}
//# sourceMappingURL=wallet.d.ts.map