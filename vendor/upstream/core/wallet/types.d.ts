import type { EncryptedData } from "../config";
import type { BitcoinNetwork } from "../types/bitcoin";
import type { Currency } from "../types/currency";
import type { WalletPaymentStatus, WalletPaymentType } from "../types/events";
export declare enum OnchainConfirmationSpeed {
    SLOW = "slow",
    MEDIUM = "medium",
    FAST = "fast"
}
export declare enum WalletReconciliationStatus {
    FUNDS_RETURNED = "funds_returned",
    FUNDS_UNRESOLVED = "funds_unresolved",
    UNKNOWN = "unknown"
}
export declare enum WalletHtlcStatus {
    WAITING_FOR_PREIMAGE = "waitingForPreimage",
    PREIMAGE_SHARED = "preimageShared",
    RETURNED = "returned"
}
export declare enum WalletFundingStatus {
    PENDING = "pending",
    COMPLETE = "complete",
    EXPIRED = "expired"
}
export declare enum WalletPayoutStatus {
    PENDING = "pending",
    BROADCAST = "broadcast",
    CONFIRMED = "confirmed",
    FAILED = "failed",
    FUNDS_RETURNED = "funds_returned",
    FUNDS_UNRESOLVED = "funds_unresolved",
    UNKNOWN = "unknown"
}
export type WalletPayoutDetails = {
    providerPaymentId?: string;
    paymentHash?: string;
    txid?: string;
    destination?: string;
    amountSats?: string;
    feeSats?: string;
    network: BitcoinNetwork;
    status: WalletPayoutStatus;
    checkedAt?: string;
    createdAt?: string;
    sentAt?: string;
    broadcastAt?: string;
    confirmedAt?: string;
    failedAt?: string;
    confirmations?: number;
    blockHeight?: number;
    explorerUrl?: string;
    reconciliationStatus?: WalletReconciliationStatus;
    htlcStatus?: WalletHtlcStatus;
    htlcExpiry?: string;
};
export type WalletPayoutLookup = {
    references: string[];
    destination?: string;
    amountSats?: string;
    feeSats?: string;
};
export interface BreezSparkProviderConfig {
    apiKey?: string;
    network?: BitcoinNetwork;
    mnemonic: string;
    walletPublicKey?: string;
    usdtTokenIdentifier?: string;
    usdcTokenIdentifier?: string;
    stableBalance?: StableBalanceConfig;
}
export type WalletProviderConfigResponse = Omit<BreezSparkProviderConfig, "apiKey" | "mnemonic">;
export declare enum StableBalanceToken {
    USDB = "USDB"
}
export declare const STABLE_BALANCE_USDB_TOKEN_IDENTIFIER = "btkn1xgrvjwey5ngcagvap2dzzvsy4uk8ua9x69k82dwvt5e7ef9drm9qztux87";
export declare enum StableBalanceReceiveBehavior {
    KEEP_BTC = "keep_btc",
    ACCUMULATE_THEN_CONVERT = "accumulate_then_convert"
}
export interface StableBalanceConfig {
    enabled: boolean;
    token: StableBalanceToken;
    tokenIdentifier: string;
    stablePercentage: number;
    smallReceiveBehavior: StableBalanceReceiveBehavior;
    thresholdSats?: number;
    maxSlippageBps?: number;
}
export type PayoutResult = {
    paymentHash?: string;
    txid?: string;
    feeSats: string;
};
export type PayoutFeeQuote = {
    amountSats: string;
    feeSats: string;
    requiredSats: string;
    expiresAt: string;
};
export type StableBalanceResult = {
    balanceSats: string;
    tokenIdentifier: string;
    tokenAmount: string;
    thresholdSats?: string;
    minimumConversionSats?: string;
    pendingConversion: boolean;
    syncedAt: string;
};
export type WalletPaymentHistoryItem = {
    id: string;
    type: WalletPaymentType;
    status: WalletPaymentStatus;
    method: string;
    amountSats: string;
    feeSats: string;
    tokenAmount?: {
        amount: string;
        decimals: number;
        name: string;
        ticker: string;
        tokenIdentifier: string;
    };
    createdAt: string;
    sentAt?: string;
    description?: string;
    txid?: string;
    invoice?: string;
    paymentHash?: string;
    providerPaymentId?: string;
    reconciliationStatus?: WalletReconciliationStatus;
    lockedAmountSats?: string;
    htlcStatus?: WalletHtlcStatus;
    htlcExpiry?: string;
    payoutStatus?: WalletPayoutStatus;
    network?: BitcoinNetwork;
    destination?: string;
    explorerUrl?: string;
};
export type StableBalanceOverview = {
    enabled: boolean;
    active: boolean;
    token: StableBalanceToken;
    tokenIdentifier: string;
    tokenAmount: string;
    decimals: number;
    fiatCurrency: Currency;
    changeSats: string;
    stablePercentage: number;
    smallReceiveBehavior: StableBalanceReceiveBehavior;
    pendingConversion: boolean;
    minimumConversionSats?: string;
};
export type WalletOverview = {
    /** Bitcoin/change held directly by the wallet. */
    balanceSats: string;
    /** Provider-valued spendable total, including configured stable tokens. */
    totalBalanceSats: string;
    identityPubkey?: string;
    syncedAt: string;
    stableBalance?: StableBalanceOverview;
    history: WalletPaymentHistoryItem[];
};
export interface WalletInstanceConfig {
    id: string;
    name: string;
    description?: string;
    provider: WalletProvider;
    isActive: boolean;
    providerConfig?: BreezSparkProviderConfig;
    connections?: WalletConnectionConfig[];
    isConnected?: boolean;
    lastChecked?: Date;
    version?: string;
    error?: string;
    latency?: number;
    createdAt: Date;
    updatedAt: Date;
}
export type WalletResponse = Omit<WalletInstanceConfig, "connections" | "createdAt" | "lastChecked" | "providerConfig" | "updatedAt"> & {
    providerConfig?: WalletProviderConfigResponse;
    createdAt: string;
    updatedAt: string;
    lastChecked?: string;
    isLocked?: boolean;
    lockReason?: string;
};
export type WalletMetadataConfig = {
    wallets?: WalletInstanceConfig[];
    escrow?: {
        serverId?: string;
        backendWalletId?: string;
        backendId?: string;
        isActive?: boolean;
        allowOnchainPayouts?: boolean;
    };
    _encrypted?: Record<string, EncryptedData>;
    _metadata?: {
        version: number;
        lastSynced?: Date;
    };
};
export declare enum WalletConnectionScope {
    WALLET_READ = "wallet.read",
    WALLET_RECEIVE = "wallet.receive",
    WALLET_PAYMENT_READ = "wallet.payment.read"
}
export declare const WALLET_CONNECTION_RECEIVE_ONLY_SCOPES: readonly [WalletConnectionScope.WALLET_READ, WalletConnectionScope.WALLET_RECEIVE, WalletConnectionScope.WALLET_PAYMENT_READ];
export interface WalletConnectionConfig {
    id: string;
    label: string;
    token: string;
    tokenHash: string;
    tokenPrefix: string;
    scopes: WalletConnectionScope[];
    createdAt: string;
    createdBy: string;
    lastUsedAt?: string;
    revokedAt?: string;
}
export declare enum WalletProvider {
    BREEZ_SPARK = "breez_spark"
}
export type BreezSparkConfig = {
    id: string;
    type: WalletProvider.BREEZ_SPARK;
    name?: string;
    connectionString: string;
    isActive: boolean;
    priority?: number;
    stableBalance?: StableBalanceConfig;
};
export type ParsedBreezSparkConnection = {
    type: WalletProvider.BREEZ_SPARK;
    apiKey: string;
    network: BitcoinNetwork;
    mnemonic: string;
    storageDir?: string;
    usdtTokenIdentifier?: string;
    usdcTokenIdentifier?: string;
    stableBalance?: StableBalanceConfig;
};
//# sourceMappingURL=types.d.ts.map