import type { Agent, AgentMatchCriteria, AgentPaymentDetails, AgentSettings, AgentStatus, AgentTeamAssociationStatus, AgentTeamAssociationVisibility, Currency, CurrencyChannels, OperatingHours, PaymentChannel, SwapState, UpdateAgentDto, AgentEscrowStatus } from "@minmo/core";
import type { AgentDisputeListQuery, AgentDisputeListResponse, AgentDisputeStats } from "../disputes";
import type { HttpClient } from "../http";
import type { SwapResource } from "./swap";
export type AgentListQuery = AgentMatchCriteria & {
    status?: AgentStatus;
    isAutomated?: boolean;
    search?: string;
    page?: number;
    limit?: number;
};
export type AgentListResponse = {
    agents: Agent[];
    total: number;
    totalAll: number;
    page: number;
    limit: number;
};
export type RegisterAgentInput = {
    userId?: string;
    referralCode?: string;
    currencyChannels?: CurrencyChannels;
    supportedCurrencies?: Currency[];
    supportedChannels?: PaymentChannel[];
    minTransactionAmount: string;
    maxTransactionAmount: string;
    dailyVolumeLimit: string;
    onrampMarginBp: number;
    offrampMarginBp: number;
    operatingHours?: OperatingHours;
    settings?: AgentSettings;
    paymentDetails?: AgentPaymentDetails;
};
export type UpdateAgentAvailabilityInput = {
    status: AgentStatus;
};
export type ValidateAgentInput = {
    amount: string;
    currency: Currency;
    paymentChannel: PaymentChannel;
};
export type AgentStatsResponse = {
    totalVolume: string;
    completionRate: number;
    averageRating: number;
    disputeRate: number;
};
export type AgentSwapsQuery = {
    page?: number;
    limit?: number;
    state?: SwapState;
};
export type AgentSwapsResponse = {
    swaps: SwapResource[];
    total: number;
    page: number;
    limit: number;
};
export type PartnerAssociationInput = {
    status?: AgentTeamAssociationStatus;
    visibility?: AgentTeamAssociationVisibility;
    metadata?: Record<string, unknown>;
};
export declare class AgentsClient {
    private readonly http;
    constructor(http: HttpClient);
    register(input: RegisterAgentInput): Promise<Agent>;
    list(query?: AgentListQuery): Promise<AgentListResponse>;
    discover(query?: AgentListQuery): Promise<AgentListResponse>;
    get(agentId: string): Promise<Agent>;
    update(agentId: string, input: UpdateAgentDto): Promise<Agent>;
    updateAvailability(agentId: string, input: UpdateAgentAvailabilityInput): Promise<Agent>;
    deactivate(agentId: string): Promise<void>;
    validate(agentId: string, input: ValidateAgentInput): Promise<Agent>;
    stats(): Promise<AgentStatsResponse>;
    swaps(agentId: string, query?: AgentSwapsQuery): Promise<AgentSwapsResponse>;
    escrowStatus(agentId: string): Promise<AgentEscrowStatus>;
    disputes(agentId: string, query?: AgentDisputeListQuery): Promise<AgentDisputeListResponse>;
    disputeStats(agentId: string): Promise<AgentDisputeStats>;
    activatePartnerReferral(agentId: string, referralCode: string): Promise<Agent>;
    listPartnerAgents(partnerId: string, query?: AgentListQuery): Promise<AgentListResponse>;
    getPartnerAgent(partnerId: string, agentId: string): Promise<Agent>;
    updatePartnerAgentAvailability(partnerId: string, agentId: string, input: UpdateAgentAvailabilityInput): Promise<Agent>;
    setPartnerAssociation(partnerId: string, agentId: string, input?: PartnerAssociationInput): Promise<Agent>;
    removePartnerAssociation(partnerId: string, agentId: string): Promise<Agent>;
}
//# sourceMappingURL=agents.d.ts.map