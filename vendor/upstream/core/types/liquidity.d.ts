import { type Currency } from "./currency";
export declare enum LiquiditySource {
    DECLARED = "declared",// Agent-declared fiat liquidity from bank accounts/mobile money
    WALLET = "wallet"
}
export declare enum LiquidityChangeType {
    DEPOSIT = "deposit",
    WITHDRAWAL = "withdrawal",
    SWAP_RESERVED = "swap_reserved",
    SWAP_COMPLETED = "swap_completed",
    SWAP_CANCELLED = "swap_cancelled",
    MANUAL_ADJUSTMENT = "manual_adjustment",
    CUSTODIAL_SYNC = "custodial_sync",
    DECLARATION = "declaration"
}
export interface CurrencyLiquidity {
    currency: Currency;
    available: string;
    reserved: string;
    total: string;
    source: LiquiditySource;
    lastUpdated: Date;
}
export interface AgentLiquidityProfile {
    agentId: string;
    liquidity: CurrencyLiquidity[];
    totalValueUsd?: string;
    lastUpdated: Date;
}
export interface LiquidityHistory {
    id: string;
    agentId: string | null;
    currency: Currency;
    previousAmount: string;
    newAmount: string;
    changeAmount: string;
    changeType: LiquidityChangeType;
    source: LiquiditySource;
    reference?: string;
    metadata?: Record<string, unknown>;
    createdAt: Date;
}
export interface DeclareLiquidityDto {
    currency: Currency;
    amount: string;
}
export interface BulkDeclareLiquidityDto {
    declarations: DeclareLiquidityDto[];
}
export interface ValidateLiquidityDto {
    agentId: string;
    currency: Currency;
    amount: string;
}
export interface ValidateLiquidityResponse {
    isValid: boolean;
    availableAmount: string;
    requiredAmount: string;
}
export interface LiquidityHistoryFilter {
    currency?: Currency;
    changeType?: LiquidityChangeType;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
}
export interface LiquidityHistoryResponse {
    items: LiquidityHistory[];
    total: number;
}
export interface LiquidityReport {
    agentId: string;
    startDate: Date;
    endDate: Date;
    summary: {
        currency: Currency;
        openingBalance: string;
        closingBalance: string;
        totalDeposits: string;
        totalWithdrawals: string;
        totalSwapsCompleted: string;
        netChange: string;
    }[];
    transactions: LiquidityHistory[];
}
export interface AgentLiquidityEntity {
    id: string;
    agentId: string;
    currency: Currency;
    available: bigint;
    reserved: bigint;
    source: LiquiditySource;
    metadata?: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
}
export interface LiquidityHistoryEntity {
    id: string;
    agentId: string | null;
    currency: Currency;
    previousAmount: bigint;
    newAmount: bigint;
    changeAmount: bigint;
    changeType: LiquidityChangeType;
    source: LiquiditySource;
    reference?: string;
    metadata?: Record<string, unknown>;
    createdAt: Date;
}
//# sourceMappingURL=liquidity.d.ts.map